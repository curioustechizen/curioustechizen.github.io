--- 
title: 'Android Constants: Preference Keys, Actions, Extras and more' 
publishDate: '2013-02-18' 
author: Kiran Rao 
tags: 
- technique 
- programming 
- constants 
- android
---

The content of this post may seem ... well .. trivial at first, but I
have tripped over these so many times that I decided to write it up - at
least to keep me reminded of it, if not for any other reason!

If you have written anything more than a HelloWorld app in Android,
chances are you have had to work with a plethora of program elements
that are represented as `String`s. Consider this sampling:

-   Keys for `SharedPreferences` are `String`s
-   Keys for `Bundle`s are `String`s
-   `Intent` extras are `Bundle`s, and hence, if you want to include any
    extras or retrieve them from `Intent`s, you use their `String` keys
    to work with them. Ditto with `Fragment` arguments
-   `Intent` and `IntentFilter` actions (and categories) are `String`s
    themselves
-   . . .

I used to deal with these the lazy way: Declare the keys as
`public static` where they are first used (or where they "belong"
logically) and refer to them from wherever they are needed in the code.
Examples of the class that is the logical owner might be:

-   The class that broadcasts an `Intent`
-   The class that creates or sends a non-broadcast `Intent` (this might
    be an `Activity` or `Service` for example)
-   The class that creates a `SharedPreference` for editing

However, I quickly found out that often it is not possible to cleanly
define these keys as belonging to a particular class. Further, since you
might end up with a handful of extras, qualifying the class name becomes
tedious - more so since it is likely that Activities or Services can
have quite long names. How readable is this snippet?

```java
if(AbstractBaseLiveModeActivity.ACTION_LIVE_UPDATE.equals(intent.getAction())){
    Bundle extras = intent.getExtras();
    if(extras.containsKey(AbstractBaseLiveModeActivity.EXTRA_LIVE_UPDATE_TIMESTAMP)){
        long timestamp = extras.getLong(AbstractBaseLiveModeActivity.EXTRA_LIVE_UPDATE_TIMESTAMP);
        // Do something with timestamp here
    }
}
```

### Constants Almighty

One common solution to this problem is to put everything into one "God"
object called `Constants` or whatever, and prefix the constant names
with `EXTRA_`, `ACTION_` or other such descriptive characters to keep
them distinct.

```java
public class Constants{
    private Constants(){}

    public static final String ACTION_LIVE_UPDATE = "com.myawesomeapp.action.LIVE_UPDATE";
    // ...

    public static final String EXTRA_LIVE_UPDATE_TIMESTAMP = "com.myawesomeapp.extra.LIVE_UPDATE_TIMESTAMP";
    // ...

}
```

Now, we've solved the readability problem since we just qualify the
constant names with `Constant.` So, all's well, right?

<span id="disadvantages"></span>**Wrong!**

The problem with this approach is as the number of extras, actions and
preference keys increases, the `Constants` class quickly becomes
unmanageable. Also, having to use the `ACTION_` and `EXTRA_` prefixes
hinders usability with some IDE's. For example, with Eclipse, even if
you know that you want `EXTRA_LIVE_UPDATE_TIMESTAMP`, you are forced to
type the first six characters without which the code assist will not be
able to filter only the extras.

Try using Eclipse to find a particular action or extra from the `Intent`
class if you want to see a real-world example of what I mean.  

<span id="split-constant-files"></span>

### Split it up into distinct constant files

Here's what I do to keep my code free of such stutter. I simply split up
the "God" `Constants` class into several smaller, easier-to-manage
constants classes. Like so:

```java
public class Extras{
    private Extras(){}

    private static String createExtra(String suffix){
        return Constants.NAMESPACE_PREFIX + ".extra."+suffix; //NAMESPACE_PREFIX could be "com.myawesomeapp"
    }

    public static final String LIVE_UPDATE_TIMESTAMP = createExtra("LIVE_UPDATE_TIMESTAMP");
    public static final String LIVE_UPDATE_VALUE = createExtra("LIVE_UPDATE_VALUE");
    public static final String FRIEND_ID = createExtra("FRIEND_ID");
    // ...

}

public class Broadcasts{
    private Broadcasts(){}

    private static String createBroadcast(String suffix){
        return Constants.NAMESPACE_PREFIX + ".broadcast."+suffix; //NAMESPACE_PREFIX could be "com.myawesomeapp"
    }

    public static final String LIVE_UPDATE = createBroadcast("LIVE_UPDATE");
    public static final String FRIEND_OFFLINE = createBroadcast("FRIEND_OFFLINE");
    // ...
}

public class Actions{
    private Actions(){}

    private static String createAction(String suffix){
        return Constants.NAMESPACE_PREFIX + ".action."+suffix; //NAMESPACE_PREFIX could be "com.myawesomeapp"
    }

    public static final String JOIN_CHAT = createAction("JOIN_CHAT");
    // ...
}
```

