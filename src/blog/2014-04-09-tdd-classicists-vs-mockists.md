---
layout: post
title: TDD - Classicists vs Mockists
date: '2014-04-09 17:26:00'
---

A while ago I reread Martin Fowler's classic [mocks aren't stubs essay][]. He does a great job of explaining the different schools of TDD. In summary it basically comes down to classicists, those that build the system from business models up and mockists who build the system from the UI down mocking lower level components that haven't been build yet.

[mocks aren't stubs essay]: http://martinfowler.com/articles/mocksArentStubs.html

The essay got me thinking about which school I belong too. I lean to the mockist side of things, but I think it's dangerous to separate ourselves between being purely mockist or purely classicist. You probably prefer one over the other but you should use whichever best solves your problem.

For example in the Karma apps we have a store where customers can buy gigabytes. When the store loads I want to verify that the buy button is displaying the price formatted as US dollars. One way of verifying this behavior is by stubbing the formatter to return a static response. In this case I consider that an implementation detail. Instead I verify that the button title is what I expect. For example the button title for a product costing $14 should be formatted as $14.00 if the locale is en-US and the currency is dollars. It should read $ 14,00 when the locale is nl-NL and the currency is dollars. This way I not only verify that the formatter is called, but also that the formatter is configured correctly.

When testing what happens after products load I _would_ use a mock (actually I would use a fake, more on that later). I don't want my tests to hit the actual API because it can randomly fail and makes it complicated to test both success and failure cases. Instead I'd rather stub out the API abstraction and have it return what I expect.

The problem with stubbing asynchronous code is that you need to use a [spy](https://github.com/jonreid/OCMockito#capturing-arguments-for-further-assertions) to get access to the success and error callbacks. I haven't seen any framework, in any language, that doesn't make this process convoluted. In reality I'm much more likely to use a [fake implementation](https://github.com/klaaspieter/APIClient/blob/master/Specs/APITestHTTPClient.m#L39) of the API abstraction. A fake will save the callbacks internally when products are requested. After my expectations are set up, I tell the fake to either [fail](https://github.com/klaaspieter/APIClient/blob/master/Specs/APITestHTTPClient.m#L101) or [succeed](https://github.com/klaaspieter/APIClient/blob/master/Specs/APITestHTTPClient.m#L77).

With this approach the tests never need access to the callbacks. Fakes do introduce more, potentially buggy, code in your test suite. As long as you keep your fakes as simple as possible this should never become a major problem. Furthermore fakes, unlike real APIs, will never randomly feel (unless you use threading, luck that with good).	

I like Martin's essay (seriously, read it, now!) but I think it should be made more apparent that there is no one size fits all solution. You're not a classicist or a mockist. You might prefer one over the other, but you have to assess the problem and pick the right solution.