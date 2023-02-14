---
layout: post
title:  "Mobile Multiplatform and Me"
description: "My experiences with Kotlin Mobile Multiplatform, Flutter and ReactNative"
date: 2021-07-24 16:30 +05:30
comments: true
tags: [multiplatform, flutter, android, ios]
---

**Disclaimer:** This post is based on my own experience and is highly opinionated. It is not meant as a blanket "State of the Union" of mobile multiplatform.

Over the years, there have been several attempts at cross-platform frameworks for building mobile (Android and iOS) apps. This post is about my experience with three of them: [ReactNative](https://reactnative.dev/), [Flutter](https://flutter.dev/) and [Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/).

This is not meant as a competition. I'm not going to announce a winner at the end of the post. Every framework serves a different audience and has different use cases. I made sure to call out the sweet spot for each of these frameworks.

# React Native

RN was my first experience with mobile cross-platform. I worked with it in 2017 and at the time it was not very mature. However I expect things to have evolved since then.

### Pros

1. Concepts of React carry over directly. This makes mobile app development approachable for a large developer audience.
1. Edit-refresh development cycle is very rapid compared to traditional mobile app development.

### Cons

1. ReactNative initially had only iOS support. Android was added later. This was obvious when I was working with it - Android frequently lagged behind iOS.
1. ReactNative ultimately interpretes JavaScript code on the target platform. On Android this is achieved using a JS bridge, which makes it slow. It also results in "stringly-typed APIs" while crossing the bridge which kind of negates the productivity gains of the edit-refresh cycle.

### Sweet spot

The sweet spot for RN is when you have web developers that want to get into mobile development.

# Kotlin Mobile Multiplatform

I worked with KMM in 2019-2020. At the time the technology was not very mature. At the time of writing this, it is still in Alpha. Do note that KMM is from JetBrains. My experience with JetBrains technology is that when it is designated as alpha, it is already very usable, even in production.

### Pros

1. KMM does not provide multiplatform UI libraries. It is intended to share logic, leaving writing the UIs to platform native code. This, in my opinion, is the correct approach to multiplatform.
1. It is from JetBrains, from the Kotlin team. Hence the tooling is great.
1. It is Kotlin, which is my favourite language!
1. Due to the nature of KMM, you can share as little or as much of the code between platforms as you wish. You don't give up on any of the platform native features.
1. You don't need to change the way you develop your Android app to make it multiplatform-capable.

### Cons

1. Kotlin was a JVM language for several years. For mobile, you could interprete this as KMM being Android-first.
1. While Kotlin, the language is very stable and mature, the KMM technology is still immature.
1. KMM can be unnatural for iOS developers. The Kotlin-ObjC (and hence Kotlin-Swift) [interop has some limitations](https://www.reddit.com/r/Kotlin/comments/odau0p/marrying_kmm_and_swift_with_sourcery/h4056dq?utm_source=share&utm_medium=web2x&context=3) which can ruin the experience on the iOS consuming side.

### Sweet spot

The sweet spots for KMM are:

1. Android developers who have also dabbled in iOS
1. Minimum Viable Products (MVPs). Remember point 5 from the pros of KMM. If you developed an app using KMM, and you later want to change your iOS app to become a pure native app, what you are left with is still a fully functional native Android app.

# Flutter

I did not work professionally with Flutter. However, I made an open source app for learning Flutter in 2020.

### Pros

1. Flutter is the most mature of the mobile cross-platform frameworks
1. Hot reload! Seriously. Flutter's hot-reload is life-changing.
1. Mature implementations of several libraries (especially those from Google like Maps, Analytics etc)

### Cons

1. Dart is a dated language compared to Kotlin, Swift or TypeScript. This could have something to do with Dart's history of a compile-to-JS language that dramatically pivoted to mobile multiplatform.
1. Writing platform plugins for Flutter is not as natural as plugging into native functionality with KMM's expect/actual mechanism. It used to be stringly-typed but that seems to have changed with the [pigeon package](https://pub.dev/packages/pigeon).

### Sweet spot

The sweet spot for Flutter is for teams that want end-to-end cross platform apps without having to go through the mess of the web development ecosystem.

# Conclusion

Each of the mobile multiplatform frameworks have their use cases, and each have their sore weaknesses. Mobile cross-platform is still very much an unsolved problem.