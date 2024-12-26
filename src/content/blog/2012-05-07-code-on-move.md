--- 
title: Code. On the Move 
publishDate: '2012-05-07' 
author: Kiran Rao
tags: 
- IDE 
- AIDE 
- android
slug: 2012/05/07/code-on-move
---

### ... a.k.a "How I was made to eat the humble pie".

Two years back, when tablet computers were re-born, I was super-excited.
I thought that finally the PC can be dispensed with. However this joy
was short-lived as I soon realized that tablets were primarily
data-*consumption* devices; and data *creation* is pretty difficult on
them.  
  
That, and the fact that there was nothing in there for a developer. I
mean, how can you cram Eclipse on to that small screen, right?  
  
That is why when I saw [this question on
StackOverflow](http://stackoverflow.com/questions/3586174/is-it-possible-to-develop-for-android-on-android),
I laughed and laughed. I showed it to a friend, and we both laughed. The
title of the question was:  
  
> Is it possible to develop for Android on Android?  

Yeah, right. Hahahaha. We scoffed and ridiculed right until we saw one
of the answers, which pointed us to
[AIDE](https://play.google.com/store/apps/details?id=com.aide.ui&hl=en).
And then, we stopped laughing.   

AIDE is an actual complete IDE which you can use to develop Android apps
***on an Android device***. Make sure you read that again. Now, when I
first saw it, I was mighty skeptical. I mean, C'mon now! No kidding.  
  
I decided to do a critical analysis of this little app claiming to be an
IDE, and found every one of my questions being answered by the features
list. The conversation went like this:  
  

> What use is an IDE that doesn't provide syntax highlighting, eh?  
 
But AIDE does have syntax highlighting. In Java, in XML, and everywhere
you would expect.  
   
> But surely, it doesn't provide completion suggestions. Aha!

Sure does. You can configure the number of characters to type before
code completion kicks in.  

> But then I'm sure its impossible to ***compile*** the Java code!
> (Triumphant expression)  
 

Not at all. AIDE comes with a Java compiler.  
   
> How about pointing out errors as you type?   

Yup. AIDE has that; plus suggestion for correction.  

> Ok. You can compile Java, but how will you compile the resource files;
> and how will you generate the APK? (Nail-in-the-coffin)    

Simple. AIDE uses the open source implementations of dx and other tools
from AOSP. And yes, AIDE generates a complete, signed APK.  

> (By this time, I'm feeling the cockiness drain out) Ok, that's cool;
> but this is still a useless app. Think about it - how many people are
> really going to code an entire app on an Android phone?   

That's where GitHub and DropBox integration come in. AIDE will probably
be used more as an edit-on-the-go rather than
code-from-scratch-on-the-go environment. So, write your code on your
traditional PC. Upload it to GitHub or Dropbox - and you're good to
go.  
  
> But, aren't these project structures incompatible?  

Nope. AIDE projects are fully compatible with Eclipse projects.  
  
> Size?  

10 MB at last count.  
  
By this time, I had installed the app on a Samsung Galaxy S Captivate
and given it a good spin. The verdict was unanimous: AIDE is a brilliant
app. I was forced to eat the humble pie (and I was glad to do it!).  

Hats off to AIDE.They have come out with an app that I never imagined
would be possible. Hail Innovation!  
