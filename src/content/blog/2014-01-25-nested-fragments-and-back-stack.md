--- 
title: Nested Fragments and the Back Stack 
publishDate: '2014-01-25'
author: Kiran Rao 
tags: 
- nested 
- fragments 
- programming 
- backstack 
- android
---

This article is not about the back stack of *activities* that Android
maintains for every task. That stuff has been written about adequately
elsewhere. This post is about the back stack of *fragment transactions*
maintained by the
[`FragmentManager`](http://developer.android.com/reference/android/support/v4/app/FragmentManager.html)
and how they relate to nested fragments.

**Edit: Other posts in this series at**

1.  [Part 2](http://curioustechizen.blogspot.com/2014/02/nested-fragment-and-backstack-part-2.html)
2.  [Part 3](http://curioustechizen.blogspot.com/2014/02/nested-fragments-and-backstack-part-3.html)

**Heads-up:** If you are using nested fragments, you need to use the
support library, even if your app only targets API level 14 and above.
This is because nested fragment support was [added in API
17](http://developer.android.com/about/versions/android-4.2.html#NestedFragments),
and the feature was back-ported to the support library (revision 11 and
later).

### TL;DR

The gist of this post can be stated as follows:

> There are many situations where a fragment may be mostly torn down
> (such as when placed on the back stack with no UI showing), but its
> **state will not be saved until its owning activity actually needs to
> save its state**.

This is from the
[docs](http://developer.android.com/reference/android/support/v4/app/Fragment.html#onSaveInstanceState%28android.os.Bundle%29)
(emphasis mine). Overlooking this can lead to bugs especially when you
use nested fragments since the back stack of a child fragment manager
could be reset when you least expect it. Remember - if the state of a
`Fragment` is not saved, then by definition, the back stack of fragment
transactions managed by that fragment’s child `FragmentManager` is not
saved either.

### The Problem

With the advent of fragments, more so nested fragments, the general
advice one gets from the developer community is this:

> Fragmentize all the everythings!

And with good reason too. Consider the following:

-   If you use ActionBar tabs, the content of each tab is implemented as
    a `Fragment`.
-   Each “page” in a `ViewPager` is often implemented as a `Fragment`.
-   In navigation drawers, the “content” of each navigation item is
    expected to be a `Fragment`.

What this translates to is that what would once be implemented as an
`Activity` now needs to be implemented as a `Fragment`. This also means
that a *flow within that `Activity`*, that might have been implemented
using `Fragment`s, now needs to be implemented using **nested
`Fragment`s**. Note that by “flow” I simply mean a sequence of screens
to establish a particular task.

Now here’s the thing with flows: If a user “goes away” from a flow and
later returns to it, it is expected that the user continues from the
screen where they left off. Translated into `Fragment` terminology, this
means that if a user navigates away and returns to a flow that is
implemented using `Fragment`s, its is expected that the user’s position
in the backstack of fragment transactions is retained. However, this
isn’t always the case.

Here is a video demonstrating the problem:

The video shows an `Activity` with three tabs. It is a modified version
of an `Activity` created using the “New Activity” wizard in ADT or
Android Studio and specifying “Fixed Tabs + Swipe” navigation. The
modification is as follows:

-   The content of the first tab has been modified to make it a
    “Container” `Fragment` that in turn contains two nested fragments.
-   When the container fragment is first created, it shows a nested
    fragment asking you to enter your name.
-   On entering the name and Clicking “Next”, you are presented with
    another nested fragment asking you to enter your GitHub username.
-   The other two tabs are just simple `Fragment`s - no nesting business
    there.

Now, notice what happens when I follow this sequence:

1.  Enter name, press Next. Then, enter a github username.
2.  Navigate to the tab titled “Section 2” and then back to “Section 1”.
3.  Navigate to the tab titled “Section 3” and then back to “Section 1”.

Uh! In step 3 above, the back stack was nuked. But hey, it didn’t happen
in Step 2. Why so?

### Explanation

This example uses a `ViewPager`. By default, a `ViewPager` has an “off
screen limit” of 1. This means that in addition to the page being
displayed, one adjacent page in each direction is kept in memory. So,
when you navigate to “Section 2”, everything in “Section 1” is still
intact in memory.

When you navigate to “Section 3”, the page corresponding to “Section 1”
is torn down. More importantly, since at this point the `Activity`
instance state is not being saved, the `Fragment` state isn’t saved
either. This ties in with what we saw in the “TL;DR” section above. As a
result, when you navigate back to “Section 1”, the nested fragment back
stack is reset.

### Rotation? Task Switching?

Try following this sequence of steps:

1.  Enter name, press Next. Then, enter a github username.
2.  Rotate the device; or switch to another app and return back to this
    app

Now you’ll see that the back stack is retained. This is because when you
rotate the device or switch to another task, the Activity saves its
instance state. As a consequence the container fragment does too.

### Conclusion

Re-iterating what we started off this post with, **keep in mind when you
are using nested fragments that a `Fragment` is guaranteed to save state
only when the containing `Activity` saves its instance state. At other
times, the `Fragment` might simply be torn down**.

The code for a sample app illustrating the problem is available [at github](https://github.com/curioustechizen/blog-nested-fragments-backstack).
The next part of this series will explore ways to overcome this problem.
