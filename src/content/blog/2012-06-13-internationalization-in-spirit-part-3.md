--- 
title: 'Internationalization in Spirit: Part 3 - Developers'
publishDate: '2012-06-13' 
author: Kiran Rao 
tags: 
- global 
- software-design 
- i18n 
- l10n
slug: 2012/06/13/internationalization-in-spirit-part-3
---

This is the third post in a series about the idea behind making software
truly global; and why we are not quite there yet. You can read [Part 1](http://curioustechizen.blogspot.com/2012/03/internationalization-in-spirit.html)
and [Part 2](http://curioustechizen.blogspot.com/2012/03/internationalization-in-spirit-part-2.html)
to get some context.

It goes without saying that the core of the software world is the
development community. The success of any software platform (that could
mean programming language/ API/ development stack/ tool/ … ) depends on
how well developers take to it. Every platform out there has gone all
out trying to woo not only users, but also developers. There’s
documentation, end-to-end samples, fancy tooling, developer fora,
mailing-lists, HowTo screencasts, support groups and what not. These
days we even have video conferencing wherein the core developers of the
platforms interact directly with the community.

The question, then is, is this sufficient to make the platform easier to
consume for developers all over the world? From my experience, I would
say that there is still lot of scope in this area.

To begin with, there seems to be an unwritten assumption that command
over the English language is necessary in order to be a good programmer.
This is reflected in

-   the complicated language in use in developer documentation
-   the “heavy” words used to name program elements (classes, functions,
    variables .. )
-   names of frameworks/API’s or the concepts (like design patterns) on
    which they are based. These are often cool or catchy, but again,
    they make sense to only a subset of the developers that use them.

I argue that this assumption is faulty. It is worth remembering that
software development (particularly the services industry) is now big in
BRICS countries and also picking up in countries like Argentina,
Vietnam, Philippines. Most programmers might have basic English
knowledge, but I seriously doubt their having a command over the
language.  

### Developer Documentation:

I believe that currently, there is this thing about making documentation
grammatically (and I don't know .. legally, politically, ...?) correct.
This comes at the cost of clarity. While a developer who is sufficiently
well-versed in English might easily understand the essence of the
documentation, it is often confusing for developers who are not so
well-versed in English.

Consider the following method doc:

> `String bestMatch(String text)`
>
> Scans the database of known keywords until a match on the supplied
> text occurs, unless said database is empty, in which case falls back
> to performing keyword search on description and content fields; in
> either case returning a best match if found, `null` otherwise.

Yes that was correct. But how easy was it to comprehend? Now, consider
the same method doc re-written as follows:

> `String bestMatch(String text)`
>
> 1.  Scans database of known keywords , attempting to match the
>     supplied text with the keyword.
>
> 2.  If the database is empty, attempts a match on content and
>     description fields.
>
> In both cases, this method returns the best match String if found,
> `null` otherwise.  

My point is, developer documentation should strive to be simple in
language. It is always possible to re-word complex sentences by breaking
them up into bullet points and the like.

Documentation should avoid using subtle grammar or obscure language
constructs where possible. Needless "smart" wordplay is a strict no-no.
Documentation is not a place to show off one's language skills, there
are other forums well-suited for that!

### Samples:

Back in college, we mostly used `Animal`, `Cat` and `Dog` to describe
inheritance; and `Student` or `Account` as examples to illustrate data
storage concepts. Somewhere down the line, example code went through a
transition. Now, sample code looks like this:

```java
    Band ledzep = new Band();
    ledzep.type = BandType.ROCK;
    //...

    performances.add(ledZep);
```

Or, as one of my favorite books used to describe singleton pattern using
`enum`s in Java: `Elvis.INSTANCE.leaveTheBuilding();`

Now that was cool ... for someone who has heard of Elvis. But, this may
sound impossible, but there are developers who have never heard of
Elvis. They will miss the point, for sure.

What I'm trying to say here is: Sample code should try to put across the
point without being gimmicky. The gimmicks might be picked up by some,
but will definitely be lost on some others.  

### Program Elements:

So, you are designing an API. You try to follow all the best practices.
You start thinking of a name for that particular class. You want the
class name to be as descriptive as possible. Then you end up with this:

```java
public abstract class ImmutableMediationDelegatingStrategyPrefabricator
```

or a method like this:

```java
public void incrementalAddThenComputeAverageAndPersist()
```

A potential developer takes one look at your API, and is likely to never
return to your site again.

Okay, those were extreme examples. But not all that distant from the
truth. The gist here is that the name of your API should help the
developer understand its concise objective. If the developer has to
reach for the dictionary to understand what the hell the class name
means, you've got it wrong.

### Libraries:

Ditto with the name of the library itself, where we see the other
extreme. Its good to be creative and think of cool names; but there are
plenty of examples of devs who overdid it, and ended up with names that
make sense only to a small percentage of the target audience. This holds
even if the catchy name is somehow related to the functionality the
library provides (which is in itself a rarity).

Would you make an effort to understand my library if I named it
`kumbh-ka-mela`? Or `Kodachadri`?

### The Bottom Line:

It is simple really. As a developer, every aspect of your product is
carefully designed keeping the end user in mind. The same consideration
should be extended to other developers who will be using your
development tool. Right from program concepts to developer
documentation, one must strive to make the artifacts as inclusive as
possible.

After all, more the developers use my development tool, the more I
benefit. Right?  
