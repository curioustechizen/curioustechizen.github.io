---
layout: post
title:  "Android Gradle: Lessons learnt using missingDimensionStrategy"
description: "Advanced flavor configuration in Android Gradle, and the missingDimensionStrategy DSL"
date: 2020-03-31 21:00
comments: true
tags: [android, gradle]
---

## TL;DR:

  1. If a _library module_ includes a flavor dimension that the _app flavor_ does not, then use `missingDimensionStrategy` to specify default flavors from the missing dimension
  2. More generally, you can use this any time a _consumed module_ includes a flavor that the _consumer module_ does not. Remember, `missingDimensionStrategy` DSL should be used in the `build.gradle` of the _consumer module_.
  3. However, point 2 might not always do what you think it is doing. In particular, when the _consumer module_ which is missing the flavor dimension is in **itself a dependency for another module**, you are probably better off introducing this flavor dimension in this module, mirroring that of the consumed module.

## Introduction

The Android Gradle Plugin introduces the concept of product flavors. When you have a project that contains multiple modules, it is possible that your modules do not agree on the number of flavors or flavor dimensions. The DSL offers ways to handle such situations.

The important portions of the DSL are `matchingFallbacks` and `missingDimensionStrategy`. Which one you choose depends on **which module declares more flavors**: the _consuming module_, or the _consumed module_. [This table](https://developer.android.com/studio/build/dependencies#resolve_matching_errors) in the Android Gradle documentation explains this in more detail.

I had a slightly more complex project structure where I thought `missingDimensionStrategy` would be my tool of choice, but it turns out I was wrong. This post describes my situation and why I was wrong.

## Project structure

The project that I use for this blog post is [here](https://github.com/curioustechizen/android-gradle-missing-flavors-demo). The app itself is a shell. It has no activities, no functionality and almost no Android code. It has the following modules:

  1. `app` module. 
      - Includes a flavor dimension `"target"`, with values `"emulator"` and `"realdevice"`
      - Depends on `intermediate-1`, `intermediate-2` and `leaf`
  2. `intermediate-1` module. 
      - Does not know about flavors
      - Depends on `leaf`
  3. `intermediate-2` module. 
      - Does not know about flavors
      - Depends on `leaf`
  4. `leaf` module. 
      - Includes the same flavor dimension and flavors as `app` module
      - Has no dependencies


### String resources

To demonstrate how flavors work, I've created some string resources (using gradle's `resValue` feature) in every flavor, in every module that does care about the flavor. When I build an APK for a particular flavor, I can inspect the string resources in APK analyzer to figure out which variant was used.

```
// app/build.gradle

flavorDimensions "target"
productFlavors {
    emulator {
        dimension "target"
        resValue("string", "name_app_module", "App Emulator")
    }
    realdevice {
        dimension "target"
        resValue("string", "name_app_module", "App Real Device")
    }
}

// leaf/build.gradle

flavorDimensions "target"
productFlavors {
    emulator {
        dimension "target"
        resValue("string", "name_leaf_module", "Leaf module Emulator")
    }
    realdevice {
        dimension "target"
        resValue("string", "name_leaf_module", "Leaf module Real Device")
    }
}
```

## The build error

This is the starting point of my experiment, and it fails to build. You can `git checkout checkpoint-2` if you want to [see it in action](https://github.com/curioustechizen/android-gradle-missing-flavors-demo/tree/checkpoint-2). The build error you see looks like this:

![Build Error](/blog/assets/img/build_error.png)

The reason for this build error is that both the `intermediate` modules know nothing flavors but they depend on `leaf` which does.

## Configuring `missingDimensionStrategy`

My first attempt at fixing this was to configure the `intermediate` modules to specify `missingDimensionStrategy`

```
//intermediate-1/build.gradle and intermediate-2/build.gradle
//this goes inside android { defaultConfig block

missingDimensionStrategy 'target', 'emulator'
```

Here we're saying that when trying to build the intermediate modules, choose the `emulator` variant of the `leaf` module. This works, _kind of_. We can build the APKs for both flavors and we can see the correct strings get included in the built APKs.

This is what the `emulatorDebug` flavor looks like. Note that it has included the strings `"App Emulator"` and `"Leaf module Emulator"`

![app-emulator-debug-apk-missingDimensionStrategy](/blog/assets/img/app-emulator-debug-apk-missing-dimension-strategy.png)

And here's the `realdeviceDebug` APK. Note that it has included the strings `"App Real Device"` and `"Leaf module Real Device"`

![app-realdevice-debug-apk-missingDimensionStrategy](/blog/assets/img/app-realdevice-debug-apk-missing-dimension-strategy.png)

You can `git checkout checkpoint-3` if you want to [see it in action](https://github.com/curioustechizen/android-gradle-missing-flavors-demo/tree/checkpoint-3).

#### The problem

The problem with this solution becomes obvious when you see the build output window. It contains this warning

> Module 'leaf' has variant 'realdeviceDebug' selected, but the modules ['intermediate-1', 'intermediate-2'] depend on variant 'emulatorDebug'

The problem is this: When you chose `realdeviceDebug` variant for `app` module, the same variant is selected for `leaf `module. However, for the `intermediate` modules, we specified we want to use `emulator` flavor.

This is not a problem for us because we explicitly stated that the intermediate flavors don't know or care about flavors. But, how do you fix those warnings?

## Making intermediate module flavor-aware

Unfortunately, the only **correct** way to achieve this was to make the intermediate module flavor-aware. This might seem tedious and against the original intent, but I would argue that for this situation, it is a future-proof approach compared to `missingDimensionStrategy`. Because with `missingDimensionStrategy` if for some reason an intermediate module had to become flavor-aware, it could end up silently choosing the wrong flavor of the leaf module.

So, the fix is to actually introduce the same flavor dimensions and flavors in the intermediate modules as in the leaf modules. You can `git checkout checkpoint-4` to [see it in action](https://github.com/curioustechizen/android-gradle-missing-flavors-demo/tree/checkpoint-4). If you are worried about the repetitive flavor configuration code in the intermdiate modules, you can extract it into a `flavors.gradle` and then use it in the build.gradle files.

```
// root flavors.gradle

android {
    flavorDimensions "target"
    productFlavors {
        emulator {
            dimension "target"
        }
        realdevice {
            dimension "target"
        }
    }
}

// build.gradle of intermediate modules
apply from: '../flavors.gradle'
```

## Conclusion

Use `missingDimensionStrategy` mainly if your **app** module is missing flavor dimensions compared to library modules. Think twice before using it in a module that is itself a dependency for another module. It might look like it works, but it might be doing the wrong thing.

## Credits

Thanks to [Xavier Ducrohet (@droidxav)](https://twitter.com/droidxav) for pointing out the potential pitfalls of using `missingDimensionStrategy` for my use case.