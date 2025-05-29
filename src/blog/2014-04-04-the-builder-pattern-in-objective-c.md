---
title: The Builder pattern in Objective-C
date: "2014-04-04T17:43:00.000+02:00"
---

Learning Android and by extension Java has given me some new patterns to apply in my Objective-C code. The one that I'm most excited about is the [builder pattern][].

[builder pattern]: http://en.wikipedia.org/wiki/Builder_pattern

The builder pattern is an object creation pattern that fits well with Java's syntax. I've seen some adaptions to Objective-C but they all directly copy Java's implementation directly and are not very idiomatic.

Let's start off with what it looks like in Java. For my [talk about applying patterns from other languages](http://www.meetup.com/new-york-ios-developer/events/166708792/) I used a Pizza model as an example, I'll use the same here. This is what it looks like:

```java
Pizza pizza = new Pizza.Builder()
    .size(12)
    .pepperoni(true)
    .mushrooms(true)
    .build();
```

Think about what this would look like if you had to use a constructor. What would happen to the constructor if the restaurant decides to add more toppings or perhaps different crust types? For these kinds of objects it's easy to end up with an array of possible constructors all covering different permutations of the arguments.

This is the problem the builder pattern solves. It decouples the construction of a complex object from it's representation. The builder pattern is a so called [fluent interface](http://en.wikipedia.org/wiki/Fluent_interface); an API that aims to provide more readable code.

A direct port to Objective-C looks something like this:

```objc
Pizza *pizza = [[[[[PizzaBuilder alloc] init] setPepperoni:YES] setMushrooms:YES] setSize:12] build];
```

Not very fluent is it? Unlike others I don't mind Objective-C's square brackets but there's a limit. The following is a more idiomatic approach. It makes use of Objective-C's dot syntax to set the properties:

```objc
PizzaBuilder *builder = [[PizzaBuilder alloc] init];
builder.size = 12;
builder.pepperoni = YES;
builder.mushrooms = YES;
Pizza *pizza = [builder build];
```

This definitely reads better but we're exposing the builder beyond it's minimum scope. It's possible to accidentally re-use the same object somewhere in the same method. In general the scope of variables should always be limited to their absolute minimum.

One of the most common mistakes I see when people are trying to adopt a new language is copy patterns from their favorite language and subsequently complain how bad the adopted language is. Copying the Java implementation has served us well so far but we have to let go now and make the pattern ours. Good artists copy, great artists steal.

In order to make this pattern fit Objective-C we're going to apply another pattern. This one comes from Ruby. I don't know what the official name for it is, I just call it the Ruby configuration block pattern. This is our final idiomatic Objective-C implementation:

```objc
Pizza *pizza = [Pizza pizzaWithBlock:^(PizzaBuilder *builder]) {
    builder.size = 12;
    builder.pepperoni = YES;
    builder.mushrooms = YES;
}];
```

We made the interface fluent, the scope of the builder is limited to within the block and as an added benefit the call to build is now implicit. When the block returns the `pizzaWithBlock:` method knows that configuration is finished and can call build for us. Not only did we make the pattern idiomatic Objective-C, we also removed one of the Java implementation's major headaches; forgetting to call the sentinel method.

To finish, this is the `pizzaWithBlock:` method implementation:

```objc
+ (instancetype)pizzaWithBlock:(PizzaBuilderBlock)block {
    NSParameterAssert(block);

    PizzaBuilder *builder = [[PizzaBuilder alloc] init];
    block(builder);
    return [builder build];
}
```

The builder's `build` method is implemented as:

```objc
- (Pizza *)build;
{
    return [[Pizza alloc] initWithBuilder:self];
}
```

And finally Pizza's `initWithBuilder:` method:

```objc
- (id)initWithBuilder(PizzaBuilder *)builder;
{
    self = [super init];
    if (self) {
        _size = builder.size;
        _pepperoni = builder.pepperoni;
        _mushrooms = builder.mushrooms;
    }

    return self;
}
```

I use a similar approach in [APIClient](https://github.com/klaaspieter/APIClient/blob/master/Classes/APIClientConfiguration.m#L28). Note that I wrote this code before I knew about the builder pattern so it isn't an exact implementation. Having read this post you should now be able to [improve my implementation](https://github.com/klaaspieter/APIClient/pulls).

I believe we can learn a lot from other languages and their communities. Unfortunately most of us don't have the time to really adopt a new language. This post serves as a shortcut. You just learned a new pattern to apply in your Objective-C code without first having to learn Java or Ruby.
