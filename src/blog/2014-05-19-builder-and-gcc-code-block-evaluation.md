---
title: Builder and GCC Code Block Evaluation
date: '2014-05-19T18:04:00.000+02:00'
---

My post about the [builder pattern][] got great responses and a lot of people offered alternative solutions to the same problem. The most popular suggestion was to use [GCC Code Block Evaluation](http://nshipster.com/new-years-2014/#gcc-code-block-evaluation-c-extension) without the separate builder object. Using the pizza example from the previous post it looks like this:

```
Pizza *pizza = ({
    Pizza *builder = [[Pizza alloc] init];
    builder.size = 10.0;
    builder.pepperoni = YES;
    builder.mushrooms = YES;
    builder;
});
```

[builder pattern]: http://www.annema.me/the-builder-pattern-in-objective-c

While this gives the same advantages to code organization there is nothing stopping me from modifying the pizza after it's created. One of the advantages of builder is that the created object is immutable. Immutable objects are great because they can be safely used in caches or passed around between threads.

But, we can improve this by combining the approach from my first post and this one. Let's take a look at an example using Foundation:

```
NSURL *url = ({
    NSURLComponents *components = [[NSURLComponents alloc] init];
    components.scheme = @"http";
    components.host = @"annema.me";
    components.path = @"the-builder-pattern-in-objective-c";
    [components URL];
)};
// URL = http://annema.me/the-builder-pattern-in-objective-c
```

In this example `NSURLComponents` is the builder object and `NSURL` is the immutable result. The url components are nicely enclosed in their own scope making it impossible to accidentally re-use the same instance. The created URL is immutable, giving us the same advantages of builder without having to add a special constructor to the class.

Even better is that this also works for any object that has a mutable counterpart (hat tip to [Hannes Verlinde](http://cocoanuts.mobi/2014/05/15/builder/)). For example `NSAttributedString`:

```
 NSAttributedString *text = ({
    NSMutableAttributedString *mutableText = [[NSMutableAttributedString alloc] init];
    [mutableText appendAttributedString:[[NSAttributedString alloc] initWithString:paragraph1]];
    [mutableText appendAttributedString:[[NSAttributedString alloc] initWithString:paragraph2]];
    [mutableText appendAttributedString:[[NSAttributedString alloc] initWithString:paragraph3]];
    [mutableText copy];
}];
```

Before writing my post I had forgotten about GCC Code Block Evaluation. After the responses made me aware of the pattern I not only found it works great with builder, it's a great aide in code organization as well. Mattt Thompson summarized it better than I can:

> If code craftsmanship is important to you, strongly consider making this standard practice in your work. It may look a bit weird at first, but this will very likely become common convention by the end of 2014.

I guess my adopting this practice in 2014 is one more step towards proving Mattt's statement.
