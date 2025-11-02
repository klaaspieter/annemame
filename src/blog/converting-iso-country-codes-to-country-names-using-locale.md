---
title: Converting ISO country codes to country names using Locale
date: 2025-10-31
---

Because IPinfo's open API always returns country codes, I needed to convert them to country names for better address formatting. For example, [1.1.1.1](https://ipinfo.io/1.1.1.1/json) returns AU for Australia. The authenticated tiers (free [Lite](https://ipinfo.io/developers/lite-api) and paid [Core](https://ipinfo.io/developers/core-api)/[Plus](https://ipinfo.io/developers/plus-api)) have both codes and names, but the open API doesn't.

At first I hoped this would do the trick:

```swift
let postalAddress = CNMutablePostalAddress()
postalAddress.isoCountryCode = ipInfoResponse.country
print(postalAddress.country) // ""
```

Sadly `CNPostalAddress` and `CNPostalAddressFormatter` don’t map country codes to
country names. While looking for alternatives, I found [this gist](https://gist.github.com/dineybomfim/a4d88330111032e212ef66446d19dbcb). It uses
`Locale`’s
[`localizedString(forRegionCode:)`](<https://developer.apple.com/documentation/foundation/locale/localizedstring(forregioncode:)>)
to init a `Locale` using just the country code. What an incredibly elegant idea!
No external dependencies and just platform native APIs which are much more
likely to return similar results as people would see in Apple’s own apps. Since I only need country names (not a full locale), the code is even shorter:

```swift
Locale.autoupdatingCurrent.localizedString(forRegionCode: "NL") // Netherlands
```

That’s it.

This almost felt too easy. I was looking forward to building a solution: importing mapping data, handling translations, dealing with edge cases. Instead, one line of platform API code solved it better than anything I could build. Feeling robbed of a good engineering challenge, I decided to verify this simple solution actually works. I tested this against [all ISO-3166 country codes](https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes) to see what happens.

The setup:

```swift
let json = // https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/blob/145f1ad3caff212ed25f42b0ee2c8b92a75af895/slim-2/slim-2.json

struct Country: Decodable {
  private enum CodingKeys : String, CodingKey {
    case name
    case alpha2 = "alpha-2"
    case countryCode = "country-code"
  }

  let name: String
  let alpha2: String
  let countryCode: String
}

let decoder = JSONDecoder()
let countries = try! decoder.decode(
  [Country].self,
  from: json.data(using: .utf8)!
)

struct LocaleCountry {
  let name: String
  let code: String

  let originalName: String
}

let locale = Locale.current
let localeCountries: [LocaleCountry] = countries.compactMap {
  guard let countryName = locale.localizedString(forRegionCode: $0.alpha2) else {
    return nil
  }

  return LocaleCountry(
    name: countryName,
    code: $0.alpha2,
    originalName: $0.name
  )
}
```

Starting with the basics, let’s confirm no countries are missing:

```swift
localeCountries.count == countries.count // true
```

Then let’s confirm every country has a name:

```swift
localeCountries.count(where: { $0.name.isEmpty }) // 0
```

Finally, let’s check if all the names match:

```swift
localeCountries.count(where: { $0.name != $0.originalName }) // 49
```

I knew this was too easy; I found 49 mismatches. On closer inspection however, the simple solution actually works better than expected. These were mostly stylistic mismatches. For example “BQ” in the original data is “Bonaire,
Sint Eustatius and Saba” whereas Apple uses “Caribbean Netherlands”. Similarly the
original data uses the awkward “Netherlands, Kingdom of the” whereas Apple returns just “Netherlands” which is better. Apple also makes other stylistic choices (like using “&” instead of “and” in Antigua & Barbuda) that feel more natural. By using platform native APIs, we get the same values Apple uses. Which is what users from, for example, the Caribbean Netherlands, Côte d’Ivoire and Netherlands will expect. Although as someone from The Netherlands, I do miss the _The_ in The Netherlands.

For reference here’s the full list of mismatches:

```plain
AG: Antigua & Barbuda != Antigua and Barbuda
BO: Bolivia != Bolivia, Plurinational State of
BQ: Caribbean Netherlands != Bonaire, Sint Eustatius and Saba
BA: Bosnia & Herzegovina != Bosnia and Herzegovina
IO: Chagos Archipelago != British Indian Ocean Territory
BN: Brunei != Brunei Darussalam
CV: Cape Verde != Cabo Verde
CN: China mainland != China
CG: Congo - Brazzaville != Congo
CD: Congo - Kinshasa != Congo, Democratic Republic of the
CI: Côte d’Ivoire != Côte d’Ivoire
FK: Falkland Islands != Falkland Islands (Malvinas)
HM: Heard & McDonald Islands != Heard Island and McDonald Islands
VA: Vatican City != Holy See
IR: Iran != Iran, Islamic Republic of
KP: North Korea != Korea, Democratic People’s Republic of
KR: South Korea != Korea, Republic of
LA: Laos != Lao People’s Democratic Republic
FM: Micronesia != Micronesia, Federated States of
MD: Moldova != Moldova, Republic of
MM: Myanmar (Burma) != Myanmar
NL: Netherlands != Netherlands, Kingdom of the
PS: Palestinian Territories != Palestine, State of
PN: Pitcairn Islands != Pitcairn
RU: Russia != Russian Federation
BL: St. Barthélemy != Saint Barthélemy
SH: St. Helena != Saint Helena, Ascension and Tristan da Cunha
KN: St. Kitts & Nevis != Saint Kitts and Nevis
LC: St. Lucia != Saint Lucia
MF: St. Martin != Saint Martin (French part)
PM: St. Pierre & Miquelon != Saint Pierre and Miquelon
VC: St. Vincent & Grenadines != Saint Vincent and the Grenadines
ST: São Tomé & Príncipe != Sao Tome and Principe
SX: Sint Maarten != Sint Maarten (Dutch part)
GS: So. Georgia & So. Sandwich Isl. != South Georgia and the South Sandwich Islands
SJ: Svalbard & Jan Mayen != Svalbard and Jan Mayen
SY: Syria != Syrian Arab Republic
TW: Taiwan != Taiwan, Province of China
TZ: Tanzania != Tanzania, United Republic of
TT: Trinidad & Tobago != Trinidad and Tobago
TC: Turks & Caicos Islands != Turks and Caicos Islands
GB: United Kingdom != United Kingdom of Great Britain and Northern Ireland
US: United States != United States of America
UM: U.S. Outlying Islands != United States Minor Outlying Islands
VE: Venezuela != Venezuela, Bolivarian Republic of
VN: Vietnam != Viet Nam
VG: British Virgin Islands != Virgin Islands (British)
VI: U.S. Virgin Islands != Virgin Islands (U.S.)
WF: Wallis & Futuna != Wallis and Futuna
```
