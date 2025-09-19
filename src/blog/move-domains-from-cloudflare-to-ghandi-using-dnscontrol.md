---
title: Moving DNS from Cloudflare to Gandi using DNSControl
date: "2025-09-24"
---

## Current setup

I'm in the process of moving this site to Europe. For the past couple of
years annema.me was hosted on GitHub Pages. My domain registrar was
dotster.com and DNS was done by Cloudflare.

## Historical context

I registered annema.me with Dotster in 2011 because I worked at
[Sofa](http://madebysofa.com) and they used Dotster. I later moved to Cloudflare
for DNS since it made HTTPS easy.

For years all I heard from Dotster was the occasional renewal email, but then
they rebranded to web.com, then Network Solutions, triggering excessive
emails with each change. Combined with wanting to use European providers, this
prompted me to move all my domains.

## The migration challenge

At the moment annema.me is rented through [gandi.net](https://gandi.net)
but the DNS is still controlled by Cloudflare. Unfortunately, moving DNS to Gandi without
interruption requires switching to Gandi's LiveDNS, which provides only a
bare text box for entering existing DNS records. It doesn't even tell me, a
DNS novice, what format it expects.

My first attempt was to use Cloudflare's export and paste the result of that
into the box. It gave a ton of cryptic errors. I tried editing the file because
it complained about Cloudflare's magic TTL of 1 (which just means Cloudflare
handles TTL automagically). Even changing it to 300, Gandi's minimum, but none
of that worked.

Besides this all feels fragile. I honestly don't care too much if everything
goes down but I at least want to _try_ to keep things up.

I don't remember how I found it, but I ended up using
[DNSControl](https://dnscontrol.org) to automate the migration.

## Exporting existing records

After [setting up my
credentials](https://docs.dnscontrol.org/getting-started/getting-started#id-4.-create-the-initial-creds.json)
I needed a
[`dnsconfig.js`](https://docs.dnscontrol.org/getting-started/getting-started#id-3.-create-the-initial-dnsconfig.js)
with my own DNS configuration. Again it felt error prone to do this manually
so I used `dnscontrol get-zones` instead:

```sh
dnscontrol get-zones --out=dnsconfig.js --format=djs cloudflare - all
```

Which gives a good starting point:

```javascript
var DSP_CLOUDFLARE = NewDnsProvider("cloudflare");
var REG_CHANGEME = NewRegistrar("none");

D(
  "annema.me",
  REG_CHANGEME,
  DnsProvider(DSP_CLOUDFLARE),
  DefaultTTL(1),
  A("@", "185.199.111.153", CF_PROXY_ON),
  A("@", "185.199.110.153", CF_PROXY_ON),
  A("@", "185.199.109.153", CF_PROXY_ON),
  A("@", "185.199.108.153", CF_PROXY_ON),
  // etc
);
```

## The 404 roadblock

With that in place I added `DSP_GANDI = NewDnsProvider("gandi")` and, with the
credentials already configured, ran `dnscontrol preview`:

```sh
$ dnscontrol preview
**\*\*\*\***\*\*\*\***\*\*\*\*** Domain: annema.me
INFO#1: Domain "annema.me" provider gandi Error: StatusCode: 404 ; Err: 404: Unknown domain
INFO#2: DetermineNS: zone "annema.me"; Error: error while getting
Nameservers for zone="annema.me" with provider="gandi": StatusCode: 404 ;
Err: 404: Unknown domain
```

This confused me for a while because
`https://api.gandi.net/v5/domain/domains/annema.me/nameservers` definitely
returned information for annema.me. I _had_ read in [the Gandi provider
documentation](https://docs.dnscontrol.org/provider/gandi_v5) that:

> It is only able to work with domains migrated to the new LiveDNS API

It wasn't until I read the
[Debugging](https://docs.dnscontrol.org/provider/gandi_v5#debugging) section
that I realized the Gandi provider is calling:

<https://api.gandi.net/v5/livedns/domains/annema.me/nameservers>

Which, of course, did 404, because, to avoid interruption, my domains are
using Cloudflare instead of Gandi's LiveDNS.

Classic. I was trying to automate moving my DNS from Cloudflare to Gandi,
only to end up back at that same text box. However, playing with DNSControl reacquainted me with [DNS zone
files](https://en.wikipedia.org/wiki/Zone_file). I figured that might be what
the text box was silently asking for.

## The zone file workaround

So I could not go from Cloudflare to Gandi, but perhaps I could go from
Cloudflare → DNS zone (BIND) → Gandi. Out of an abundance of caution, I
tested this process with another domain first, and it worked perfectly.

I updated my dnsconfig.js to include
`DnsProvider(DSP_BIND)`. After confirming with `dnscontrol preview` that nothing
strange would happen, I ran `dnscontrol push` and got a zone file in
`./zones/annema.me.zone`.

I pasted the zone file content into Gandi's text box and switched the
nameservers. To verify everything was working, I checked the DNS propagation:

```sh
dig ns annema.me

;; ANSWER SECTION:
annema.me.              86351   IN      NS      mona.ns.cloudflare.com.
annema.me.              86351   IN      NS      yichun.ns.cloudflare.com.
```

Ugh. DNS in a nutshell. _Of course_ the TTL had just rolled over and would take
almost a full day to propagate.

But querying Gandi's nameserver directly confirmed that my records had
migrated successfully:

```sh
dig @ns-7-a.gandi.net a annema.me
```

```sh
;; ANSWER SECTION:
annema.me.              300     IN      A       185.199.108.153
annema.me.              300     IN      A       185.199.109.153
annema.me.              300     IN      A       185.199.110.153
annema.me.              300     IN      A       185.199.111.153
```

## Verifying the migration

The migration worked perfectly. DNSControl's zone file export provided
what Gandi's LiveDNS import expected. What started as a frustrating
manual process became an automated, repeatable solution. Open source and
available on [GitHub](https://github.com/klaaspieter/dns).

All that done, my domain names and DNS are now handled by European
companies. Part of my motivation for this move was reducing dependence on
American services given the unpredictability of US politics.

I have no particular strong feelings about the US, but I do think their
electoral system is problematic. I think it's an antiquated system invented
to account for horse travel that both parties have kept in place because at
one point or another it favored them. At least that's the only logical
explanation I can come up with to keep the system in place. Trump is a democratically elected
president under this system, which I believe unfairly gives more power to
less populous states (I know he won the popular vote this time, my point still
stands) and creates exactly the kind of uncertainty that
France's Europe Minister Benjamin Haddad was referring to:

> We cannot leave the security of Europe in the hands of voters in
> Wisconsin every four years.

The same principle applies to digital infrastructure. By using European providers
I am supporting local infrastructure, reducing dependence on distant
political decisions, and as an EU citizen, having some democratic input
into the regulations that govern my digital rights.

Next up: moving from GitHub Pages to my Hetzner server.
