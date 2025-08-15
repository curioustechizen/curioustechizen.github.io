---
title:  "Pragmatic KMP for Mobile at Somnox - Part 1"
description: "Case study: Pragmatic, incremental adoption of KMP for mobile at Somnox. Part 1: Independent feature"
publishDate: 2025-08-13
comments: true
tags: [kotlin-multiplatform, pragmatic-incremental-kmp]
slug: pragmatic-kmp-part-01
seo:
  image:
    src: '/blog/assets/img/somnox-guide-tab.png'
    alt: 'Screenshot of the Guide tab in the Somnox app'
---

## Introduction

At [Somnox](https://somnox.com/), we've had native Android and iOS [apps in production](https://somnox.com/app/) since 2020. In 2023, we started using [Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) for new features. In this series of blog posts, we will look at how we achieved this in a _pragmatic_, _incremental_ manner. 

The first batch of posts will look at strategies for incrementally introducing shared code with KMP, while tapping into existing native code for what works well already. The next batch will look into the technical challenges and how we dealt with them. You can read all posts in this series [here](/tags/pragmatic-incremental-kmp) (this is an ongoing series, so be sure to check back occasionally)

## Context

Somnox is a huggable companion device that helps users find calm and improve their sleep through the power of breathing. The Somnox mobile app has 2 roles
1. Configuring your Somnox over BLE
2. Stand-alone features like a Daily sleep journal and a Sleep Guide (more on this later)

## First KMP step: Independent "Guide" tab

In late 2023, we wanted to add a completely self-contained tab to the app. This tab was the Guide tab, a comprehensive Sleep Program with educational content about improving your breathing and sleep, weekly check-ins and more. Crucially, this tab did not interact with any other tab in the app. All it required was for the user to be logged in, and a way for the host app to navigate in to this tab.

The content of this tab also lent itself to multiplatform implementation:
- It involved network requests
- It involved persistent storage
- It did **not** involve communication with the Somnox (so no BLE), or any other platform-specific elements

This was the perfect use case to implement using KMP because the self-contained nature of this feature meant the risk was minimum.

Here's a screenshot of the guide tab

<img src="/blog/assets/img/somnox-guide-tab.png" alt="Screenshot of Somnox app guide tab" style="max-height: 555px; max-width: 270px; display: block; margin: auto;"/>

### What was shared and what was not?

When KMP was first launched, it was pitched as a "share business logic, write UI using platform UI toolkits" approach (this was before Compose Multiplatform was a thing). In essence, this is exactly what we followed for the Guide feature. This is what our implementation path looked like:

- KMP implementation of the networking (using Ktor)
- KMP implementation of the persistence (Using SqlDelight)
- All business logic (UseCases) and presentation logic (ViewModels/Presenters) implemented in KMP
- Platform-native UI implementation (Compose for Android and SwiftUI for iOS).
- Platform-specific screen navigation mechanisms ([navigation-compose](https://developer.android.com/develop/ui/compose/navigation) library on Android, [FlowStacks](https://github.com/johnpatrickmorgan/FlowStacks) on iOS)

Compose Multiplatform for iOS was still in alpha when we started this implementation, so we decided to go for SwiftUI instead. Also, this feature included video and audio playback for which it made sense to use platform-native facilities anyway.

### Practical implications

As one might expect, not much changed on Android.

On iOS, it involved
- Using the [Skie](https://skie.touchlab.co/) library to wrap our ViewModels and make them easier to consume from SwiftUI. Specifically, this was to convert the `StateFlow`s exposed by our ViewModels into `AsyncSequence`s and using the `for await` syntax to consume them from SwiftUI
- Implementing a `GuideRouter` interface using FlowStacks under the hood
- Passing this router implementation to the DI library on the Kotlin side (using [Koin](https://insert-koin.io/))

That was pretty much it. Only the UI was in platform code. All state production happened in KMP code and every action on the screen would get handled by KMP.

### Rough edges

It goes without saying that not everything was pristine. The biggest problem we faced was that now each app had multiple ways to do some things

#### Networking libraries:
- The Android app previously used Retrofit 
- The iOS app performed network requests using Alamofire
- We have now another library: Ktor. So each app has 2 ways of doing networking.

#### Data storage:
- The Android app previously used Room for database and SharedPreferences for key-value storage
- The iOS app has been using GRDB as an Sqlite wrapper and UserDefaults for key-value storage
- With the KMP integration, the data for just this tab is now stored in a completely different location: using SqlDelight for database and Androidx datastore for key-value storage. So now each app has its data split across two databases and its key-value storage split across two locations.

We could have taken on a migration task to unify all of the data, but remember that the operative word in this entire post is **incremental**. Why would we do that when things are already working?

This is a recurring theme throughout this series: Don't touch what already works. It might make your code look a little less pretty, but it is the most pragmatic approach.

----
In this first post of this series, we looked at the least risk integration of KMP into our app. We shared the logic and data while we kept the UI platform-native.

But what if you want to flip it around? What if you want to _share the UI_ while keeping the _data implementation separate_? Why would one even want to do that?

We'll answer that in the next post in this series. Stay tuned!

----
You can comment on this post on [LinkedIn](https://www.linkedin.com/posts/activity-7361394238397296640-rZZ_) or the [Fediverse](https://androiddev.social/@kiranrao/115021794164500442).