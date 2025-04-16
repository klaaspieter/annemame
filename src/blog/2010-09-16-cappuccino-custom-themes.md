---
title: Cappuccino Custom Themes
date: '2010-09-16T19:17:00.000+02:00'
---

A while ago I wrote a blog post about [the basics of Cappuccino theming](http://www.annema.me/blog/post/the-basics-of-cappuccino-theming). Since then I've got a lot of questions about how to create fully customized themes.

The first step in building your own custom theme is to create a theme descriptor. If you've built Cappuccino [from source][Instructions] you can create one using the following command:

```
capp gen -t ThemeDescriptor --build -F BlendKit [Theme name]
```

If you haven't installed Cappuccino from source, you can [download][] a default theme descriptor.

[Instructions]: http://github.com/280north/cappuccino/wiki/Getting-and-Building-the-Source

[download]: http://dl.dropbox.com/u/3415875/Blog/Cappuccino%20Theming/ThemeDescriptor.zip

You should now have a folder with the theme descriptor file, a resources directory and a Jakefile. A theme descriptor also includes a handy showcase application which you can use to preview your theme. Running the showcase is simply a matter of opening `index.html` or `index-debug.html`.

The showcase by default isn't very helpful, it only has an ugly button. If you open the theme descriptor you'll see the `+ (CPButton)themedButton` class method. You can change the theme properties for a button by setting additional theme values in this method. How to change theme values is described in my previous [blog post][] about Cappuccino theming.

[blog post]: http://www.annema.me/blog/post/the-basics-of-cappuccino-theming

Unfortunately theme-able properties are not documented. You'll have to take a look at Aristo's theme descriptor or check the `+ (id)themeAttributes` method of a class and all of it's superclasses.

Theming another class is done by implementing another `+(<Class>)themed<Class>` method. If the class is initialized with a frame and some theme values it will automatically show in the theme showcase. Take a look at [Aristo's theme descriptor][] to see what you can do.

[Aristo's theme descriptor]: http://github.com/280north/cappuccino/blob/master/AppKit/Themes/Aristo/ThemeDescriptors.j

The next step is building your theme. You can do this by running `jake debug` or `jake install` inside your theme directory. The build process will take the resources and theme descriptor and build it into a theme blend. After the build is done, the theme blend can be found in: `Build/[Configuration]/[Theme name].blend>`. \[Configuration] is either Debug or Release, depending on the jake argument used.

The theme blend is what is needed to actually load the theme in your Cappuccino application. The easiest way to load the theme is by adding the following to your application's Info.plist:

```
:::XML
<key>CPDefaultTheme</key>
<string>[Theme name]</string>
```

This will automatically set the custom theme as the default theme for the application. This will override Aristo (Cappuccino's default theme) and set your theme as the default for the application.

If you load your application, you'll see there's an error; Cappuccino can't find your theme blend. This is because Cappuccino will look inside your application bundle's resource directory for the theme blend and it was built somewhere else. The easiest way to solve this is to symlink the theme blend inside the Resources directory. This also makes sure any changes to your theme are automatically applied in your application when you rebuild the theme.

As mentioned before the previously described method of loading a Theme will completely override Aristo. If you want to use Aristo in addition to your own theme you can load the theme blend manually. The following code shows how this is done:

```
:::Objective-J
- (void)applicationDidFinishLaunching:(CPNotification)aNotification
{
	var bundle = [CPBundle mainBundle],
	    blend = [[CPThemeBlend alloc] initWithContentsOfURL:
				 [bundle pathForResource:@"<Theme name>.blend"]];

	[blend loadWithDelegate:self];
}

- (void)blendDidFinishLoading:(CPThemeBlend)theBlend
{
	// Show your application and use your custom theme
}
```

When using this method it's advisable to show your application after the blend finished loading. This way you'll never have flashes when the custom theme loads.

After the blend is loaded you can apply it to any view:

```
var customTheme = [CPTheme themeNamed:<Theme name>],
     button = [CPButton buttonWithTitle:@"Custom themed button"];

[button setTheme:customTheme];
```

I've wrapped up both methods of theming into separate projects. Both can be downloaded [here][Download URL]. Please let me know if you have any questions in the [comments](#comment_form).

[Download URL]: http://dl.dropbox.com/u/3415875/Blog/Cappuccino%20Theming/Cappuccino%20Custom%20Themes.zip
