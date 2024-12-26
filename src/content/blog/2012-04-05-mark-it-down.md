--- 
title: Mark It Down 
publishDate: '2012-04-05' 
author: Kiran Rao
tags: 
- editing 
- publishing 
- markdown
slug: 2012/04/05/mark-it-down
---

#### <u>Then</u>:

My traditional workflow for writing a blog post used to be this:

1.  Type it out offline in a Word Processor (MS Word, Open Office, Lotus
    Symphony, Libre Office - what have you).
2.  When the post is ready, first copy-paste it into Google Docs.
3.  Then, create a new post in Blogger, and paste in the contents.
4.  Often, several formatting "adjustments" would be needed (let me not
    even go into the details of these adjustments!)
5.  Finally, publish the post.

The idea was to have a copy of the document outside of blogger (in case
I decide to switch hosting platforms etc). The Google Docs step was in
order to have a cloud copy of the "copy outside Blogger". Yes, go ahead.
Throw back your head and laugh out loud at the stupidity of it all. I
deserve it :-)

  
But, let's face it: Word Processors are not meant for producing content
for the web.

-   Copy-pasting from a Word Processor document into any post editor
    invariably messes up the formatting.
-   Then there's the issue of things like line-spacing and "Justify"
    settings in word processors - these do not translate to HTML in a
    standard way.
-   Finally, stuff like quoting passages of text; or inserting in-line
    pre-formatted code is mighty difficult to get right while using a
    combination of Word Processors and post editors.  

#### <u>Now</u>:

In order to get past all these problems, I have now turned to [Markdown
syntax](http://en.wikipedia.org/wiki/Markdown). As you can see, markdown
is a simple syntax for formatting web content (headers, paras, bullet
points, quotes, code etc). The advantages of Markdown for me are:

-   Simple, familiar(?) syntax. (If you have used StackOverflow, you
    have already used Markdown)
-   Produces HTML as output.
-   Implemented in a standard way across Markdown Editors.
-   Especially convenient for use cases like this technical blog that
    you are reading, where I will need to include lots of inline code
    snippets and the like.

  
My new workflow for publishing a post is:

1.  Write the post in a Markdown Editor. I use
    [ReText](http://sourceforge.net/p/retext/home/ReText/), but there
    are dozens of them out there, for every platform, and even web-based
    ones.
2.  Export it as HTML.
3.  Make minor changes in the HTML if required. For example, I use
    [google code
    prettify](http://code.google.com/p/google-code-prettify/) for syntax
    highlighting. This requires HTML `code` elements to have specific
    CSS styles associated with them.
4.  Copy the final HTML into the **HTML editor** of Blogger.
5.  Publish it (actually, I **schedule** my posts rather than publish
    them right away - because I wrote several posts at a time and then
    space them out. But that's a different topic).

  
I suppose some of these steps can further be eliminated - for example:

-   Some blogging platforms already allow Markdown directly in their
    post editors.
-   If and when Blogger allows Markdown directly in the post editor, I
    can skip the HTML exporting part.
-   That part about adding specific CSS classes to the `code` elements -
    that can probably be automated with Javascript.

  
What we have at the end of the day is a simple, predictable and no-fuss
workflow for writing blog posts which are not only well-formatted, but
are also interleaved with quotes and code blocks; all this without
breaking HTML.

#### <u>Customize</u>:

You might have observed that Markdown (or rather the HTML output of
Markdown) only defines the *structure* of the content, and not the
*style*. What this means is that you can customize the look of the HTML
procuded by Markdown, by suppying appropriate CSS styles. Note that this
is consistent with the best practices of web development:

> Separate structure from presentation.

This is exactly what Markdown does: Defines the semantic structure, but
leaves the presentation to the CSS.

#### <u>Cons</u>:

I have been a big fan of 1.5 line spacing and the "Justify" feature of
Word Processors. It looks like these formatting features are unavailable
in Markdown (probably because they do not translate to HTML in a
standard way). But on second thoughts, this probably is a good thing -
since including line spacing and Justification would pollute the
structure with presentation!

#### <u>Conclusion</u>:

I've adopted Markdown for not only my blogging needs, but for much more
(writing documentation, for example). It works pretty well, is
hassle-free and is simple. Do let me know what tools you use and the
workflow you follow for content creation and publishing.
