---
layout: post
title:  "The Limits of One-size-fits-all"
date: 2017-05-25 11:00
tags: [next-billion, android-go]
---

At Google I/O 2017, Google announced Android Go, a  configuration of Android that is optimized for entry-level devices. The focus of this initiative is around affordability, limited connectivity and multi-lingual capability. Starting Android O, all devices that have a memory of 1GB or less will ship with this configuration.

I see this step as sort of an acknowledgement that we are reaching the limits of "one-size-fits-all" mentality we've had all these years. It is a refreshing change from the "We have a potential target of a billion users, hence we **must** make a single app that caters to all". Android has reached the tipping point (2 billion active users) where that approach no longer scales. In the best case it results in a solution that satisfies one subset of users at the expense of the other. In the worst case it produces something that does not solve the needs of either!

The requirements and constraints of the developing world are vastly different from that of the developed world. App usage patterns for the same app might differ between the target groups. Localization is about more than translating strings, currency and temperature units. Not all the guidelines about [writing style](https://material.io/guidelines/style/writing.html#) are applicable globally. Metaphors do not scale well across languages and cultures.

Facebook set the ball rolling with the Facebook Lite app. This is a tiny app (<2MB installed size excluding data on my Android 6.0 phone). Compare this with the regular Facebook app that is >70MB at the time of this writing. The Facebook Lite app is also frugal in its mobile data usage.

YouTube Go seems to be following in the footsteps. They have studied and understood how people use YouTube in developing markets. They have realized that always requiring an internet connection is absurd to the point of being stupid. The peer to peer sharing feature is the killer. Most people were using some shady youtube downloader apps to download YT videos offline, and then sharing it with peers using ShareIt or the like anyway.

I believe Android Go will act as a turning point in the industry's approach to global apps. It is no longer taboo to offer multiple flavors of the same app, catering to different target groups. In fact, with Android Go's Google Play catalog that highlights apps optimized for the entry-level devices, I believe this will become a norm going forward.

Remember, it is not about how many users you have, but about how useful your app is to those users.