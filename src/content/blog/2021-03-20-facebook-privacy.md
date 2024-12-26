---
title:  "Facebook and Privacy"
description: "How to use Facebook while not entirely giving up your privacy"
publishDate: 2021-03-20
comments: true
tags: [privacy]
slug: 2021/03/20/facebook-privacy
---

It is no secret that using Facebook is detrimental to one's privacy. However, not everyone is in a position to quit the platform. In this post, I look into some steps that I took while attempting to use Facebook with minimal intrusion to my privacy. Your mileage may vary.

## Facebook mobile app

I used the Facebook Android app for a long time and for some startling reason, I realized that I had granted it several permissions. My first step towards setting things right was to revoke every single permission that I had granted it.

What does this mean in practice though?

- I can no longer upload pictures to FB directly from my phone. Which is actually a blessing in disguise. I use my laptop for that.
- ... that is all!!!

Facebook had a bazillion permissions, including Contacts, camera, storage and what not. And the single gain it brought me was the ability to upload photos! I can live without that!

For some time I also used the Facebook Lite app - it is a slimmed down version and uses less storage space and data. Still, I made sure to not give it any permissions

## Getting rid of the app

But just having the app installed is enough to compromise on your privacy. In slightly older verisons of Android, _any_ app can know what other apps are installed on a phone (without any permission). Using this, it is possible to "fingerprint" a device. You can read more about fingerprinting [here](https://www.mozilla.org/en-GB/firefox/features/block-fingerprinting/).

So, I decided to get rid of the app altogether. This comes with some minor inconveniences:

- I no longer get notifications when someone sends me a friend request or comments on my posts. This is actually a good thing (I'll probably write a separate post about taming notifications some day)
- I can no longer share something directly to Facebook. I often come across interesting articles and use Android's Share functionality to share it on Twitter and Facebook. This requires the app to be installed and after getting rid of the app, I have to log in on a browser and paste the link manually. This is something I'm ready to live with.

## Browsing on the desktop: Firefox

Unfortunately, it is still possible for Facebook to track me on the web. **Even if I'm not logged in to Facebook**. All I need to do is visit a website that includes a "Like" or "Share" button.

To really make it difficult for Facebook to track me while I'm browsing, I use Mozilla Firefox with the dedicated ["Facebook container" plugin](https://addons.mozilla.org/en-US/firefox/addon/facebook-container/). This is an official plugin from Mozilla. What it does is, it tries to isolate my Facebook activity on the web from my non-Facebook activity. I've been using it for a couple of months now and it just works.

## Browsing on Android: Firefox Focus

On my phone, I use [Firefox Focus](https://play.google.com/store/apps/details?id=org.mozilla.focus&hl=en_US&gl=US) browser, which is a browser by Mozilla, but is different from Firefox itself. This browser is also available for iOS and even for desktop.

It is somewhat like Incognito mode in Chrome, except it is better. It not only deletes all cookies as soon as you close the browser, it also blocks several trackers by default.

So, how do I use it?

1. Whenever I want to browse Facebook on my phone, I just browse to the website on Firefox Focus. 
2. Since I'm in the EU, I'm first presented with some cookie consent - which I accept (because the cookies will be deleted anyway). This step will not apply if I'm outside the EU.
3. Then I login with my username and password (I use Android's auto-fill for this purpose).
4. After browsing, I logout and hit the big "delete" button. Done.

This is marginally more work than having the app installed, but it has actually benefited me. I spend way less time on Facebook now.

## Conclusion

It is possible to use Facebook without entirely letting go of my privacy. It introduces some friction but in my personal experience, it has only resulted in a net gain for me.


This is a post in my series related to digital privacy. You can read more posts in this series [here](/tags/privacy). For more advanced information and inspiration about digital privacy, you can visit the [Privacy Tools](https://privacytools.io/) page.