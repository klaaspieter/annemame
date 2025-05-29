---
title: Hour formatting with NSDateFormatter dateFormatFromTemplate
date: "2014-05-27T19:00:00.000+02:00"
---

**TLDR;** Using NSDateFormatter's `dateFormatFromTemplate:options:locale:` for 12/24 hours? Use "j" instead of "h" or "H" for the hour format.

Last week I started a fight with NSDateFormatter. I needed to format just the hour of an `NSDate`. Formatting hours is especially tricking because unlike any other date component, the same hour can be shown in two different formats, 12 hour with am/pm designator or 24 hour.

To generate the date format I'm using `NSDateFormatter`'s `dateFormatFromTemplate:options:locale:` class method. This was my first try:

```objc
[NSDateFormatter dateFormatFromTemplate:@"HH a" options:0 locale:[NSLocale currentLocale];
```

The template string uses 24 hour format but also includes the am/pm designator 'a'. HH stands for 0 prefixed 0-23 hours. I wasn't exactly sure how to use this method but my expectation was that it would be rewritten to "hh a" and "HH" for 12 and 24 hours respectively.

This appears works. On my phone (set to nl_NL and 24 hour time format), toggling the 12/24 hour setting would correctly change the generated format. In the simulator and on one of our test phones it did not. The test phone was set to 12 hour clock and it's locale was set to en_US, but `dateFromTemplate:options:locale:` always returned "HH" as the date format.

I changed the template to read `hh a`. This again appeared to work except on my phone. Which would now always format 12 hour time. I reversed the problem.

`NSDateFormatter` is documented to try to rewrite the format to match the 12/24 hour preference in the Settings app. My guess is that this is why toggling the preference appeared to work for phones that were set to the same locale as the template string I was passing in.

After googling and trying to comprehend the [Unicode Technical Standard](http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_Patterns) it finally clicked. I kept glossing over the last hour designator of which the first line of the description says:

> This is a special-purpose symbol. It must not occur in pattern or skeleton data.

My mind would read that it shouldn't be used in pattern data and move on. Unfortunately the next line says:

> Instead, it is reserved for use in skeletons passed to APIs doing flexible date pattern generation

Which is exactly the purpose of this NSDateFormatter API, just worded somewhat confusingly. Eventually the fix was to change the template line to:

```objc
[NSDateFormatter dateFormatFromTemplate:@"jj" options:0 locale:[NSLocale currentLocale];
```

and all was good in the world.
