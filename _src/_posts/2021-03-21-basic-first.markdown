---
layout: post
title:  "Basic before advanced"
description: "Advanced features are useless if the basic ones don't work well"
date: 2021-03-21 16:30
comments: true
tags: [obvious]
---

This is a non-programming post in the series I call "re-stating the obvious". This series talks about topics that already boast extensive literature, I'm merely adding my own annotations. You can find all posts in this series [here](/blog/tags/obvious).

## An anectode

I start this post with an anecdote. The era was 1990s and the scene was a bus stand. While my father and I were waiting for a bus, a hawker approached us with a bunch of imitation Casio watches. Here's the conversation that ensued:
>**Father:** How much for that watch?
><br>
>**Hawker:** 100 rupees
><br>
>**F:** That is a lot for a watch. Why is it so expensive?
><br>
>**H:** It has a lot of amazing features ...
><br>
>**F:** Like what?
><br>
>**H:** See this button here? It activates the stop watch ... and look, it glows in the dark ... and also, it is water resistant ... and oh, do you see the strap? It is reversible .. and ...
><br>
>**F:** I see the watch is running behind by 5 minutes. Why is that?
><br>
>**H:** Oh that is probably because the light and stopwatch consume a lot of battery
><br>
>**F:** So you are trying to sell me a watch that does not even tell the time correctly but has lot of other useless fancy features?

## Feature creep

Wikipedia has a great definition of [featue creep](https://en.wikipedia.org/wiki/Feature_creep). To paraphrase it, and add my own flavor to the definition:
> Feature creep is the tendency to add advanced features to a system even before the main purpose of the existence of the system is fulfilled.

I say "system" but feature creep could also occur in a narrower scope, i.e., a subsystem of a system (more on this in a bit). Let's take a look at some examples.

### Smartphones

A smartphone is perhaps the obvious example that comes to mind. Smartphones function as calculators, cameras, navigation devices, alarms, calendars, books, entertainment devices and a whole bunch more. With so much functionality crammed in, the fundamental purpose of making and receiving phone calls has taken a back seat. All the other features use up resources like battery, leaving very little for actual phone calls.

### Automotive systems

In the automotive space, the line between what is infotainment and what is driver-assist is constantly blurring. What is a luxury today becomes a basic safety feature tomorrow. It is no wonder that companies get carried away trying to pack their vehicles to the brim with features This is where things start going awry. 

> Feature creep starts seeping in such a way that safety features of one subsystem are rendered almost useless due to overcrowded features in another.

Consider this. Let's say you have a vehicle with every major driver assist safety feature that you can think of: Tyre pressure monitoring system, Anti-lock Braking system, Side-stand alert, cruise control, collision warning - you name it. And then, you go and pair this with an infotainment system that distracts the driver, or requires the driver to spend too much time fiddling with the controls in order to achieve anything. What use are all those advanced features then? **The feature creep in the infotainment subsystem could cause fatal crashes long before the safety subsystem can even kick in.**

If you think this is hypothetical, think again. Next time you use your vehicle, check how easy it is to perform some tasks like the following:

  - Changing the destination of your navigation system while you are driving
  - Checking the tyre pressure (if your vehicle is equipped with a TPMS)
  - If you use phone projection systems like Android Auto or Apple CarPlay, how seamlessly does the system recover from a lost connection between the vehicle and phone?

And note that this list does not even include the "tainment" part of infotainment. I have not even gotten to the part where you try to control your music or podcasts or message someone.

## Basic First

I'm not here to advocate that there is one true solution to this problem. I'm a fan of the "a product should do one thing and do it well" philosophy but it does not apply to every product.

What might be interesting is to come up with some principles for a threshold for a feature to make it in. This tweet about Minimum Viable Product comes to mind:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Debunking the <a href="https://twitter.com/hashtag/MVP?src=hash&amp;ref_src=twsrc%5Etfw">#MVP</a> myth: a key figure from &quot;The Lean Product Playbook&quot; <a href="http://t.co/TvuHbBnE7e">http://t.co/TvuHbBnE7e</a> <a href="https://twitter.com/hashtag/leanstartup?src=hash&amp;ref_src=twsrc%5Etfw">#leanstartup</a> <a href="https://twitter.com/hashtag/prodmgmt?src=hash&amp;ref_src=twsrc%5Etfw">#prodmgmt</a> <a href="http://t.co/DqM0tWPzLG">pic.twitter.com/DqM0tWPzLG</a></p>&mdash; Dan Olsen (@danolsen) <a href="https://twitter.com/danolsen/status/613581087617384449?ref_src=twsrc%5Etfw">June 24, 2015</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

It might be an interesting experiment to repurpose (and kind of negate) the second image in this tweet and use it as a template for deciding if a feature should be added:

  1. Bottom of the pyramid (Functionality): Will absence of this feature prevent the core functionality of the feature from being fulfilled?
  2. Second from the bottom (Reliability): Without this feature, will the reliability of the product be impacted?
  3. Second from top (Usability): Does absence of this feature have detrimental effect on the usability of the core product?
  4. Top of the pyramid (Delight): Only if the product passes through the other three filters, then ask the question - Do we have no way to delight the user without this feature?

If the answer to all these questions is a resounding Yes, then the feature makes it in, else it stays out.

## Conclusion

At the risk of restating the obvious, **advanced features are useless if the basic ones don't work well**. Products ought to focus on the basic reason for their existence to work solidly before trying to add more. Otherwise it risks being perceived as gimmicky.