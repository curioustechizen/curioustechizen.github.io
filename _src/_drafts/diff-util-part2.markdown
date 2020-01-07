---
layout: post
title:  "What's the big difference? List Diffs on other platforms"
date: 2020-01-07 10:00
comments: true
tags: [android, diff]
---

This is the second post in a series that looks into calculating diffs between two lists on Android. You can read [Part 1 here](/blog/2020/01/06/diff-util-part1/). In this post, we will look at how other platforms handle list diffing.

## Swift Standard Library

The Swift standard library has a [`difference(from:)`](https://developer.apple.com/documentation/swift/bidirectionalcollection/3200721-difference) method on `BidirectionalCollection` protocol that returns a `CollectionDifference` result. [This blog post](https://www.fivestars.blog/code/swift-5-1-collection-diffing.html) does a deep dive into this API in Swift.

It looks like this facility is intended as a general purpose list diff API, not specific to UI programming. Remember, it is in the *standard library* so it can be used in backend server programming, for example.

Some notable features of this API

- The most interesting feature is the return type: `CollectionDifference`. This API provides you a way to iterate through all the diff operations, or even to only pick the insertions (or removals). This is different from how Android does it.
- By default, it does not detect moves, but there's an `inferringMoves()` method on `CollectionDifference` that you can use if you want to do this
- There's no concept of "changes" in this API. The `CollectionDifference` provides in itself a Collection of `CollectionDifference.Change` - which is an enum with 2 values: `.insert` and `.remove`.
- `.insert` provides you with an `element` and its offset in the _final list_
- `.remove` provides you with an `element` and its offset in the _original list_. This is somewhat different from how Android's DiffUtil works (although both APIs can be used to achieve the same end-result)
- This API uses `associatedWith` parameter of the enums to inform you about moves
- It uses equality by default for the comparison, but you can customize how the comparison occurs using [`difference(from: by:)`](https://developer.apple.com/documentation/swift/bidirectionalcollection/3200722-difference) variant. Here you pass in a closure that returns a `Bool` so you can use whatever logic you wish to compare the elements.

I could not find a way to convert positions between old and new lists, but I'm not sure if it is ever required when using this API in practice.

## Swift Apple platforms

We started this series with an example of how Android's RecyclerView animates between 2 lists using DiffUtil. It should come as no surprise that Apple's UI frameworks have similar capabilities too.

It has always been possible to achieve this on Apple platforms but it has been verbose and error-prone (frequently giving rise to the Swift equivalent of `ArrayIndexOutOfBoundsException`). Recent API improvements have greatly enhanced the developer ergonomics here.

The headline API is `UITableViewDiffableDataSource` and friends (quite a mouthful!). This is completely out of my comfort zone so I'll point you to [these](https://developer.apple.com/videos/play/wwdc2019/215) [talks](https://developer.apple.com/videos/play/wwdc2019/220) from WWDC (there are also PDF slides available) if you want to learn more. I will point out though, that the items participating in this API need to be `Hashable`. This is how the framework decides that items have "changed". It fulfils the role of `areContentsTheSame()` from Android's DiffUtil.

## Flutter

I could not find any official API for List Diffs in Flutter. However, there's a third party library that is inspired by Android's DiffUtils. It is called [AnimatedStreamList](https://github.com/adithyaxx/animated-stream-list). The relevant files in this repo are [`myers_diff.dart`](https://github.com/adithyaxx/animated-stream-list/blob/c5b3b17e8dd0b723e2b3777521924c272580c4bf/lib/src/myers_diff.dart) and [`diff_payload.dart`](https://github.com/adithyaxx/animated-stream-list/blob/c5b3b17e8dd0b723e2b3777521924c272580c4bf/lib/src/diff_payload.dart).

Of note in this library:

- It returns a `List<Diff>`. In this sense it is similar to the Swift implementation
- `Diff` can be one of `InsertDiff`, `DeleteDiff` or `ChangeDiff`. This library does not implement moves.
- Each instance of `Diff` includes an `index` and a `size`. In this respect, it is similar to the Android DiffUtil implementation.
- It uses an [`Equalizer`](https://github.com/adithyaxx/animated-stream-list/blob/c5b3b17e8dd0b723e2b3777521924c272580c4bf/lib/src/myers_diff.dart#L5) to customize the comparison.

## Angular

Angular has an `IterableDiffer` API that can be used to compute the diff between 2 Iterables. From what I can tell, it is not intended to be used directly by applications, instead it is used internally by the framework (for example, by the `NgForOf` directive). [This article](https://blog.mgechev.com/2017/11/14/angular-iterablediffer-keyvaluediffer-custom-differ-track-by-fn-performance/) goes into the nuts and bolts of this API.

The interesting classes are

- [`IterableDiffer`](https://angular.io/api/core/IterableDiffer): The entry point of the API. Offers the `diff` function
- [`IterableChanges`](https://angular.io/api/core/IterableChanges): The diff result, which in itself is an Iterable
- [`IterableChangeRecord`](https://angular.io/api/core/IterableChangeRecord): Each individual update operation

The `IterableChanges` interface is pretty interesting: it exposes functions to iterate over the changes in a variety of ways (all updates, only additions, only removals etc). The `DefaultIterableDiffer` accepts a `TrackByFn` argument, which fulfils the role of Android's `DiffUtil.Callback`.

`IterableChangeRecord` is also interesting: It does not directly state the diff operation. Instead, it contains `currentIndex` and `previousIndex`. Together, these can be used to decide if an item was added, removed etc. It also fulfils the role of position conversion APIs in Android. Of course, you'd probably use the `IterableChanges` API to achieve the same result instead.

## At a glance

Here's a table summarizing all the diff APIs across these platforms.

|                     | Android               | Swift                          | Flutter   | Angular              |
|---------------------|-----------------------|--------------------------------|-----------|----------------------|
| Detect Moves        | Yes                   | Yes                            | No        | Yes                  |
| Change payloads     | Yes                   | No                             | Yes       | Yes                  |
| Custom comparison   | `DiffUtil.Callback`     | `difference(from:by:)`, `Hashable` | `Equalizer` | `TrackByFn`            |
| Position conversion | Methods on `DiffResult` | NA                             | NA        | `IterableChangeRecord` |

## Conclusion

After my research for this post, I came to the conclusion that Android's DiffUtil API is the most flexible of all. It is the lowest level API for exposing the diff operations (the `ListUpdateCallback`). All other platforms expose collection-style APIs for this purpose.

I reckon Android has this low-level API because it plays well together with RecyclerView Adapter API. One can write a wrapper to expose it as a collection-style API.

That is exactly what we will do in the next post in this series: Look at an example situation where RecyclerView might not be best fit, and instead wrap the `ListUpdateCallback` to implement some custom UI.