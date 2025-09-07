---
title:  "Pragmatic KMP for Mobile at Somnox - Part 3"
description: "Case study: Pragmatic, incremental adoption of KMP for mobile at Somnox. Part 3: Code organization and CI"
publishDate: 2025-08-31
comments: true
tags: [kotlin-multiplatform, pragmatic-incremental-kmp]
slug: pragmatic-kmp-part-03
seo:
  image:
    src: '/blog/assets/img/pragmatic-kmp-part-03-directory-structure.png'
    alt: 'Directory structure showing the Android and iOS app repos checked out as siblings'
---

## Introduction

At [Somnox](https://somnox.com/), we've had native Android and iOS [apps in production](https://somnox.com/app/) since 2020. In 2023, we started using [Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) for new features. In this series of blog posts, we will look at how we achieved this in a _pragmatic_, _incremental_ manner. 

This is the third post in this series. You can read all posts [here](/tags/pragmatic-incremental-kmp). The [first](http://kiranrao.in/blog/pragmatic-kmp-part-01) [two](http://kiranrao.in/blog/pragmatic-kmp-part-02) posts talked about sharing architectural layers. In this post, we'll look at using KMP with our existing repo structure and CI setup. There's very little _Kotlin_ itself in this episode!

## Existing structure

We use private GitHub repos to host our source, but the discussion here can be applied to any modern source code repository. Our existing apps were in separate git repos. It looked something like this
- Android: `Somnox/SomnoxAndroidApp`
- iOS: `Somnox/SomnoxIosApp`

Each app also had its own CI configuration (to run per-PR tests, and to build releases/submit to the respective stores).

## Enter Kotlin Multiplatform

For fresh KMP projects, there are a few common repository organization strategies:
1. Have a single repo that contains the Android, iOS and shared code
2. Maintain three repos, one each for the Android app, the iOS app and the shared KMP code

When we introduced KMP, we wanted to do it with the least possible friction to existing workflows. Remember, we were wetting out feet, so we did not want to make big changes like merging or splitting repos. So neither of the above strategies were suitable for us.

Our `SomnoxAndroidApp` already contained modules that were KMP-ready. Many of the modules could be made KMP-compatible just by changing the gradle plugin and modifying the directories a bit. For example we had some base architectural classes and utilities in our `:core` module which could be made multiplatform. We wanted to use these base classes from day 1 in our multiplatform code.

The first decision we took was to start off with having the exact same repos: `SomnoxAndroidApp` & `SomnoxIosApp`.
> We decided to start off without any changes to the repository setup

This had a few immediate consequences:
1. We would write the shared KMP code in the `SomnoxAndroidApp` repository. That's where we'd place the `kmp_umbrella` module that would be the entry point for iOS into the Kotlin world.
2. `SomnoxIosApp` would have to somehow depend on `SomnoxAndroidApp`. We chose to check out these repos as siblings in a folder. There are other options like git submodules, but we decided to make the bare minimum changes to get things rolling.

So, when we introduced KMP, we would check out our two repos side-by-side as follows
```bash
$ tree -L 2
.
├── SomnoxAndroidApp
│   ├── app
│   ├── build.gradle.kts
│   ├── core
│   ├── features
│   ├── kmp
│   ├── kmp_umbrella
│   └── settings.gradle.kts
└── SomnoxIosApp
    ├── SomnoxIosApp
    ├── SomnoxIosApp.xcodeproj
    └── SomnoxIosApp.xcworkspace
```

Next, we had to modify the instructions from [here](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html#configure-the-ios-project-to-use-a-kmp-framework) to make it work with our directory structure. Specifically, in the "Build Phases" section where we add the script to run gradle, we point to our `kmp_umbrella` module as follows
```diff lang="bash"
- cd "$SRCROOT/.."
- ./gradlew :shared:embedAndSignAppleFrameworkForXcode
+ cd "$SRCROOT/../SomnoxAndroidApp"
+ ./gradlew :kmp_umbrella:embedAndSignAppleFrameworkForXcode
```

Note that after going up a directory from where the xcodeproj resides, we have to go down a level into `SomnoxAndroidApp` - that's where the `gradlew` command is available.

With these changes we were able to build the iOS app and have it consume KMP code. But what about CI?

## Continuous Integration with KMP

As you might have guessed, there was no change in the CI pipeline for the Android app (after all, we were using the exact same repo as before).

For iOS, we use fastlane for per-PR builds, and for submitting the release builds to TestFlight. For the most part, we did not have to make any changes to the fastlane configuration itself.

The real challenge was in checking out 2 repos from a single Github Action run. By default, you can only check out the repository for which the action was triggered (in this case it would be `SomnoxIosApp`). We ended up using SSH key pairs with deploy keys:
 - Create an SSH keypair
 - Store the _public_ key as a deploy key on the `SomnoxAndroidApp` repo
 - Store the private key as a secret (for example `SSH_PRIVATE_KEY_ANDROID_REPO`) in the repo that triggers the checkout (`SomnoxIosApp`)
 - Finally, make use of this secret while checking out the Android repo from the iOS repo's CI

Here's a snippet from our `build.yml` file in the `SomnoxIosApp` repo

 ```yml
steps:
  - name: Install SSH Key 
    uses: webfactory/ssh-agent@v0.5.4
    with:
      ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY_ANDROID_REPO }}

  - name: Checkout iOS app source code
    uses: actions/checkout@v3.4.0
    with:
      path: SomnoxIosApp

  - name: Checkout Android app source code
    uses: actions/checkout@v3.4.0
    with:
      repository: Somnox/SomnoxAndroidApp
      path: SomnoxAndroidApp
      ref: main
 ```

 The rest of the build.yml file remained the same as before. This is sufficient for CI to be able to check out the iOS and Android repos as siblings, and build the iOS app with a dependency on the KMP code in the Android repo.
 
 **Note:** I've seen discussion about using Github Personal Access Tokens instead for this convoluted deploy key mechanism for checking out other private repos belonging to the same github org. I haven't had the chance to try that option.

 ## Merging into a "monorepo"

 The above arrangement of having sibling repos was beneficial for us during the "trial period". As you might imagine, it was not without serious pain-points though. Co-ordinating branches between the two separate repos was the biggest problem, and we knew it would become a blocker sooner or later.

 That is precisely why, once KMP as a technology had proven itself and we had decided to go all in on it, the first thing we did was to merge the two repos into one. Calling it a mono-repo is a bit pretentious (since it is just a merger of two repos), but the name has stuck, so I'm going to use that term for the rest of this series.

 [This blog post](https://jdriven.com/blog/2021/04/How-to-merge-multiple-git-repositories) was taken as a basis for merging the two existing repos into a third repo. We were able to retain
 - Commit histories for both original repos
 - Tags

However we lost
- Additional branches created in the individual repos

Honestly, I was surprised that it was at all possible to merge two repos into one while maintaining the commit histories for both repos. Git is surprisingly flexible!

After merging the repos, almost nothing changed in terms of configuration:
- The build phase of the Xcode project did not change
- The CI was only simplified (we could get rid of the deploy key dance)

But a monorepo brings more advantages than that: Our iOS and Android apps now evolve together. Feature additions happen on the same branch. So philosophically too, we are where we wanted to be with KMP.

 ----

 We saw in this post
 1. That you can get started with KMP without disruptions to your existing Android and iOS app workflows
 2. That it enables you to try out the technology without committing to it fully
 3. How you can embrace the technology once your team is convinced
 4. How to achieve all of this without much risk, while still reusing as much existing code and infrastucture as possible

In the next post, we'll get back to code. We'll look at how we bridged the navigation gap between the two platforms.

----

**Edited to add:** You can comment on this post on [Mastodon](https://androiddev.social/@kiranrao/115135733022932428) or [LinkedIn](https://www.linkedin.com/posts/activity-7368983714925584384-jf9u).