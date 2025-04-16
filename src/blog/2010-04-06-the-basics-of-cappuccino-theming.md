---
title: The Basics of Cappuccino Theming
date: '2010-04-06T08:02:00.000+02:00'
---

<p>This is the second post of a series of posts about Cappuccino where I explain the subjects I talked about during my <a href="http://www.cocoaheads.nl">CocoaHeads Amsterdam</a> presentation. The first post can be found <a href="http://www.annema.me/blog/post/objective-j-explained-brtoll-free-bridges">here</a>.</p>
<p>Cappuccino and Cocoa have a lot of similarities, but there are some differences. Most prominent is probably Cappuccino's theming engine. Web developers are accustomed to a certain level of customization that Cocoa does not provide. The theming engine provides this freedom to Cappuccino developers. </p>
<p>The theming engine let's you customize any theme-able attribute of CPView. Every subclass of CPView can declare it's own theme-able attributes by implementing the <code>themeAttributes</code> class method and returning a CPDictionary with the attribute names as keys and their default value as values.</p>
<h3>Theme states</h3>
<p>Before going into theming you'll have to know something about theme states. Basically every Cappuccino view has a theme state. The current theme state can be found by calling the <code>themeState</code> method on any view.</p>
<p>The <code>themeState</code> method itself is not extremely useful since you'll only get a unsigned integer back, it's up to you to find the actual theme state. Far more useful is the <code>currentValueForThemeAttribute:</code> method. This methods takes a string, the name of the theme-attribute, and returns it's current value.</p>
<p>Changing theme states is done through the <code>setThemeState:</code> and <code>unsetThemeState:</code> method. They both take a string with the state name or the CPThemeState itself as their only argument.</p>
<h3>Changing theme-attributes</h3>
<p>Most (if not all) of the state changing is handled by Cappuccino. Unless you are creating a custom control, you won't need to touch any of the the above methods. Far more important is the <code>setValue:forThemeAttribute:inState:</code> method. Let's take a look at changing the left and right content inset of a CPButton:</p>
<div class="codehilite"><pre><span class="p">[</span><span class="n">button</span> <span class="n">setValue</span><span class="o">:</span><span class="nf">CGInsetMake</span><span class="p">(</span><span class="mf">0.0</span><span class="p">,</span> <span class="mf">50.0</span><span class="p">,</span> <span class="mf">0.0</span><span class="p">,</span> <span class="mf">50.0</span><span class="p">)</span> <span class="n">forThemeAttribute</span><span class="o">:</span><span class="s">@&quot;content-inset&quot;</span><span class="p">];</span>
</pre></div>

<p>Since we don't want the text to jump around when changing states we don't explicitly name the state, this effectively sets a fallback value. When a control is in a state with no defined value, the control will fall back to using this value. </p>
<p>Let's also take a look at setting theme-attributes for different states:</p>
<div class="codehilite"><pre><span class="p">[</span><span class="n">button</span> <span class="n">setValue</span><span class="o">:</span><span class="n">buttonBezel</span> <span class="n">forThemeAttribute</span><span class="o">:</span><span class="s">@&quot;bezel-color&quot;</span> <span class="n">inState</span><span class="o">:</span><span class="n">CPThemeStateBordered</span><span class="p">];</span>

<span class="p">\[</span><span class="n">button</span> <span class="n">setValue</span><span class="o">:</span><span class="n">highlightedButtonBezel</span> <span class="n">forThemeAttribute</span><span class="o">:</span><span class="s">@"bezel-color"</span> <span class="n">inState</span><span class="o">:</span><span class="n">CPThemeStateBordered</span> <span class="o">|</span> <span class="n">CPThemeStateHighlighted</span><span class="p">];</span>

<span class="p">\[</span><span class="n">button</span> <span class="n">setValue</span><span class="o">:</span><span class="n">disabledButtonBezel</span> <span class="n">forThemeAttribute</span><span class="o">:</span><span class="s">@"bezel-color"</span> <span class="n">inState</span><span class="o">:</span><span class="n">CPThemeStateBordered</span> <span class="o">|</span> <span class="n">CPThemeStateDisabled</span><span class="p">];</span> </pre></div>

<p>Assuming the bezel colors are defined, the above sets the bezel color for the normal, highlighted and disabled state.</p>
<p>During my presentation I used an example of a large button to show how the theming engine works. All the code used in this post came from that example. The project can be downloaded <a href="http://dl.dropbox.com/u/3415875/Blog/Cappuccino%20Theming/Theming%20Cappuccino%20-%20The%20Basics.zip">here</a>.</p>
<p>These are the basics of the theming engine. In my own code I often use:</p>
<div class="codehilite"><pre><span class="n">setValue</span><span class="o">:</span><span class="n">forThemeAttribute</span><span class="o">:</span><span class="n">inState</span><span class="o">:</span>
</pre></div>

<p>to quickly change small details<sup id="fnref:1"><a href="#fn:1" rel="footnote">1</a></sup>. I don't recommend creating your own, fully custom, themes this way. It will only result in a lot of clutter in your code. If you want to create your own theme, you should take a look at theme descriptors<sup id="fnref:2"><a href="#fn:2" rel="footnote">2</a></sup>.</p>
<p>The last thing I talked about during my CocoaHeads presentation is data availability. Cappuccino and Cocoa both assume data to be available when the application launches. I'll discuss this problem in more detail in the next, and last, post of the series.</p>
<div class="footnote">
<hr>
<ol>
<li id="fn:1">
<p>Like issues with text in a control with odd height, resulting in the text appearing a pixel off center.&#160;<a href="#fnref:1" rev="footnote" title="Jump back to footnote 1 in the text">&#8617;</a></p>
</li>
<li id="fn:2">
<p>I tried to find a good post about theme descriptors to link to, but unfortunately I couldn't find one. If you know of one, I'd be happy to link to it.&#160;<a href="#fnref:2" rev="footnote" title="Jump back to footnote 2 in the text">&#8617;</a></p>
</li>
</ol>
</div>
