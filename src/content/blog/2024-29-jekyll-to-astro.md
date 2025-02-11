---
title:  "Goodbye Jekyll, Hello Astro"
description: "Why, What and How of the migration of my blog from Jekyll to Astro"
publishDate: 2025-02-09
comments: false
tags: [migration, publishing, jekyll, astro]
slug: bye-jekyll-hello-astro
---

This blog started on the blogger platform with a [blogspot subdomain](https://curioustechizen.blogspot.com/). In 2015, it moved to [Jekyll](https://jekyllrb.com/) as a platform and its own domain. Now 9 years and 26 posts since the last shakeup, it has undergone another big migration, this time to [Astro](https://astro.build/).

## Why migrate?

Jekyll is great. It is very widely used. It was probably the first (if not the first) static site generator to be adopted at scale. It has a huge community around it. You get tons of themes and plugins for Jekyll. You'll get support if you're stuck.

Then why did I migrate? It boils down to 2 reasons:
1. My lack of familiarity with the Ruby ecosystem (that's what Jekyll is based on)
2. Markdown extensions like [MDX](https://mdxjs.com/) and [Markdoc](https://markdoc.dev/) being more at home in other ecosystems (particularly Javascript)

The first problem could probably be solved in some way. For example, often times when I upgrade my Linux distribution, I run into problems with Ruby dependencies. This could be solved by using Docker, or using a CI job to build my site from markdown sources.

The second is more interesting to me. Markdown is great, but it is pretty limited. If you want some customization, you're dependent on the markdown processor used by your static site generator.

Enter markdown extensions like MDX or Markdoc. With either of these extensions, you can have your site written mostly in Markdown, and you can then add "custom components" that markdown does not support out of the box.

For a programming related blog, this is a good choice.

## What were my options?

I only experimented with 2 frameworks

1. [Astro](https://astro.build/), the Javascript framework for content-driven websites
2. [Kobweb](https://kobweb.varabyte.com/), the Kotlin and Compose-HTML based framework for dynamic websites

Kobweb was extremely tempting for me since my day job is that of a Kotlin multiplatform developer and I work with Compose on a daily basis. This means I could reach for Compose-HTML based components instead of MDX or Markdoc if I needed any extensions to Markdown (and Kobweb has support for such extensions out of the box).

However, Kobweb is pretty new and although it has an awesome community around it already, there simply aren't enough "templates" to choose from.

In the end, I chose Astro for the following reasons

1. A wide selection of "hit the ground running" [templates](https://astro.build/themes/). This was important for me because I did not want to spend a lot of time designing/implementing a blog theme from scratch.
2. A matured community. This was useful for migrating my blog from Jekyll. For example I found it way easier to map existing URLs from my old blog to my migrated Astro blog.

## What did the migration involve?

1. The first step was to choose an Astro theme to base my blog on. I wanted a minimalistic, content-focused layout and I settled on [Dante Atsro theme](https://github.com/JustGoodUI/dante-astro-theme).
2. The next step was to customize this theme to my liking (mainly [these](https://github.com/curioustechizen/curioustechizen.github.io/blob/3bddb34c7cb96fa6dd83c3ab29eb39729e60b15a/src/styles/global.css) [two](https://github.com/curioustechizen/curioustechizen.github.io/blob/3bddb34c7cb96fa6dd83c3ab29eb39729e60b15a/tailwind.config.cjs) files).
3. Then comes the most important step: Moving the markdown files from my Jekyll project to the Astro project. This involved adjusting the frontmatter and a bit of fiddling with the Typescript code in the Astro project.

The git diff for this change is humongous, but if you look at an individual markdown file in isolation, it isn't that big. As an example, let's look at the markdown file for [this post](https://kiranrao.in/blog/2021/12/03/jetpack-compose-slots/). This is the diff for the frontmatter between the [Jekyll](https://github.com/curioustechizen/curioustechizen.github.io/blob/9b3e09bc6c7b2009867295c9534818c61268214a/_src/_posts/2021-12-03-jetpack-compose-slots.markdown#L1-L9) and [Astro](https://github.com/curioustechizen/curioustechizen.github.io/blob/3bddb34c7cb96fa6dd83c3ab29eb39729e60b15a/src/content/blog/2021-12-03-jetpack-compose-slots.md#L1-L9) versions.

```diff
---
- layout: post
 title:  "Effectively using slots in Jetpack Compose"
 description: "Using slots to avoid having to trickle parameters down the tree of Composables"
- date: 2021-12-03 20:00 +05:30
+ publishDate: '2021-12-03'
 comments: true
 tags: [android, jetpack-compose]
+ slug: 2021/12/03/jetpack-compose-slots
---
```

Similarly, I was using Jekyll's liquid syntax for code blocks and I could replace that with makrdown's code-fence syntax. It went from [this](https://github.com/curioustechizen/curioustechizen.github.io/blob/9b3e09bc6c7b2009867295c9534818c61268214a/_src/_posts/2021-12-03-jetpack-compose-slots.markdown#L61-L63)
```markdown
{% highlight kotlin %}
MainScreen(mainScreenModel = sampleMainScreenModel)
{% endhighlight %}
```

to [this](https://github.com/curioustechizen/curioustechizen.github.io/blob/3bddb34c7cb96fa6dd83c3ab29eb39729e60b15a/src/content/blog/2021-12-03-jetpack-compose-slots.md#L61-L63)
````markdown
```kt
MainScreen(mainScreenModel = sampleMainScreenModel)
```
````

My Jekyll site had some redundancy when it comes to defining tags (I had to create a separate YML file for tags). With Astro, none of that is required, just adding a tag in the YML is sufficient.

### Retaining incoming links

The new `slug` property in the YAML frontmatter is the key to allowing me to retain old URLs. The Jekyll site used the format `YYYY/MM/DD/some-slug` while the Astro one uses just `slug` (by default). So all I had to do was update the slug property in my old posts and I my existing links are not lost.

For retaining links to the existing tag pages, I had to use a [redirect](https://github.com/curioustechizen/curioustechizen.github.io/blob/3bddb34c7cb96fa6dd83c3ab29eb39729e60b15a/astro.config.mjs#L24-L26) because I had configured my Jekyll blog to use `/blog/tags/tag-name` while Astro uses `/tags/tag-name`.

That is the gist of the changes that I made. There are several other small changes related to the 404 page, RSS generation, robots.txt, SEO etc.

## In closing

Migrating to Astro was way less involved than I had originally expected. I'm pretty happy with the way things have worked out so far. And I haven't even used any MDX/Markdoc features yet!