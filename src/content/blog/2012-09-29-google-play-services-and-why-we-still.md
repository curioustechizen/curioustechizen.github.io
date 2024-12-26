--- 
title: Google Play Services, and Why We Still Need AccountManager
publishDate: '2012-09-29' 
author: Kiran Rao 
tags: 
- google-play-services 
- development 
- AccountManager 
- oauth 
- android
slug: 2012/09/29/google-play-services-and-why-we-still
---

### Introduction

Recently, Google has [started rolling out](http://android-developers.blogspot.ca/2012/09/google-play-services-and-oauth-identity.html)
the widely awaited [Google Play Services](https://developers.google.com/android/google-play-services/),
announced during Google I/O 2012. One of the major pieces of Google Play
Services is the `GoogleAuthUtil`. The principal problem that this
component solves is OAuth. Up until now, writing an Android app that
requires OAuth has been **complex** and **non-standard**.

-   Complex, because you need perform the whole OAuth dance behind the
    scenes (not specific to Android, mind you).
-   Non-standard because the app developers ended up displaying their
    own custom screens for choosing the account to be used for OAuth.
    Also, the OAuth scopes are specific to the identity provider; and
    this led to displaying the *raw oauth scope strings* in some OAuth
    confirmation screens rather than a user-friendly description of the
    scope.

The [`AccountManager` framework](https://developer.android.com/reference/android/accounts/AccountManager.html)
did some of the heavy lifting and attempted to address both the
problems. However, it met with limited success on both counts. Which is
why, when the `GoogleAuthUtil`, and the `AccountPicker` were previewed
at IO2012, I was jumping in excitement. If you want your app to use
OAuth with Google, then `GoogleAuthUtil` makes life a whole lot simpler.

### Caveat

But, therein lies the caveat. ***It only applies to Google Accounts***.
One could argue that any Android device that has Google Play Services
also has at least one Google account - so this is not a big deal.
However, remember that many Android apps are actually just one of the
ways of accessing a (possibly OAuth-protected) web service. The web
service itself might offer several identity providers for the user to
sign up, log in or authorize. Restricting that to just the Google
account on the Android version of the app doesn't make sense.

What is really required is for more identity providers to leverage the
`AccountManager` framework in Android. Admittedly, that is not so
straightforward. Not only does it involve writing an
`AccountAuthenticator`, there are some pieces specific to identity
provider and **there is no go-to place to publish the documentation for
these provider-specific pieces**.

Suppose I wanted to write an app that allows users to sign in with their
Google, Facebook or Twitter accounts. Google is easy (it has been easy
even before Play Services!). But what about the rest? How do I know what
the `accountType` for Twitter is? How do I know the valid values for
`features` parameter for Twitter?

But the problem doesn't stop there. Apparently, some third-party
services **require you to use their OAuth API to sign the user in**.
This is stated explicitly, as part of the terms of services. I noticed
this when I was trying out a third party twitter client. I already had
Twitter's official client installed, and hence my twitter account was
available in the "Accounts" settings. Still, I had to enter my twitter
credentials in a WebView. The third-party twitter client did not use
AccountManager to log me in. I wrote to the developer about it and I was
informed that Twitter required this as part of their terms of service.

### Solution (?)

I really think third party identity providers (at least the big ones)
should make an effort to leverage `AccountManager` framework of Android.
This may be additional work - but just look at the size of the customer
base they are targetting. With the new `AccountPicker`, the end user
experience for using OAuth with Google is a breeze. It makes the
traditional "log in using a web page" seem like a stone-age UX. The
driving principle should be:

> **An end user should never be forced to enter the credentials for an
> account that is already present in the "Accounts" settings screen**

Furthermore, it may project Google in a bad light since it may give the
impression that Google is trying to make the UX good for its own
services while leaving others in the lurch - which is not true.

### Conclusion

In a nutshell:

-   Google Play Services (in particular `AccountPicker`) = **Good** -
    for Google Accounts.
-   Third party identity providers and OAuth providers: WebView =
    **Bad**. Please use `AccountManager` and
    `AbstractAccountAuthenticator`.
