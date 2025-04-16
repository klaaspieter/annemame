---
title: CSS Markdown mark
date: '2012-03-16T12:05:00.000+01:00'
---

I've been impressed with icons created in CSS3 and decided to have a go at it. As an experiment I took [Dustin Curtis'][] markdown mark and made a version using only HTML and CSS. This is the result ([separate page][]):

[Dustin Curtis']: http://dcurt.is/the-markdown-mark

[separate page]: http://dl.dropbox.com/u/3415875/Blog/CSS%20Markdown%20mark/markdown.html

<style type="text/css" media="screen">
    .markdown {
        position:relative;
        border:10px solid gray;
        width:188px; height:108px;
        border-radius:15px;
        -webkit-font-smoothing:antialiased;
    }
    .markdown:before {
        color:gray;
        font:bold 100px "Gill Sans";
        content:"M";
        position:absolute;
        top:-4px;
        left:12px;
    }
    .markdown .stem {
        border:10px solid gray;
        position:absolute;
        height:30px;
        right:34px;
        top:20px;
    }
    .markdown .arrow {
        width:0;
        height:0;
        position:absolute;
        bottom:0px;
        right:14px;
        border-style:solid;
        border-width:34px 30px 20px 30px;
        border-color:gray transparent transparent transparent;
    }

    .markdown.spec {
        border-color:#ccc;
    }
    .markdown.spec:before {
        color:#ccc;
    }
    .markdown.spec .stem {
        border-color:#ccc;
    }
    .markdown.spec .arrow {
        border-top-color:#ccc;
    }

    .markdown.cutout {
        border-color:black;
    }
    .markdown.cutout:before {
        color:black;
    }
    .markdown.cutout .stem {
        border-color:black;
    }
    .markdown.cutout .arrow {
        border-top-color:black;
    }

    .markdown.solid {
        background-color:black;
        border-color:black;
    }
    .markdown.solid:before {
        color:white;
    }
    .markdown.solid .stem {
        border-color:white;
    }
    .markdown.solid .arrow {
        border-top-color:white;
    }

    /* Not part of the actual icons */
    .cutout-positioner {
        position:absolute;
        top:0px;
        left:269px;
    }

    .solid-positioner {
        position:absolute;
        top:0px;
        left:530px;
    }

    /* Make the spec background white because it doesn't really work with my blog's background */
    .markdown.spec {
        background-color:white;
    }
    /* Make the cutout background white as well, it works on my blog's background but it looks weird
    next to the specs white background */
    .markdown.cutout {
        background-color:white;
    }

</style>

<div style="position:relative; margin-bottom:30px;">
    <div class="markdown spec">
        <div class="stem"></div>
        <div class="arrow"></div>
    </div>
    <div class="cutout-positioner">
        <div class="markdown cutout">
            <div class="stem"></div>
            <div class="arrow"></div>
        </div>
    </div>
    <div class="solid-positioner">
        <div class="markdown solid">
            <div class="stem"></div>
            <div class="arrow"></div>
        </div>
    </div>
</div>

<p>
Unfortunately, due to two issues in current browsers the icon is not pixel perfect.
</p>

<p>
The M portion of the icon is rendered using the <code>:before</code> pseudo tag with a <code>content</code> attribute. By default text in browsers on a Mac (I haven't tested on Windows) is rendered using sub pixel antialiasing. I was able to make the drawing of the M more accurate by setting <code>-webkit-font-smoothing</code> to <code>antialiased</code> but the end result still has 1 pixel grayish border on both sides of the M. It should be possible to reproduce the M using CSS shapes, but that's outside the scope of my experiment.
</p>

<p>
Note that <code>-webkit-font-smoothing</code> also allows <code>never</code> but the result is awful:
</p>

<style type="text/css" media="screen">
    .markdown.cutout {
        -webkit-font-smoothing:none;
    }
</style>

<div style="margin-bottom:30px;">
    <div class="markdown cutout">
        <div class="stem"></div>
        <div class="arrow"></div>
    </div>
</div>

<p>
Ironically, the second issue is the lack of antialiasing on borders. Dustin's original arrow shape is very crisp whereas my version has jacked edges. The most obvious solution is to render a div with a solid background and use <code>:before</code> and <code>:after</code> to overlay two rotated rectangle. This would create the same effect but probably without the jacked edges. I was however unable to get this to work without the rotated rectangles overlapping others parts of the icon.
</p>

<p>
If you know why browsers don't antialias borders or how to get the arrow more crisp; please <a href="https://twitter.com/klaaspieter">mention</a> me on Twitter or comment on the <a href="https://github.com/dcurtis/markdown-mark/pull/5">pull request</a>.
</p>
