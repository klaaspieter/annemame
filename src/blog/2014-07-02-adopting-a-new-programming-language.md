---
title: Adopting a new programming language
date: '2014-07-02T19:33:00.000+02:00'
---

Over the course of my short career I've had the opportunity to build production-quality software in many new languages. I _like_ learning new languages. I think it makes me a better developer. My skill level is probably average in most of the languages I’ve worked with, but I've learned something useful from each and every one. 

Here's my approach to adopting a new language.

### Commit!

There’s no use in trying to adopt something if the language you’re comfortable with is looming nearby: have a specific goal in mind and commit to it. Write a program, write a single class, do a beginners tutorial. Anything, as long as it commits you to writing the new language and nothing else.

### Stay idiomatic

Most programmers I know, including myself, will come to a new language and start complaining about what it lacks. Most of us will also immediately start looking for ways to incorporate the favorite features from our language of choice. 

Avoid this at all costs. People are productive in the language every day. It is very likely they have a better, more idiomatic, solution for the problem you're trying solve. Don't try to get back into your comfort zone by turning a language into something it's not. You want to learn something new, not force your old knowledge into another context.

### Learn when you have a better solution

Eventually you'll become comfortable in a language. You'll know which solutions have been tried and which don't work for you. This is the point to start incorporating past experiences, never earlier. Note that it can take months, if not years, to get to this level of proficiency. If you're not sure, you're not ready yet.

Side note: I'm talking about language patterns that apply to specific languages. You should always try to follow good software practices. Regardless of language you should always be on the lookout for [Law of Demeter][] and [Lyskov][] violations.

[Law of Demeter]: http://en.wikipedia.org/wiki/Law_of_Demeter
[Lyskov]: http://en.wikipedia.org/wiki/Liskov_substitution_principle

### Learn the frameworks

> Programming languages are born, evolve and are discarded. Knowing the big concepts will help you transition to any new language. — <a href="https://twitter.com/casademora/status/476755756612476931">Saul Mora</a>

Most programming languages have similar syntax, so learning the syntax usually isn't the hardest part. Unless you're designing a language, it doesn't really matter how a method is called.
It's the frameworks where you have the most opportunity to learn about new patterns, or novel ways to use them.

One trick I picked up to learn is to take warnings seriously. It's easy to ignore warnings when learning a new language. Especially early on, you might not yet really know what is going on, and the warnings might be very cryptic and hard to understand. Don't ignore them. Warnings are meant to tell you about a potential problem, an issue that is likely to cause a bug at some point. Only ignore them if you truly know what you're doing.

Warnings give you an opportunity to learn something new. Frameworks often warn about using it in ways that might become problematic. By exploring these warnings, you learn a little about the assumptions and inner workings of the framework. Only after learning what the warning means should you decide to ignore the warning.

### Become part of the community

When you first get started, you might not know anybody in that community. That means there’s no one to reach out to when you get stuck. It's important to find people that can help you learn.

Try to go to meetups. If you're in a hub like New York, there's probably a ton. If not try, to at least go to a conference. Regardless of where you are in the world you’ll want to engage with the community online.

The best way to get yourself known is speaking. It might be hard to get in, because organisers don't know you, but you do have a unique perspective now. You've learned their language coming from a different background, and should be able to give an interesting talk about it. Talk about the challenges of adopting the language. Talk about things you find good/bad in the community. You have an unbiased view of what it's like to get started and the community can learn from that.

### Learn how to navigate the docs

The documentation is your number one go-to for problems and discovery.  Learning to navigate the documentation means you can find things faster. Most community-maintained frameworks also adopt the documentation style and design of the language. For example, most Ruby documentation looks like, well, [ruby doc](http://ruby-doc.org/). By just learning to navigate the language's docs, you're simultaneously getting familiar with how most of the community documents their code. 

### Embrace the change

Initially you will literally feel overwhelmed. Programming is making choices and for the first couple of weeks you will feel like every choice you make is stupid and wrong. In short, you will have no clue what you're doing. At some point or another you probably have to suppress the urge to find whoever wrote the documentation and have a good chat with him. Don't let this feeling discourage you. You're outside of your comfort zone; you should, by definition, feel uncomfortable.

**Edit**: I made a bad joke about PHP. I probably thought it was funny at the time, but reading it now; it does not fit this post nor my blog. This is about encouraging everyone to learn new things and the comment detracts from that. PHP is used succesfuly every day and joking about it only disrespects its community. Linking to Buffer, a company advocating positivity and succesfully using PHP, in the same paragraph makes it even worse. I apologize. I left the comment in for posterity.

We're all _software_ developers. You're not just a Ruby developer, I'm not just an Objective-C developer, ~~and in some circles you don't want to identify yourself as a PHP developer~~. More diversity in your knowledge and your experiences means you'll be able to build more interesting things. Or as the [Buffer Blog](http://blog.bufferapp.com/connections-in-the-brain-understanding-creativity-and-intelligenceconnections) said it:

> The more of these building blocks we have, and the more diverse their shapes and colors, the more interesting our castles will become.
