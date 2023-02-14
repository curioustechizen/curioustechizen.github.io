---
layout: post
title:  "Tech as an Enhancer"
description: "Offline-first and other stories ... "
date: 2020-12-18 21:00 +05:30
comments: true
tags: [obvious]
---

This is a non-programming post in the series I call "re-stating the obvious". This series talks about topics that have been beaten to pulp already. I'm simply adding to the cacophony. You can find all posts in this series [here](/blog/tags/obvious).

## The trigger for this post

In November 2020, some Amazon Web Services servers suffered an outage that caused a domino effect across countless products and services which depend on AWS. Social media was quick to poke fun at the incident with an explosion of jokes and memes. This tweet is a summary of the mood of social media on that day:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I... can&#39;t vacuum... because us-east-1 is down.</p>&mdash; Geoff Belknap (@geoffbelknap) <a href="https://twitter.com/geoffbelknap/status/1331690657170157568?ref_src=twsrc%5Etfw">November 25, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Lessons learnt

My take-away from this incident (and others before it) is

> Most products and services ought to dwell on the role of technology in the system. Does tech bring the most value as an _enhancer_ or as a _prerequisite_? In other words, **does the system degrade gracefully** in the absence of the very tech that differentiates it?

(In this post, I use the term "tech" in a very loose sense)

### Examples

Let's look at some (mostly hypothetical) examples. Since I spent a large portion of my career in two domains (IoT and automobile), some bias is bound to creep into the examples.

  1. It is awesome that my air-conditioner is connected to the internet. I can set the temperature on my way home so that the house is already comfortable when I reach there. But should it really _require_ the internet to function? Do I absolutely have to configure the WiFi settings _before_ using the air-conditioner?
  1. An internet-connected blood pressure monitor is a really good idea since it eliminates the manual data entry process and lets medical personnel have direct access to the necessary data. However, a blood pressure monitor that _refuses to function when a server is down_ is not very useful, is it?
  1. I can unlock my car with my phone? Amazing. Does it also have a good old key for backup? It would be awkward if my _phone is out of battery and I cannot even unlock the car_.

That last point seems far-fetched but it really isn't. It is just one step away from this:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Got in our <a href="https://twitter.com/Zipcar?ref_src=twsrc%5Etfw">@Zipcar</a> we&#39;ve been driving for 3 days. It doesn&#39;t start. Call Zipcar and get told that the car can&#39;t access the internet so it won&#39;t start. The only option is to have a tow truck come and tow it to somewhere where it has internet.</p>&mdash; Keith Smiley (@SmileyKeith) <a href="https://twitter.com/SmileyKeith/status/1078417333540990976?ref_src=twsrc%5Etfw">December 27, 2018</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I could go on with dozens of examples but I think I've illustrated my point.

### Offline first

["Offline-first"](http://offlinefirst.org/) is often used to describe apps that function when the network is unavailable, but it is more than that. Offline-first apps also behave well in the face of a _poor network connection_. As an end user, the experience when you have that feeble network is way worse than when you have no network at all.

This concept of offline-first can be extended to all things tech. In majority of the cases, solutions need to be designed

  - **First** for the situation where the tech crutch on which the solution depends is unavailable for whatever reason
  - **Then** for the case where the tech is available but in a significantly reduced form
  - **Then and only then** for the case where the differentiating technology is healthy and functioning at its peak

I do qualify all my opinions with "majority of" or "most of" because I'm pretty sure there are situations where this is not feasible. I know there must be some solutions out there that rely completely on the tech, where the solution ceases to exist without the tech.

## Conclusion

Tech is making its mark in unimaginable ways in unprecedented fields. It works really well when it enhances an existing system. It would be a shame to go overboard and make a system overly reliant on tech where there is no real need to.