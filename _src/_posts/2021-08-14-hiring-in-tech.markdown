---
layout: post
title:  "Hiring in Tech"
description: "Learning ability above knowledge; and other tips for hiring programmers"
date: 2021-08-14 21:00
comments: true
tags: [hiring]
---


> "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn." ~Alvin Toffler

In this post, I share my experience in the world of tech hiring. The examples in this post are from tech that I've worked with (Android, iOS), but most points apply to _any_ tech. I start off by listing the core criteria that I'm looking for when I'm hiring, and later I'll describe the process that could be used to determine if a candidate fulfils those criteria.

This is a very opinionated topic, and I don’t claim that all of these points are applicable to everyone. Also, this is not necessarily how I hire at my current position. It is a culmination of what I learnt during the course of my career.

# Hiring principles

## Hire for learning ability, not knowledge

The programming landscape changes fast. _Real_ fast. 

If you did Android development in 2017, then moved to some other technology, then returned to Android in 2021, chances are that you would pretty much start from scratch. Libraries and patterns that are standard in Android today were almost unheard of in 2017. Co-routines. Flow. Hilt. Jetpack Compose are all new, and we've not even started talking about the impact of continuous PlayStore policy updates.

In this landscape where knowledge goes stale quickly, what a candidate knows has less value than whether they are capable of learning.

## Experience matters, but only to a degree

While _knowledge_ can be treated as a past laurel that one must not rest on, _experience_ certainly has value. It does not need to be experience in a certain technology. Mere experience brings with it a lot of value. Even more if the candidate has had experience switching tech stacks; or unlearning and re-learning.

That said, sometimes experience is given too much importance. Not every role requires a Senior developer.

## Evaluate based on "typical day at work" ...

 ... not based on something that might only be required sparingly.

 When hiring for a mobile developer, I want to evaluate how good the candidate is at developing mobile apps. _That_ should be the goal of the process.

 What does a mobile developer do during a typical day at work?

   - Understand specs for a feature
   - Implement the feature 
   - Design a reasonable architecture
   - Write tests for the feature

What does a mobile developer _not_ do during a typical day at work?

  - Print a fibonacci sequence
  - Implement a sorting algorithm by hand
  - Micro-optimize a data structure

This is an unpopular opinion: for the role of a mobile developer, quizzing a candidate about data structures and algorithms is not very fruitful (Of course, if you're hiring for the role of a standard library developer for a programming language, chances are that data structures and algorithms are exactly what matter to you). 

The basics are important though. If the architecture is good, then tweaking an algorithm here or there will be an isolated operation leaving the rest of the code base untouched.

## Skip anything that can be easily looked up

_I was once at an Android interview where I was asked to explain the [Intent launch modes](https://developer.android.com/guide/components/activities/tasks-and-back-stack#TaskLaunchModes). In my opinion no one should ever use any of those modes without first consulting the documentation. There are far too many subtleties._

But really, what is the point of asking this question? What insight would you gain into the candidate by asking such a question?

My rule of thumb : If it can be looked up in 30 minutes, it is not interview material.

## Even so-called basics are changing

In mobile development, the absolute basics are generally the lifecycles of the core platform components (Activity on Android, UIViewController on iOS). Strong foundations in these basics has been considered a non-negotiable criterion while interviewing candidates.

I'm going to state yet another unpopular opinion: Even these basics are not required anymore. If a candidate has experience with _any_ platform that has a lifecycle, they're going to learn how his works. Even with the platform that they do have experience with, it is unlikely that they know about the lifecycle beyond the core inner loops.

For example, on Android I find the [Fragment lifecycle's](https://developer.android.com/guide/fragments/lifecycle?hl=en) interaction with the Activity lifecycle very tricky. I can never remember whether `onCreate` is called first or `onCreateView`. For an Activity, there is no guarantee of the order of `onSaveInstanceState` calls with respect to `onPause` or `onStop`.

As with the previous point, this can just be looked up. Just knowing that some lifecycle exists, and that it is one documentation link away, is sufficient.

## Enable the candidate to bring out the best in them

An interview process should be such that it allows the candidate to shine. You want to see the best side of the candidate. You do not want to make the candidate a nervous wreck.

Unpopular opinion #3: Allow the candidate to steer the interview. Allow the candidate to take control.

A sub-point: Avoid requiring "preparation" on the candidate's part. I'm not even referring to LeetCode or Cracking the Coding Interview. I find those artificial anyway.

The point here is the candidate should not need to prepare for an interview with your company, instead you should judge the candidate for what they are.

# Hiring process

Now that I've listed what according to me are the core principles for hiring in tech, I'll describe the process that worked best for me in the past. This is subjective, and depends on the role. It worked well for hiring for the role of a mobile developer.

My process consists of 2 steps for the _technical_ part of the interview. Beyond this, you still need the HR interviews and to assess whether they are a cultural fit.

## Step 1: Small take-home assignment

This step involves providing a small take-home assignment. 

What you glean from this step is:

  - Does the candidate understand requirements? 
    - Do they ask clarifying questions?
  - How do they approach architecting a solution?
  - How do they approach testing?

This needs to be a tiny assignment. I cannot stress this point enough. Be sensitive to the fact that the candidate is likely interviewing at other companies too. This is an assignment that they will be doing in their free time. You don't want your assignment to take up their entire weekend.

Most companies that I interviewed at wanted me to develop an app with at least 2 screens, lists, network calls to some backend APIs and more. Half the time is spent obtaining API keys and setting up the infrastructure. Some companies even state something along the lines of "Give us your best".

I am a strong opponent of such take-homes. A candidate should not need to spend more than half a day on the assessment. You can take simple apps like counters, timers, "click-to-change-color" and add some interesting twists to them to come up with requirements that satisfy all the criteria stated above.

### Alternative: Pair programming

For some candidates, a take-home is not an option. For those, a pair programming session can be used to approximate the same result.

## Step 2: Technical interview

If the candidate passes Step 1, then they are invited for a technical interview. 

The goals of this step:

  - Understand if the candidate really came up with this solution on their own
  - Have a technical discussion with the candidate

The first of these goals can be achieved by discussing their assessment. Asking them to explain their choices. Adding more requirements, or changing a requirement to see how they adapt their solution, pair programming (this need not be complete, running code; just an explanation would suffice).

The second point in this interview goes back to the point about allowing the candidate to shine. For this I shamelessly copy a strategy from an interview where I was a candidate. I ask an open-ended question, like:

> "What's the one thing in your career that you're most proud of/least proud of?", "What's the most difficult challenge that you had so far? How did you solve it?"

In my experience this often puts candidates at ease and lets them open up. The answers to these questions give a lot of valuable insight into their technical and critical thinking abilities.

# Conclusion

So there is my formula for hiring in tech. 

As a recap, here are the core principles:

1. The ability to learn, unlearn and relearn is more valuable than existing knowledge
1. Experience always has value, but not every role needs to be a Senior Developer
1. Evaluating based on what a candidate does every day at work is beneficial over evaluating something that they do occasionally
1. If it can be looked up in 30 minutes, it is not interview material
1. What constitutes "basics" is changing every day, it is advisable to not get too hung up on them
1. Bringing out the best in the candidate is a win-win

Here is the TL;DR of the tech portion of the hiring process

1. Tiny take-home assignment; pair programming session if a take-home is not possible for the candidate
1. Technical interview as a follow up to Step 1.

  
# Credits

Thanks to [Mike Wolfson (@mikewolfson)](https://twitter.com/mikewolfson) for reviewing this article.