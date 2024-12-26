--- 
title: 'Android: Passing an arbitrary object to a custom View'
publishDate: '2013-02-01' 
author: Kiran Rao 
tags: 
- custom-view 
- android
---

So, I came across a situation where I wanted to create a custom `View`
in Android (let's call it `MyAwesomeView`). I had to work with a couple
of constraints:

1.  I have to be able to pass in an additional object to
    `MyAwesomeView`.
2.  The `MyAwesomeView` should also be usable from XML.
3.  The `MyAwesomeView` should be distinct from the application itself -
    i.e., it should be possible to distribute the `MyAwesomeView` as a
    library.

To elaborate a bit on the "pass in an additional object" part: `View`
provides three standard constructors using which you can pass in

-   a `Context`,
-   an `AttributeSet` and
-   an `int` representing the style.

I want to also pass in a
[`BitmapCache`](https://github.com/chrisbanes/Android-BitmapCache)
object since `MyAwesomeView` uses lots of `Bitmap`s and I don't want to
encounter the dreaded `OutOfMemoryError` that goes hand in hand with
decoding large bitmaps in an Android app. `MyAwesomeView` decodes a
bitmap only if it is not already present in the cache.

The second constraint makes things really difficult. It is possible to
pass in additional "configuration" information to a `View` by [creating
custom
attributes](http://developer.android.com/training/custom-views/create-view.html#customattr).
However, this obviously cannot be used to pass in an object like a
`BitmapCache`.

### Augmenting the `Context` object with additional information

This solution I came across is as follows:

-   Define an interface `BitmapCacheProvider` with a single method
    `provideBitmapCache()`;
-   Make your `Activity` class implement the interface defined in
    step 1. Override the interface method to return an appropriate
    `BitmapCache` object.
-   In the constructor of `MyAwesomeView`, check to see if the context
    object passed in to implements the `BitmapCacheProvider` interface.
    If it does - we're good. If not, then fail fast (or disable
    cacheing - whatever works for you).

In code, here's what this would look like:
```java

/**
 * Interface to be implemented by the Context (Activity etc) in which `MyAwesomeView` runs
 */
public interface BitmapCacheProvider{
    BitmapCache provideBitmapCache();
}

/**
 * An example of an Activity that implements BitmapCacheProvider
 */

public class MyActivity extends Activity implements BitmapCacheProvider{
    //... Life-cycle methods of the Activity here

    @Override
    public BitmapCache provideBitmapCache(){
        //Get your instance of bitmapcache here - probably from your Application
        BitmapCache bitmapCache = ...;
        return bitmapCache;
    }
}

/**
 * Custom View that uses an additional object (BitmapCache) for its configuration.
 */
public class MyAwesomeView extends View{
    private BitmapCache mBitmapCache;

    public MyAwesomeView(Context context){
        init(context, null, 0);
    }

    public MyAwesomeView(Context context, AttributeSet attrs){
        init(context, attrs, 0);
    }

    public MyAwesomeView(Context context, AttributeSet attrs, int style){
        init(context, attrs, style);
    }

    private void init(Context context, AttributeSet attrs, int style){
        try{
            /*
                * Try casting the contex to BitmapCacheProvider. 
                * 
                * If the required interface is not implemented, 
                * it'll throw a ClassCastException
                */
            mBitmapCache = ((BitmapCacheProvider) context).provideBitmapCache();
        } catch(ClassCastException e){
                throw new ClassCastException(context.toString()
                    + " must implement BitmapCacheProvider");
        }

        //At this point, we have the BitmapCacheObject which we can use for further processing.
    }

}
```

### Conclusion:

What we saw in this post was how it is possible to create a custom
`View` in Android, that can take in an arbitrary object in its
constructor - and still be usable from XML. Admittedly, it is a bit
round-about, but it has its benefits. Here are a few other points worth
considering if you are following this approach:

-   In this example, I just augmented the main `Activity` with the
    desired `interface`, but you might need to do this for other
    classes. Basically, the `Context` that is passed in to the custom
    `View` constructor must be enhanced to implement the interface. What
    this context is depends on how you are including the custom `View`.
-   You might argue that the BitmapCache should be part of the custom
    `View` and not passed in to it by the application. This depends on
    the use case. If you have multiple custom Views that require Bitmap
    cacheing (as is the case with my app), it probably makes sense for
    the app to maintain the cache. We might not want too maintain too
    many caches lest the cache overhead cancels out any benefits we
    derive from having the cache in the first place!
