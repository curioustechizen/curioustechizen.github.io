--- 
title: 'Code Smells: Calling Life-Cycle Methods of Program Components Explicitly' 
publishDate: '2012-12-18' 
author: Kiran Rao
tags: 
- java 
- life-cycle 
- callbacks 
- software-design 
- programming
slug: 2012/12/18/code-smells-calling-life-cycle-methods
---

Here is some code I see that sets off alarm bells clanging in my head:

> Explicitly calling life-cycle methods of components **that are outside
> your control**.

Since that sounds oh-so-generic, let me illustrate by way of example.

Assume you are writing a `Servlet` and your implementation doesn't care
whether the request was a POST or a GET (in the current RESTful world,
this should never be the case, but let's keep that aside for the
purposes of this post). So, the following would appear to be a
reasonable implementation:

```java
public class MyServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        //Handle the request 
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        doGet(req, resp); //Just call doGet
    }
}
```

I would never do this though. This is because `doGet`, `doPost` and the
other `doXXX` methods are life-cycle methods of the `Servlet`. I have no
control over when and how the servlet engine calls them. I also have no
control over what the engine does once these methods return. It is
possible that the engine performs some house-keeping tasks once a
`doGet` returns, and that action could be different from what is done
once a `doPost` returns.

It is really a simple matter of extracting the "common functionality"
between such life cycle methods into a method and calling that method.

```java
public class MyServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        handleRequest(req, resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        handleRequest(req, resp);
    }

    /**
     * Method that extracts out the common functionality between GET and POST requests
     */
    private void handleRequest(HttpServletRequest req, HttpServletResponse resp){
        //Handle the request
    }
}
```

#### What if the life cycle methods are in an Interface?

One opinion that came up in a discussion was that it is safe to call
other life-cycle methods if they are in an `interface` as opposed to a
`class`. Note that the above code sample extends
`javax.servlet.http.HttpServlet` which is an `abstract class` as opposed
to the base `javax.servlet.Servlet` which is an `interface`. This has
come up specially while discussing callbacks.

I disagree with this opinion since it assumes that any book-keeping has
to be performed by the same (possibly `abstract`) class that denotes the
life-cycle component. This is not true. Take an imaginary UI toolkit for
example, which has a `Pane` as a UI element. Now, assume an interface
for handling interaction callbacks:

```java
interface InteractionListener{
    public void onClick();
    public void onRightClick();
    public void onLongClick();
    public void onDoubleClick();
}
```

In this case again, assume that you want the same action to be performed
on long-click and right-click. So, you might be tempted to do this:

```java
Pane pane = // ...

pane.setInteractionListener(new InteractionListener(){
    public void onClick(){
        //Handle single-click
    }

    public void onRightClick(){
        //Handle right-click
    }

    public void onLongClick(){
        onRightClick();
    }

    public void onDoubleClick(){
        //Handle double-click
    }
});
```

This is *still* wrong. Yes- `InteractionListener` is an interface and
there is no way it can have a concrete method that might perform
house-keeping tasks. However, you have no control over how the UI
toolkit engine invokes the call-backs. You also have no control over
what action the engine takes *after* your `onXXXClick()` methods return.
The solution, again is exactly the same as before: extract the common
code into a method which you then invoke from both `onLongClick()` and
`onRightClick()`.  

#### Conclusion

Avoid calling one component life-cycle method from another, when the
component in question is outside your control. This could lead to
unpredictable behavior. Simply refactor the common behavior into a
method and call that method from both life-cycle call-backs.

A few other instances where I have seen this sort of code:

-   Android's
    [`SqliteOpenHelper`](http://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html).
    In the `onUpgrade()` method, you probably want to take a backup of
    data, drop the tables, add new columns, and then re-create the
    tables. The implementation often looks like this:

```java
public class MySqliteOpenHelper extends SqliteOpenHelper{
    public void onCreate(SQLiteDatabase db){
        //Use SQL CREATE TABLE statements to create the tables.
    }

    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion){
        /*
        * 1. Take backup of data
        * 2. Drop tables
        * 3. Add columns
        *
        * And finally:
        */
        onCreate(db); //This is not right.
    }
}
```

The right way to do this would be:

```java
public class CorrectSqliteOpenHelper extends SqliteOpenHelper{
    public void onCreate(SQLiteDatabase db){
        createDatabase(db);
    }

    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion){
        /*
            * 1. Take backup of data
            * 2. Drop tables
            * 3. Add columns
            *
            * And finally:
            */
        createDatabase(db);
    }

    private void createDatabase(SQLiteDatabase db){
            //Use SQL CREATE TABLE statements to create the tables.
    }
}
```
I will re-visit this post and add more instances as and when I come
across them.
