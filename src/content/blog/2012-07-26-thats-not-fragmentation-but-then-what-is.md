--- 
title: That's NOT Fragmentation; But then What Is? 
publishDate: '2012-07-26' 
author: Kiran Rao 
tags: 
- development 
- fragmentation 
- android
slug: 2012/07/26/thats-not-fragmentation-but-then-what-is
---

  

Of late, much has been said and debated regarding the fragmentation
"problem" in Android. People who know me know that I'm a BIG fan of
Android - as a user and as a developer. However, I do admit that Android
is fragmented. That, in itself is [not such a bad
thing](http://www.vogella.com/blog/2012/07/17/why-the-missing-device-fragmentation-is-hurting-the-iphone/).
But, this fragmentation is making my life as a developer that much more
difficult. That's the bad thing.

Having said that, I get to read and here things like this a lot. These
all belong to a category I like to call "What Fragmentation is **NOT**".

> Oh! There's 4-inch phones, 7-inch tabs and 10-inch tabs? **Damn!
> Fragmentation!**

OR

> Urghh! So many different device manufacturers? So many thousands of
> device models? They won't all have the same hardware and capabilities
> :-( **Damn! Fragmentation!**

Try This

> What? Every release of Android has its own theme and look&feel?
> **Damn! Fragmentation!**

All of this makes me go "Oh No! Not again!" I wonder how developers
don't realize that these factors are not limitations - they are an
opportunity: to get your app to audiences you wouldn't have thought
possible. Android platform has armed developers with great tools to
address these factors.

-   The amazing [resources
    framework](http://developer.android.com/guide/topics/resources/overview.html)
    allows you to adapt to a wide variety of configurations with little
    or no code. You can optimize your app for phone, tablet, portrait,
    layout, night mode, keyboard mode, dock mode, different languages
    and what not by simply providing alternate resources.
-   Then, there's the theme inheritance with which you can customize the
    look and feel of your app without looking out of place on the
    particular platform version.
-   If your app requires a particular capability to work; or if it
    cannot function in certain configurations, you can use manifest
    filtering to prevent it from being available to devices that don't
    match your criteria.

All the above rants, can then be attributed to developers **not knowing
the framework** and the tools properly. These have *nothing to do with
fragmentation*.

----

There are some problems, though, that have the potential of requiring
developers to spend considerably more effort if they want their apps to
target a large percentage of Android devices in the wild. A sampling of
such problems follows.  

### RTSP Streaming:

Getting a simple RTSP video stream to play on even the more popular
devices using Android's
[MediaPlayer](http://developer.android.com/guide/topics/media/mediaplayer.html)
framework is an uphill task (I've tried and basically given up). As per
the specs it should "just work", but implementations haven't adhered
strictly to the specs.

Now, *****That's*** fragmentation**.  

### Rapid Deprecations:

UI and design patterns that were previously *suggested by the Android
team* have suddenly fallen out of favor and are now deprecated, only to
be replaced with new patterns (yes, Android Design Guide, I'm looking at
you). Examples include
[ActionBar](http://developer.android.com/guide/topics/ui/actionbar.html),
and [the AsyncTask
punishment](https://groups.google.com/d/topic/android-developers/8M0RTFfO7-M/discussion).

The fact that device manufacturers haven't exactly kept up with the pace
of Android platform version releases doesn't help. For example, as of
July 2, 2012, the percentage of devices that support ActionBar
functionality *natively* [is just
13%](http://developer.android.com/about/dashboards/index.html).

The Android team, and the community have tried to bridge the gap by
coming up with libraries that allow you to use the new features on the
old versions (via [Android Compatibility
Library](http://developer.android.com/tools/extras/support-library.html),
[ActionBar Sherlock](http://actionbarsherlock.com/) etc), but these
don't completely solve the problem. There are still gaps, and if you
want to develop an app that both follows the new patterns *and* is truly
well-behaved on even 75% of the installed base, you have to roll your
sleeves and get your hands dirty.

Now, *****That's*** fragmentation**.  

### Very Basic Changes in the Framework:

Since HoneyComb (Android 3.0), the dedicated hardware ["Menu" key has
been
dumped](http://android-developers.blogspot.in/2012/01/say-goodbye-to-menu-button.html)
in Android, to be replaced with an overflow menu in the ActionBar. This
seems like a simple problem, until you come across problems like [this
one](http://commonsware.com/blog/2012/06/08/removing-rogue-menus.html).

You can't even be confident that your erstwhile awesome app will display
that menu properly across all devices.

Now, *****That's*** fragmentation**.

The way you are supposed to use the Back Button has been changed and
made [all the more
confusing](http://www.androiduipatterns.com/2012/07/i-was-watching-navigation-in-android.html)
to both developers and end users. There was even a talk at the recent
Google IO conference in which half an hour was spent explaining the
reasoning behind the back button.

To balance the way the back button is supposed to work in various
versions of the platform, with the way *you* want it to work might take
quite a lot of effort (especially since the compatibility API's [don't
really do the
job](http://developer.android.com/reference/android/support/v4/app/TaskStackBuilder.html)
here).

Now, *****That's*** fragmentation**.  

### Patent-induced inconsistencies:

We've all got used to the "Chooser" displayed by Android whenever you
click on, say, a link in an e-mail. This chooser allows you to select
the app that you would use to display the link (probably a list of
browsers installed on your device).

Pretty basic stuff, right? Well, this may no longer be the case. As a
result of a patent issues, at least one manufacturer [has modified this
behavior](http://commonsware.com/blog/2012/07/24/linkify-problem-detection-mitigation.html).
This is bad news for app developers that depend on this feature for
their app to be even discovered. Work-arounds exist but are very very
round-about. Also, what if another manufacturer follows some other
approach to get past the patent problem?

Now, *****That's*** fragmentation**.

----

There are other issues I can point out, but I guess I've made my point
(at least to all two of you who've made it this far). Luckily, most of
these problems are likely to be contained in the near future. This makes
sense if you look at the fact that Android is still a maturing platform.
The team behind it is bound to realize how some of the earlier decisions
were wrong and it is good for the platform and ecosystem if they take
steps to correct the mistakes. For example:

-   The AsyncTask, ActionBar and Menu key problems I mentioned will
    probably not be a problem once we have more devices running ICS and
    above.
-   The Back Button and other issues surrounding navigation guidelines
    are also likely to be eliminated once we have more developers
    developing apps that follow the *new* guidelines ***consistently***.
    I also don't expect Google to make any more drastic changes in these
    areas in the near future.
-   Even the MediaPlayer framework inconsistencies are bound to shrink
    with more adoption of the newer platform releases.
-   At Google IO 2012, Google announced the PDK (Platform Developers'
    Kit) aimed at shortening the gap between the announcement of a new
    platform release; and device manufacturers rolling out phones or
    updates with the new release. Believe me - this is **GOOD!**

That leaves the issues related to patent and other legal stuff. There's
not much Google or any device manufacturer can do in that space, when
evil and jealous competitors are deciding to abandon innovation and
instead pick up cheap means to combat competition, is there?

----

### Conclusion:

Yes, Android is fragmented. Today, the effort it takes to make your app
play well on various versions, and implement all the new guidelines is
disproportionate to the gains (that's purely my own opinion). But this
won't last.

Once [this
pie-chart](http://developer.android.com/about/dashboards/index.html)
shows a growth in ICS and newer devices, lot of our problems as
developers will be minimized. As for fragmentation caused by reasons
outside Google's control - well we'll just have to live with it.
