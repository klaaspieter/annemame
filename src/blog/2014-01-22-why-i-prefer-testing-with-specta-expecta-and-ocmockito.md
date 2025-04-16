---
title: 'Why I prefer testing with Specta, Expecta and OCMockito'
date: '2014-01-22T19:20:00.000+01:00'
---

**Update August 2014**: Since writing this article, OCMock has released major version 3. Everything said about OCMock is based on version 2.

If you're testing your Objective-C code (you should) you've probably heard of [Kiwi][] and XCTest. Great! Do you like it? Awesome! You should switch to [Specta][] and [Expecta][]. Why? Keep reading.

[Kiwi]: https://github.com/allending/Kiwi

[Specta]: https://github.com/specta/specta

[Expecta]: https://github.com/specta/expecta

### Uniform interface

Specta provides one uniform interface that works for every kind of value. For example:

```
it("equals YES", ^{
    expect(view.isHidden).to.equal(YES);
    // Yes, I'm aware there is a isTruthy matcher but that wouldn't really prove my point...
});
```

Compare this to the Kiwi alternative:

```
it(@"equals YES", ^{
    [theValue(view.isHidden) should] equal:theValue(YES)];
});
```

In Kiwi, when working with scalars, both sides need to be wrapped using the `theValue(aScalar)` macro. Specta hides this complexity by providing one uniform interface for any value. Anything you pass to `expect` or to a matcher is automatically wrapped for you.

If that doesn't convince you; both Kiwi and Specta are based on RSpec and RSpec [switched](http://myronmars.to/n/dev-blog/2012/06/rspecs-new-expectation-syntax) to the `expect` approach that Specta is using.

This is their reasoning behind the change, replace RSpec with Kiwi and object with `NSObject`:

> The underlying problem is RSpec’s should syntax: for should to work properly, it must be defined on every object in the system… but RSpec does not own every object in the system and cannot ensure that it always works consistently.

### Asynchronous Testing

Testing asynchronous code with Specta and Expecta is amazingly well done. It's probably my favorite feature. Both Specta and Expecta support a different use case, which combined will cover all your asynchronous testing needs.

Let's take a look at Specta first:

```
it(@"does something asynchronously", ^AsyncBlock{
    [object doSomethingAsynchronously:^(BOOL wasDone) {
        expect(wasDone).to.beTruthy();
        done();
    }];
});
```

`AsyncBlock` is a macro that provides a block named done. You call this block whenever your test finishes. This can be anywhere between immediately or 10 seconds from now. After 10 seconds it is assumed done will not get called and your test fails. You can use this to test that some sort of callback will be called some time from now.

This also works on `before` blocks. For example to ensure that a view controller is presented before any expectations run:

```
before(^AsyncBlock{
    [_mainViewController presentViewController:_viewController animated:YES completion:done];
});
```

Be careful with this approach. If you're doing TTD or BDD you want your test suite to be fast. A 10 second timeout can significantly slow it down. The Specta approach is often useful in lower levels of the stack. For example imagine AFNetworking using this approach to verify that a completion block is called after a request finishes.

When you test higher up the stack you'll also want to test the outcome of the asynchronous callback. For example that the completion of a network request updates your UI:

```
it(@"sets the user's name when the user loads", ^{
    [_view.user load];
    expect(_view.nameLabel.text).will.equal(@"Ben Day");
});
```

This verifies that the `nameLabel`'s text property equals Ben Day within 1 second. The default timeout of 1 second can be changed using `[Expecta setAsynchronousTestTimeout:2]`.

In my experience the combination of these methods of asynchronous testing cover any use case you might have.

### Separation of concern

Specta itself is a test runner built on top of XCTest with a BDD-style DSL. Because it nicely separates concerns it does not force a particular matcher framework on you. The authors recommend you use Expecta but if you want you can also use XCTest or [OCHamcrest][] matchers. Of course you can else write [your](https://github.com/dblock/ios-snapshot-test-case-expecta) [own](https://github.com/klaaspieter/UISpecta).

[OCHamcrest]: https://github.com/hamcrest/OCHamcrest

### Mocking (and more about separation of concerns)

Initially separation of concern was what I disliked about Specta. Not in the literal sense, who doesn't like nicely separated concerns right? The reason I initially didn't switch from Kiwi to Specta was because Kiwi comes with great mocking built-in. In other words Kiwi mixes multiple concerns into the same framework while Specta doesn't. When I realized I wasn't switching because of something I actually liked about Specta I started looking for a new mocking framework.

My first pick was [OCMock][]. Mostly because it's recommend by Specta's authors. OCMock was sufficient while my test suite was still small, but as it grew it quickly became a burden. It's API doesn't blend very well with Specta's BDD style and it doesn't report test failures properly. OCMock reports test failures by raising exceptions. Exceptions often do not contain enough information for the test reporter to give you accurate line and file information. When you're working with multiple mocks in the same file it becomes very hard to figure out which one is failing.

[OCMock]: http://ocmock.org/

After a brief search for another mocking framework I settled on [OCMockito][] and I've been using it without complaints ever since. Take a look at the following spec:

```
it(@"has a dependency that does something", ^{
     _subject.dependency = mock([Dependency class]);
     [_subject doSomethingWithDependency];
     [verify(_subject.dependency) doSomething];
});
```

OCMockito's clever use of macros make it a very good match with Specta. It also correctly reports errors making it trivial to track down the exact location of a failure.

[OCMockito]: https://github.com/jonreid/OCMockito

### Wrapping up

Historically Objective-C developers don't have a very good track record when it comes to testing. If you take a look at a language like Ruby where testing is at the core of community you'll find that better tooling, frameworks and education is what drives new rubiests to adopt that mindset.

I think the introduction of tools like Cocoapods and frameworks like Specta and Expecta are the first steps in bringing that mindset to Objective-C. All we need now is more education.
