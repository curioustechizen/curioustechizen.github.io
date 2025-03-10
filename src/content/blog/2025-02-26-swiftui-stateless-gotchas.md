---
title:  "Stateless views with SwiftUI and gotchas"
description: "SwiftUI: Limitations with stateless views when embedding a UIViewControllerRepresentable"
publishDate: 2025-02-26
comments: true
tags: [swiftui, stateless]
slug: stateless-swiftui-gotchas
---

When working with declarative UI toolkits, I prefer to make components stateless. This is especially true the closer the component is to the leaf. What's a stateless component?

I define it as one that receives everything that it needs to render as an immutable inputs, leaving all state changes to the caller. In SwiftUI, it would mean one that only accepts `let` properties as inputs, and closures to bubble up events back to the caller. A view that uses `@State` or `@Binding` properties is not stateless.

In the following example, `StatefulCounter` uses a `@State` property and is hence stateful. `StatelessTopView` and `StatelessBottomView`, on the other hand, only depend on the immutable input `count`, or the close `onClick` passed to them. Hence they are both stateless.

```swift
struct StatefulCounter: View {
    @State private var clickCount = 0
    var body: some View {
        VStack {
            StatelessTopView {
                self.clickCount += 1
            }.frame(maxHeight: .infinity)
            
            StatelessBottomView(clickCount: self.clickCount)
                .frame(maxHeight: .infinity)
        }
    }
}

private struct StatelessTopView: View {
    let onClick: () -> Void
    var body: some View {
        Button("Click me", action: onClick)
    }
}

private struct StatelessBottomView: View {
    // This view is completely stateless. It only uses the clickCount property passed to it.
    let clickCount: Int
    var body: some View {
        VStack {
            Text("Stateless example")
            Text("\(self.clickCount) clicks")
        }
        
    }
}
```

## Adding Non-SwiftUI components into the mix

SwiftUI offers some APIs to embed components that are not written in SwiftUI into a SwiftUI view. These components are
- `UIViewRepresentable`
- `UIViewControllerRepresentable`

These APIs are meant to allow you to embed UIKit Views or entire ViewControllers written against the UIKit APIs into SwiftUI views. The `UIViewControllerRepresentable` API for example offers the following functions to override:
- `makeUIViewController`: This is used to return an instance of the UIKit ViewController
- `updateUIViewController`: Here you can use the instance returned in the `makeUIViewController` function and set properties on it for example

