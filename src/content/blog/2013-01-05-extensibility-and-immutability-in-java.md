--- 
title: Extensibility and Immutability in Java 
publishDate: '2013-01-05' 
author: Kiran Rao 
tags: 
- java 
- thread-safety 
- immutability 
- programming 
- extensibility
slug: 2013/01/05/extensibility-and-immutability-in-java
---

### Objective:

> **To devise a way to make thread-safe, a Java class designed to be
> extensible.**

### Introduction:

*Effective Java, Second Edition: Item 15* says **"Minimize
Mutability"**. One should always try to make a class immutable. This has
several advantages that I will not go over here (Since *Effective Java*
explains it all). I will however point out one of those advantages since
it is central to this discussion:

> **Making a class immutable is the easiest way to ensure that the class
> is thread-safe.**

There is however a problem: to make a class *truly immutable*, you must
prevent it from being sub-classed. Either the class must be declared
`final`, or it should have a `private` constructor and provide `static`
factory methods instead of constructors. The reasons for this are
outlined in *Effective Java*. The basic premise is that a sub-class can
violate the immutability guarantees.

This must-not-be-subclassed restriction may be fine if you are applying
immutability to some *value object* like `User`, `Point`, `Account` etc.
However, the same requirement turns out to be overly restrictive if you
are applying the concept to *logic classes*. This is because logic
classes are often meant to be customized by extension.

### A strongly-immutable logic class:

As an example of a logic class, consider the following ReportGenerator:

```java
public final class ReportGenerator{
    private final DatabaseLayer mDatabaseLayer;
    private final PresentationLayer mPresentationLayer;

    public ReportGenerator(DatabaseLayer db, PresentationLayer pres){
        this.mDatabaseLayer = db;
        this.mPresentationLayer = pres;
    }

    public void generateMonthlyReport(User user){
        Report report = mDatabaseLayer.getReport(user);
        mPresentationLayer.present(report);
    }
}
```

The other classes have been ommitted for brevity. Assume that
`DatabaseLayer` and `PresentationLayer` classes are themselves
immutable. This makes `ReportGenerator` **strongly immutable** and
hence, thread-safe.

Now, suppose in the next phase of the project, you need to add a way to
generate a historical report. The easiest way that comes to mind is to
inherit from `ReportGenerator`. Unfortunately, we cannot do this since
in order to make `ReportGenerator` immutable, we have declared it
`final`. One possible approach to solving this issue is making
`ReportGenerator` **weakly immutable**. This is discussed in the next
section.

### A weakly-immutable logic class:

One can relax the restriction that an immutable class must not be
extensible, while still maintaining the guarantees, **provided the
sub-class adheres to the established contract**. This is done by
removing the `final` modifier from the class declaration, and making all
fields `protected final`, or keep them `private final` and provide
getters which we then use in the sub-classes. Both these approaches are
shown in the code below.

```java
public class ReportGenerator{
    protected final DatabaseLayer mDatabaseLayer; //protected field approach
    private final PresentationLayer mPresentationLayer; //private field with accessor approach

    public ReportGenerator(DatabaseLayer db, PresentationLayer pres){
        this.mDatabaseLayer = db;
        this.mPresentationLayer = pres;
    }

    public PresentationLayer getPresentationLayer(){
        return this.mPresentationLayer;
    }

    public void generateMonthlyReport(User user){
        Report report = mDatabaseLayer.getReport(user);
        mPresentationLayer.present(report);
    }
}
```

We can now sub-class this as follows:

```java
public class HistoricalReportGenerator extends ReportGenerator{

    public HistoricalReportGenerator(DatabaseLayer db, PresentationLayer pres){
        super(db, pres);
    }

    public void generateHistoricalReport(User user, Duration duration){
        Report historicalReport = mDatabaseLayer.getReport(user, duration);
        getPresentationLayer().present(historicalReport);
    }
}
```

We could also have added more `protected final` fields to the sub-class
if needed.

What we now have is a weakly immutable class. **This class is immutable
as long as sub-classes adhere to the contract**. It is a good idea to
establish in the class javadoc, the expectation that sub-classes
**MUST** preserve the same weak immutability restrictions that this
class adheres to. If a sub-class willfully violates the contract, then
the logic class cannot be depended upon to work correctly.