You could create classes for Categories, Preference Keys and so on. Note
that I differentiate between Broadcasts and Actions because although
they are both Intents, they are logically very different. Now, [this
code snippet](#basic-example) changes to:

```java
if(Broadcasts.LIVE_UPDATE.equals(intent.getAction())){
    Bundle extras = intent.getExtras();
    if(extras.containsKey(Extras.LIVE_UPDATE_TIMESTAMP)){
        long timestamp = extras.getLong(Extras.LIVE_UPDATE_TIMESTAMP);
        // Do something with timestamp here
    }
}
```

Which code snippet would your rather see, especially six months from now
when you have to fix a bug? Also note that we've made it far more easy
to find the exact action or extra that we want using our IDEs.  

### Wait, what about constants in XMLs?

Glad you asked. In android, many of these constants are used not only in
Java code, but also from XML files.

-   Preference keys can be referenced in [preferences
    XML](http://developer.android.com/guide/topics/ui/settings.html#DefiningPrefs)
    files via the `<PreferenceScreen>` element.
-   Intents can be declared in `AndroidManifest.xml`. This means, the
    `Intent` action and categories can be referenced from the manifest.
-   `BroadcastReceiver`s can be declared in `AndroidManifest.xml`. The
    `<intent-filter>` action and categories are referenced here.
-   . . .

This presents a problem since we end up duplicating the constants here.
We cannot use our `Broadcasts.LIVE_UPDATE` constant in XML, so we tend
to repeat the constant value:
```xml
<intent-filter>
    <action android:name="com.myawesomeapp.broadcast.LIVE_UPDATE"/>
</intent-filter>
```

This is not good. Any change to any constant involves updating it at
multiple places. What's more, these issues are not caught at compile
time and can be hard to debug.  

### Using String resources to avoid duplication

One way to avoid constant literal duplication issue explained in the
previous section is to use [string
resources](http://developer.android.com/guide/topics/resources/string-resource.html).
You are already using string resources for a variety of strings in your
Android app. (Wait, you aren't? I strongly suggest you start doing so
right now). All you need to do is add the constants as additional string
resources.

To keep things clean, you could keep these constants in their own file
under `values/` folder - for example `constants.xml`. In there, you
could add
```xml
<resources>

    <!-- Broadcast Actions -->
    <string name="broadcast_live_update">com.myawesomeapp.broadcast.LIVE_UPDATE</string>
    <string name="broadcast_friend_offline">com.myawesomeapp.broadcast.FRIEND_OFFLINE</string>

    <!-- Intent Extras -->
    <string name="extra_live_update_timestamp">com.myawesomeapp.extra.LIVE_UPDATE_TIMESTAMP</string>
    <string name="extra_live_update_value">com.myawesomeapp.extra.LIVE_UPDATE_VALUE</string>
    <string name="extra_friend_id">com.myawesomeapp.extra.FRIEND_ID</string>

    <!-- Preference Keys -->
    <string name="pref_key_update_interval">UPDATE_INTERVAL</string>
    <string name="pref_key_theme">THEME</string>

</resources>
```

Then, you could access these values from XML as follows:
```xml
<intent-filter>
    <action android:name="@string/broadcast_live_update"/>
</intent-filter>

<Preference 
    android:key="@string/pref_key_update_interval"
    ... />
```

And so on. In Java code, you'd access these as:
```java
if(getString(R.string.broadcast_live_update).equals(intent.getAction())){
    // ...
}

mSharedPref.getLong(getString(R.string.pref_key_update_interval));
```

**Unfortunately, this solution has all the disadvantages I mentioned in
an [earlier section](#disadvantages)**.

Your `constants.xml` will quickly become a monolithic clutter. This can
be addressed by creating a separate XML file for each type of constant -
like `broadcasts.xml`, `pref_keys.xml` etc. Even if you do that, you
will still be accessing all the resources using `@string/blah` and
`R.string.blah`.

Also, IDE content assist is still a problem. Your resource names will
need to be prefixed with `action_` or `broadcast_` or `pref_key_` etc
and finding the key you need could be frustrating.  

### A workable strategy

Here's a strategy I follow to decide how I should declare these
constants:

-   For preference keys, prefer string resources. This is because you
    are most likely to be building your Settings screens with XML
    anyway.
-   For all other key constants, prefer [split constant
    files](#split-constant-files).
-   Only if you need to use these from XML, declare them as string
    resources.
