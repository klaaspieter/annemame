---
layout: post
title: 'Objective-J Explained: Toll-Free Bridges'
date: '2010-03-19 22:34:00'
---

<p>Last week I gave a talk on the <a href="http://www.cappuccino.org">Cappuccino</a> frameworks during a <a href="http://www.cocoaheads.nl">Cocoaheads Amsterdam</a> meeting. This post is the first in a series in which I’ll explain several of the subjects I talked about during my presentation. I didn’t have a lot of slides and they won’t make much sense without explanation but for those that are interested you can download them <a href="http://dl.dropbox.com/u/3415875/Blog/Objective-J%20Explained/Cocoaheads%20Cappuccino.key">here</a>. All of the examples used in this post can be downloaded <a href="http://dl.dropbox.com/u/3415875/Blog/Objective-J%20Explained/Objective-J-Explained.zip">here</a>.</p>
<p>I'm going to start of this series at the basis of the Cappuccino framework, Javascript. In the end Cappuccino and Objective-J are build on top of this one language and that allows for some pretty cool things. Cool things which will look familiar to Cocoa developers and cool things that can make the transition for Javascript developers easier.</p>
<p>The following code shows an example:</p>
<div class="codehilite"><pre><span class="c1">// 1 Declare a javascript array</span>
<span class="kd">var</span> <span class="n">array</span> <span class="o">=</span> <span class="p">[];</span>
<span class="n">CPLog</span><span class="p">.</span><span class="nf">debug</span><span class="p">(</span><span class="s">@&quot;Step 1: %@&quot;</span><span class="p">,</span> <span class="n">array</span><span class="p">);</span>
<span class="c1">// &gt;</span>

<span class="c1">// 2 Call an Objective-J method on it</span>
<span class="p">[</span><span class="n">array</span> <span class="n">addObject</span><span class="o">:</span><span class="s">@&quot;first object&quot;</span><span class="p">];</span>
<span class="n">CPLog</span><span class="p">.</span><span class="nf">debug</span><span class="p">(</span><span class="s">@&quot;Step 2: %@&quot;</span><span class="p">,</span> <span class="n">array</span><span class="p">);</span>
<span class="c1">// &gt; first object</span>

<span class="c1">// 3 Call a Javascript function</span>
<span class="n">array</span><span class="p">.</span><span class="nf">push</span><span class="p">(</span><span class="s">@&quot;SECOND OBJECT&quot;</span><span class="p">);</span>
<span class="n">CPLog</span><span class="p">.</span><span class="nf">debug</span><span class="p">(</span><span class="s">@&quot;Step 3: %@&quot;</span><span class="p">,</span> <span class="n">array</span><span class="p">);</span>
<span class="c1">// &gt; first object,SECOND OBJECT</span>

<span class="c1">// 4 Mix it up</span>
<span class="n">array</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="p">[</span><span class="n">array</span> <span class="n">objectAtIndex</span><span class="o">:</span><span class="mi">0</span><span class="p">];</span>
<span class="n">CPLog</span><span class="p">.</span><span class="nf">debug</span><span class="p">(</span><span class="s">@&quot;Step 4: %@&quot;</span><span class="p">,</span> <span class="n">array</span><span class="p">[</span><span class="mi">0</span><span class="p">]</span> <span class="o">===</span> <span class="p">[</span><span class="n">array</span> <span class="n">objectAtIndex</span><span class="o">:</span><span class="mi">0</span><span class="p">]);</span>
<span class="c1">// &gt; true</span>

<span class="c1">// 5 Do something wacky</span>
<span class="n">array</span><span class="p">[[</span><span class="n">array</span> <span class="n">indexOfObject</span><span class="o">:</span><span class="s">@&quot;SECOND OBJECT&quot;</span><span class="p">]]</span> <span class="o">=</span> <span class="p">[</span><span class="n">array</span> <span class="n">objectAtIndex</span><span class="o">:</span><span class="p">[</span><span class="n">array</span> <span class="n">indexOfObject</span><span class="o">:</span><span class="s">@&quot;SECOND OBJECT&quot;</span><span class="p">]].</span><span class="nf">toLowerCase</span><span class="p">();</span>
<span class="n">CPLog</span><span class="p">.</span><span class="nf">debug</span><span class="p">(</span><span class="s">@&quot;Step 5: %@&quot;</span><span class="p">,</span> <span class="n">array</span><span class="p">);</span>
<span class="c1">// &gt; first object,second object</span>
</pre></div>


