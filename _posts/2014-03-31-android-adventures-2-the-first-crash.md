---
layout: post
title: 'Android adventures #2 - The first crash'
date: '2014-03-31 17:12:00'
---

Last week we introduced bug fix monday's at Karma. The goal is to have a dedicated day to fix bugs that we usually don't have time for. Because, you know, features are better.

In Android I've had a crasher for a while that falls into this category. With every release I classify it as a nice to have and end up not getting around to it. On the first bug fix monday I decided to tackle it. Problem is I have no clue why it happens.

Luckily the code was also in need of a refactor. Without a reliable way to reproduce I hope the refactor fixed the problem, but if it doesn't I found some useful features in Crashlytics to help with debugging.

First, instead of crashing I catch the NullPointerException causing the crash and use [`Crashlytics.logException(e);`](http://support.crashlytics.com/knowledgebase/articles/202805-logging-caught-exceptions) to send it as a non-fatal crash. This gives me the same information as I currently have, but without affecting the user. 

I dislike catching unchecked exceptions though because I could be hiding a different problem too. In order to actually fix (instead of hide) the issue I'll need more information. 

My assumption is that the crasher is related to the Fragment lifecycle thus I want to know more about it's state when the crash happens. The `Fragment` class has method called [`dump`](http://developer.android.com/reference/android/app/Fragment.html#dump(java.lang.String, java.io.FileDescriptor, java.io.PrintWriter, java.lang.String[])) but it's usage is a bit obscure to a beginning Java developer like myself. It took some googling and trial and error but this is the working solution:

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    dump("", null, new PrintWriter(outputStream, true), null);
    Crashlytics.log(Log.INFO, TAG, outputStream.toString());

This writes information about fragment to an output stream which is then logged as a string. Crashlytics will write this to LogCat and also [send it with the crash report](http://support.crashlytics.com/knowledgebase/articles/120066-how-do-i-use-logging).

Hopefully the crasher has been fixed but if it isn't I'll definitely have more data to diagnose it.