---
title: Debugging Ember
date: '2013-01-12T15:30:00.000+01:00'
---

While building the [Karma customer dashboard][] I discovered several interesting ways to debug Ember apps. Some of these are my own, others I've taken from Tom Dale's excellent [debugging Ember talk][].

[Karma customer dashboard]: https://dashboard.yourkarma.com

[debugging Ember talk]: http://vimeo.com/37539737

# Observers

I don't need explicit observers often in production code but I do use them frequently for debugging. Adding an observer is very similar to a computed property:

		:::javascript
    propertyObserver: function() {
      // Called when the value of property changes
    }.observes('property');

I use this when some computed property down the line has an unexpected value. Add any logging or debugging code in the observer and it will tell you whether the property is changed as expected or not.

# toString

Ember does some very cool stuff to give you useful string representations of your objects. However by default modern browsers will show you the object representation. While this is often useful I find myself in situations where I just want to know what kind kind of object I'm looking at.

One option is to call toString on the property like so:

		:::javascript
    applicationController.toString(); // "<App.ApplicationController:ember2366>"

Another way that is less typing is to append "" like so:

		:::javascript
		applicationController + "" // "<App.ApplicationController:ember2366>"

# Handlebars

{% raw %}
Handlebars has two convenient helpers to aid in debugging. `{{log path.to.value}}` and `{{debugger}}` respectively log the value of the path or add a debugger statement at that location in your template.
{% endraw %}

# forEach

It can be quite annoying to have to keep stepping into `forEach` calls. Set a breakpoint inside your callback function and hit “continue”. If the array is not empty the debugger will immediately jump to your callback function. Note that the same works for any other callback as well.

[Yehuda](http://yehudakatz.com) adds that in Chrome you can also right click the line number and click “Continue to here”.

And that's it. Tom also talks about some more generic javascript debugging techniques so I encourage you to watch it. If you have any debugging techniques I missed let me know.
