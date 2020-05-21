---
layout: post
title:  "Java: Value classes and the equals() method"
description: "Gotchas while overriding equal() method while using Java's value classes"
date: 2017-04-03 22:00
comments: true
tags: [effectivejava]
---

## TL;DR

> **Rule 1:** When overriding `equals()` method for a _value class_ in java, it is preferable to reject instances of sub-classes of this class. In other words, use `getClass()` instead of `instanceof` for ensuring that the other object is of the correct type.
  
  ```java
  if(!this.getClass().equals(other.getClass()) return false;
  ```
 
  instead of
  
  ```java
  if(!(other instanceof MyClass)) return false;
  ```
  
> **Rule 2:** Exception to Rule 1: If it is likely that the object that will be passed around is an instance of **_a proxy of your class_**, then use `instanceof`.

## Deep-dive

A lot has been written about `equals()` in Java. For me the definitive source has been from "Effective Java 2nd Edition". Item 8 says "Obey the general contract when overriding equals".

However, as a programmer I do not need to remember the recipe provided by Joshua Bloch (well, most of the time). This is because IDEs offer options to auto-generate the `equals()` (and a corresponding `hashCode()`) methods for me. Mechanisms for creating value classes (like [AutoValue](https://github.com/google/auto/tree/master/value) or Kotlin's [data classes](https://kotlinlang.org/docs/reference/data-classes.html)) go one step further by not even requiring you to maintain the equals() method in source code format. 

That said, there are some gotchas to be aware of that crop up from time to time. The point relevant to this post is (I might be para-phrasing it)

> It is not possible to extend an instantiable class and add a field without violating the contract of the equals method.

I encourage you to read Joshua Bloch's explanation of this along with the excellent examples to understand what the contract is and why extending a class might break this contract. Once you understand this concept, Rule 1 is a logical conclusion. If you are comparing an instance of this class with an instance of a sub-class, you want to return `false`.

However, this is not always feasible. There are cases where the value class is just a crutch for a framework to do its work. The value class that you define serves as the interface between you and the framework, while the framework generates sub-classes of your class to use as a proxy.

#### Example

That's a lot of hand-waving! Let's get to a concrete example, in this case the example which led me to write this blog post in the first place - [Realm](https://realm.io/docs/java/latest/). Realm is an object database for Android. You declare your models as POJOs and you can then use Realm to persist/query them.

Here's how you would define a User model in Realm:

```java
public class User extends RealmObject {
    public String name;
    public int age;
    
    // Rest of the class left out for brevity
}
```

Now, let's see what happens when we use the strict interpretation of the `equals()` method:

```java
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    if (!getClass().equals(o.getClass()) return false; //Strict type comparison
    User other = (User)other;
    if (age != other.age) return false;
    return name.equals(other.name); 
}
```

Now, assume you are writing a test to check whether a `User` instance retrieved from Realm is what you expect it to be.

```java
@Test
public void givenADatabase_whenRetrieveByName_thenReturnsCorrectUser() {
    Realm realm = getRealm();
    final User ACTUAL = getUser("Android");
    
    final User EXPECTED = new User("Android", 9);
    assertEquals(EXPECTED, ACTUAL); 
}
```

You will find that this test fails, even though the instance returned from Realm has the correct `name` and `age`. Why is this so?

#### Proxy classes

This is because the object that Realm returns is an instance of `UserRealmProxy` that extends your `User` class. Even though the fields that matter for this comparison are the same, the `if (!getClass().equals(o.getClass()) return false;` line leads our equals implementation to report that the instances are not equal.

The fix is of course to be more lenient in checking the types in equals(), with the trade-off that you potentially break the contract of `equals()`

```java
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null) return false;
    if (!(o instanceof User)) return false; //lenient type comparison
    User other = (User)other;
    if (age != other.age) return false;
    return name.equals(other.name); 
}
```

Realm is just one example of where a proxy class is used. There is a host of libraries/frameworks that proxy your value classes under the covers. Although the intent is for you as a user of the framework to be largely unaware of the use of these proxies, the peculiar case of `equals()` and sub-classes means that at times you need to be aware of these implementation details.

#### Aside: Order of Expected and Actual in tests

When I got started with unit testing, I often did not care about the order in which I passed the `expected` and `actual` in tests. I did not differentiate between `assertEquals(expected, actual)` and `assertEquals(actual, expected)`. The worst that could happen was that I would be slightly confused by the JUnit error message sometimes, but my tests that should pass would still pass, and those that should fail would still fail.

However, in the example above, you will notice that if you switch the positions of `expected` and `actual`, the result of the test will be different. 

```java
assertEquals(ACTUAL, EXPECTED); 
```

This test fails. This is because the `UserRealmProxy` class has extended `User` and overridden `equals()` in a way that breaks symmetry.

This is one of the reasons why the contract of `equals` says that it should be symmetric, i.e., `x.equals(y)` should return `true` **if and only if** `y.equals(x)` returns `true`.

## A survey of equals-generators

We will now survey existing tools that generate `equals()` for you and see how they handle type-checks.

#### Eclipse

At the time of this writing, Eclipse Neon, in the wizard to "Generate hashCode() and equals()" has a checkbox "Use 'instanceof' to compare types". If you check this checkbox that Eclipse generates a strict type comparison, else it generates the more lenient one.

#### IntelliJ IDEs

IntelliJ IDEA, Android Studio and other similar IDEs have a checkbox "Accept subclasses as parameters to equals() method". Checking this checkbox will generate the _lenient_ type comparison, while the default (un-checking it) will generate the strict type comparison

#### Kotlin data classes

```kotlin
data class UserKt(var name: String, var age: Int)
```

This generates bytecode equivalent to the following Java code

```java
public boolean equals(Object var1) {
  if(this != var1) {
     if(var1 instanceof UserKt) {
        UserKt var2 = (UserKt)var1;
        if(Intrinsics.areEqual(this.name, var2.name) && this.age == var2.age) {
           return true;
        }
     }

     return false;
  } else {
     return true;
  }
}
```

As you can see, it generates an `instanceof` check but this **does not violate the contract of equals()**. This is because in Kotlin (as of v1.1.0), data classes cannot be sub-classed.

#### Auto-Value

With this declaration using AutoValue

```java
@AutoValue
public abstract class UserAV {
    abstract String name();
    abstract int age();
    public static UserAV create(String name, int age) {
        return new AutoValue_UserAV(name, age);
    }
}
```

The generated code (snipped to show only relevant portions) is

```java
final class AutoValue_UserAV extends UserAV {

  private final String name;
  private final int age;
  
  // ...snip...

  @Override
  public boolean equals(Object o) {
    if (o == this) {
      return true;
    }
    if (o instanceof UserAV) {
      UserAV that = (UserAV) o;
      return (this.name.equals(that.name()))
           && (this.age == that.age());
    }
    return false;
  }
}
```

The two points to observe:

  1. The generated `equals()` uses the lenient `instanceof` for type comparison
  2. The generated class is declared `final`, hence it is guaranteed that there are no sub-classes which means the contract of `equals()` is not violated.

## Conclusion

In a majority of the cases, tools that generate `equals()` method are good enough. There is no reason to customize the code that they generate for you. However, there are cases where it is advantageous to be aware of what is going on under the hood.

For value classes, prefer to do a strict type comparison in the `equals()` method, unless it is likely that the value class might be proxied.
