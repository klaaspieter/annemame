---
title: The Basics of Cappuccino Theming
date: "2010-04-06T08:02:00.000+02:00"
---

This is the second post of a series of posts about Cappuccino where I explain the subjects I talked about during my [CocoaHeads Amsterdam](http://www.cocoaheads.nl) presentation. The first post can be found [here](http://www.annema.me/blog/post/objective-j-explained-brtoll-free-bridges).

Cappuccino and Cocoa have a lot of similarities, but there are some differences. Most prominent is probably Cappuccino's theming engine. Web developers are accustomed to a certain level of customization that Cocoa does not provide. The theming engine provides this freedom to Cappuccino developers.

The theming engine let's you customize any theme-able attribute of CPView. Every subclass of CPView can declare it's own theme-able attributes by implementing the `themeAttributes` class method and returning a CPDictionary with the attribute names as keys and their default value as values.

## Theme states

Before going into theming you'll have to know something about theme states. Basically every Cappuccino view has a theme state. The current theme state can be found by calling the `themeState` method on any view.

The `themeState` method itself is not extremely useful since you'll only get a unsigned integer back, it's up to you to find the actual theme state. Far more useful is the `currentValueForThemeAttribute:` method. This methods takes a string, the name of the theme-attribute, and returns it's current value.

Changing theme states is done through the `setThemeState:` and `unsetThemeState:` method. They both take a string with the state name or the CPThemeState itself as their only argument.

## Changing theme-attributes

Most (if not all) of the state changing is handled by Cappuccino. Unless you are creating a custom control, you won't need to touch any of the the above methods. Far more important is the `setValue:forThemeAttribute:inState:` method. Let's take a look at changing the left and right content inset of a CPButton:

```objc
[button setValue:CGInsetMake(0.0, 50.0, 0.0, 50.0) forThemeAttribute:@"content-inset"];
```

Since we don't want the text to jump around when changing states we don't explicitly name the state, this effectively sets a fallback value. When a control is in a state with no defined value, the control will fall back to using this value.

Let's also take a look at setting theme-attributes for different states:

```objc
[button setValue:buttonBezel forThemeAttribute:@"bezel-color" inState:CPThemeStateBordered];

[button setValue:highlightedButtonBezel forThemeAttribute:@"bezel-color" inState:CPThemeStateBordered | CPThemeStateHighlighted];

[button setValue:disabledButtonBezel forThemeAttribute:@"bezel-color" inState:CPThemeStateBordered | CPThemeStateDisabled];
```

Assuming the bezel colors are defined, the above sets the bezel color for the normal, highlighted and disabled state.

During my presentation I used an example of a large button to show how the theming engine works. All the code used in this post came from that example. The project can be downloaded [here](http://dl.dropbox.com/u/3415875/Blog/Cappuccino%20Theming/Theming%20Cappuccino%20-%20The%20Basics.zip).

These are the basics of the theming engine. In my own code I often use:

```objc
setValue:forThemeAttribute:inState:
```

to quickly change small details[^1]. I don't recommend creating your own, fully custom, themes this way. It will only result in a lot of clutter in your code. If you want to create your own theme, you should take a look at theme descriptors[^2].

The last thing I talked about during my CocoaHeads presentation is data availability. Cappuccino and Cocoa both assume data to be available when the application launches. I'll discuss this problem in more detail in the next, and last, post of the series.

[^1]: Like issues with text in a control with odd height, resulting in the text appearing a pixel off center.
[^2]: I tried to find a good post about theme descriptors to link to, but unfortunately I couldn't find one. If you know of one, I'd be happy to link to it.
