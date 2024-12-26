--- 
title: Internationalization, In Spirit - Part 1 
publishDate: '2012-03-10' 
author: Kiran Rao 
tags: 
- global 
- software-design 
- i18n 
- l10n
slug: 2012/03/10/internationalization-in-spirit
---

You’re watching an amazing program on Discovery. It is about some mind-boggling natural wonder - say, the Grand Canyon, or the Amazon .. or something of the sort. You watch (and hear) in awe, as the narrator unfolds the statistics of the phenomenon. And then, in a bid to impress upon you how big the structure really is, he says “It is [insert-some-number] feet long, that’s [insert-some-other-number] New York city blocks put together”. 

And you go, “How in the world am I supposed to know how big a block is?”. You feel anger and disappointment rising up in equal amounts. You start trying to figure out that calculation. You miss the next five minutes of the program. Before you know it, you’ve lost track, and interest. 

----

Rewind to networking class in your college days. You are studying the token ring algorithm. Your book explains the workings of the algorithm in detail, but every so often makes a reference to “token system in public service office counters”. Basically the book assumes that you are already amply familiar with this token-something-something system, whatever it is. Forget the book, the algorithm itself makes this assumption. 

Bad assumption, you say. You come from a country where there is hardly a concept of a queue, let alone tokens. You have a hard time grasping the concept. Worse, you begin hating that algorithm! 

----

Okay. I admit that was exaggerated. But the fact remains. 

Internationalization has gone from being a best practice to becoming an absolute requirement in most software applications.**How widely a software is adopted is directly tied to how usable it is by people all over the planet**. 

These days it is pretty standard for any application development framework (language/platform/stack) to provide techniques for developers to easily internationalize their applications. Display messages, units, currencies are all externalized from the code itself. Heck, developers don’t even write the display messages - that task is outsourced to translators. 

But, is this sufficient? Would people the world over be happy if their web app displayed messages in their language, Rupees instead of Dollars, and kilometres in place of miles? I think not. In this series of posts, I will present my argument on why I think the software world is still a far cry from being truly global. 

Stay tuned for Part 2 of this series, which will talk about cultural sensitivity.