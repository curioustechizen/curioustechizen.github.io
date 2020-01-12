---
layout: post
title:  "Android DiffUtil Part 3: Custom animations"
date: 2020-01-12 10:00
comments: true
tags: [android, diff]
---

This is part 3 in a series of posts that looks into DiffUtil on Android. The previous posts in this series are:

1. [Part 1](/blog/2020/01/06/diff-util-part1/) where we take a deep dive into the DiffUtil API
2. [Part 2](/blog/2020/01/07/diff-util-part2/) where we compare this API with similar APIs on other platforms.

In this post, we'll look at an example of when to use custom animations. 

## The sample app

Here's an example of the animations that we will achieve. The code for this sampe is available [here](https://github.com/curioustechizen/diffutil-custom-animations)

<img src="/blog/assets/video/diff_custom.gif" alt="Custom diff animation" style="max-height: 512px; max-width: 288px;" />

This is admittedly a goofy example, but it serves a purpose. I originally wanted to demonstrate this using visualization of RingBuffer data structure as an example, but I settled for this Color Circles example because it prevents us from getting distracted learning ring buffer!

Here is how the sample works:

- There are 7 slots, arranged in a circle
- Each slot can be empty, or occupied by a colored view (I chose the colors of the rainbow, hence the number 7)
- Each view can be "expanded" or not

The data for the view is a `List<CircleInfo>` where `CircleInfo` is defined as follows:

{% highlight kotlin %}
data class CircleInfo(val color: Int, val expanded: Boolean = false)
{% endhighlight %}

