---
layout: post
title: 'Android adventures #3 - Testing'
date: '2014-04-02 17:14:00'
---

Due to an injury I had to suspend training for my first [half marathon][] for the remainder of the week. I found myself with some extra time yesterday morning. I decided to spend that time on trying to set up testing for the Karma Android app.

[half marathon]: http://www.nyrr.org/races-and-events/2014/nyrr-five-borough-series-brooklyn-half

Honestly testing on Android is about the same state as Objective-C when I started 5(?) years ago. At Karma we test most of our code (including our iOS app) but early on we made the decision not to test our Android app. Because of my inexperience with Android learning the platform and learning how to write test for it would've just taken too much time.

I've been doing Android for a couple of months now and felt more confident that I could figure it out. If you, like me this morning, have no idea where to get started I highly recommend [this article](http://rexstjohn.com/unit-testing-with-android-studio/). Using this article I got it working. I immediately started writing tests for components that most need it. 

The first thing I noticed is how slow tests are. Practicing BDD/TDD requires a fast test suite but the gradle build/test step takes quite some time on my state of the art MacBook Pro. This is with just one unit test, I can only imagine how slow it'll get when I get to the level of coverage that our iOS app has. Slow tests, in this case, are better than no tests so I patiently endured. 

The second unit test I wrote required a mock. I'm a big fan of [OCMockito](http://www.annema.me/why-i-prefer-testing-with-specta-expecta-and-ocmockito) for iOS and I decided to try [Mockito](https://code.google.com/p/mockito/). This is where things got hard. Googling gives me a lot of outdated and conflicting information. I'm assuming all the suggestions worked at some point in Android's Studio lifecycle but they sure as hell don't anymore.

Here are some of the things I tried:

- This answer on [StackOverflow](http://stackoverflow.com/a/16637755/1555903). It fails with an error that `instrumentTestCompile` doesn't exist.
- The [linked documentation](http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Testing) suggests using `androidTestCompile "org.mockito:mockito-core:1.9.5"`. This worked but adding the static import for mockito still failed.
- I believe this [Google Plus](https://plus.google.com/+AndroidDevelopers/posts/Xw8qbKRwMxx) post was linked in the last Android Weekly newsletter. It's a variation on the above and also didn't work.
- Tried following the [Gradle user guide](http://tools.android.com/tech-docs/new-build-system/user-guide). It constantly refers to things mentioned in previous chapters making it really hard to get just the information I need. I intend to read it at some point, but did not have the time yesterday morning.
- More googling found me yet another project from [Jake Wharton](https://github.com/JakeWharton/gradle-android-test-plugin). Unfortunately it's deprecated. There are successors I believe but I get the feeling that this is already part of Android Studio now?

Trying to combine different solutions from different blogs all stating that _theirs_ is the way to go took me a couple of hours and resulted in nothing.

I only just started Android but I consider the lack of good up-to-date articles a huge problem. This wasn't my first goose chase through Android blogs all recommending different things. I find the official Android documentation thorough in documenting specific APIs, but it often lacks recommended usage and best practices. When starting a new technology you need someone to tell you how it's supposed to be done. I was lucky to have some experienced developers advising me, but not every beginner has that luxury. 

On the bright side, I appreciate Apple's [very](https://developer.apple.com/library/ios/featuredarticles/ViewControllerPGforiPhoneOS/Introduction/Introduction.html) [thorough](https://developer.apple.com/library/Mac/documentation/Cocoa/Conceptual/KeyValueCoding/Articles/KeyValueCoding.html) [guides](https://developer.apple.com/library/ios/documentation/userexperience/conceptual/tableview_iphone/AboutTableViewsiPhone/AboutTableViewsiPhone.html) a lot more now.