---
title:  "Delegates - Composition over Inheritance in Kotlin"
description: "Using Kotlin's interface delegation feature to replace inheritance with composition"
publishDate:   2017-03-05
comments: true
tags: [kotlin]
slug: 2017/03/05/kotlin-coi
---

Joshua Bloch's Effective Java Item 16 says "Favor composition over Inheritance". The reasons for doing so are well-described in the book, so we will concentrate on the implementation aspects and how Kotlin helps. 

The idea behind composition is that if `class A` needs behavior defined in `class B`, then instead of inheriting from `class B`, it could have a member variable of `class B`. Then any behavior that `class A` would have achieved by calling a method on `super`, it achieves the same by calling that method on the member variable of type `class B` instead. 

An example of this is seen in the book: The `InstrumentedSet` - first a broken implementation that uses [Inheritance](https://github.com/marhan/effective-java-examples/blob/master/src/main/java/org/effectivejava/examples/chapter04/item16/InstrumentedHashSet.java), and then corrects it [using](https://github.com/marhan/effective-java-examples/blob/master/src/main/java/org/effectivejava/examples/chapter04/item16/ForwardingSet.java) [Composition](https://github.com/marhan/effective-java-examples/blob/master/src/main/java/org/effectivejava/examples/chapter04/item16/InstrumentedSet.java). When you use the composition pattern, the **wrapper** class simply forwards all method calls to an instance of the **wrapped** class.

```java
public class ForwardingSet<E> implements Set<E> {
	
	/*
	 * ForwardingSet is the wrapper class and it wraps the Set.
	 *
	 * In this example ForwardingSet also implements Set interface but that is just 
	 * in order to adhere to the interface and not for inheritance. Set, being an interface, there is
	 * no implementations in {@code super}!
	 */
	private final Set<E> s; 

	public ForwardingSet(Set<E> s) {
		this.s = s;
	}

	public void clear() {
		s.clear();
	}

	public boolean contains(Object o) {
		return s.contains(o);
	}

	public boolean isEmpty() {
		return s.isEmpty();
	}

	public int size() {
		return s.size();
	}

	public Iterator<E> iterator() {
		return s.iterator();
	}

	public boolean add(E e) {
		return s.add(e);
	}

	public boolean remove(Object o) {
		return s.remove(o);
	}

	public boolean containsAll(Collection<?> c) {
		return s.containsAll(c);
	}

	public boolean addAll(Collection<? extends E> c) {
		return s.addAll(c);
	}

	public boolean removeAll(Collection<?> c) {
		return s.removeAll(c);
	}

	public boolean retainAll(Collection<?> c) {
		return s.retainAll(c);
	}

	public Object[] toArray() {
		return s.toArray();
	}

	public <T> T[] toArray(T[] a) {
		return s.toArray(a);
	}

	@Override
	public boolean equals(Object o) {
		return s.equals(o);
	}

	@Override
	public int hashCode() {
		return s.hashCode();
	}

	@Override
	public String toString() {
		return s.toString();
	}
}
```

As you can see, the downside of using the composition pattern is the verbosity. This is boilerplace, tedious, robotic code that should be automated.

And, well, it can be automated. IDE's do this automation for you. IntelliJ, for example, has "Replace Inheritance with Delegation" as an option in the "Refactor" menu. However, the generated code is still code that needs to be maintained. When you change methods/add new methods, you now have two (or more) places where you need to make the change. Also over time you are no longer sure what parts of this class were generated and what parts were hand-writtern.

## Delegation in Kotlin

Enter Kotlin's delegates. Here is the same example using Kotlin delegates.

```kotlin
 open class ForwardingMutableSet<E>(s: MutableSet<E>): MutableSet<E> by s
```

It really is as simple as that. The `by s` clause basically tells Kotlin to maintain an object of `MutableSet` and forward any applicable calls to that instance instead. And remember all this is done at compile time.

The complete example, including a simple unit test is hosted [here](http://try.kotlinlang.org/#/UserProjects/r6h47rducuggpve5g1l4d2d8nd/on2i6nnt4armofoep69ch5qknk). You can play around with it thanks to the awesome try.kotlinlang.org.

## Limitations

This is a limitation with the pattern, rather than with Kotlin's implementation of the pattern - you can only use delegation if you control the instantiation of the object of the wrapped class. You cannot, for example compose Android's Activity classes because the framework instantiates an Activity for you. Of course, you should probably be composing Presenters/ViewModels/Whatever rather than Activities/Fragments but that is a topic for another blog post!