The "Toggle" button switches between two hard-coded lists. It submits the entire list to the `ColorCirclesView`, which in turn [applies a diff](https://github.com/curioustechizen/diffutil-custom-animations/blob/42be2a706721fcf40c6e426895d9ba8894025c5c/app/src/main/java/in/kiranrao/diffutilsamples/ColorCirclesView.kt#L107) and runs some animations:

- If an item's `expanded` property changed, then we animate the change in width and height of that view
- If an item was removed, then we shrink the view until it disappears, while simultaneously moving it to the center of the circle
- If an item was added, then we expand it from size 0 to its final size, while simultaneously moving it from the center of the circle to its final position along the circumference.
- For items that were present in both lists, but their positions in the list changed, we move the views along the circumference of the circle to arrive at the new positions. This animation "makes room" for items being inserted, and "fills the gap" created by disappearing items.

Finally, we run all these animations in a pre-determined order:

1. All removals first
2. Then, change animations together with move along circumference animations
3. Finally the insertion animations are run

As you might have guessed, this example was carefully chosen to demonstrate the use of custom diffs. This example is not suitable for `RecyclerView`

- For one, there's no straightforward way of arranging RV items along a circle
- Even if you do find a circular `LayoutManager` for RV, you are unlikely to get it to work well with RV's `ItemAnimator` framework (this framework, although very powerful and flexible, requires you to understand way too much of the RV internal workings)
- In this specific example, there's no recycling happening, so you don't really need RV. There's a fixed limit to the number of items (7) and they all fit on screen at once.

Here's another example with more operations happening: There's 2 removals, 2 changes and one insertion (I recommend to run the app on an emulator to see the real animations, the fidelity of GIF is not good enough)

<img src="/blog/assets/video/diff_custom_2.gif" alt="Custom diff animation 2" style="max-height: 512px; max-width: 288px;" />

**Note:** There are some situations that this sample does not handle. For example if you submit a list while animations for the previous diff are already in progress, it could crash. However, this is not related to the DiffUtil wrapper that we are discussing in this post, so I'll leave it as is.

## A wrapper for DiffUtil

In the previous posts, we discussed about wrapping Android's DiffUtil in a collection-style API. It is necessary to do this for our sample. This is because of the order in which we want to run our animations: We want to run all removals together. The standard `ListUpdateCallback` has no way of telling us "here are all the items that were removed".

So, we can start off by doing the obvious: maintain our own list of diff operations (change, remove etc) and keep adding to this list when our `ListUpdateCallback` is called. This is implemented [here](https://github.com/curioustechizen/diffutil-custom-animations/blob/42be2a706721fcf40c6e426895d9ba8894025c5c/atomic-diff-util/src/main/java/in/kiranrao/atomicdiffutil/AtomicDiffCalculator.kt#L49-L67) and a snippet is like this

{% highlight kotlin %}
internal val diffOps = mutableListOf<RawDiffOperation>()
override fun onChanged(position: Int, count: Int, payload: Any?) {
    diffOps.add(RawDiffOperation.Change(position, count, payload))
}
// Other overrides follow
{% endhighlight %}

And `RawDiffOperation` is [defined as](https://github.com/curioustechizen/diffutil-custom-animations/blob/42be2a706721fcf40c6e426895d9ba8894025c5c/atomic-diff-util/src/main/java/in/kiranrao/atomicdiffutil/AtomicDiffResult.kt#L105-L109)

{% highlight kotlin %}
sealed class RawDiffOperation {
    data class Insert(val position: Int, val count: Int) : RawDiffOperation()
    data class Change(val position: Int, val count: Int, val payload: Any?) : RawDiffOperation()
    data class Remove(val position: Int, val count: Int) : RawDiffOperation()
}
{% endhighlight %}

But we can do better. In our sample, we don't actually care about the exact order in which the diff operations need to be applied. All we care about is the final set of changes, removals and additions. In other words, instead of 

> Item at index 3 was deleted, then item at index 1 was deleted, then an item was inserted at index 0

we want to say

> Items at index 1 and 3 were deleted; and an item was inserted at index 0

## AtomicDiffResult

So, we use a combination of the RawDiffOperations and DiffUtil's position conversion methods (`convertNewPositionToOld()` and `convertOldPositionToNew()`) to expose an API like this: 

{% highlight kotlin %}
sealed class ItemDiffRecord<T> {
    data class Inserted<T>(val item: T, val newPosition: Int) : ItemDiffRecord<T>()
    data class Removed<T>(val item: T, val oldPosition: Int) : ItemDiffRecord<T>()
    data class Changed<T>(
        val oldItem: T,
        val newItem: T,
        val oldPosition: Int,
        val newPosition: Int,
        val payload: Any?
    ) : ItemDiffRecord<T>()

    data class PositionChanged<T>(val item: T, val oldPosition: Int, val newPosition: Int) :
        ItemDiffRecord<T>()
}

class AtomicDiffResult<T> {
    val insertionRecords: List<Inserted<T>>
    val removalRecords: List<Removed<T>>
    val changeRecords: List<Changed<T>>
    val positionChangeRecords: List<PositionChanged<T>>
}
{% endhighlight %}

Note that this API gives us everything we need to perform our animations. It gives us the item itself in addition to positions. In case of item changes, it gives us both the old and new items. You can see the implementation of [AtomicDiffResult here](https://github.com/curioustechizen/diffutil-custom-animations/blob/42be2a706721fcf40c6e426895d9ba8894025c5c/atomic-diff-util/src/main/java/in/kiranrao/atomicdiffutil/AtomicDiffResult.kt#L8).

**Implementation note:** This implementation of AtomicDiffResult is leaves some room for optimization since it performs 2 extra iterations over the lists (once over the new list and once over the old one). In this example it is negligible.

## Entry point into the API

Now that we know what we want the result to look like, let's consider how we want to calculate the diff. We want to provide the following pieces of information

1. Old list
2. New list
3. How to compare items in the list

This leads us to the following signature

{% highlight kotlin %}
fun <T> calculateAtomicDiff(
    oldList: List<T>, 
    newList: List<T>, 
    itemCallback: ItemCallback<T>): AtomicDiffResult<T>
{% endhighlight %}

The implementation of this function is [here](https://github.com/curioustechizen/diffutil-custom-animations/blob/42be2a706721fcf40c6e426895d9ba8894025c5c/atomic-diff-util/src/main/java/in/kiranrao/atomicdiffutil/AtomicDiffCalculator.kt#L7-L18). You can find the tests for this implementation [here](https://github.com/curioustechizen/diffutil-custom-animations/blob/42be2a706721fcf40c6e426895d9ba8894025c5c/atomic-diff-util/src/test/java/in/kiranrao/atomicdiffutil/AtomicDiffUtilTest.kt).

## Wrapping up

In this post, I explored one way to wrap DiffUtil's `ListUpdateCallback` into a more ergonomic API. This is by no means the most generic way:

- It does not handle moves
- It ignores the change payloads
- In some cases you do really want access to the raw diff operations in the order they were performed (note that `AtomicDiffresult` does expose the underlying `List<RawDiffOperation>` for this purpose)

However, it does handle a lot of use cases where you might want to use `ListUpdateCallback`. The API style I proposed here is closest to Angular's style.

The most practical applications of wrapping DiffUtil are in situations where you have lists of data but you don't want to use RecyclerView to display them. Examples include

- Situations where you have limited number of items and no recycling happening
- Lists shown in bottom sheets
- Custom UI like the one shown in the sample, or visualizing a ring buffer data structure

You might also apply this technique when you want to display custom animations and RV's ItemAnimator does not suffice for your use case.