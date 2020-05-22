---
layout: post
title:  "Stateless widget animations in Flutter"
description: "Using Implicit animations in Flutter to animate stateless widgets"
date: 2020-05-21 21:00
comments: true
tags: [flutter, animations]
---

I'm a Flutter newbie (my day job is Android developer), and it took me some time to understand how animations work in Flutter. In particular, most posts and videos on this topic show how to achieve one of these:

1. How to animate properties of a State*less* widget between a fixed pair of start and end values
2. How to animate properties of a State*ful* widget from whatever the current value is, to an end value.

What I wanted to achieve was a mix of the two. My objective was:
> Animate a State**less** widget to an end value, beginning with whatever the _current_ value is

In this post, we're going to look at exactly that.

**TL;DR:** Within your Stateless widget, use an implicit animation (a widget that extend from `ImplicitlyAnimatedWidget`) to animate the properties you wish to.

This is the animation that we are going to build. 

<img src="/blog/assets/video/flutter_stateless_animation.gif" alt="Flutter stateless animation" style="max-height: 200px; max-width: 200px;" />

 As you can see, it is a very simple animation. Every time you tap the container, it animates:
 1. The background color (this animates between a shade of blue and completely transparent)
 2. A drop shadow for the background

 These properties are applied wrapping our content in a `DecoratedBox` widget, and applying these properties as a `BoxDecoration(color:, borderRadius:, boxShadow:[])`

## Starting point: One-time animation

To start off, we'll see how to achieve this as a one-time animation, without the tap handling. This requires us to create a `StatefulWidget`, provide an `AnimationController` and provide a tween. All this is pretty standard for making an animation in Flutter.

Here's the tween definition

{% highlight dart %}
  final DecorationTween decorationTween = DecorationTween(
    end: BoxDecoration(
      color: kSelectedColor.withAlpha(32),
      borderRadius: kSelectedBorderRadius,
      boxShadow: <BoxShadow>[
        BoxShadow(
            color: kSelectedColor.withOpacity(0.2),
            blurRadius: 8.0,
            offset: kSelectedShadowOffset)
      ],
    ),
    begin: BoxDecoration(
      color: kUnselectedColor,
      borderRadius: kSelectedBorderRadius,
      // No shadow.
    ),
  );

{% endhighlight %}

And here's how we use it inside of a `DecoratedBoxTransition`

{% highlight dart %}
return DecoratedBoxTransition(
    decoration: decorationTween.animate(_controller),
    child: Container(/*Rest of the content*/)
);

{% endhighlight %}

You can see the full runnable example on [this DartPad snippet](https://dartpad.dev/9e9d8a42de5ec14ee6e61f75b71953c8).

## Toggling between states on tap

As the next step, we'll introduce an `isSelected` state that we toggle when the user taps on our widget. This allows us to make the animation go forward/reverse depending on the state.

First, we introduce a bool field in our state class
{% highlight dart %}
bool _isSelected = false;
{% endhighlight %}


Then, in our `build` method we wrap our `DecoratedBoxTransition` in a `GestureDetector` to handle taps
{% highlight dart %}
return GestureDetector(
    onTap: _handleTap,
    child: DecoratedBoxTransition(/*Rest of the code as before*/),
);
{% endhighlight %}

Finally, instead of starting the animation in `initState()`, we start the animation in either forward or reverse direction in `_handleTap`, depending on the `_isSelected` state. And of course, we need to update the state by calling `setState()`
{% highlight dart %}
  void _handleTap() {
    _isSelected ? _controller.reverse() : _controller.forward();
    setState(() {
      _isSelected = !_isSelected;
    });
  }
{% endhighlight %}

You can see this in action on [this Dartpad](https://dartpad.dev/b424985022624c3d8c94a0ea184d5699).

## Going Stateless

The previous solutions both work, but what I really wanted was to make my widget stateless. The reason is that in my app, state is managed outside the widgets. When a user taps on a widget, it simply calls a `Function` that was passed to it. I have a different component in my architecture that updates the state and passes back the new `isSelected` to me.

So, can we just cheat and give the `DecoratedBoxTransition` only the end value so that it begins with whatever the current value is?

{% highlight dart %}
//Does NOT work - throws an exception
DecorationTween decorationTween = DecorationTween(
    end: _isSelected ? _boxDecorationSelected : _boxDecorationUnselected
   // Don't provide a begin
);
{% endhighlight %}

Unfortunately, this does not work. `DecoratedBoxTransition` expects both `begin` and `end` to be not null. This is because `DecoratedBoxTransition` is not an `ImplicitlyAnimatedWidget`. Understanding this was a light bulb moment for me.

To achieve what I want, what we really need is an implicit animation. Is there one that suits my needs? Indeed, there is. 

### Enter, `AnimatedContainer`.

`AnimatedContainer` is an `ImplicitlyAnimatedWidget` and it allows setting several properties of a child, including `constraints`, `paddding`, `margin` and, the one relevant for us: `decoration`.

So, all I had to do was replace `DecoratedBoxTransition` with `AnimatedContainer` and voila! My widget works exactly as I expect it to.

Some relevant pieces of code: First, make the widget completely stateless by passing in the `isSelected` and a function to handle taps as constructor parameters:

{% highlight dart %}
  final bool isSelected;
  final Function onSelectionChanged;
{% endhighlight %}

Then, in the build method, return an `AnimatedContainer`, passing in a `decoration` object that conditionally returns either an empty decoration or the one we want.

{% highlight dart %}
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onSelectionChanged,
      child: AnimatedContainer(
        decoration: BoxDecoration(
            color:
                isSelected ? kSelectedColor.withAlpha(32) : kUnselectedColor,
            borderRadius: BorderRadius.circular(32),
            boxShadow: isSelected ? _selectedBoxShadow: []
        ),
        duration: Duration(milliseconds: 350),
        curve: Curves.easeInOut,
        child: MyContent()
      ),
    );
  }
{% endhighlight %}

You can see the full working sample on [this Dartpad](https://dartpad.dev/1dc8122b218795f118dbfd4339538397).

### Gotchas

I was able to get away with using a Stateless widget in my case because there already existed an `ImplicitlyAnimatedWidget` that fulfils my needs. This might not always be the case, so you might end up needing to make your widget stateful anyway. If you are faced with this situation, you might also consider creating your own subclass of `ImplicitlyAnimatedWidget` to perform the animation - so that you can keep your actual widget stateless.

## Conclusion

In this post, we saw how to use implicit animations in Flutter to keep your widget stateless, and what the limitations are. 

To see a real world use of the techniques described in this post, see the [Covid19-India flutter app](https://github.com/curioustechizen/covid19india-flutter) (where you switch between the categories like "active", "recovered" etc.)
