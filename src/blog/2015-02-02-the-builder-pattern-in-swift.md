---
layout: post
title: The Builder Pattern in Swift
date: '2015-02-02 20:51:00'
---

A while ago I wrote a post about implementing the builder pattern in Objective-C. Today we’re going to do the same for Swift.

In the [previous post](http://www.annema.me/the-builder-pattern-in-objective-c) the end result was:
    
    Pizza *pizza = [Pizza pizzaWithBlock:^(PizzaBuilder *builder]) {
        builder.size = 12;
        builder.pepperoni = YES;
        builder.mushrooms = YES;
    }];

There is a couple of things that can be improved here:

1. The syntax.
I don’t mind Objective-C, but there are definitely some superfluous characters.
2. Failability. 
A pizza without a size doesn’t make sense. Adding this to Objective-C is not impossible, but a decision has to be made on how to represent failures. Do we throw an exception when a size isn’t set? Return nil from an initializer? Maybe even have an isValid method with an error parameters that is returned by reference?

In turns out, builder can be done better in Swift. This is what it looks like when using the same `Pizza` example from the previous post:

    Pizza() { builder in
        builder.size = 12
        builder.cheese = .Mozzarella
        builder.pepperoni = true
    }

The `Pizza` initializer takes a block, with the builder as it’s parameter. In the [trailing closure](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html) we set the properties of the pizza. So far it’s exactly the same as Objective-C with slightly better syntax. From this point on things are different. After the block is executed we have an _optional_ Pizza, whereas in Objective-C we had a potentially invalid Pizza. As mentioned before, preventing this in Objective-C is possible, but a decision has to be made on how to present the error. In my experience these kinds of errors usually end up being ignored, becoming a hard to find bug at some point in the future.

Back to Swift; we ended with an optional Pizza. By making the result an optional we make it easier to deal with physical impossibilities; like a Pizza without a size. To see how this works, take a look at the initializers:

    init?(block: (PizzaBuilder -> Void)) {
        let builder = PizzaBuilder()
        block(builder)
        self.init(builder: builder)
    }

    init?(builder: PizzaBuilder) {
        if contains([12, 14, 16], builder.size) {
            self.size = builder.size
            self.cheese = builder.cheese
            self.pepperoni = builder.pepperoni
            self.mushrooms = builder.mushrooms
        } else {
            return nil
        }
    }

Both initializers are what are called [failable initializers](https://developer.apple.com/swift/blog/?id=17). They either return an optional Pizza or nil. In our example the only way the initializer fails is when the size isn’t 12, 14, or 16 inch.

Check out my entire `Pizza` implementation in [this gist](https://gist.github.com/klaaspieter/c05e843896abfa70f5cb). 

Swift arguably makes the syntax for a builder nicer. It also makes modeling failure easier by making it a core part of the language. After the Pizza is initialized from the builder there is only one question left: Is the Pizza a lie?