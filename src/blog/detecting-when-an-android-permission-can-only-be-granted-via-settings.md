---
title: Detecting when an Android permission can only be granted via Settings
---

I was surprised to discover how easy it is, even when following the [official Android permissions guide](https://developer.android.com/training/permissions/requesting), to end up with a button that does nothing.

## Setting the stage: how it works on iOS

On iOS [`CLAuthorizationStatus`](https://developer.apple.com/documentation/corelocation/clauthorizationstatus) has 6 possible states to indicate what level of access a user has granted to their location:

```swift
public enum CLAuthorizationStatus {
case notDetermined
case restricted
case denied
static var authorized: CLAuthorizationStatus // deprecated
case authorizedAlways
case authorizedWhenInUse
}
```

The `denied` and `notDetermined` cases are crucial because they allow us to differentiate between a user who has been asked for access and rejected it, and a user who has not yet been asked. We know the system shows the permission request UI when `CLAuthorizationStatus` is `notDetermined`, but does nothing if the status is `denied`.

As a result, we can create buttons and interfaces that respond appropriately to each state. For example:

```plain
.notDetermined
We need location authorization
[Request authorization]

.denied
We need location authorization
[Open Settings]
```

## Taking the stage: how it works on Android

Consider my surprise when I learned the equivalent Android type is:

```kotlin
public sealed interface PermissionStatus {
    public object Granted : PermissionStatus
    public data class Denied(
        val shouldShowRationale: Boolean
    ) : PermissionStatus
}
```

This type is defined by Google's [Accompanist](https://github.com/google/accompanist/blob/fda7f06a24a42b0b1afa75591e768d82d2941984/permissions/src/main/java/com/google/accompanist/permissions/PermissionsUtil.kt#L42-L47) which builds on top of existing Android APIs for easier access from Jetpack Compose. In truth, Android requires separate APIs to determine whether a permission is granted or denied and if an additional rationale may be shown or not.

Android does not have an official API for detecting the difference between `notDetermined` and `denied`. As a result, there’s no standard method to send users to the settings app if they mistakenly reject a permission or want to grant it later. If implemented the official Android way, they will get a button that simply does nothing.

The maintainer of Accompanist [admits](https://github.com/google/accompanist/issues/1363#issuecomment-1299910349) as much and agrees it's [terrible UX](https://github.com/google/accompanist/issues/1363#issuecomment-1303072548). Luckily someone in the comments provided a [partial solution](https://github.com/google/accompanist/issues/1363#issuecomment-1326516265). It's partial because it only supports asking for a single permission, but precise location access on Android requires two separate permissions: `android.permission.ACCESS_COARSE_LOCATION` and `android.permission.ACCESS_FINE_LOCATION`. It works by remembering the original state of the permission and directing the user to Settings if the permission changed from `Denied(shouldShowRationale=true)` to `Denied(shouldShowRationale=false)`.

## Intermission: understanding how permissions change

Before we can understand the final solution we need to understand how permissions change as the user rejects all or partial permissions:

### Rejecting all permissions

The flow for rejecting all permissions is the same as for rejecting a single permission, meaning we can use the same approach as the original implementation but looking at all the requested permissions instead.

#### Initial state

The state of permissions when the user first launches the app or has previously rejected all permissions.

| Permission               | PermissionStatus                    |
| ------------------------ | ----------------------------------- |
| `ACCESS_COARSE_LOCATION` | `Denied(shouldShowRationale=false)` |
| `ACCESS_FINE_LOCATION`   | `Denied(shouldShowRationale=false)` |

#### First rejection

After the user first rejects permissions Android gives us the opportunity to provide an additional rationale for why it's necessary:

| Permission               | PermissionStatus                   |
| ------------------------ | ---------------------------------- |
| `ACCESS_COARSE_LOCATION` | `Denied(shouldShowRationale=true)` |
| `ACCESS_FINE_LOCATION`   | `Denied(shouldShowRationale=true)` |

#### Second rejection

Because the user rejects the permission again we're no longer allowed to show a rationale. The system will no longer show system UI when asked.

| Permission               | PermissionStatus                    |
| ------------------------ | ----------------------------------- |
| `ACCESS_COARSE_LOCATION` | `Denied(shouldShowRationale=false)` |
| `ACCESS_FINE_LOCATION`   | `Denied(shouldShowRationale=false)` |

#### The important state change

Because the permission state changes from `Denied(shouldShowRationale=true)` to `Denied(shouldShowRationale=false)`, we know that the user has denied us for the final time and can instead open the Settings app.

In code:

```kotlin
currentState is PermissionStatus.Denied && currentState.shouldShowRationale &&
newState is PermissionStatus.Denied && !newState.shouldShowRationale
```

## Rejecting partial permissions:

The flow for partial permissions is slightly different:

#### Initial state

The state of permissions when the user first launches the app or has previously rejected all permissions.

| Permission               | PermissionStatus                    |
| ------------------------ | ----------------------------------- |
| `ACCESS_COARSE_LOCATION` | `Denied(shouldShowRationale=false)` |
| `ACCESS_FINE_LOCATION`   | `Denied(shouldShowRationale=false)` |

#### Partial approval

The user allowed coarse location, but not fine.

| Permission               | PermissionStatus                    |
| ------------------------ | ----------------------------------- |
| `ACCESS_COARSE_LOCATION` | `Granted`                           |
| `ACCESS_FINE_LOCATION`   | `Denied(shouldShowRationale=false)` |

#### Second partial approval

The user is asked to change location access from coarse to fine but rejects it.

| Permission               | PermissionStatus                    |
| ------------------------ | ----------------------------------- |
| `ACCESS_COARSE_LOCATION` | `Granted`                           |
| `ACCESS_FINE_LOCATION`   | `Denied(shouldShowRationale=false)` |

#### The important state change

In this case we see that with the first and second partial approvals the permission state doesn't change at all. We can detect this specific state by making sure that at least one permission was granted and the permission state didn't change:

```kotlin
if (newPermissionStates.any { !it.value.isGranted } && currentPermissionsStates == newPermissionStates)
```

Unfortunately, there is still an issue with this approach. After rejecting the change from approximate to precise location, the system UI dismisses and the Settings app opens immediately. Ideally this would happen the next time they tap the button, like it does when all permissions are rejected. I decided that this is good enough for me. It should be relatively rare and I've already spend more time on this than I wanted.

## Applause: the full solution

```kotlin
package io.ipinfo.android.extensions

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.content.pm.PackageManager
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.MultiplePermissionsState
import com.google.accompanist.permissions.PermissionState
import com.google.accompanist.permissions.PermissionStatus
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberMultiplePermissionsState
import com.google.accompanist.permissions.rememberPermissionState
import com.google.accompanist.permissions.shouldShowRationale

// Extend Accompanist to detect when a permission needs to be granted through the Settings app.
// Inspired by: https://github.com/google/accompanist/issues/1363#issuecomment-1326516265

/** Find the closest Activity in a given Context. */
internal fun Context.findActivity(): Activity {
    var context = this
    while (context is ContextWrapper) {
        if (context is Activity) return context
        context = context.baseContext
    }
    throw IllegalStateException("Permissions should be called in the context of an Activity")
}

internal fun Context.checkPermission(permission: String): Boolean {
    return ContextCompat.checkSelfPermission(this, permission) ==
        PackageManager.PERMISSION_GRANTED
}

internal fun Activity.shouldShowRationale(permission: String): Boolean {
    return ActivityCompat.shouldShowRequestPermissionRationale(this, permission)
}

private val TAG = "ExtendedAccompanist"

/** `true` if a rationale should be presented to the user. */
@ExperimentalPermissionsApi
internal val PermissionStatus.shouldShowRationale: Boolean
    get() =
            when (this) {
                PermissionStatus.Granted -> false
                is PermissionStatus.Denied -> shouldShowRationale
            }

@ExperimentalPermissionsApi
@Composable
fun rememberPermissionState(
        permission: String,
        onCannotRequestPermission: () -> Unit = {},
        onPermissionResult: (Boolean) -> Unit = {},
): ExtendedPermissionState {
    val context = LocalContext.current

    var currentShouldShowRationale by remember {
        mutableStateOf(context.findActivity().shouldShowRationale(permission))
    }

    var atDoubleDenialForPermission by remember { mutableStateOf(false) }

    val mutablePermissionState =
            rememberPermissionState(permission) { isGranted ->
                if (!isGranted) {
                    val updatedShouldShowRationale =
                            context.findActivity().shouldShowRationale(permission)
                    if (!currentShouldShowRationale && !updatedShouldShowRationale)
                            onCannotRequestPermission()
                    else if (currentShouldShowRationale && !updatedShouldShowRationale)
                            atDoubleDenialForPermission = false
                }
                onPermissionResult(isGranted)
            }

    return remember(permission) {
        ExtendedPermissionState(
                permission = permission,
                mutablePermissionState = mutablePermissionState,
                onCannotRequestPermission = onCannotRequestPermission,
                atDoubleDenial = atDoubleDenialForPermission,
                onLaunchedPermissionRequest = { currentShouldShowRationale = it }
        )
    }
}

@OptIn(ExperimentalPermissionsApi::class)
private fun permissionStates(context: Context, permissions: List<String>): Map<String, PermissionStatus> {
    return permissions.associate {
        if (context.checkPermission(it)) {
            it to PermissionStatus.Granted
        } else {
            it to PermissionStatus.Denied(
                shouldShowRationale = context.findActivity().shouldShowRationale(it)
            )
        }
    }
}

@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun rememberMultiplePermissionsState(
        permissions: List<String>,
        onPermissionsResult: (Map<String, Boolean>) -> Unit = {},
        onCannotRequestPermission: () -> Unit = {}
): ExtendedMultiplePermissionState {
    val context = LocalContext.current
    var currentPermissionsStates by remember {
        mutableStateOf(permissionStates(context, permissions))
    }

    var atDoubleDenialForPermission by remember { mutableStateOf(false) }

    val mutablePermissionState =
            rememberMultiplePermissionsState(
                    permissions,
                    onPermissionsResult = { newPermissions ->
                        val newPermissionStates = newPermissions.mapValues {
                            if (it.value) {
                                PermissionStatus.Granted
                            } else {
                                PermissionStatus.Denied(
                                    shouldShowRationale = context.findActivity().shouldShowRationale(it.key)
                                )
                            }
                        }

                        Log.d(
                            TAG,
                            """
                               ------------
                               onPermissionResult
                               current: $currentPermissionsStates
                               new: $newPermissionStates
                               --------------
                            """.trimIndent()
                        )

                        // show settings when at least one permission is denied and the current and new permissions haven't changed.
                        if (newPermissionStates.any { !it.value.isGranted } && currentPermissionsStates == newPermissionStates) {
                            onCannotRequestPermission()
                        } else {
                            for (permission in permissions) {
                                val currentState = currentPermissionsStates[permission]
                                val newState = newPermissionStates[permission]
                                if (
                                    currentState is PermissionStatus.Denied && currentState.shouldShowRationale &&
                                    newState is PermissionStatus.Denied && !newState.shouldShowRationale
                                ) {
                                    onCannotRequestPermission()
                                    break
                                }
                            }
                        }

                        onPermissionsResult(newPermissions)
                    }
            )

    return remember(permissions) {
        ExtendedMultiplePermissionState(
                permissions = mutablePermissionState.permissions,
                mutablePermissionState = mutablePermissionState,
                onCannotRequestPermission = onCannotRequestPermission,
                atDoubleDenial = atDoubleDenialForPermission,
                onLaunchedPermissionRequest = {
                    currentPermissionsStates = permissionStates(context, permissions)

                    Log.d(
                        TAG,
                        """
                            onLaunchedPermissionRequest
                            current: $currentPermissionsStates
                        """.trimIndent()
                    )
                },
        )
    }
}

@OptIn(ExperimentalPermissionsApi::class)
@Stable
class ExtendedPermissionState(
        override val permission: String,
        private val mutablePermissionState: PermissionState,
        private val atDoubleDenial: Boolean,
        private val onLaunchedPermissionRequest: (shouldShowRationale: Boolean) -> Unit,
        private val onCannotRequestPermission: () -> Unit
) : PermissionState {
    override val status: PermissionStatus
        get() = mutablePermissionState.status

    override fun launchPermissionRequest() {
        onLaunchedPermissionRequest(mutablePermissionState.status.shouldShowRationale)
        if (atDoubleDenial) onCannotRequestPermission()
        else mutablePermissionState.launchPermissionRequest()
    }
}

@OptIn(ExperimentalPermissionsApi::class)
@Stable
class ExtendedMultiplePermissionState(
        override val permissions: List<PermissionState>,
        private val mutablePermissionState: MultiplePermissionsState,
        private val atDoubleDenial: Boolean,
        private val onLaunchedPermissionRequest: (shouldShowRationale: Boolean) -> Unit,
        private val onCannotRequestPermission: () -> Unit
) : MultiplePermissionsState {
    override val revokedPermissions: List<PermissionState> by derivedStateOf {
        permissions.filter { it.status != PermissionStatus.Granted }
    }

    override val allPermissionsGranted: Boolean by derivedStateOf {
        permissions.all { it.status.isGranted } || // Up to date when the lifecycle is resumed
        revokedPermissions.isEmpty() // Up to date when the user launches the action
    }

    override val shouldShowRationale: Boolean by derivedStateOf {
        permissions.any { it.status.shouldShowRationale } &&
                permissions.none { !it.status.isGranted && !it.status.shouldShowRationale }
    }

    override fun launchMultiplePermissionRequest() {
        onLaunchedPermissionRequest(mutablePermissionState.shouldShowRationale)
        if (atDoubleDenial) onCannotRequestPermission()
        else mutablePermissionState.launchMultiplePermissionRequest()
    }
}
```
