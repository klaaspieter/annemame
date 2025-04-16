---
title: Problems with iOS Push Notifications
date: '2014-02-07T03:34:00.000+01:00'
---

Push notifications are a great way to keep users engaged with your iPhone app. The amount of applications that support them led me to conclude that supporting push notification must be trivial. After implementing them myself I'm left with the realization that it is most definitely not.

Consider the [Karma iOS app][], we have a simple use case, when a push notification is delivered the user needs to be presented the correct screen. For example when a user opens a 'balance' notification, the app should open in the store.

[Karma iOS app]: https://itunes.apple.com/us/app/id673069729?mt=8

Starting at the beginning let's take a look at the code paths when a push notification is delivered. There are two `UIApplicationDelegate` methods that need to be implemented. One for when the app is running and one for when it's not.

When the app is not running a push notification will be delivered to this method:

```
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
    if (options[UIApplicationRemoteNotificationKey]) {
        // Handle the notification
    }
}
```

The `launchOptions` dictionary will contain the information about your push notification. This key won't exist if your app was launched in another way.

When your app is already running you need to handle incoming notifications differently:

```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)options;
{
    // Handle the notification
}
```

Unfortunately we're not done yet. A running app can be running in 3 different modes: `UIApplicationStateActive`, `UIApplicationStateInactive` and `UIApplicationStateBackground`. When the application state is in `UIApplicationStateActive` the user is not automatically notified of the push notification and is likely interacting with the app. In the Karma case where we want to show a particular screen we cannot rip a user out of his workflow. The solution:

```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)options;
{
    if (application.applicationState != UIApplicationStateActive) {
        // Handle the notification
    }
}
```

That's not 1, not 2, but 3 possible code paths (the conditional technically makes it 4, but we're not using else or doing anything after it) of which 2 have duplicate code. All that and we still haven't really done anything. What boggles my mind is that *every* iOS developer implementing push notifications has to write this code every time push support is added to an app.

Let's fix the duplicate code by introducing a class named `RemoteNotificationHandler`:

```
@interface RemoteNotificationHandler
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification;
@end
```

Wait, you just moved the method to a different object? Yep! How is that going to solve duplicate code? Well, take a look at the  AppDelegate:

```
- (void)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)options;
{
    if (options[UIApplicationRemoteNotificationKey]) {
        [self.remoteNotificationHandler application:application didReceiveRemoteNotification:options[UIApplicationRemoteNotificationKey];
    }
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)options;
{
    [self.remoteNotificationHandler application:application didReceiveRemoteNotification:options[UIApplicationRemoteNotificationKey];
}
```

There is still some duplicate code, but at least we moved the bulk of handling the notification to an isolated place that can be independently tested. Note that the check for `application.applicationState` is gone. Now that we have an isolated object dealing with notifications this responsibility belongs there.

Honestly I wish Apple would split the `UIApplicationDelegate` protocol up into [different protocols](https://github.com/JaviSoto/JSDecoupledAppDelegate). That way I don't have to spend so much time keeping my AppDelegate short and readable. Something like `application.remoteNotificationDelegate = [[RemoteNotificationHandler alloc] init]` would be perfect ([Radar #15940986](https://bugreport.apple.com)). Splitting the delegate into smaller objects also means classes like the `RemoteNotificationHandler` aren't needed anymore because the delegate objects can be tested independently from the main AppDelegate.

Back to the topic at hand. Over 600 words and we haven't done anything to solve the initial use case; routing the user to the correct screen in response to a push notification.

To make the problem even more interesting. In the Karma app we didn't simply require the user to be routed to a particular screen. The user needs to be routed to the relevant place in the app as if he had navigated there using the UI. We didn't want to present a modal sheet because it means the same place in the UI can be reached in more than one way. This is not only confusing to the user it also convolutes the code because the same view controller can be presented in different situations.

Enough context, let's begin implementing the `RemoteNotificationHandler`:

```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification;
{
    if (application.applicationState == UIApplicationStateActive) {
        return;
    }

    // We'll do more here, eventually
}
```

Before we do anything else we need to know if the user is currently interacting with the app. If so, we're going to do nothing with the notification. We deemed this sufficient for the Karma app, if you want to simulate the iOS notification bar there are [plenty of libraries](http://cocoapods.org/?q=notification) out there.

Next we'll show the appropriate view controller. The next example is storyboard specific. It also uses [storyboard convenience](https://github.com/klaaspieter/KPAStoryboardConvenience) library because, having written it myself, I like using it:

```
    - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification;
{
			// Application state != Active

			NSString *segueIdentifier = [UIStoryboard segueIdentifierForClass:[GuestViewController class]];
			[application.rootViewController performSegue:segueIdentifier];
}
```

Ok, this works! Sometimes. We ask the rootViewController of the application's key window to present the `GuestViewController` for us. This works if your storyboard's rootViewController has a segue called `GuestViewControllerSegue`. If the view controller responsible for presenting the guest screen is deeper down into your view controller stack this approach will quickly turn into a mess of  `rootViewController.presentedViewController.topViewController`. This approach will also break when the rootViewController is already presenting a different view controller.

I dislike this approach because it's a clear [Law of Demeter](http://en.wikipedia.org/wiki/Law_of_Demeter) violation. Our `RemoteNotificationHelper` has to know about the structure of UIApplication, UIWindow and the rootViewController. If you ever decide to move things around in your app this will most definitely break. Our remote notification handler shouldn't know anything about UIWindow or UIViewController, but due to the isolated nature of view controllers this seems the only method that always works.

In my attempts to make this better I tried two other methods with varying success; using the responder chain and `NSNotification`. These both are conceptually better solutions because the part of the application interested in the remote notification gets a chance to handle it. Unfortunately the responder chain approach doesn't work because there is no guarantee that the responsible part is participating in the responder chain when the push notification is received. The `NSNotification` approach only works if the handler of the notification is guaranteed to be in memory. If it isn't, the push notification will not be delivered. Another disadvantage of the `NSNotification` approach is that a component cannot mark a notification as handled. You can easily get into a situation where multiple parts of your app are doing conflicting things in response to the same push notification.

In the Karma app I eventually went with the `NSNotification` approach. I know that the receiver of the notification is always in memory making this approach viable. It also nicely decouples receiving and handling the push notification, making it trivial to test both.

I've long doubted wether to post this blog post or not. The entire process of supporting push notifications seems too convoluted to be true and even now, while writing this, I feel like I must be missing something. If that is the case than please [tell me](https://twitter.com/klaaspieter). If not then this will serve as an indication to others. No, you are not stupid!
