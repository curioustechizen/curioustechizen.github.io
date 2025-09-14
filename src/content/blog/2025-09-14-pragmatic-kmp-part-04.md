---
title:  "Pragmatic KMP for Mobile at Somnox - Part 4"
description: "Case study: Pragmatic, incremental adoption of KMP for mobile at Somnox. Part 4: Multiplatform screen navigation"
publishDate: 2025-09-14
comments: true
tags: [kotlin-multiplatform, pragmatic-incremental-kmp]
slug: pragmatic-kmp-part-04
seo:
  image:
    src: '/blog/assets/img/pragmatic-kmp-part-04-flowstacks-snippet.png'
    alt: 'Code snippet showing navigation on iOS implemented using FlowStacks library'
---

## Introduction

At [Somnox](https://somnox.com/), we've had native Android and iOS [apps in production](https://somnox.com/app/) since 2020. In 2023, we started using [Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) for new features. In this series of blog posts, we will look at how we achieved this in a _pragmatic_, _incremental_ manner. 

You can read all posts [here](/tags/pragmatic-incremental-kmp). The [first](/blog/pragmatic-kmp-part-01) [two](/blog/pragmatic-kmp-part-02) posts talked about sharing architectural layers, while the [third](/blog/pragmatic-kmp-part-01) explored maintaining our existing repo structure and CI setup.

In this fourth instalment, we'll see how we were able to keep our existing navigation mechanism when introducing KMP. There are two parts to this
1. Navigating from a multiplatform screen to another multiplatform screen
2. Navigating from a multiplatform screen to an existing natively implemented screen

## Setting the stage

- Our Android app was using the [navigation compose](https://developer.android.com/develop/ui/compose/navigation) library (before this library went multiplatform). Specifically we were still using nav2.
- Our iOS app was using `NavigationView` APIs
- We have also been injecting a `Router` abstraction into our ViewModels.

Some pseudocode
```kotlin
//Multiplatform router interface
interface GuideRouter {
  fun goToSessionScreen(sessionId: Long)
  fun goToGuideOnboardingScreen()
  fun goBack()
}

//Multiplatform ViewModel
class GuideViewModel(private val guideRouter: GuideRouter): ViewModel() {
  fun onSessionClick(sessionId: Long) {
    guideRouter.goToSessionScreen(sessionId)
  }

  // ...
}

//Android implementation of the router using NavController
class AppRouter: GuideRouter, FeatureFooRouter, FeatureBarRouter {
  override fun goBack() {
    navController.popBackStack()
  }

  override fun goToSessionScreen(sessionId: Long) {
    navController.navigate("session/$sessionId")
  }

  override fun goToGuideOnboardingScreen() {
    navController.navigate("guideOnboarding")
  }
}

//Entry point using navigation-compose (the NavHost composable)
@Composable fun AppNavHost() {
  navigation(startDestination = "guide") {
    composable("guide") {
      GuideScreen
    }
    composable("session/{sessionId}") {
      // Code to retrieve the sessionId has been elided
      SessionScreen(sessionId)
    }
    composable("guideOnboarding") {
      GuideOnboardingScreen()
    }
  }
}
```

**Warning:** The approach shown above has some serious flaws and I do not recommend it. Specifically, implementing this Router in terms of `NavController` on Android is problematic. A better approach is to implement state-based routing.

But remember the theme of this entire series is to integrate KMP with our existing code, without taking on a large migration or refactoring task. We had the above setup in our app and refactoring it at the same time as introducing KMP would be too much of a risk. So we decided to go with what we had.

### The iOS implementation

The goal is to have a router injected in a Multiplatform ViewModel drive the screen navigation on iOS. So, how do we implement this on iOS? Enter [FlowStacks](https://github.com/johnpatrickmorgan/FlowStacks).

First, we create an enum to represent the screens

```swift
enum GuideDestination {
  case guide
  case session(sessionId: Int64)
  case onboarding
}
```

Then, we implement the `GuideRouter` interface on iOS
```swift
import FlowStacks
import Shared

class IosAppRouter: GuideRouter, FeatureFooRouter, FeatureBarRouter {
  private init(){}
  static let shared = IosAppRouter()
  static let defaultRoute: Routes:<GuideDestination> = [.root(.guide)] // From FlowStacks lib

  let routesPublisher = PassthroughSubject<Routes<GuideDestination>, Never>()

  private var routes: Routes<GuideDestination> = IosAppRouter.defaultRoute {
    didSet {
      if oldValue != newValue {
        routesPublisher.send(routes)
      }
    }
  }

  func goBack() {
    routes.goBack()
  }

  func goToSessionScreen(sessionId: Int64) {
    self.routes.push(.session(sessionId: sessionId))
  }
  
  func goToGuideOnboardingScreen() {
    self.routes.push(.onboarding)
  }

  // ...
}
```

Next, we expose this as a SwiftUI ObservableObject
```swift
@MainActor
class NavigationViewModel: ObservableObject {
  private let appRouter = IosAppRouter.shared
  @Published var navRoutes: Routes<GuideDestination> = IosAppRouter.defaultDestination

  private var cancellables = Set<AnyCancellable>()

  init() {
    self.appRouter.routesPublisher
      .sink { [weak self] newRoutes in
        self?.navRoutes = newRoutes
      }
      .store(in: &cancellables)
  }
}
```

Finally, we use the `Router` UI component provided by FlowStacks to observer the navRoutes
```swift
struct GuideFeatureNavHost: View {
  @StateObject navViewModel = NavigationViewModel()
  var body: some View {
    NavigationView {
      // Router is provided by FlowStacks library
      Router($navViewModel.navRoutes) { dest in
        switch dest {
        case .guide: IosGuideScreen()
        case .session(let sessionId): IosSessionScreen(sessionId: sessionId)
        case .onboarding: IosGuideOnboardingScreen()
        }
      }
    }
  }
}
```

In the above example,
- `GuideScreen`, `SessionScreen` and `GuideOnboardingScreen` are Compose Multiplatform screens
- `IosGuideScreen`, `IosSessionScreen` and `IosGuideOnboardingScreen` are thin wrappers around the CMP screens (implemented as described [here](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-swiftui-integration.html))

With that, we were able to implement navigation for multiplatform screens without changing the existing navigation mechanisms.

## Navigating to existing screens

Navigating to new screens is just one part of the puzzle. We had some existing screens already implemented natively on iOS and Android. How could we fit those into the picture?

Let's assume that `GuideScreen` has an additional button that takes you to a native Account screen.

`GuideScreen` lives in a multiplatform module and does not depend on the android module where the native screens are implemented. Also, the iOS implementation lives in Swift code. How do we bridge this gap?

The answer is anti-climactic: We simply pass in lambdas on the iOS side and implement using NavControlle on the Android side. There's no magic or trick here.

```kotlin
interface GuideRouter {
  // ... All existing methods here
  // Then new methods for navigation to existing native screens
  fun goToAccountScreen()
}

//Multiplatform ViewModel
class GuideViewModel(private val guideRouter: GuideRouter): ViewModel() {
  fun onAccountClick() {
    guideRouter.goToAccountScreen()
  }

  // ...
}

// Android
class AppRouter: GuideRouter, FeatureFooRouter, FeatureBarRouter {
  override fun goToAccountScreen() {
    navController.navigate("account")
  }
}

fun NavGraphBuilder.addAccountFeature() {
  navigation(startDestination = "account") {
    composable("account") {
      AccountScreen()
    }
  }
}
```

Basically nothing changes on Android. We modify the Multiplatform GuideScreen though: We add an additional lambda for dealing with the native actions. It calls both the ViewModel and the additional lambda on click.

```kotlin
typealias AccountClickHandler = () -> Unit

@Composable 
fun GuideScreen(
  guideViewModel: GuideViewModel, 
  accountClickHandler: AccountClickHandler? = null
) {
  Button(
    onClick = {
      guideViewModel.onAccountClick()
      accountClickHandler?.invoke()
    }
  )
}
```

The corresponding change is needed in the wrapper that we expose to SwiftUI
```kotlin
// iosMain IosGuideScreen.kt
fun GuideScreen(accountClickHandler: AccountClickHandler): 
  UIViewController = ComposeUIViewController {
    GuideScreen(accountClickHandler = accountClickHandler)
  }
```

On the Swift side, two things need to happen:
1. The router implementation should no-op
2. The SwiftUI wrapper for the CMP screen should pass an additional lambda

```swift
class IosAppRouter: GuideRouter {
  func goToAccountScreen() {
    // Do Nothing. This is implemented differently on iOS
  }
}

struct IosGuideScreen: UIViewControllerRepresentable {
  let onAccountClick: () -> Void
  func makeUIViewController(context: Context) -> UIViewController {
        return IosGuideScreenKt.GuideScreen(accountClickHandler: onAccountClick)
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
    }
}

// One example of how the additional lambda can be used on the iOS side to open the existing AccountScreen
struct GuideTabView: View {
  @Binding var showAccountScreen: Bool
  var body: some View {
    IosGuideScreen(
      onAccountClick: {
        showAccountScreen = true
      }
    )
  }
}

struct MainView: View {
  @State var showAccountScreen = false
  var body: some View {
    if showAccountScreen {
      // This native screen sets the value of showAccountScreen to false when the user closes it.
      AccountScreen(showAccountScreen: $showAccountScreen)
    }

    // Elsewhere in a tab bar
    GuideTabView(showAccountScreen: $showAccountScreen)
  }
}
```

With that we can navigate from a multiplatform screen to a native one.

----

Let's recap what we saw in this episode
1. Navigation decisions can be taken in the ViewModel, in a multiplatform manner
2. You can navigate from a multiplatform screen to another while still reusing existing patterns
3. You can navigate from a multiplatform screen to a platform native screen while still reusing existing patterns

This flexibility was invaluable in our journey of integrating KMP into our codebase.

From the next episode, we'll start looking into the truly platform-specific aspects like deep-linking, permissions, notifications.

