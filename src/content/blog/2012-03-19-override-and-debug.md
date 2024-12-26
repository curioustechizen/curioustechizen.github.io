--- 
title: Override and Debug 
publishDate: '2012-03-19' 
author: Kiran Rao 
tags: 
- debug 
- technique 
- override
slug: 2012/03/19/override-and-debug
---

What would we ever do without a debugger eh? In the Java world, it’s
JPDA. Integrated with your favourite IDE, it makes debugging your source
code a breeze. Just set a breakpoint someplace in your code, and then
step through.  
  
But wait. What happens when you step into code that’s outside your
project? What if you step into a method that’s from a library, or from
the core platform itself? You end up seeing something illegible: some
bytecode, or just a “Source not found” message (if you are using Eclipse
that is). Go ahead: try it out:  

-   Write a bare minimum `“Hello World!”` application.
-   Put a breakpoint at the line where you print the message to
    `System.out`.
-   Now debug your application and step into the `System.out.println`
    method.

What do you see?  

### Solutions?

The best solution, of course, is to attach the source code, if
available. Unfortunately, most of the time the source code is not
available, and even if it is, “attaching” it is not the easiest thing to
do. If you have worked with Android, you know what I mean.  
  
What’s the second-best solution? Use the ***override-debug technique***.
Although this technique does have its limitations (as we will discuss
later in this article), it does turn out to be useful in a large number
of use-cases. The technique is as follows:  

-   Choose the library method that you wish to debug. Note that you
    might not care about the method that you call directly from your
    code. Instead, you might be interested in a method, say, four levels
    deep in the call stack.
-   Extend the class which contains this method, and override it.
-   Simply call the `super` method in the overriden implementation.
-   Finally, while debugging, put a breakpoint in the brand new
    one-liner method that you just implemented.

  
Congrats! You’ve just managed to see what’s happening four levels deep
in the call hierarchy; without even having the source code.  

### Show me some Code!:

Much of that did not make sense, did it? Probably because it was all
text and no code? Fear not, for the code example is here!  
  
I use an (admittedly contrived) example to demonstrate this technique. I
have a `Laundry` class and a `doLaundry()` method within it which takes
a bunch of clothes as arguments. This method  

-   First invokes the `WashingMachine` object to wash and rinse the
    clothes.
-   Then it calls upon a `Dryer` to spin them.
-   Finally, it hangs out the clothes to dry on a `Clothesline`.

All of this is within a library for which you don't have the source.The
objective is to debug what is happening when the control reaches the
`Clothesline.hang()` method.  
  
```java
public class LaundryRunner {
    private static Laundry laundry = new Laundry();

        public static void main(String[] args) {

        /*
            * Initialize the clothes for laundry
            */
        List clothes = new ArrayList(3);
        clothes.add(new ClothingItem("shirt", "white", "stained"));
        clothes.add(new ClothingItem("jeans", "blue", "dirty"));
        clothes.add(new ClothingItem("t-shirt", "red", "dirty"));

        /*
            * Objective: To try to debug whats going on inside.
            * For example, what happens by the time the clothes reach the clothesline?
            */
        laundry.doLaundry(clothes);
    }
}
```
  
You could put a breakpoint at the `doLaundry()` invocation, but since
you don't have the source attached, you draw a blank.  
  
The solution is to extend the `Clothesline` class as follows:  
  
```java
public class CustomClothesline extends Clothesline {

    @Override
    public void hang(List clothes) {
        System.out.println("Debugging in Custom Clothesline");
        System.out.println("Status of clothes given to me:");
        for(ClothingItem item: clothes){
            System.out.println(item.getStatus());
        }
        super.hang(clothes);
    }
}
```
  
And then, instruct the `Laundry` class to use your custom `Clothesline`
instead of the default one.  
  
```java
    laundry.setLine(new CustomClothesline());
    laundry.doLaundry(clothes);
```
  
This entire project and source code is available here. I have included
the dependent project as a JAR library, but it is also available as a
separate project in case you want to look at it.  
  
Ok that was just an example code. To see the override-debug technique in
the real world, see [this
project](http://code.google.com/p/android-drawable--invalidation-on-orientation-issue/)
on Google Project Hosting (pay special attention to
`CustomDrawable.java` ). Here, I would ordinarily have used a
`BitmapDrawable` object, but I wanted to know what happens when the
`onBoundsChanged()` method is called. I achieved this by extending
`BitmapDrawable` and overriding the method I was interested in.  

### Limitations:

The override debug technique has the following constraints:  

-   The class that you want to debug must be extensible. This means it
    must be declared `public` and not `final`.
-   The method which you want to override must be, well, overridable.
    This means it must have a visibility of at least `protected`, and of
    course it should not be declared `final`.

### An aside:

You’re probably thinking that the above two limitations render this
technique more or less useless. After all, as a best practice,
developers of libraries and frameworks are unlikely to allow overriding
of their classes and methods unless they are explicitly designed to do
so (for example life-cycle methods).  
  
It turns out in practice this is not much of a constraint. Frameworks
like Android allow you to extend and override almost anything. The
following is a stackoverflow discussion on this topic.  
