---
title: "Android adventures #1 — Perform task on launch"
date: "2014-03-27T17:54:00.000+01:00"
---

I'm going to try and apply the [Brent Simmons][] approach to Android development. This is the first installment.

I need a way to do something when my Android app is launched. Most Google results I find are about getting notified when another app launches. I'm just interested in when my app launches because I need to load the user's authorization token from disk and create the session.

I realize that most of my readers probably do iOS so let me explain why this is hard. On iOS there is the AppDelegate. Whenever your app launches that's where you do these kinds of common setup. Android apps consists of 1 or more Activities. Every activity is a completely decoupled component that can be launched separately. In other words when the StoreActivity opens there is no guarantee that the MainActivity or any other activity was started before that. In a way you can see Android activities as the AppDelegate and a ViewController merged into the same thing.

Back to the problem at hand. _A_ solution would be to use an abstract superclass for every activity and have that manage creating the session in `onCreate:`. I dislike this because what to do when I need a [`ListActivity`](http://developer.android.com/reference/android/app/ListActivity.html). I can't dynamically change the superclass of a built-in activity (Technically I probably could, it just sounds like a bad idea). Another reason is that I already have an abstract superclass. Every activity in the [Karma app][] needs to monitor the hotspot status and update the background color accordingly. Now I would need a `AbstractHotspotActivity` and a `AbstractSessionActivity` which inherits from that? The other way around wouldn't work because not _every_ activity can be launched without going through the MainActivity first. [Mixins](http://www.tutorialspoint.com/ruby/ruby_modules.htm) where are you when I need you?

[Karma app]: https://play.google.com/store/apps/details?id=com.yourkarma.android

Another solution is to subclass Application and setup the session there. [Experienced Android developers][Kevin's blog] tell me the Application methods are guaranteed to be called before anything else in your application. I can't explain it, but I also dislike this approach. It might be because when I started doing iOS (a long time ago) it was acceptable to put global state on the AppDelegate so that you can reach it using: `UIApplication sharedApplication].delegate.someProperty`. In the Android community subclassing Application is an [acceptable solution](http://stackoverflow.com/a/708317/1555903) for the same thing. I suspect my iOS attuned nose is just picking up the stale smell of buried corpses.

[Kevin's blog]: http://kevinthebigapple.tumblr.com/

Unfortunately I haven't found another solution so I'm going to choose the lesser of two evils here. I'm going to subclass Application and deal with it. Chances are future-me will have to write another post about this. Future-me, if you're reading this, deal with it.

[Brent Simmons]: http://inessential.com/
