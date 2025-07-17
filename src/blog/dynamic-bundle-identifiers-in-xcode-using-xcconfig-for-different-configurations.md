---
title: "Dynamic bundle identifiers in Xcode: Using xcconfig for different configurations"
---

Generally in Xcode you have two configurations: Debug and Release. It's often a good idea to have a different bundle identifier for each configuration so that your debug builds don't replace the release builds on your device.

## Normal setup

For a single target I usually start with three xcconfig files: `Base.xcconfig`, `Debug.xcconfig` and `Release.xcconfig`. `Base.xcconfig` is for build settings shared by both configurations. Versions for each app/extension need to match so that's a good thing to place in your `Base.xcconfig`:

```xcconfig
// Base.xcconfig
MARKETING_VERSION = 1.0
CURRENT_PROJECT_VERSION = 1
```

`Debug.xcconfig` and `Release.xcconfig` then look like this:

```xcconfig
// Debug.xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = "me.annema.app-name.ios.dev"
```

```xcconfig
// Release.xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = "me.annema.app-name.ios"
```

See [Map build settings to a build configuration](https://developer.apple.com/documentation/xcode/adding-a-build-configuration-file-to-your-project/#Map-build-settings-to-a-build-configuration) for instructions on how to configure your project to use the xcconfig files.

## Safari extension

I'm working on a Safari extension which comes with 4 different targets: iOS app, iOS extension, macOS app and macOS extension. With the above approach that would mean 8 separate xcconfig files that are almost identical. The odds of a typo or copy-paste error are high. I want a single xcconfig file per target that has the `dev` suffix for Debug builds and no suffix for Release builds.

## Conditional values

The first obvious thing I tried was to define conditional Debug and Release values:

```xcconfig
// Base.xcconfig
PRODUCT_BUNDLE_IDENTIFIER_PREFIX = me.annema.safari-extension
PRODUCT_BUNDLE_IDENTIFIER_SUFFIX[config=Debug] = .dev
```

```xcconfig
// iOS (App).xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = $(PRODUCT_BUNDLE_IDENTIFIER_PREFIX)$(PRODUCT_BUNDLE_IDENTIFIER_SUFFIX)
```

I expected this to resolve to:

- Debug: `me.annema.annema.safari-extension.dev`
- Release: `me.annema.safari-extension`

But each configuration resolves to `me.annema.safari-extension` instead.

## The trick

It's then I realized references can be nested:

```xcconfig
// Base.xcconfig
BUNDLE_ID_SUFFIX_Debug = dev
BUNDLE_ID_SUFFIX_Release =

PRODUCT_BUNDLE_IDENTIFIER_SUFFIX = $(BUNDLE_ID_SUFFIX_$(CONFIGURATION))
```

Xcode sees the `$(CONFIGURATION)` and replaces it with `Debug` or `Release`. The outer `$()` then becomes `$(BUNDLE_ID_SUFFIX_Debug)` or `$(BUNDLE_ID_SUFFIX_Release)` which Xcode replaces with one of the values we've defined on the first two lines: `dev` for `BUNDLE_ID_SUFFIX_Debug` and nothing for `BUNDLE_ID_SUFFIX_Release`.

## The result

To get the final bundle identifier we need to combine the prefix with the suffix and make the value unique for each target. The final `Base.xcconfig` therefor defines both a prefix and a suffix:

```xcconfig
// Base.xcconfig
BUNDLE_ID_SUFFIX_Debug = .dev
BUNDLE_ID_SUFFIX_Release =

PRODUCT_BUNDLE_IDENTIFIER_PREFIX = me.annema.safari-extension
PRODUCT_BUNDLE_IDENTIFIER_SUFFIX = $(BUNDLE_ID_SUFFIX_$(CONFIGURATION))
```

The app specific `xcconfig`s combine the prefix and suffix:

```xcconfig
// iOS (App).xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = $(PRODUCT_BUNDLE_IDENTIFIER_PREFIX).ios$(PRODUCT_BUNDLE_IDENTIFIER_SUFFIX)
```

```xcconfig
// iOS (Extension).xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = $(PRODUCT_BUNDLE_IDENTIFIER_PREFIX).ios.web-extension$(PRODUCT_BUNDLE_IDENTIFIER_SUFFIX)
```

```xcconfig
// macOS (App).xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = $(PRODUCT_BUNDLE_IDENTIFIER_PREFIX).macos$(PRODUCT_BUNDLE_IDENTIFIER_SUFFIX)
```

```xcconfig
// macOS (Extension).xcconfig
#include "Base.xcconfig"

PRODUCT_BUNDLE_IDENTIFIER = $(PRODUCT_BUNDLE_IDENTIFIER_PREFIX).macos.web-extension$(PRODUCT_BUNDLE_IDENTIFIER_SUFFIX)
```
