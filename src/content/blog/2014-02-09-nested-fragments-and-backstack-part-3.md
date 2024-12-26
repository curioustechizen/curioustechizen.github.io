--- 
title: Nested Fragments and the Backstack - Part 3 
publishDate: '2014-02-09' 
author: Kiran Rao 
tags: 
- nested 
- fragments 
- programming 
- backstack 
- android
---

This is the third post in the series about Nested Fragments and the Back
Stack in Android. Read the previous posts here:

1.  [Part 1](http://curioustechizen.blogspot.com/2014/01/nested-fragments-and-back-stack.html)
2.  [Part 2](http://curioustechizen.blogspot.com/2014/02/nested-fragment-and-backstack-part-2.html)

The first two posts have looked at the topic taking `ViewPager` as an
example. I have also mentioned repeatedly that this is not the only use
case for having to maintain the back-stack of nested fragments. One use
case that I threw up often in comments was about **Navigation Drawers**.
That is exactly what this post will look into.

----

**EDIT: Some Google engineers, including the creators of the Android
framework have expressed their reservations regarding this article. Read
[this G+
thread](https://plus.google.com/100961288997176421259/posts/BLLi6srFtwT)
for more details. They point out that using an `Application` sub-class
to save state is not a good idea, but also that saving `Fragment`
instance state explicitly might in itself needs to be considered
carefully. I hope to gather their thoughts and write a follow-up post in
the coming weeks. Stay Tuned.**

----

### Re-cap

Just to re-cap the conclusion from the previous article:

-   Consider pro-actively saving your `Fragment` states in `onPause`,
    particularly is the `Fragment` happens to nest other fragments
    inside of it.
-   Do not rely solely on the system saving state for you in
    `onSaveInstanceState`.
-   Use `FragmentManager#saveFragmentInstanceState` to save the Fragment
    state including the back-stack of nested fragment transactions for
    you.
-   Do not hold on to the saved state any longer than necessary.

### Adapting to Navigation Drawer

If you take the [source code for Part2](https://github.com/curioustechizen/blog-nested-fragments-backstack/tree/master/nested-fragments-backstack-part2)
of the series, and adapt it as-is to a Navigation Drawer example, you’ll
find that things don’t quite work as you’d expect. In particular, you’ll
find that *even though you have saved the state of the
`ContainerFragment` in `onPause`*, the next time you return to this
fragment, its state is cleared.

Why is this? The alert reader might have spotted the reason.

In the case of the `ViewPager` example, we clear the saved fragment
state in `onDestroy()`. This is because of the way ViewPager works (or
rather, `FragmentPagerAdapter` or `FragmentStatePagerAdapter` works):
When you navigate away from a tab, the Fragment’s `` `onPause `` is
called but none of the other life-cycle methods are called. This means
`onDestroy` is skipped and the Fragment is simply torn down. `onDestroy`
is only called when the hosting `Activity` is destroyed.
```java
@Override
public void onPause() {
    super.onPause();
    ((NestedFragApp)getActivity().getApplication()).setFragmentSavedState(SAVED_STATE_KEY, getFragmentManager().saveFragmentInstanceState(this));
}

@Override
public void onDestroy() {
    super.onDestroy();
    ((NestedFragApp)getActivity().getApplication()).setFragmentSavedState(SAVED_STATE_KEY, null);
}
```

However, when you use a Navigation Drawer, the case is different. In
this situation, there is no `PagerAdapter` to deal with. When you
navigate from one item in the navigation drawer to another, the “old”
Fragment undergoes the complete life-cycle - `onPause` all the way to
`onDestroy` and `onDetach`. As a consequence, since you’re clearing the
saved Fragment state in `onDestroy` of the `ContainerFragment`, **you
end up clearing the state that you had just saved in `onPause`**.

### Solution?

Well, the solution is rather simple - just don’t clear the state in
`onDestroy` of the parent Fragment! In addition, there are a few other
minor changes - like the way you set the initial state of the
ContainerFragment (instead of retrieving the saved state in one of the
life cycle methods of the Fragment, you use `setInitialSavedState` in
the static creator method). The source code for this is available at the
[github
repo](https://github.com/curioustechizen/blog-nested-fragments-backstack)
for this series.
```java
public static ContainerFragment newInstance(SavedState savedState) {
    ContainerFragment frag = new ContainerFragment();
    frag.setInitialSavedState(savedState);
    return frag;
}
...
...
@Override
public void onPause() {
    super.onPause();
    ((NestedFragApp)getActivity().getApplication()).setFragmentSavedState(SAVED_STATE_KEY, getFragmentManager().saveFragmentInstanceState(this));
}
```
Here’s a video showing this in action (Unfortunately the Android
screenrecord tool doesn’t like it if you rotate the device during the
recording, but I think the video demnostrates the point sufficiently):

### Forgetting the saved state?

The bullet points that we established in the previous post (re-capped at
the beginning of this post) say that you should not hold on to the saved
state any longer than necessary. However, we had to violate that rule in
this solution because - well - it is pointless to save the state only to
immediately clear it!

However, depending on your use case you might approach this in a
different manner. For example, you might only clear the fragment saved
state when the hosting `Activity` is destroyed. This is *not*
demonstrated in the sample code on github but should be straightforward
to implement.
