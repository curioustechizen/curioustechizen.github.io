--- 
title: Nested Fragment and the BackStack - Part 2 
publishDate: '2014-02-02' 
author: Kiran Rao 
tags: 
- nested 
- fragments 
- programming 
- backstack 
- android 
---

This article is the second in this series about Nested Fragments and the
Back Stack in Android. You can read Part 1
[here](http://curioustechizen.blogspot.com/2014/01/nested-fragments-and-back-stack.html).
To get this post into context, take a look at the video embedded in the
previous post, if nothing else.

**Edit: Later posts in this series at**

1.  [Part 3](http://curioustechizen.blogspot.com/2014/02/nested-fragments-and-backstack-part-3.html)

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

At the risk of sounding repetitive, I’ll start off this post by once
again stating the gist of the previous post:

> A Fragment’s `onSaveInstanceState` method is not guaranteed to be
> called when it is “removed”. The `Fragment` might simply be torn down.
> The only time its state might be saved is when the hosting `Activity`
> saves its state.

We also saw how this could be a problem when you use nested fragments
and a `FragmentManager` doesn’t save its backstack of fragment
transactions. In this part, we’ll look at one possible solution to this
problem.

### Save state in onPause

This is the obvious solution to the problem. The Android docs also state
this time and again: it is a best practice to proactively save state.
Also, since `onPause` is the only callback that is guaranteed to be
called, it makes sense to save your instance state here.

Having said that, it is easy to save view states, scroll positions and
even entire arbitrary objects in `onPause.` But, how does one save a
back stack of fragment transactions?

Enter
[`Fragment.SavedState`](http://developer.android.com/reference/android/support/v4/app/Fragment.SavedState.html).
You can ask the `FragmentManager` to save the state of a `Fragment`
using
[`saveFragmentInstanceState`](http://developer.android.com/reference/android/support/v4/app/FragmentManager.html#saveFragmentInstanceState%28android.support.v4.app.Fragment%29).
The back stack being managed by a Fragment’s nested `FragmentManager` is
included in the state saved by this method.

#### The `Application` sub-class

This post shows how you could use a sub-class of the `Application` class
to save the state, but you might choose another mechanism to do so. The
important thing is that the state has to be saved. We use a `Map` of
strings as keys and the saved state as values in this example.
```java
public class NestedFragApp extends Application {

    Map<String, Fragment.SavedState> savedStateMap;

    @Override
    public void onCreate() {
        savedStateMap = new HashMap<String, Fragment.SavedState>();
        super.onCreate();
    }

    public void setFragmentSavedState(String key, Fragment.SavedState state){
        savedStateMap.put(key, state);
    }

    public Fragment.SavedState getFragmentSavedState(String key){
        return savedStateMap.get(key);
    }

}
```

#### Explicitly saving Fragment state

Then, you save the state of the container fragment when it pauses as
follows:
```java
@Override
public void onPause() {
    super.onPause();
    ((NestedFragApp) getActivity().getApplication()).setFragmentSavedState(
            SAVED_STATE_KEY, getFragmentManager().saveFragmentInstanceState(this));
}
```

#### Initializing the fragment transaction

Finally, remember to check whether there is a saved state for this
fragment before “initializing” the fragment transaction:
```java
SavedState fragmentSavedState = ((NestedFragApp)getActivity().getApplication())
        .getFragmentSavedState(SAVED_STATE_KEY);
if(fragmentSavedState == null){
    if (savedInstanceState == null) {
        getChildFragmentManager().beginTransaction().replace(R.id.nested_fragment_container, 
                NestedFragmentOne.newInstance()).commit();
    } else {
        // use savedInstanceState here to restore state saved in onSaveInstance
    }
}
```

Note that there are two “saved states” here:

1.  The instance state saved in `onSaveInstanceState`, which is provided
    to you by the system via `savedInstanceState`.
2.  The state you explicitly saved in `onPause`, which you retrieve from
    the `Application` object as `fragmentSavedState`.

The flow you follow for initializing the fragment is as follows:

-   You first check to see if you had previously explicitly saved state.
    If true, then you don’t need to do anything.
-   If not, then you proceed to check if the system had saved state for
    you. If true, then you use the `savedInstanceState` to restore
    system-saved state.
-   Only if neither is true, then you initiate the fragment transaction.

#### Letting go of the saved state

One thing you need to be careful of is to not hold on to the saved
fragment state any longer than necessary. For example, when the
**container `Fragment`** is destroyed, you want to invalidate the
back-stack associated with it as well. This sounds obvious but I
overlooked it and ended up with strange behaviors.

The best way I found was to “forget” the saved state of a container
fragment in its `onDestroy`:
```java
@Override
public void onDestroy() {
    super.onDestroy();
    ((NestedFragApp) getActivity().getApplication()).setFragmentSavedState(
            SAVED_STATE_KEY, null);
}
```

With all these steps in place, the app now behaves as one would expect
it to. Your position within a back-stack, even within a nested fragment,
is remembered even when you navigate away and return to the top level
fragment.

Here’s a video showing how the app now behaves:

The source code for the entire series is at
[github](https://github.com/curioustechizen/blog-nested-fragments-backstack).

### Conclusion

-   Consider pro-actively saving your `Fragment` states in `onPause`,
    particularly is the `Fragment` happens to nest other fragments
    inside of it.
-   Do not rely solely on the system saving state for you in
    `onSaveInstanceState`.
-   Use `FragmentManager#saveFragmentInstanceState` to save the Fragment
    state including the back-stack of nested fragment transactions for
    you.
-   Do not hold on to the saved state any longer than necessary.

This article looked at ActionBar tabs with a ViewPager, but this concept
applies to other situations where one would use nested Fragments
(Navigation Drawers for example).
