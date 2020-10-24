---
layout: post
title:  "Falsehoods programmers believe about addresses"
description: "Invalid assumptions that we make about addresses, that lead to poor UX"
date: 2020-10-24 11:00
comments: true
tags: [falsehoods]
---

I've spent the better part of the last three years developing a navigation app at work. It includes features like 

  - Searching for a location
  - Adding a location to favorites
  - Turn by turn navigation to a destination

I had the seemingly simple task of splitting an address into two parts for displaying in the user interface (line 1 and line 2). The exact mechanism of the split didn't matter as long as it could be reasonably split. 

Here as some examples of how I presumed it could be split depending on the length of the address

  - Line 1 = Place Name; Line 2 = address
  - Line 1 = Place name, number, street; Line 2 = city, state
  - Line 1 = Place name, number; Line 2 = street, city
  - ... and so on

Simple, right? Wrong.

Over the course, I've made several assumptions about addresses that turned out to be incorrect. This post attempts to list the things I learned about addresses. 

This post is inspired by other "Falsehood programmers believe" posts (and hence uses a similar format). In fact, there's a [GitHub repo](https://github.com/kdeldycke/awesome-falsehood) that lists all such posts. Other people before me have already made "Falsehoods about addresses" lists, but I'm making one based on my own experience.

So, let's get right to the falsehoods. Every one of the statements below is false.

About **locations**:

  1. Every location has a unique address. This is false: every location has a unique _geocoordinate_ (lat-long), or other such _identifier_ like [Google Plus Codes](https://maps.google.com/pluscodes/) or [what3words](https://what3words.com/about-us/), but it does not have a unique _address_.
  1. A location has an address

About **addresses**:

  1. The concept of an address is universal
  1. What constitutes an address is universal
  1. An address has a number
  1. An address identifies a single house/shop/office
  1. An address has a street name
  1. An address has a post code/zip code/pin code
  1. An address has a neighborhood/locality name
  1. An address has a place name
  1. An address is hierarchical (number, street, city, state, country)

**User interface** related:

  1. An address has sufficient info to make sense in a user interface
  1. An address, when shortened (ellipsized etc) to fit on a user interface, still gives enough context to the user
  1. An address fits on one screen on a mobile phone with a readable font size

About **streets**:

  1. A street has a name
  1. A street name is unique in a city
  1. A street name is unique in a locality
  1. A road number (like highway number) is unique in a locality
  1. A road number uniquely identifies a road
  1. A neighborhood/locality name is unique in a city

About **directions**:

  1. What constitutes a navigation instruction is universal
  1. A navigation instruction at a point is unambiguous
  1. Restrictions applied to navigation (like avoid highways, avoid tolls etc) are unambiguous
  1. Navigation directions are user-friendly (this one is an opinion, and not a fact)