Here's an example to how to establish this contract:
```java
/**
 * The logic class that generates the report.
 * ... ...
 * <br/><br/>
 * This class is <em>weakly immutable</em>. It has been kept open for 
 * extensibility. Sub-classes <strong>MUST</strong> preserve the immutability 
 * guarantees of this class. In particular, they must have only immutable 
 * fields; and must not override any of the methods defined in this class to
 * return a mutable reference.
 *
 */

public class ReportGenerator{
    //Class body omitted.
}
```
Since immutability is enforced by documentation rather than by the
compiler, this is an acceptable compromise. It allows us to easily
create thread-safe classes that are also extensible. This makes writing
API's and frameworks that much easier.

### Thread-safety is more than Immutability:

Of course, making a class immutable is not the only way to make a class
thread-safe. A mutable class can be written such that it is thread-safe
too. It is often desirable for an object to change its state during the
execution of a program. How that is done is beyond the scope of this
article. I suggest looking at *Java Concurrency In Practice* for details
on this topic.

### Extending the logic class by Composition:

There exists an alternative way to extend the functionality of
`ReportGenerator` that does not involve inheriting from it: **"Favor
Composition over Inheritance"** (*Effective Java, Second Edition, Item
16*). For completeness, I present the code for this approach here. Do
note that this example uses the strongly immutable form of
`ReportGenerator`.

```java
public final class ReportGenerator{
    private final DatabaseLayer mDatabaseLayer;
    private final PresentationLayer mPresentationLayer;

    public ReportGenerator(DatabaseLayer db, PresentationLayer pres){
        this.mDatabaseLayer = db;
        this.mPresentationLayer = pres;
    }

    public PresentationLayer getPresentationLayer(){
        return this.mPresentationLayer;
    }

    public DatabaseLayer getDatabaseLayer(){
        return this.mDatabaseLayer;
    }

    public void generateMonthlyReport(User user){
        Report report = mDatabaseLayer.getReport(user);
        mPresentationLayer.present(report);
    }
}

public final class HistoricalReportGenerator{
    private final ReportGenerator mReportGenerator;

    public HistoricalReportGenerator(ReportGenerator reportgen){
        this.mReportGenerator = reportgen;
    }

    public ReportGenerator getReportGenerator(){
        return this.mReportGenerator;
    }

    public void generateHistoricalReport(User user, Duration duration){
        Report historicalReport = mReportGenerator.getDatabaseLayer().getReport(user, duration);
        mReportGenerator.getPresentationLayer().present(report);
    }
}
```

This approach works fine when the class hierarchy is only a couple of
levels deep. If it gets deeper than that, then getting a handle to the
members of the base class becomes unwieldy. For example, suppose we have
the following:

```java
    public class AnnualReportGenerator extends HistoricalReportGenerator
    public class LeapYearReportGenerator extends AnnualReportGenerator
```

Now imagine a method in `LeapYearReportGenerator` needs access to the
`DatabaseLayer` object. The code for this would look lik:

```java
    mAnnualReportGenerator().getHistoricalReportGenerator().getReportGenerator().getDatabaseLayer();
```

This is clearly something you want to avoid. With the composition
approach, you also lose the runtime polymorphism advantage.

### Conclusion

To summarize what this article discussed:

> -   The easiest way to make a class thread-safe is to make it
>     immutable.
> -   Strong immutability closes the door on extensibility.
> -   It is often convenient to make a class weakly immutable. This
>     allows it to be sub-classed.
> -   If you make an immutable class extensible, clearly establish in
>     the javadoc, the contract that sub-classes must preserve the
>     immutability guarantees.

Other than these observations, we also saw that:

> -   Immutability is not the only way to achieve thread-safety, and in
>     fact immutability is not always desirable.
> -   Instead of inheriting from a weakly immutable class, one can also
>     extend the functionality by composing a class with a strongly
>     immutable object as its member. This has its own pros and cons -
>     and both approaches must be evaluated before deciding on one.
