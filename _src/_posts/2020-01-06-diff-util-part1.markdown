---
layout: post
title:  "What's the big difference? A deep dive into Android DiffUtil"
description: "A 3 part series on Android's DiffUtil; Part 1 is about the API and how to use it"
date: 2020-01-06 16:00 +05:30
comments: true
tags: [android, diff]
---

This is a series of posts that looks into calculating the diffs between two lists on Android. This first post in the series looks at the basics of what the DiffUtil is.

## What's DiffUtil?

The [docs for DiffUtil](https://developer.android.com/reference/androidx/recyclerview/widget/DiffUtil) describe it as

> DiffUtil is a utility class that calculates the difference between two lists and outputs a list of update operations that converts the first list into the second one.

The selling point of this utility is it is nicely integrated with RecyclerView such that the following simple series of steps is sufficient to display nice animations for newly added items and disappearing items in the list.

{% highlight kotlin %}
 val oldList = adapter.data
 val diffResult = DiffUtil.calculateDiff(MyCallback(oldList, newList))
 adapter.data = newList
 diffResult.dispatchUpdatesTo(adapter)
{% endhighlight %}

Given the following data

{% highlight kotlin %}
val oldList = ["A", "B", "C", "D"]
val newList = ["A", "B", "D", "E"]
{% endhighlight %}

While switching back and forth between these 2 lists, this code produces this animation:

<img src="/blog/assets/video/diff_basic.gif" alt="Basic diff animation" style="max-height: 512px; max-width: 288px;" />

You could also achieve this effect using the `notifyItemXYZ` family of methods on `RecyclerView.Adapter`, if you maintain the list of items yourself and mutate it. However, in unidirectional data flow architectures, it is likely that you have an immutable list in your state. In those situations, `DiffUtil` is more suitable.

## DiffUtil API usage in detail

Let's dig into how to use the API. Using DiffUtil consists of the following high-level steps

1. You tell the API how to compare items in the list (what constitutes a "removal"? What does a "change" mean?)
2. You ask the API to calculate the diff and give you a result
3. You use the DiffResult object to get called back for each update operation.

Let's go through each step in more detail. We'll use a `Player` class like this for this example

{% highlight kotlin %}
data class Player(val name: String, val score: Int)
{% endhighlight %}

### Step 1: Comparing list items

DiffUtil tells you what items were removed, added and changed between 2 lists, but how does it know? Android chose to not use `equals` and `hashCode` for this purpose - instead having you extend a `DiffUtil.Callback` class. The relevant methods that you need to override are

1. `areItemsTheSame()` - This method is used for **identity comparison**. In the case of the Player class above, 2 items have the same identity if they have the same name. We don't care about the score for this comparison
2. `areContentsTheSame()` - This method is used for **equality comparison**. In the case of the Player class, 2 items have the same contents if they have the same name and score.

The latter is used to tell you if an item retained the same identity but its contents changed. This can be useful for item change animations (for example, if a user liked a tweet you can animate the heart icon using this feature)

The entire code for the callback would be

{% highlight kotlin %}
class PlayerDiffCallback(private val oldList: List<Player>, private val newList: List<Player>) :
    DiffUtil.Callback() {
    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int) =
        oldList[oldItemPosition].name == newList[newItemPosition].name

    override fun getOldListSize() = oldList.size

    override fun getNewListSize() = newList.size

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int) =
        oldList[oldItemPosition] == newList[newItemPosition]
}
{% endhighlight %}

### Step 2: Calculating the diff

This step is a one-liner

{% highlight kotlin %}
val diffResult = DiffUtil.calculateDiff(PlayerDiffCallback(oldList, newList))
{% endhighlight %}

However, there's a lot going on behind the scenes. `calculateDiff` implements the standard algorithm used for diffing: Eugene Myers diff algorithm. This is also the algorithm used by diff tools like `git diff` and text editors. It is not necessary to know the implementation details of this algorithm, but if you are interested, you can go through [this article](https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/).

DiffUtil can also detect moves. If the position of an item in the list changes, then instead of reporting it as a removal followed by an insertion, DiffUtil can report it as a move from position A to position B. You do this by passing `true` to the second argument (`detectMoves`)

We will ignore moves for the rest of this series.

### Step 3: Using the DiffResult

This is the step where I found the API to be a bit ... unexpected. I would expect the DiffResult to give me a collection of update operations in the order that they need to be performed (something like a `List<DiffOperation>`). Instead, you need to call one of the `dispatchUpdatesTo` overloads:

1. `dispatchUpdatesTo(adapter: Adapter)`: This is the one that you'll probably use 99% of the time. You pass on the results to your existing RecyclerView adapter and you get all those animations automagically.
2. `dispatchUpdatesTo(updateCallback: ListUpdateCallback)`: You use this if you want custom animations. In a later post in this series, we'll look at an example where you might need this.

### `ListUpdateCallback` in detail

[This interface](https://developer.android.com/reference/androidx/recyclerview/widget/ListUpdateCallback.html) has the following methods:

- `onChanged(position: Int, count: Int, payload: Any?)`: This is called when DiffUtil detects that `count` items have changed starting at `position`.
- `onInserted(position: Int, count: Int)`: This is called when DiffUtil determines that `count` elements have been inserted into the old list starting at `position`
- `onRemoved(position: Int, count: Int)`: This is called when DiffUtil determines that `count` elements have been removed from the old list starting at `position`

Some important points to note here:

1. These methods **atomic**: the `position` argument reported in every method is with reference to the _list as it was after the previous step_, not as it was at the beginning of the diff operation.
2. The `count` parameter in these methods makes it so that only consecutive similar changes are grouped together, not disjoint ones. 

Point 2 above merits more discussion. To put it another way, if items at position 0 and 2 are deleted, DiffUtil reports it as "Hey item 2 was removed" and "Hey item 0 was removed" as separate callbacks instead of telling you "Hey items 0 and 2 were removed" in a single callback. This follows as a consequence of point 1 because each disjoint operation might have altered the structure of the list.

The API designed this way allows you to basically endlessly "stream" diff operations from DiffResult to your UI component. This is powerful, but can also have downsides (as we will see in a future post).

#### Position conversions

In addition to `ListUpdateCallback`, there are 2 additional API's offered by `DiffResult`

1. `convertOldPositionToNew(oldListPosition: Int)`
2. `convertNewPositionToOld(newListPosition: Int)`

They do what their names suggest. When would you use these? Remember that when one of the ListUpdate callbacks has been dispatched, the number of items in the list might have changed. An item at index `i` in the new list might not represent the same item at index `i` in the old list (it might not even exist in the old list). This pair of conversion methods is useful in such situations. One example is for animations, where you need to access the same view in both the old and new layouts.

## Conclusion

In this post, we got an introduction to DiffUtil and how to use it. We also peeked under the hood into `ListUpdateCallback`, but we haven't used it in an example yet.

In the next post in this series, we will conduct a brief survey of how other platforms handle list diffs.