[Here](https://sarunw.com/posts/uiviewcontroller-in-swiftui/) is a more detailed blog post on this topic.

## Embedding a declarative component

What if the component being embedded is itself a declarative component? This might seem like a weird requirement at first. If you have a declarative SwiftUI view you can use it directly instead of wrapping it in a UIViewControllerRepresentable.

However, there are situations where you might want to do this. One example is [embedding](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-swiftui-integration.html#use-compose-multiplatform-inside-a-swiftui-application) a Compose Multiplatform Composable from SwiftUI. We will look more into this in upcoming blog posts.

For the purpose of this post, we'll see what happens when you wrap a SwiftUI view inside a `UIViewControllerRepresentable`. However the same concepts apply regardless of what declarative component you are wrapping inside the UIViewControllerRepresentable.

Let's try to use the same stateless approach here. First, we create a stateful View to be the root:

```swift
struct IncorrectRepresentableExample: View {
    @State private var clickCount: Int = 0
    var body: some View {
        VStack {
            TopView {
                self.clickCount += 1
            }
            .frame(maxHeight: .infinity)
            
            IncorrectStatelessBottomViewRepresentable(clickCount: self.clickCount)
                .frame(maxHeight: .infinity)
        }
    }
}
```

Then, we make `TopView`, the view which has the button, which is still stateless:
```swift
private struct TopView: View {
    let onClick: () -> Void
    
    var body: some View {
        VStack {
            Text("Incorrect UIVC Representable example")
            Button("Click me", action: onClick)
        }
        
    }
}
```

Finally, we introduce the UIViewControllerRepresentable to wrap the `BottomView` (which shows the number of button clicks). This is where things get interesting.
```swift
private struct IncorrectStatelessBottomViewRepresentable: UIViewControllerRepresentable {
    // We try to use a stateless approach for a UIVCRepresentable.
    // However this is incorrect: the state change is not propagated to the SwiftUI view
    // embedded inside the UIHostingViewController
    let clickCount: Int
    
    
    func makeUIViewController(context: Context) -> UIViewController {
        let bottomView = BottomView(clickCount: clickCount)
        // This is how you return a declarative View like a SwiftUI View from makeUIViewController
        // By wrapping it in a UIHostingController
        return UIHostingController(rootView: bottomView)
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // If BottomView was a regular UIKit view, then we could have held on to an instance
        // and updated a property here.
        // However it is a SwiftUI view so that is not possible.
    }
}

private struct BottomView: View {
    let clickCount: Int
    
    var body: some View {
        Text("\(clickCount) clicks")
    }
}
```

The important bits to note here:
- The actual declarative implementation of `BottomView` did not change. It is still stateless.
- We wrapped `BottomView` in a `UIHostingController` before returning it from `makeUIViewController`

Do you see the problem here? You are returning a declarative view from makeUIViewController but you have no way of making updates to this view from `updateUIViewController`.

If you run this app, you'll see that clicks are registered but the view that shows the click count does not update at all:
![Incorrect UIViewControllerRepresentable usage](/blog/assets/video/IncorrectUIVCRepresentableExample.gif)

### The fix: Abandon the stateless approach

The only fix I found for this was to abandon the stateless approach, just for the component that is being hosted inside a `UIHostingController`. Instead, make it stateful and use the `@State` or `@Binding` facilities of SwiftUI.

So, the root view and the top view with the button still remain the same:
```swift
struct CorrectRepresentableExample: View {
    @State private var clickCount: Int = 0
    var body: some View {
        VStack {
            TopView {
                self.clickCount += 1
            }
            .frame(maxHeight: .infinity)
            
            CorrectStatefulBottomViewRepresentable(clickCount: self.$clickCount)
                .frame(maxHeight: .infinity)
        }
    }
}

private struct TopView: View {
    let onClick: () -> Void
    
    var body: some View {
        VStack {
            Text("Correct UIVC Representable example")
            Button("Click me", action: onClick)
        }
        
    }
}
```

And for the component that is wrapped inside UIViewControllerRepresentable:
```swift
private struct CorrectStatefulBottomViewRepresentable: UIViewControllerRepresentable {
    // To be able to propagate state changes as desired, we have to abandon the stateless approach
    // Instead we need to use a stateful approach using SwiftUI @Binding
    @Binding var clickCount: Int
    
    
    func makeUIViewController(context: Context) -> UIViewController {
        let bottomView = BottomView(clickCount: $clickCount)
        return UIHostingController(rootView: bottomView)
    }
    
    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // No need to update anything here, instead the @Binding var above results in state propagation
    }
}

private struct BottomView: View {
    @Binding var clickCount: Int
    
    var body: some View {
        Text("\(clickCount) clicks")
    }
}
```

What did we change?

1. In our implementation of the `UIViewControllerRepresentable`, we accepted a `@Binding var` property instead of a `let` property
2. We made the same changes also to our `BottomView`
3. In the root view, we pass the binding `self.$clickCount` instead of the value `self.clickCount`

And with that, we have our state propagation working again:
![Correct UIViewControllerRepresentable usage](/blog/assets/video/CorrectUIVCRepresentableExample.gif)

## Conclusion

Using stateless components in SwiftUI is great - it makes reasoning about the state flow in your application much simpler since stateless components simply cannot mutate any state. However, when wrapping a declarative component inside a `UIViewControllerRepresentable`, you need to reach for the stateful APIs of SwiftUI.

You can find the code for this post [here](https://gist.github.com/curioustechizen/4d191dcd4d633aac62419f756ff0f650). You can discuss this article on [Mastodon](https://androiddev.social/@kiranrao/114133644705964925) or on [LinkedIn](https://www.linkedin.com/posts/activity-7304733966371102720-sbaA).