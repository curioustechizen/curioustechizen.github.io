--- 
title: 'Android: "Application level" Pause and Resume' 
publishDate: '2012-12-03' 
author: Kiran Rao 
tags: 
- Application 
- onResume 
- development 
- android 
- onPause
slug: 2012/12/03/android-application-level-pause-and
---

### Update

I have created an open source library using the concepts presented in
this post. You can directly use the library to create your apps. Get it
at
[android-app-pause](https://github.com/curioustechizen/android-app-pause)
on github

### Introduction

I have often come across questions on StackOverflow and the
android-developers google group about an `Application`-level `onPause()`
and `onResume()`. In this post, I present one of the ways of achieving
such functionality. But before that, what exactly do I mean by an
app-level `onPause()`?

After all, an Android app consists of multiple components, several of
which might be in the background. There could be `Service`s, `Thread`s,
`BroadcastReceiver`s, scheduled `Alarm`s. How do these figure in a
"paused" app? Well, here's my definition of an app being paused for the
purposes of this post:

> An app is considered to be paused when the app is no longer visible to
> the user. By definition, this means that when an app is paused, *none
> of the Activities that belong to the app* are visible to the user.

In my opinion, this is a fair definition since this would typically be
the point when the app wishes to "pause" any background work it does.
For example, an app might wish to cancel all scheduled alarms, or stop
making HTTP calls when it knows that the user is no longer interacting
with the app.

> Similarly, an app is considered to be resumed when at least one
> `Activity` from the app is visible to the user.

This is the point at which the app can re-establish HTTP communication,
re-schedule alarms and the like.

### TL;DR

I got this idea from [this answer](http://stackoverflow.com/a/7924855/570930) that I gave on
stackoverflow. The basis of this approach is that when an Activity
starts another, both of them [undergo lifecycle changes](http://developer.android.com/guide/components/activities.html#CoordinatingActivities)
**in a predictable fashion**. The series of steps to follow to achieve
the app-level pause and resume functionality is as follows:

> 1.  Create a bound `Service` (let's call this `AppActiveService`).
> 2.  In the `onStart()` of every `Activity` of your app, bind to
>     `AppActiveService`.
> 3.  In the `onStop()` of every `Activity` of your app, unbind from
>     `AppActiveService`.
> 4.  The `onDestroy()` method of `AppActiveService` represents the
>     point when your app is "pausing"; while the `onBind()` method
>     represents the point when your app is "resuming". Put the code you
>     want to be run when your app "goes to the background" in
>     `AppActiveService`'s `onDestroy()` method.

To make things even simpler, you can put all the code above in a
`BaseActivity` for your application and have all your other Activities
inherit from this `BaseActivity`.

If you follow the steps above, the `AppActiveService` will have at least
one `Activity` bound to it as long as your app is visible to the user.
When this condition is false, no `Activity` is bound to the `Service`,
at which point its `onDestroy()` is called.

Do note that we are using `onStop()` and not `onPause()` to un-bind from
the `Service`. If you were to use `onPause()`, then there would be zero
components bound to `AppActiveService` even as you are switching from
one `Activity` to the other within your own app.

### Gotchas

One gotcha in this approach is: What happens if your app "starts another
app" using an `Intent`? No `Activity` from your app will be visible to
the user - thus triggering an app-pause. Whether this is acceptable or
not depends on your use case.

### Conclusion

I plan to publish the code for this procedure as a library or at least
as a gist on GitHub. Before that, I'm looking for feedback on how the
code can be improved and made more robust. Have you come across the need
to know when your app as a whole is "going away"? How have you solved
the problem?
