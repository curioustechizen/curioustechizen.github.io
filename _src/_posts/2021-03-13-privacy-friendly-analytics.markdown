---
layout: post
title:  "Moving to Counter for analytics"
description: "Getting rid of cookie-based analytics to enhance privacy of my readers"
date: 2021-03-13 18:15 +05:30
comments: true
tags: [privacy]
---

Analytics is often crucial for a business. This includes web anaytics, app analytics and everything in between.

However, for a simple blog like this one, there is no need for advanced analytics. These are the features that would be nice to have. Note that these are restricted to _page_ analytics.

  - How many hits has my blog received, page-wise
  - What was the source of the hits

Specifically, what I _don't_ need is _user_ analytics. This means things like

  - Tracking new versus returning users
  - Tracking a user's flow through my blog (they landed on this page and then went to this other page and finally exited from this page)

I've been using Google Analytics all this while for this blog, but today I have decided to move away from it. The reason is that GA provides advanced features but this comes at a cost. It uses cookies and this comes at a cost, not for my privacy, but that of the readers of my blog. It is totally unfair for me to compromise on the privacy of my readers for no tangible benefit.

For now I have installed [Counter](https://counter.dev/). Counter is a privacy friendly web analytics service and it is open source. It is also very simple and has very few features, not more than what I need.

Depending on how often I update this blog, I might even consider removing analytics altogether.

**Next up:** My comments system (I need to evaluate whether I need this disqus commenting system at all)

#### Footnote

Even for businesses, there are privacy-friendly alternatives to traditional analytics engines. I want to end this post by advocating against analytics engine that invade your users' privacy. We can do better and our users deserve better.