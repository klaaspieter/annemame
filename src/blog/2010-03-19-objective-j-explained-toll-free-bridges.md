---
title: "Objective-J Explained: Toll-Free Bridges"
date: "2010-03-19T22:34:00.000+01:00"
---

Last week I gave a talk on the [Cappuccino](http://www.cappuccino.org) frameworks during a [Cocoaheads Amsterdam](http://www.cocoaheads.nl) meeting. This post is the first in a series in which I'll explain several of the subjects I talked about during my presentation. I didn't have a lot of slides and they won't make much sense without explanation but for those that are interested you can download them [here](http://dl.dropbox.com/u/3415875/Blog/Objective-J%20Explained/Cocoaheads%20Cappuccino.key). All of the examples used in this post can be downloaded [here](http://dl.dropbox.com/u/3415875/Blog/Objective-J%20Explained/Objective-J-Explained.zip).

I'm going to start of this series at the basis of the Cappuccino framework, Javascript. In the end Cappuccino and Objective-J are build on top of this one language and that allows for some pretty cool things. Cool things which will look familiar to Cocoa developers and cool things that can make the transition for Javascript developers easier.

The following code shows an example:

```objc
// 1 Declare a javascript array
var array = [];
CPLog.debug(@"Step 1: %@", array);
// >

// 2 Call an Objective-J method on it
[array addObject:@"first object"];
CPLog.debug(@"Step 2: %@", array);
// > first object

// 3 Call a Javascript function
array.push(@"SECOND OBJECT");
CPLog.debug(@"Step 3: %@", array);
// > first object,SECOND OBJECT

// 4 Mix it up
array[0] === [array objectAtIndex:0];
CPLog.debug(@"Step 4: %@", array[0] === [array objectAtIndex:0]);
// > true

// 5 Do something wacky
array[[array indexOfObject:@"SECOND OBJECT"]] = [array objectAtIndex:[array indexOfObject:@"SECOND OBJECT"]].toLowerCase();
CPLog.debug(@"Step 5: %@", array);
// > first object,second object
```

All of the above code is perfectly valid. This is an example of a toll-free bridge. A toll-free bridged object is both an instance of a regular Javascript and an instance of an Objective-J object. In Objective-J CPArray and CPString are toll-free bridged to their Javascript equivalents.

As you see you can mix and match both syntaxes as you feel fit. **A word of caution**. The above example (especially step 5) is contrived, I do not recommend mixing syntax like this in production code since it can make your code very hard to read and maintain. Personally I only use Javascript literal array notation to create arrays because it's shorter and more readable than `[CPArray array]`. I also use regular Javascript objects in stead of CPDictionaries because CPDictionary is _not_ toll-free bridged with the Javascript object.

```objc
// 1. Create a regular javascript object using literal notation
var object = {};
// > {}

// 2. Add a key value pair to it using javascript
object['key1'] = 'value1';
// > {"key1": "value1"}

// 3. Attempt to add another key value pair using Objective-J
[object setValue:@"value2" forKey:@"key2"];
// > TypeError: Result of expression 'isa' [undefined] is not an object.
```

If you prefer using CPDictionaries over Javascript objects you can transform it into a CPDictionary like so:

```objc
// 1. Create the object from the previous example
var object = {@"key1":@"value1"}
// > {"key1": "value1"}

// 2. Make a CPDictionary out of it
var dictionary = [CPDictionary dictionaryWithJSObject:object recursively:YES];
// > {"key1": "value1"}

// 3. Attempt to add the key value pair using Objective-J again
[dictionary setValue:@"value2" forKey:@"key2"];
// > {"key1": "value1", "key2": "value2"}
```

I personally never do this because, to me:

```objc
{@"key1":@"value1", @"key2":@"value2"}
```

is far more readable than:

```objc
[CPDictionary dictionaryWithObjectsAndKeys:
    @"value1", @"key1", @"value2", @"key2"]
```

As you've seen, Objective-J and Javascript differ in syntax a lot, but are still very much the same thing.

As I've said earlier, this post is the start of a series of posts about Cappuccino. The next one will be about Theming, make sure you don't miss it by [subscribing](feed://feeds.feedburner.com/annemame) to my feed or [following](http://www.twitter.com/klaaspieter/) me on Twitter.
