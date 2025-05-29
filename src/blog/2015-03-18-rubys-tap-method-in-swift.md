---
title: Ruby's tap method in Swift
date: "2015-03-18T13:38:00.000+01:00"
---

Ruby has a nice method called `tap`, which I wanted to try and port to Swift. To learn what it does, let's take a look at [Ruby's documentation](http://ruby-doc.org/core-2.2.0/Object.html#method-i-tap):

> Yields self to the block, and then returns self. The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.

Yeah, right. I don't really know what that means. Googling yields (no pun intended) many contrived examples like these:

```ruby
[1, 2, 3, 4].tap &:reverse! # [4, 3, 2, 1]
```

In Swift the same can be written as:

```swift
tap([1, 2, 3, 4], reverse) // [4, 3, 2, 1]
```

A less contrived example would be:

```ruby
User.new.tap do |user|
    user.name = "Yukihiro Matsumoto"
    user.known_for = "Ruby"
end
```

In the latter case tap is acting as a sort of [improptu builder](http://www.annema.me/the-builder-pattern-in-swift). In Swift:

```swift
tap(user) {
    $0.name = "Chris Lattner"
    $0.knownFor = "Swift"
}
```

Note that the previous example requires every property of the user to be mutable (`var`). This example should only be seen as a comparison to Ruby. Please don't do this in your actual code unless you absolutely have to.

That said, we've established a public API, it's time to start implementing. If you want to follow along; I've made a [playground available](https://gist.github.com/klaaspieter/9d8ce4485007fcb973b7).

In the Ruby source [tap](https://github.com/ruby/ruby/blob/e28c3d5df4f5abc83e0d2de34e7ebf675c96a307/object.c#L684-L689) is implemented like so:

```c
VALUE
rb_obj_tap(VALUE obj)
{
    rb_yield(obj);
    return obj;
}
```

Translating that to actual Ruby:

```ruby
class Object
  def tap
    yield self
    self
  end
end
```

My first attempt was a copy of Ruby's implementation, but in a global function. I'm not a huge fan of the global functions in Swift, but it works out nicely because we won't have to extend any existing objects.

```swift
func tap(object: AnyObject, block: (AnyObject) -> ()) -> AnyObject {
    block(object)
    return object
}
```

Great, we threw out all type safety in an attempt to be as dynamic as Ruby. It also doesn't compile.

Let's introduce some generics:

```swift
func tap<A>(var object: A, block: (inout A) -> ()) -> A {
    block(&object)
    return object
}
```

This does compile, and it's type safe to boot:

```swift
tap([1, 2, 3], reverseInPlace)
```

Note that Swift doesn't have a built-in reverse in place method like Ruby does. If you're interested in what that looks like; take a look at [the gist](https://gist.github.com/klaaspieter/9d8ce4485007fcb973b7).

A less contrived example would be:

```swift
tap(NSDateComponents()) {
    $0.day = 18
    $0.month = 06
    $0.year = 1986
    $0.calendar = NSCalendar.currentCalendar()
}.date
```

If you got this far, you might be wondering: do we need a `tap` function? The answer is: maybe. In Objective-C we could use [GCC code block evaluation](http://www.annema.me/builder-and-gcc-code-block-evaluation) to similar effect. In Swift we should be able to write:

```swift
let date = {
    let c = NSDateComponents()
    c.day = 18
    c.month = 06
    c.year = 1986
    c.calendar = NSCalendar.currentCalendar()
    return c
}().date
```

Unfortunately this confuses the type system. It is unable to infer the return type of the block. Instead we have to write:

```swift
let date = { () -> NSDateComponents in
    let c = NSDateComponents()
    c.day = 18
    c.month = 06
    c.year = 1986
    c.calendar = NSCalendar.currentCalendar()
    return c
}().date
```

For now, `tap` is a safer and arguably more readable alternative but it's likely that the Swift compiler will solve the entire issue more elegantly in the future.

**Update**: Several people on Twitter have pointed out to me that my implementation wasn't an exact reproduction. The post has been updated with a better implementation. If you're interested in my incorrect implementations take a look at the revision history of [the gist](https://gist.github.com/klaaspieter/9d8ce4485007fcb973b7/revisions).
