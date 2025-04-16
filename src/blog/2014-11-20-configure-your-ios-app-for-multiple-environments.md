---
layout: post
title: Configure your iOS app for multiple environments
date: '2014-11-20 19:50:00'
---

Two weeks ago I wrote a post about [cleaning up your application delegate with initializers](http://www.annema.me/clean-up-the-application-delegate-with-initializers). I eluded to a `Configuration` object in that post. I decided to make this two separate posts because they’re different concepts that happen to work together.

The Karma app has to run in 3 environments: Development, Pre-release and Production. We also have some secondary environments, like Test and Device, which are subsets of respectively Development and Production.

Each environment is different. In Development crashes are not reported and Facebook’s development environment is used for authentication. In production (read: App Store) crashes are reported and the app communicates with our production APIs. This requires connecting to different URLs and authenticating with different keys.

One solution, unfortunately used frequently, is preprocessor macros. When you create a project, Xcode [automatically configures](https://developer.apple.com/library/mac/technotes/tn2347/_index.html#//apple_ref/doc/uid/DTS40014516-CH1-THE_DEBUG_PREPROCESSOR_MACRO) a `DEBUG=1` preprocessor macro for Debug builds. The macro is not defined for release builds so it’s possible to target different environments:

    #if DEBUG
    NSString *const KPAThirdPartyServiceKey = @"debug123";
    #else
    NSString *const KPAThirdPartyServiceKey = @"release123";
    #endif

This is known as [conditional compilation](http://en.wikipedia.org/wiki/C_preprocessor#Conditional_compilation). The code in the `DEBUG` block will not be part of a Release build and vice versa. Meaning both environments run different code. This is great if you’re targeting different architectures, say ARM and Intel, because doing the same thing requires different APIs. 

It’s awful for configuring environment, because 1) it’s an unnecessary conditional (that doesn’t indent in Xcode) 2) you’re literally shipping code that’s different from what you use to debug. In this simple example it will likely never cause problems, but it’ll become more complicated over time. Consider what happens when introducing a third environment. As mentioned before, the Karma app has 3 primary environments and several subsets of those. Using conditional compilations, we would need several levels of nested conditionals to support every environment.

What we want is a way to automatically load different configurations for different environments. We’ll need 3 things to make this work:

1. An object to hold the configuration values
2. A way of differentiating between environments (without using conditional compilation and preferably no other type of conditional)
3. A system to load different configuration values for each environment

I’ve made an [example project](https://github.com/klaaspieter/configuration) available on Github that has these 3 things. Let’s go over them one by one.

# The Configuration Object

The [`Configuration`](https://github.com/klaaspieter/configuration/blob/master/Configuration/Configuration.m) object solves requirement one. It holds configuration values in a dictionary and makes them available through a `settingForKey:` method. The object also partially solves requirement 3 because it can populate itself by loading a plist. More on that later.

# Differentiating between environments

Before we can fully solve requirement 3 we first need a way of differentiating between environments. I’ve done this in the example project by creating different build configurations. In Xcode 6.1 you can find build configurations by clicking on the project in the Project Navigator then selecting the project again under “PROJECT” in the editor. From there go to the “Info” tab. You should see a “Configurations” section, which by default, has a Debug and Release configuration. In the example project I called them: Development, Staging and Production. You can create as many as needed and give them any name you see fit.

![Changing build configurations gif](http://i.imgur.com/ceNaKmy.gif)

For convenience I also created a scheme for each build configuration. This makes it easy to build for a certain environment by simply selecting it’s corresponding scheme.

# Loading different configurations per environment

Now that we have a way to differentiate between environments it’s time to discover how we can load a configuration for each. This is already partially solved by the `Configuration` object. In the `loadDefaults` method it will search for the `ConfigurationPlist` key in the Info.plist. In other words: all we need is a way to make this key have a different value for each environment.

When a value in the Info.plist is enclosed in $(), the key between () will be looked up in your build settings (I searched for documentation on this, but couldn’t find any). In the example project the `ConfigurationPlist` value is $(CONFIGURATION_PLIST). To make it work, we need to add a build setting called “CONFIGURATION_PLIST” and give it a different value for each build configuration.

To add a build setting, select the project in the Project Navigator, select the target (in the Example app it’s called “Configuration”) under “PROJECTS” and switch to the “Build Settings” tab. In this tab you can add more build settings by clicking the plus icon and selecting “Add User-Defined Setting” from the popup menu. Name it “CONFIGURATION_PLIST”. Now click the arrow on the left side, you’ll see that Xcode allows you to change the value for each build configuration. How you name these is up to you. I follow [Environment]-Config as a naming pattern.

![Adding custom build settings gif](http://i.imgur.com/BFwGPbG.gif)

The final step is to create the plists. If you look at the example project you’ll see there is one plist for each environment: Development-Config.plist, Staging-Config.plist and Production-Config.plist. I also added two keys: `environment` and `report_crashes`. These are just two examples, you can add any configuration options in these plists. 

All that’s left is to access your settings at runtime:

    [[Configuration defaultConfiguration] settingForKey:@“report_crashes”];

# Wrapping up

In the Karma app I combine this approach with the [Initializer pattern](http://www.annema.me/clean-up-the-application-delegate-with-initializers) I explained in my previous blog post. Each initializer is passed a Configuration object, allowing it to grab the settings it needs to initialize the portion of the app it’s responsible for.

It takes some setup, but you end up with an easy way of loading distinct settings per environment. Adding more environments takes a couple of steps, but it’s a lot easier than having to go through your code and update conditionals and hardcoded strings everywhere.

While writing this post I discovered [KZBootstrap](https://github.com/krzysztofzablocki/KZBootstrap#environments) attempts to solve the same problem. I haven’t looked at it in detail, but being able to change configurations at runtime is one thing it has over my solution. When it comes to using it I have to agree with Dave Verwer who had this to say about it in [issue 168](http://iosdevweekly.com/issues/168):

> However, before you jump in with both feet I'm not completely convinced that iOS projects actually need a bootstrap. There are some good recommendations here though so what I would recommend is to take a look at this, spend some time understanding it and then pick bits that work for you. Blindly using someone else's defaults is only going to lead to surprises down the line.

I’ve thought about open sourcing my approach, but haven’t figured out how to automate the Xcode setup. There is promise in [some](https://github.com/CocoaPods/cocoapods-plugins) of the [tools](https://github.com/CocoaPods/Xcodeproj) that power CocoaPods, but haven’t had the time yet to look into it.

I’m happy to see that more developer are trying to solve this problem. From my experience it’s something most of us run into  at some point. When I wrote my solution I couldn’t find anyone who’d shared their solution, forcing me to come up with my own.