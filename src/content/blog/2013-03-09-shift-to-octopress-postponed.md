--- 
title: Shift to Octopress Postponed 
publishDate: '2013-03-09'
author: Kiran Rao 
tags: 
- migration 
- platform 
- octopress 
- publishing
---

For some time now, I have been toying with the idea of migrating this
blog to [octopress](http://octopress.org/). I'm already using Markdown
to compose my posts, so this is a logical step for me. Also, the idea of
a static site that I can take with me wherever I choose to host it
appeals to me. Finally, there's the geek factor what with git-based
publish workflows and SCSS/liquid customizations and what not. I had
even chosen a theme -
[Fabric](http://panks.me/blog/2013/01/new-octopress-theme-fabric/) - to
use as my base theme.

However, it looks like I'm going to have to postpone migration to
Octopress. Here are some of the reasons:

### Redirection

I'm not sure how to deal with links to my existing posts. I have seen
examples of how to do this if you are self-hosting your current blog, or
if you are using your own domain name. Neither of these apply to me - my
current blog is hosted on blogger, with a `.blogspot` domain.

### Comments

I'm already using Disqus for comments on my blog. I gather that it
should be possible to migrate Disqus comments even if your domain
changes. I just haven't figured out how.

### Importing

I tried using some custom Ruby scripts to import my existing posts into
Octopress. While it works, there are two problems I need to deal with:

-   **Syntax Highlighting:** In blogger, syntax highlighting is done
    dynamically by Javascript (I use google's prettify.js). While this
    can be used with static site generators, it is best to stick to
    introducing syntax highlighting at the *post generation time*. This
    is all fine for new posts, but for posts that I import from blogger,
    this needs additional tweaking. Basically the imported sources are
    just HTML with some YAML front-matter. I will need to convert it to
    markdown, add the syntax highlighting annotations and then generate
    the posts from it.

-   **Permalinks:** This goes back to the redirection I already
    mentioned. I also need to customize the permalinks of imported posts
    to make sure they play nice with redirection. Again, this is not a
    problem for newer posts. Only the imported posts need to be tweaked.

### Looking Forward

I'm not saying that any of the above impossible (or even very difficult)
to achieve. It is just that some amount of experimentation is involved.
I feel that it would take up more time than I am willing to invest at
this point to get things up and running.

This is not to say that I have shelved the idea of shifting to a static
site generator altogether. On the contrary. This shift is surely
happening. It has just been deferred.

The easiest approach would be to maintain my current blog at
http://curioustechizen.blogspot.com/ and start the octopress blog
afresh. No imports from blogger. No redirection. Only new posts at the
new blog. This approach is not without its downsides though.

So, in a nutshell:

> I will surely be migrating to a static site generator like octopress
> in the near future. But for now, I'm sticking with blogger.

  