<p>All of the above code is perfectly valid. This is an example of a toll-free bridge. A toll-free bridged object is both an instance of a regular Javascript and an instance of an Objective-J object. In Objective-J CPArray and CPString are toll-free bridged to their Javascript equivalents.</p>
<p>As you see you can mix and match both syntaxes as you feel fit. <strong>A word of caution</strong>. The above example (especially step 5) is contrived, I do not recommend mixing syntax like this in production code since it can make your code very hard to read and maintain. Personally I only use Javascript literal array notation to create arrays because it's shorter and  more readable than <code>[CPArray array]</code>. I also use regular Javascript objects in stead of CPDictionaries because CPDictionary is <em>not</em> toll-free bridged with the Javascript object.</p>
<div class="codehilite"><pre><span class="c1">// 1. Create a regular javascript object using literal notation</span>
<span class="kd">var</span> <span class="n">object</span> <span class="o">=</span> <span class="p">{};</span>
<span class="c1">// &gt; {}</span>

<span class="c1">// 2. Add a key value pair to it using javascript</span>
<span class="n">object</span><span class="p">[</span><span class="s1">&#39;key1&#39;</span><span class="p">]</span> <span class="o">=</span> <span class="s1">&#39;value1&#39;</span><span class="p">;</span>
<span class="c1">// &gt; {&quot;key1&quot;: &quot;value1&quot;}</span>

<span class="c1">// 3. Attempt to add another key value pair using Objective-J</span>
<span class="p">[</span><span class="n">object</span> <span class="n">setValue</span><span class="o">:</span><span class="s">@&quot;value2&quot;</span> <span class="n">forKey</span><span class="o">:</span><span class="s">@&quot;key2&quot;</span><span class="p">];</span>
<span class="c1">// &gt; TypeError: Result of expression &#39;isa&#39; [undefined] is not an object.</span>
</pre></div>


<p>If you prefer using CPDictionaries over Javascript objects you can transform it into a CPDictionary like so:</p>
<div class="codehilite"><pre><span class="c1">// 1. Create the object from the previous example</span>
<span class="kd">var</span> <span class="n">object</span> <span class="o">=</span> <span class="p">{</span><span class="s">@&quot;key1&quot;</span><span class="o">:</span> <span class="s">@&quot;value1&quot;</span><span class="p">}</span>
<span class="c1">// &gt; {&quot;key1&quot;: &quot;value1&quot;}</span>

<span class="c1">// 2. Make a CPDictionary out of it</span>
<span class="kd">var</span> <span class="n">dictionary</span> <span class="o">=</span> <span class="p">[</span><span class="n">CPDictionary</span> <span class="n">dictionaryWithJSObject</span><span class="o">:</span><span class="n">object</span> <span class="n">recursively</span><span class="o">:</span><span class="kc">YES</span><span class="p">];</span>
<span class="c1">// &gt; {&quot;key1&quot;: &quot;value1&quot;}</span>

<span class="c1">// 3. Attempt to add the key value pair using Objective-J again</span>
<span class="p">[</span><span class="n">dictionary</span> <span class="n">setValue</span><span class="o">:</span><span class="s">@&quot;value2&quot;</span> <span class="n">forKey</span><span class="o">:</span><span class="s">@&quot;key2&quot;</span><span class="p">];</span>
<span class="c1">// &gt; {&quot;key1&quot;: &quot;value1&quot;, &quot;key2&quot;: &quot;value2&quot;}</span>
</pre></div>


<p>I personally never do this because, to me:</p>
<div class="codehilite"><pre><span class="p">{</span><span class="s">@&quot;key1&quot;</span><span class="o">:</span><span class="s">@&quot;value1&quot;</span><span class="p">,</span> <span class="s">@&quot;key2&quot;</span><span class="o">:</span><span class="s">@&quot;value2&quot;</span><span class="p">}</span>
</pre></div>


<p>is far more readable than:</p>
<div class="codehilite"><pre><span class="p">[</span><span class="n">CPDictionary</span> <span class="n">dictionaryWithObjectsAndKeys</span><span class="o">:</span>
    <span class="s">@&quot;value1&quot;</span><span class="p">,</span> <span class="s">@&quot;key1&quot;</span><span class="p">,</span> <span class="s">@&quot;value2&quot;</span><span class="p">,</span> <span class="s">@&quot;key2&quot;</span><span class="p">]</span>
</pre></div>


<p>As you've seen, Objective-J and Javascript differ in syntax a lot, but are still very much the same thing. </p>
<p>As I've said earlier, this post is the start of a series of posts about Cappuccino. The next one will be about Theming, make sure you don't miss it by <a href="feed://feeds.feedburner.com/annemame">subscribing</a> to my feed or <a href="http://www.twitter.com/klaaspieter/">following</a> me on Twitter.</p>