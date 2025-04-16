---
title: Announcing autonib2cib
date: '2011-03-05T20:20:00.000+01:00'
---

Some time ago I posted a [gist][] for a command line utility that automatically nib2cibs changed nibs. During the weekend I've rewritten the utility, making it more reliable with newly created nibs and nibs containing resources.

[gist]: https://gist.github.com/799190

[github repo]: https://github.com/klaaspieter/autonib2cib

I've also moved the code (all 100 lines of it) from the gist to it's own [github repo][]. If you have a feature request or find a bug, please [create an issue][] or even better, a [pull request][].

[create an issue]: https://github.com/klaaspieter/autonib2cib/issues

[pull request]: https://github.com/klaaspieter/autonib2cib/pull/new/master

Take a look at the [README][] for installation instructions. After installing you can start monitoring your nibs by running `autonib2cib <resource directory>` in your terminal.

[README]: https://github.com/klaaspieter/autonib2cib#readme

Cappuccino has been very successful at preserving the customary 'code and refresh' workflow for web developers. However, as any developer with more than a handful of cibs knows, having to manually run nib2cib breaks this workflow. Autonib2cib will solve this problem by automating the nib2cib process.
