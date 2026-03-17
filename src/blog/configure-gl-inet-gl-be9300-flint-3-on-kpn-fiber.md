---
title: "Configure GL.iNet GL-BE9300 (Flint 3) on KPN fiber"
date: "2026-03-17"
---

## Backstory

Up until a few days ago my main Wi-Fi router was an Apple Time Capsule. It's one of the latest models but still this thing is _old_. Apple discontinued the product line in 2018 but I probably bought it in 2013, maybe 2014. That makes it over 10 years old. It survived 3 NYC apartments, a move back to The Netherlands, being stored in an attic for a while, dusted off and then 2 more houses. The longevity of this thing is honestly amazing (granted I haven't used it for backups for a few years but when I stopped even the hard drive still worked).

I didn't even replace it because it was broken but because I need more configurability for my work at [IPinfo](https://ipinfo.io). To test I occasionally need uncommon network configurations like an IPv6-only network, an open Wi-Fi network or just a separate Wi-Fi network to begin with. None of these were easy to set up on my Time Capsule or the router that came for free with my KPN subscription.

## UniFi vs GL.iNet

For years I thought I would upgrade to [UniFi](https://www.ui.com/) but I decided against it. The fact that it's an American company didn't work in its favor but ultimately I realized I didn't need their ecosystem. I run Home Assistant so anything I can get through their ecosystem I can also connect to my current network and have Home Assistant handle it.

Instead I went for a [Flint 3 (GL-BE9300)](https://store-eu.gl-inet.com/collections/home-routers/products/flint-3-gl-be9300-tri-band-wi-fi-7-home-router). It was recommended by a coworker, it's well reviewed by [rthings.com](https://www.rtings.com/router/reviews/gl-inet/flint-3-gl-be9300) but most importantly it runs a modified [OpenWrt](https://openwrt.org/) firmware. I don't have to set up OpenWrt from scratch but I can still use it to configure unusual network configurations.

## KPN setup

After I received my new router I needed to make it work on my KPN Fiber connection. Initially I followed [this guide](https://danieldk.eu/Hardware/Networking/GL.iNet-GL-MT6000-on-KPN-fiber). In case the guide ever disappears here's a quick summary of its setup:

Under “Ethernet 1” click “Modify” then use the following settings:

|Setting|Value|
|-------|-----|
|Protocol| `PPPoE`|
|Username|`internet` (can be anything)|
|Password| `internet` (can be anything)|
|VLAN ID| 6|
|MTU| 1500|

Then click “Apply”

## IPv6 support

The guide worked, but left me without IPv6 support. After some digging I found
it's something I need to enable by going to “Network” -> “IPv6” and then enable
it with the following settings:

|Setting|Value|
|-------|-----|
|Mode|Native|
|DNS Acquisition method|Automatic|

Finally go to “Network” -> “Multi-WAN”, Click the settings gear next to “Ethernet 1” and change “Protocol” from “IPv4” to “Both”

That's it. A quick way to test if it worked is to see if [v6.ipinfo.io](https://v6.ipinfo.io) loads. Next I'm going to set up an open but encrypted ([OWE](https://en.wikipedia.org/wiki/Opportunistic_Wireless_Encryption)) Wi-Fi network for testing.
