---
layout: post
title:  "The Digital Identity Conundrum"
description: "Advocating against using corporate-owned identities as our digital identities"
date: 2021-08-01 16:00
comments: true
tags: [digitalidentity, bigtech]
---

In this post, I look at why surrendering our digital identities to BigTech is a bad idea (with some examples). I then examine some potential solutions to the digital identity problem and the shortcomings of those solutions. I conclude by proposing my own solution, albeit still a far from perfect one.


# The doomsday scenario

Let's say you run a restaurant business. You operate a chain of outlets across the country . You're doing great business for a few years. Then, one fine day, all of a sudden, you're hit with a termination. 

You are informed that you need to close your business because you violated a law, with the following additional points

  1. You are not informed exactly what law you violated. You are only vaguely told that it is "something related to fire safety", but not any more details.
  1. Not only are you supposed to close your business, you are not allowed to apply for a license for another business. Ever.
  1. In addition to losing your business, you also lose your ID documents (passport, driving license, etc). Now you cannot drive, travel or transact with your bank.
  1. These terminations apply not only to you, but also to some other businesses that were associated with you (some suppliers etc) 

You are desperate. You are no criminal, you _want_ to obey the law. The only problem is you don't know what to fix. You check your outlets for fire hazard standards, you ensure that the emergency exits are all functioning according to specifications.
  
You approach the authorities, requesting more information. But all you receive in response is a vague automated reply that is no use.

Not only have you lost your business, with no hope of starting another one, your entire life that is not even related to the business is destroyed as well. Your identity has been snatched from you.


# When digital identity providers are gatekeepers

That opening section seems impossible, doesn't it? Unless you are in an authoritarian state, it is unlikely that you will be handed out such an extreme punishment without even a chance at redemption. However, this is _exactly_ how it works in tech. Here's a sampling of some situations where a mistake in the business can get your digital accounts in trouble:

  - People have had their [developer accounts terminated](https://medium.com/android-news/google-just-terminated-our-start-up-google-play-publisher-account-on-christmas-day-5cb69a454da0), not because of any violation, but mereley on grounds of association. Yes, you read that right: Accounts have been terminated _merely on grounds of association_.
  - People have had their YouTube accounts [permanently banned](https://www.reddit.com/r/LivestreamFail/comments/dtv9g2/google_issues_account_permabans_for_many_of/) for flimsy reasons.
  - Your domain registrar [can suspend your domain](https://blog.gitbook.com/tech/post-mortems/06-20-gitbook-domains-blocked-by-registrar) based on suspicion (for example on suspicion that your domain is being used for phishing attacks)

These bans by themselves might not sound serious. Where it does get alarming is that these accounts are also tied to your digital identity. Did you notice that all the examples I provided above are Google accounts? When your Google Play or YouTube account is banned, so is your GMail account.

Think about what could happen if you suddenly lost access to your email account. Your email is the identity for all other services you use on the internet. Your bank, bill payment reminders, education services, password recovery mechanism, travel tickets, even governmental services - everything is tied to your email. It is the end of your digital identity.

I don't know about you, but I like a lot of Google services. I use them day in and day out. The root of the problem here is not that the services are from Google. The problems are multi-fold.

> 1. The identity provider (in this case Google) is also the gatekeeper of some services (in this example, YouTube, Google Domains or Google Play).
> 1. The gatekeeper uses opaque algorithms to identify violations
> 1. The gatekeeper does not have effective redressal mechanisms
> 1. The gatekeeper is not regulated by law to improve the situation

Points 2 and 3 above relate to the false sense of "scalability". See my [related post](/blog/2020/12/15/scalable-tech-business/) in that topic. 

Also, remember that this problem is not only about bans. What happens if Google disappears one fine day? What happens to your digital identity?

Finally, despite what the above examples might imply, this problem is not restricted to Google. It could just as well be any other bigtech. 


# Work-arounds that don't really work

How do you protect yourself against this potential ban-hammer? There are some solutions but they are all not very effective:

### Use a different Google account for business

This solution involves using a different Google account, separate from your personal one, specifically for the business. This simply does not work (see termination by association above). Google does not disclose how it identifies the association. It could be IP-based. It could be all e-mail addresses associated with the same person. It could be anything.

### Use a non-Google account for your personal email. 

This might work but it has some downsides. 

1. You still have years of history tied to your GMail account and migrating them elsewhere is non-trivial. 
1. Trusting a private corporation with your identity has the same risks as giving it to Google. That private tech company could ban your account in the same way as Google and that private company could disappear from business, leaving you stranded.

### Use your own domain and own email address

Again, this might work but it has some downsides.

1. The history and migration problems described in the previous solution apply
2. The cost and administrative effort involved in this solution are out of reach of most netizens.


# Governments as digital identity providers

My proposed solution is that the responsibility of providing digital identity should be with **Governments**. They are already responsible for our _physical_ identity documents. Passports, driving licenses, unique citizen numbers. This is just one more in the same vein.

Here are some ways in which this proposal is better than the existing solutions:

1. Government issued identities are bound to be longer lived than a corporate-issued one
1. At least in the democratic world, it is unlikely that you will be stripped of your identity without giving you a fair chance at redressal
1. Governments change, but your identity will remain. In other words, unlike corporates, Governments rarely go out of business.

However, this is far from perfect.

1. For one, this will be a new identity, so migrating your history to it will still be a challenge
1. Governmental solutions are bound to be inferior in quality compared to corporate ones
1. Ethical questions like surveillance are likely to come up when a Government is entrusted with digital identity.


# Conclusion

We entrust too much in the hands of BigTech, including our whole identity in the digital world. Moving away is hard because of the inertia created by investment in the existing system. I proposed one solution that might work but does not address the inertia problem.

Do you have any solutions to this conundrum? You can comment using disqus below, or on twitter [here](https://twitter.com/ki_run/status/1421842364109402117?s=20).