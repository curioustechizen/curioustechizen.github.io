---
title:  "Pragmatic KMP for Mobile at Somnox - Part 2"
description: "Case study: Pragmatic, incremental adoption of KMP for mobile at Somnox. Part 2: Sharing UI while retaining platform-specific data layers"
publishDate: 2025-08-14
comments: true
tags: [kotlin-multiplatform, pragmatic-incremental-kmp]
slug: pragmatic-kmp-part-02
seo:
  image:
    src: '/blog/assets/img/pragmatic-kmp-part-02-code-snippet.png'
    alt: 'Code snippet for the Pragmatic KMP Part 02 post'
---

## Introduction

At [Somnox](https://somnox.com/), we've had native Android and iOS [apps in production](https://somnox.com/app/) since 2020. In 2023, we started using [Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) for new features. In this series of blog posts, we will look at how we achieved this in a _pragmatic_, _incremental_ manner. 

This is the second post in this series. You can read all posts [here](/tags/pragmatic-incremental-kmp) (this is an ongoing series, so be sure to check back occasionally).

In the [first post](http://kiranrao.in/blog/pragmatic-kmp-part-01), we saw how we introduced KMP to an existing Android and iOS codebase by implementing a self-contained tab, sharing everything except the UI. In this post, we will look at the opposite - a situation where we shared everything except some portions of the data layer.

## Feature: Starting a Moment with the Somnox

For this post, we look at starting a "moment" with the Somnox. A moment is a collection of preset settings and it needs to be sent to the Somnox over BLE. It looks like this:

<video src="/blog/assets/video/somnox-moments-feature.webm" alt="Screenshot of the Somnox moment feature" width="320" controls style="display: block; margin: auto;"></video>

There's a bit going on here, so let's break down what is required for this feature to work
1. Detecting whether a Somnox is connected, reconnecting if needed: platform-specific code
2. Adapting the UI based on the firmware version of the Somnox: this piece of information is stored in platform-native storage
3. Fetching information about the presets: this was new for this feature, hence could be implemented in KMP
4. Once the settings are sent over BLE, doing some book-keeping like saving the timestamp and ID of the last sent moment: Also new for this feature, hence a target for KMP

### UI: To share or not to share

For this feature, we decided to use shared UI using Compose Multiplatform. It was based on the following factors:
- The UI is fairly cross-platform. 
- Compose Multiplatform for iOS was in beta for iOS by the time we started on it
- The feature is heavy on resources (lots of strings to be translated, lots of illustrations). It would be a waste of effort to import these assets twice.

### Implementation

All of the following are in `commonMain`, so there's not much to discuss
- Composable UI for this feature
- ViewModels/Presenters (UI logic)
- UseCases (Business logic)
- A `PresetsRepository` providing information about the presets, saving information about what was sent to the Somnox.

What about the platform-specifics? For that, we used an **interface/implementation** mechanism for the actual implementation, paired with **expect/actual** mechanism for DI. We are basically _wrapping_ the existing implementations and exposing them as a multiplatform interface.

Conceptually this is what it looks like
```kotlin
// commonMain
interface PlatformMomentRepository {
    fun isFooFeatureAvailable(): Boolean
    fun isSomnoxConnected(): Boolean
    suspend fun connectSomnox(device: Device)
    suspend fun sendMoment(presetId: PresetId)
}

// DI using Koin, but can be achieved using kotlin-inject/Metro/any other DI
expect fun getPlatformModule(): Module
```

On Android,  this is implemented in Kotlin
```kotlin
// androidMain
class AndroidMomentRepository: PlatformMomentRepository {
    // Implement using existing Android-native code
}

actual fun getPlatformModule(): Module = module {
    // This is how the UseCases/ViewModels get access to this implementation
    singleOf(::AndroidMomentRepository) bind PlatformMomentRepository::class 
}
```

The most interesting part is the Swift implementation. Remember that the existing implementation is in the Xcode project. You cannot access that from `iosMain`. That's because the Xcode project has a dependency on the KMP code, not the other way around.

Again, interface implementations and DI to the rescue.
```swift
// In the Xcode project
class IosMomentRepository: PlatformMomentRepository {
    // Implement using existing iOS-native code
}
```

To tie it all together, we follow the technique described by Touchlab in their KaMPKit project. It involves exposing an [`initKoin` function](https://github.com/touchlab/KaMPKit/blob/f8cfe225d64f36ead55bb9a2db6e74a28435226f/shared/src/iosMain/kotlin/co/touchlab/kampkit/KoinIOS.kt) from `iosMain` and [calling it](https://github.com/touchlab/KaMPKit/blob/f8cfe225d64f36ead55bb9a2db6e74a28435226f/ios/KaMPKitiOS/Koin.swift) from your `AppDelegate` in Swift.

Here's our DI entry point for iOS on the Kotlin side

```kotlin
// KoinIOS.kt in iosMain
fun doInitkoin(platformMomentRepository: PlatformMomentRepository): KoinApplication {
    return startKoin {
        modules(
            // Add other modules from commonMain here,
            // Then, add the iOS specific modules as follows
            module {
                single<PlatformMomentRepository> { platformMomentRepository }
            }
        )
    }
}
```

And here's the call to that entry point from the Swift side
```swift
class AppDelegate: UIApplicationDelegate {
    func application(
        _ application: UIApplication, 
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        KoinIOSKt.doInitKoin(
            platformMomentRepository: IosMomentRepository()
        )
    }
}
```

----
In this post, we saw how one can share UI using CMP and logic using KMP while reusing all existing platform-native code for the data layer. This exemplifies KMP's philosophy, which I'm going to paraphrase:
> Share as much or as little as is relevant for your situation

This is central to the incremental nature of KMP and is what makes it the most pragmatic cross-platform solution out there.

In the next post, we will look at project structure and CI considerations when adopting KMP for existing mobile apps.

----
You can comment on this post on the [Fediverse](https://androiddev.social/@kiranrao/115031312273006169) or on [LinkedIn](https://www.linkedin.com/posts/activity-7362005076753764352-dwrU).