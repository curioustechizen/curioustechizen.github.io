--- 
title: 'Android: is onDestroy the new onStop?' 
publishDate: '2013-01-29' 
author: Kiran Rao 
tags: 
- orientation 
- life-cycle 
- programming 
- onStop 
- android 
- onDestroy
---

Conventional Android development logic dictates that if there is some
action you want to perform (or rather, stop performing) when your
`Activity` is no longer visible to the user, do it in `onStop()`.
Likewise, if there is some action you want to restart performing when
the user restarts interacting with your `Activity`, do it in
`onStart()`. The disadvantage of this approach, of course, is that it
wouldn't play well with device orientation changes.

This post explores a couple of solutions to this problem, and concludes
that there are cases where one has no choice but to postpone the actions
that would be ideally taken in `onStop()`, to `onDestroy()`.

### A trivial (incorrect) example

```java
public TrivialIncorrectActivity extends Activity{

    //onCreate() and other life-cycle overrides like onResume() go here ...

    @Override public void onStart(){
        super.onStart();
        startMakingThatPeriodicRestCall();
    }

    @Override public void onStop(){
        super.onStop();
        stopMakingThatPeriodicRestCall();
    }

    // ... Other life-cycle overrides like onDestroy() go here

}
```

This example is incorrect. Every time the user rotates the device, your
app would stop making a REST call and then again start making the call.
Not good at all.

### `setRetainInstance` to the rescue . . .

API 11 introduced the Fragment API, and along with it, the
[setRetainInstance](http://developer.android.com/reference/android/app/Fragment.html#setRetainInstance(boolean))
method, which is also usable with older versions of Android by means of
the [support
library](http://developer.android.com/tools/extras/support-library.html).
You can go through the documentation to understand the effect of a
`setRetainInstance(true)`. Essentially, when a configuration change is
happening, even though the hosting `Activity` is being re-created, the
`Fragment` instance is not destroyed.

So, this allows us to improve upon our previous example.

```java
public IncorrectRotationTolerantActivity extends FragmentActivity{

    private static final String TAG_RETAIN_FRAGMENT = "RetainFragment";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if(savedInstanceState == null){
            getSupportFragmentManager().beginTransaction()
                .add(IncorrectRetainFragment.newInstance(), TAG_RETAIN_FRAGMENT).commit();
        }
    }
}

public class IncorrectRetainFragment extends Fragment{

    public IncorrectRetainFragment(){}

    public static IncorrectRetainFragment newInstance(){
        IncorrectRetainFragment frag = new IncorrectRetainFragment();
        frag.setRetainInstance(true);
        return frag;
    }

    @Override
    public void onStart() {
        super.onStart();
        startMakingThatPeriodicRestCall();
    }

    @Override
    public void onStop() {
        super.onStop();
        stopMakingThatPeriodicRestCall();
    }
}
```

This code snippet still doesn't do what we want it to do. It does
**not** prevent re-making that REST call during orientation changes.
Why?

Because, `setRetainInstance` doesn't prevent a Fragment's `onStop()`
from being called - it just prevents `onDestroy()` from being called.
So, even if you ask for a Fragment instance to be retained across
configuration changes, the `onStop()` method of the Fragment is always
still called when the device is rotated.

### `onDestroy()` is the new `onStop()`

To fix the problem, postpone stopping the REST call to the `onDestroy()`
of the Fragment. Similarly, start making the call in `onCreate()`
instead of in `onStart()`, since `onCreate()` is not called when the
device is rotated, but `onStart()` is.

```java
public RotationTolerantActivity extends FragmentActivity{

    private static final String TAG_RETAIN_FRAGMENT = "RetainFragment";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if(savedInstanceState == null){
            getSupportFragmentManager().beginTransaction()
                .add(RetainFragment.newInstance(), TAG_RETAIN_FRAGMENT).commit();
        }
    }
}

public class RetainFragment extends Fragment{

    public RetainFragment(){}

    public static RetainFragment newInstance(){
        RetainFragment frag = new RetainFragment();
        frag.setRetainInstance(true);
        return frag;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onStart(savedInstanceState);
        startMakingThatPeriodicRestCall();
    }

    @Override
    public void onDestroy() {
        super.onStop();
        stopMakingThatPeriodicRestCall();
    }
}
```

This seems so semantically wrong though. `onDestroy()` represents the
end of the *entire lifetime* of an Activity/Fragment and what we really
wanted to do was monitor the *visible lifetime*. Also, there is no
guarantee that `onDestroy()` will ever be called. If you really try out
this example on a phone or emulator, chances are that you'll never see
the Rest call being stopped - at least not right away.

### A more correct, more restrictive solution:

There exists another solution to this problem - but it works only on API
11 and later, because it uses methods introduced in API 11 -
`isChangingConfigurations()` and `getChangingConfigurations()`.

```java
public RotationTolerantActivity extends FragmentActivity{

    private boolean mRotated;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Boolean nonConfigState =
            (Boolean)getLastCustomNonConfigurationInstance();
        if (nonConfigState == null) {
            mRotated = false;
        } else {
            mRotated = nonConfigState.booleanValue();
        }
    }

    @Override 
    public void onStart(){
        super.onStart();
        if(!mRotated){
            startMakingThatPeriodicRestCall();
        }
    }

    @Override
    public void onStop(){
        super.onStop();
        mRotated = false;
        if (isChangingConfigurations()) {
            int changingConfig = getChangingConfigurations();
            if ((changingConfig & ActivityInfo.CONFIG_ORIENTATION) == ActivityInfo.CONFIG_ORIENTATION) {
                mRotated = true;
            }
        }

        if(!mRotated){
                stopMakingThatPeriodicRestCall();
        }
    }

    @Override
    public Object onRetainCustomNonConfigurationInstance() {
        return mRotated ? Boolean.TRUE : Boolean.FALSE;
    }

}
```

This solution is semantically correct, and works as expected. However,
**it only works on API 11 and higher, *even though we extend
`FragmentActivity` from the support library*** .

### Bonus: Why `onStop()` and not `onPause()`?

The keen reader would have observed that this post talks about stopping
un-needed tasks in `onStop()`and not `onPause()` - even though
`onPause()` is the only one of these methods that is guaranteed to be
called. Remember that after `onPause()` is called, the process could be
killed in order to reclaim memory and thus `onStop()` and `onDestroy()`
might never be called.

Yet, this entire post insists on using `onStop()` to stop un-needed
tasks. The reason for this lies in the technique used in my library
[android-app-pause](https://github.com/curioustechizen/android-app-pause).
Unfortunately, this library in its current form does not handle device
orientation changes correctly. This will be fixed in a future release
though.
