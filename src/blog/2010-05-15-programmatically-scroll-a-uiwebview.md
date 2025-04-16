---
layout: post
title: Programmatically Scroll a UIWebView
date: '2010-05-15 06:33:00'
---

Ever wanted to scroll a UIWebView programmatically on the iPad or iPhone? Unfortunately Apple doesn't have a public API to do this, but there is a way. A UIWebView can execute any arbitrary javascript with `stringByEvaluatingJavaScriptFromString:`.

Using this method we can easily scroll a web view like so:
	
	[webView stringByEvaluatingJavaScriptFromString:@"window.scrollTo(0.0, 100.0)"];

It's also possible to save the scroll state of the web view through javascript:

	CGFloat xOffset = [[[self webView] stringByEvaluatingJavaScriptFromString:@"pageXOffset"] floatValue];
	CGFloat yOffset = [[[self webView] stringByEvaluatingJavaScriptFromString:@"pageYOffset"] floatValue];

I've used and tested both of these methods and haven't found any bugs or weird issues. I've filed radar bug 8184256: No API for programmatically scrolling / zooming a UIWebView. It has been marked as a duplicate of radar bug 5912563.