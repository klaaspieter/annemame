---
title: Clean up the application delegate with initializers
date: "2014-10-30T17:48:00.000+01:00"
---

The application delegate has a tendency to become unwieldy. It provides a ton of callbacks to respond to about every possible state change of your app. The method that grows quickest is usually `applicationDidFinishLaunching:withOptions:`<sup>\[citation needed]</sup>. From preloading content for a better experience, to configuration third party services, it all tends to end up in that same method.

I've been using the concepts of initializers recently. An initializer is an object that conforms to the `Initializer` protocol with just one required method: `performWithConfiguration:`.

You might wonder what the configuration argument is, but for now I want to focus on the concept of initializers. For the purpose of this blog post it is sufficient to think of the configuration object as a dictionary that contains configuration options. For example: keys for third party services, or the log level.

Let's take a look at an initializer implementation. This is the initializer I use to configure HockeyApp in the [Karma app][].

[Karma app]: https://itunes.apple.com/us/app/karma-wifi/id673069729?ls=1&mt=8

```objc
  - (void)performWithConfiguration:(id<Configuration>)configuration;
{
    if (![configuration settingForKey:HockeyAppIdentifierKey]) {
        DDLogWarn(@"No Hockey Identifier in configuration: %@", configuration);
        return;
    }

    BITHockeyManager *manager = [BITHockeyManager sharedHockeyManager];
    id delegate = [UIApplication sharedApplication].delegate;
    [manager configureWithIdentifier:[configuration settingForKey:HockeyAppIdentifierKey] delegate:delegate];
    manager.disableCrashManager = [[configuration settingForKey:HockeyAppCrashesDisabledKey] boolValue];
    manager.crashManager.crashManagerStatus = BITCrashManagerStatusAutoSend;
    [manager.authenticator authenticateInstallation];
    [manager startManager];
}
```

Initializers aren't always about third party services. The following initializer preloads the store whenever the app launches. Notice that it completely ignores the configuration argument:

```objc
@implementation StoreInitializer

- (void)performWithConfiguration:(id<Configuration>)configuration;
{
    [[ProductFetcher sharedFetcher] fetch];
}

- (BOOL)shouldPerformWhenApplicationEntersForeground;
{
    return YES;
}

@end
```

This initializer also implements the `shouldPerformWhenApplicationEntersForeground` optional method. This method allows initializers to let the application delegate know they should also be run when the application enters the foreground.

Now all that is left is running the initializers every time the app launches. In your app delegate simply add the following to `application:didFinishLaunchingWithOptions:`:

```objc
[self.initializers makeObjectsPerformSelector:@selector(performWithConfiguration:) withObject:[Configuration defaultConfiguration]];
```

You can run initializers when the application enters the foreground by adding this to the `applicationWillEnterForeground:` method:

```objc
[self.initializers enumerateObjectsUsingBlock:^(id<Initializer> initializer, NSUInteger idx, BOOL *stop) {
    if ([initializer respondsToSelector:@selector(shouldPerformWhenApplicationEntersForeground)]
        && [initializer shouldPerformWhenApplicationEntersForeground]) {
        [initializer performWithConfiguration:[Configuration defaultConfiguration]];
    }
}];
```

In both examples `self.initializers` is an array of initializers. In the Karma app the property is implemented like this:

```objc
  - (NSArray *)initializers;
{
    if (!_initializers) {
        _initializers = @[
            [[LoggingInitializer alloc] init],
            [[HockeyInitializer alloc] init],
            [[WontonInitializer alloc] init],
            [[FacebookInitializer alloc] init],
            [[StoryboardInitializer alloc] init],
            [[StoreInitializer alloc] init],,
            [[APNInitializer alloc] init]
        ];
    }

    return _initializers;
}
```

By encapsulating initialization logic into it's own object you can keep the application delegate just that much cleaner. If by this point you're wondering what that configuration argument really is. Be patient. That will be the subject of a next post.
