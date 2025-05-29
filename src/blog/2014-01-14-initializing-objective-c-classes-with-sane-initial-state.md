---
title: Initializing Objective-C classes with sane initial state
date: "2014-01-14T18:54:00.000+01:00"
---

Because Objective-C has the concept of [designated initializers][], you have to ensure your classes are instantiated using sane initial state. Take for example a fictitious person class with the designated initializer `initWithName:`

```objc
@implementation Person
- (id)initWithName:(NSString *)name;
{
    self = [super init];
    if (self) {
        _name = name;
    }
    return self;
}
@end
```

[designated initializers]: https://developer.apple.com/library/ios/documentation/general/conceptual/CocoaEncyclopedia/Initialization/Initialization.html#//apple_ref/doc/uid/TP40010810-CH6-SW3

Now in a view controller this happens:

```objc
- (void)viewWillAppear:(BOOL)animated;
{
    [super viewWillAppear:animated];
    Person *person = [[Person alloc] init];
    self.nameLabel.text = self.person.name;
}
```

The author accidentally forgot to use the designated initializer and the program now has incorrect state. In this particular situation it results in an empty label that might or might not be visible to the user. This is a simple example but in a complex application this can easily lead to hard to find bugs.

Let's take a look an Foundation class to find a solution. Specifically a possible implementation of the NSNumberFormatter `init` method:

```objc
- (id)init;
{
    return [self initWithLocale:[NSLocale currentLocale]];
}
```

If possible you should always prefer a sane default over an exception. Unless otherwise specified, an NSNumberFormatter is initialized with the current locale.

However more often than not such a sane default doesn't exist. In the example of our Person class there is no default name that we can fallback on. In this case use [`NSParameterAssert`](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Miscellaneous/Foundation_Functions/Reference/reference.html#//apple_ref/c/macro/NSParameterAssert). Not providing a name is a programmer error. By convention any programmer error should raise an exception. `NSParameterAssert` will conveniently do this if the passed in parameter evaluates to false.

Let's see what that looks like in our Person class:

```objc
@implementation Person
- (id)init;
{
    return [self initWithName:nil];
}

- (id)initWithName:(NSString *)name;
{
    NSParameterAssert(name);
    self = [super init];
    if (self) {
        _name = name;
    }
    return self;
}
@end
```

This 100% guarantees that your classes initial state is correct. If, like in our previous example, `init` is accidentally used it will immediately raise an `NSInternalInconsistencyException`. Furthermore if you remove assertions from your production code this will, apart from the fact the the application now has incorrect state, have no effect on your user's experience.

This also works for classes that already have a designated initializer like UIView:

```objc
// In a UIView subclass
- (id)initWithFrame:(CGRect)frame;
{
    return [self initWithText:text];
}

- (id)initWithText:(NSString *)text;
{
    NSParameterAssert(text);
    CGRect textFrame = // Assume this exists
    self = [super initWithFrame:textFrame];
    if (self) {
        _text = text;
    }
    return self;
}
```

Finally the initialization code paths are trivial to test:

```objc
describe(@"Person", ^{
    it(@"cannot be created without a name", ^{
        expect(^{
            Person *person = [[Person alloc] init];
        }).to.raise(NSInternalInconsistencyException);
    }

       it(@"can be created with a name", ^{
        Person *person = [[Person alloc] initWithName:@"Ender"];
        expect(person.name).to.equal(@"Ender");
    });
});
```

There you have it. A simple and reusable way to make sure your classes are always initialized with sane initial state.

**Update**:

The initial version of this post included a statement that you should remove assertions from your production code. While I am still off this opinion [@\_\_block](https://twitter.com/__block/status/423716919037136896) pointed out an interesting article from [Mike Ash](https://www.mikeash.com/pyblog/friday-qa-2013-05-03-proper-use-of-asserts.html) explaining proper usage of asserts. Mike also makes a good case on why you shouldn't compile out assertions. Since this discussion is outside of the scope of this article I removed the statement.
