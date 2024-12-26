--- 
title: 'Android ListViews: "Hybrid" Choice Behavior' 
publishDate: '2013-06-08' 
author: Kiran Rao 
tags: 
- choicemode 
- listview 
- android
---

The goal of this post is to use a `ListView` in a master/detail
configuration where *both* of the following are possible:

1.  Touch a single item to **open** it.
2.  Long-tap multiple items to **choose** them and perform a common
    action on them.

Note that we wish both these to be possible simultaneously, i.e., even
as one item is opened, we wish to allow multiple items (possibly
including the item that is opened) to be chosen.

This behavior (with some minor variations) is seen in apps like GMail,
Google Play Store and the Google I/O 2013 app.

The following screenshot shows what we want to achieve. It shows one
opened item (Item 5) and two chosen items (Item 3 and Item 8)

![This is what we want to
achieve](https://lh5.googleusercontent.com/-HVUbT2xSCHE/UbNPf0kqtFI/AAAAAAAAAHk/cAFBmm4HglY/s512/target_ui.png "target_ui.png")

### A note on the terminology

Just to avoid confusion, let's sort of formalize the terminology related
to the states an item in the list can be in.

> An item is **opened** when the user is viewing the details about that
> item. In other words, the details of that item are being displayed in
> the `DetailFragment`. In dual-pane mode, there needs to be some visual
> indication in the `ListView` to let the user know which one of the
> items is currently opened.
>
> When an item is **chosen**, the Contextual Action Bar appears and the
> user can perform some action on the item. When multiple items are
> chosen, only the contextual actions that apply to all of them are to
> be presented. There needs to be some visual indication in the
> `ListView` to let the user know which of the items are currently
> chosen. Needless to say, this indication needs to differ from the that
> used to indicate the opened item.

### Implementation

You might notice that one can achieve the opened behavior using
`ListView`'s `CHOICE_MODE_SINGLE` and the chosen behavior using
`CHOICE_MODE_MULTIPLE_MODAL`. However, it is while trying to combine
them that things begin to get challenging, particularly in dual-pane
mode. You get either one or the other, but never both. For example, if
you use `CHOICE_MODE_MULTIPLE_MODAL`, then you lose the ability to
visually indicate the currently opened item.

The solution I ended up with was to not rely on the
`CHOICE_MODE_MULTIPLE_MODAL`, but rather simulate it myself. The high
level steps are as follows:

1.  Create a custom `ListAdapter` that keeps track of the currently
    opened item and the currently chosen items
2.  In the `getView()` (or equivalent) method of your custom
    `ListAdapter`, examine the item at the supplied `position`. If it is
    the currently opened item, set its visual properties to indicate
    this. Ditto if it is one of the chosen items.
3.  Listen for clicks and long clicks on your `ListView` and update the
    adapter defined in step 1 accordingly- i.e., in your
    `OnItemClickListener` implementation, set the opened item and in
    `OnItemLongClickListener`, update the list of chosen items.
4.  `OnItemLongClickListener` is also where you need to start the action
    mode (`getListView().startActionMode()`) if it isn't started
    already.

### HybridChoiceAdapter

Here are relevant portions of the code showing how the Adapter should be
customized. This code is sparsely commented since I hope that it is self
explanatory. Please look at the end of this post for the link to the
complete github project.

```java
/* Keep track of currently opened item and chosen items */
private Set<Integer> chosenItems = new HashSet<Integer>();
private int openedItem = -1;

//...snip...

public void setItemChosen(int position, boolean chosen) {
    if (!chosen && isItemChosen(position)) {
        chosenItems.remove(position);
    } else if (chosen && !isItemChosen(position)) {
        chosenItems.add(position);
    }
}

public boolean isItemChosen(int position) {
    return chosenItems.contains(position);
}

public Set<Integer> getChosenItems() {
    return chosenItems;
}

public void setOpenedItem(int position) {
    this.openedItem = position;
}

public int getOpenedItem() {
    return this.openedItem;
}

public boolean isItemOpened(int position) {
    return this.openedItem == position;
}

public void clearChoices() {
    chosenItems.clear();
}

public void toggleItem(int position) {
    if (isItemChosen(position)) {
        chosenItems.remove(position);
    } else {
        chosenItems.add(position);
    }
}

public int getChosenItemsCount(){
    return this.chosenItems.size();
}
```

### The `getView()` method

At this point, we have set up the `Adapter` to keep track of the
currently opened item and the chosen items too. We have also exposed
methods to manipulate these values. Now, lets look at the code that
updates the UI. It is rather simple - all we need to do is, set the
background of the row view depending on the opened and chosen states of
the current item. Note that an item can be both opened and chosen.

```java
@Override
public final View getView(final int position, View convertView,
        ViewGroup parent) {
    View v = convertView;
    /*Normal procedure to inflate the row layout and set its properties goes here*/

    v.setBackgroundResource(0);
    if (isItemOpened(position)) {
        setViewAsOpened(v); //This method sets the appropriate background resource or drawable
    }

    if (isItemChosen(position)) {
        setViewAsChosen(v);//This method sets the appropriate background resource or drawable
    }

    return v;
}
```

### Listening for clicks on the `ListView`

In your `Activity` or `Fragment`, we listen for both clicks and long
clicks and update the adapter accordingly. Again, only the relevant
portions of the code are presented here - the full project is shared on
github (linked at the end of this post). Here we use a `ListAdapter`
that also implements `OnItemLongClickListener`.

```java
@Override
public void onListItemClick(ListView listView, View view, int position, long id) {
    super.onListItemClick(listView, view, position, id);

    //When an item is clicked, set it as the opened item
    mAdapter.setOpenedItem(position);

    //At this point, clear all choices
    mAdapter.clearChoices();
    if(mActionMode != null){
        mActionMode.finish();
    }
    mAdapter.notifyDataSetChanged();

        // code to show the details fragment goes here
}

@Override
public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {

    //When an item is long clicked, toggle its chosen state
    //Also update the CAB title to reflect the change in number of chosen items
    mAdapter.toggleItem(position);
    updateActionMode();
    return true;
}

private void updateActionMode(){
    if(mActionMode == null){
        mActionMode = getListView().startActionMode(actionModeCallback);
    }

    mActionMode.setTitle(String.format("%d chosen", mAdapter.getChosenItems().size()));
    mAdapter.notifyDataSetChanged();
}
```

The previous code snippet also includes step 4 from our high level
overview. If the CAB is not already shown, we show it when an item is
long clicked.

That mostly covers what we need to do to achieve our goal. There are a
few other things that need to be taken care of (for example, clearing
the choices whenever the CAB is dismissed - as a result of a contextual
action being performed, or otherwise). You can examine the entire code
in detail at the github repository.

### Variations

There are subtle variations of what action the user has to take to
choose an item. For example,

-   The old GMail app (v4.3) displayed check boxes for each row. So you
    could choose an item either by long-pressing it, or by tapping the
    check box.
-   In the new GMail app and the Google I/O 2013 app, when no item is
    chosen, you long-press an item to choose it. After that, **even
    single clicking on other items chooses them**. This is different
    from our implementation where a single-tap always opens an item.

You will need to modify the code for the click listeners if you want to
go with one of these variations. The `ListAdapter` code itself should
remain the same.

### Turning this into a library?

Well, I gave this a thought too. Exposing the custom `Adapter` as a
library is the easy part. What I couldn't decide upon is how to include
the `ListView` listeners in a library. Developers might wish to extend
`ListActivity` or `ListFragment` or simply include a `ListView` in their
layouts. Catering to so many requirements is a tough ask (unless I want
to provide custom base versions of all these classes ... plus their
`Sherlock` counterparts!)

If anyone has any ideas on how this could be library-ized, please do
drop a comment.

### GitHub repositroy

The complete source code for this article is available as a sample
project on GitHub
[here](https://github.com/curioustechizen/android-hybridchoice).
