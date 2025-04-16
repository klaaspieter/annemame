---
title: Improving the Cappuccino Theme System
date: '2010-11-05T21:13:00.000+01:00'
---

I've written about the Cappuccino theming system before[^1] and I have a confession to make, I don't like the current system.

Let me clarify. Being able to change every visual aspect of a view is great, but  currently it's too complex.

It's complex because a it requires manual building, even during development. I should be able to make a change, refresh the browser and see the difference. Just like developing everything else on the web, including Objective-J.

[Cappuccino custom themes]: http://www.annema.me/blog/post/cappuccino-custom-themes

Objective-J itself is also part of the complexity. `setValue:forThemeAttribute:inState` works great for small amounts of theme changes. But it becomes unreadable when changing large parts of a theme.

With all the talent in the Cappuccino community I'm sure we can work around these problems with the current system. It will however not fix the biggest issue. Designers *won't* theme as long as we're using Objective-J as our theming language.

This is a huge step backwards. Designers have been able to style websites [for years][History of CSS] using CSS. I don't see why that isn't possible for (Cappuccino) web applications.

[History of CSS]: http://en.wikipedia.org/wiki/Cascading_Style_Sheets#History

Now is the time for the skeptics to say that this impossible or to hard to do. Well, as we say in Dutch, [watch and shiver][sample application][^2].

[sample application]: http://dl.dropbox.com/u/3415875/Blog/Improving%20the%20Cappuccino%20Theme%20System/index-debug.html

Obviously this application is a big hack, but it does show what is already possible. Imagine what we could do if we implemented this properly.

In the application I use a Javascript CSS parser. This prevents the need for a separate build phase during development. When the application is ready to be deployed, the CSS can still be build into an optimized format. CSS is also a far more readable theming language and most designers already know and use it.

Now to also get them to use Git.

[^1]: Previous posts are [Cappuccino Custom Themes](http://www.annema.me/blog/post/cappuccino-custom-themes) and [The Basics of Cappuccino Theming](http://www.annema.me/blog/post/the-basics-of-cappuccino-theming))

[^2]: The source is available [here](http://dl.dropbox.com/u/3415875/Blog/Improving%20the%20Cappuccino%20Theme%20System/Improving%20the%20Cappuccino%20Theme%20System.zip)
