---
title: "OWE on the GL.iNet Flint 3"
date: "2026-04-02"
---

For my work at [IPinfo](https://ipinfo.io) I needed an open Wi-Fi network to
test against. Having learned of the existence of [Opportunistic Wireless
Encryption (OWE)](https://en.wikipedia.org/wiki/Opportunistic_Wireless_Encryption)
and that OpenWrt [supports it](https://openwrt.org/docs/guide-user/network/wifi/owe_encryption), I wanted to have one.

OWE encrypts traffic on open networks without requiring a password. Clients
([Apple](https://support.apple.com/en-gb/guide/deployment/dep3b0448c58/web#depa1e03df0e), [Android](https://source.android.com/docs/core/connect/wifi-wpa3-owe)) that
support OWE encrypt their traffic. Lack of encryption was always the big drawback of open networks. For my use case it didn't really matter (I don't expect anyone to join), but now I get to say I have an encrypted guest Wi-Fi network that doesn't need a password.

Setting it up on the [Flint 3](/blog/configure-gl-inet-gl-be9300-flint-3-on-kpn-fiber/)
was straightforward following the OpenWrt
[guest Wi-Fi](https://openwrt.org/docs/guide-user/network/wifi/guestwifi/guest-wlan) and
[OWE](https://openwrt.org/docs/guide-user/network/wifi/owe_encryption) guides.
But it didn't work. There were two separate issues.

## GL.iNet firmware bug

The OpenWrt guides tell you to set `encryption='owe'` on the wireless interface.
Presumably this works in the normal version of OpenWrt, but there's a
bug in the modified variant that ships with the Flint 3's firmware. On firmware 4.8.4 it silently
creates an open network with no encryption. [Technical details](https://forum.gl-inet.com/t/owe-silently-broken-on-flint3/67660).

The workaround is to use the encryption and OWE flag separately:

```sh
uci set wireless.<iface>.encryption='ccmp'
uci set wireless.<iface>.owe='1'
uci commit wireless
wifi
```

## CoreWLAN bug

After getting OWE working I noticed that macOS and iOS report the network as "Security:
None". At first I thought OWE wasn't working, but checking on the router
confirmed it was.

The bug is in Apple's CoreWLAN framework. `CWInterface.security()` returns
`kCWSecurityNone` (0) for an active OWE connection when it should return
`kCWSecurityOWE` (14). The scan API gets it right:
`CWNetwork.strongestSupportedSecurity` correctly returns `kCWSecurityOWE`.

Maybe because of this bug the UI also doesn't distinguish OWE from open networks
at all. Same appearance and security warning. Anyone who went through the
trouble of setting up OWE gets flagged as insecure anyway. That's wrong.

Apple feedback ID: FB22250575

## Free Wi-Fi for all

It took a lot of fiddling and going back and forth with Claude but ultimately I
was able to come up with a solution that I understood and could report issues
for. Finding issues with iOS and macOS was an unexpected bonus. I guess.

If you're ever [near my house](https://eemgoed.nl) be sure to join my open but encrypted
Wi-Fi.
