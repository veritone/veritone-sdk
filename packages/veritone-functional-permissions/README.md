# functional-permissions-lib

**Table of Contents**

- [Summary](#summary)
- [Getting Started](#getting-started)
    - [Depedencies](#depedencies)
- [Usage](#usage)
    - [Has Permision](#has-permission)
    - [Has Any Permission](#has-any-permission)
    - [Has All Permissions](#has-all-permissions)
    - [Get Mask From Permissions](#get-mask-from-permissions)
- [Go package](#go-package)

## Summary
Functional permissions library to perform permission checking.
Permissions are checked against the user permissions (an array of integers), that can be retrieved from core-admin-server.
This library may be used on either servers or in the browser, anywhere where it can be `require()`ed.

## Getting Started

### Depedencies
* Something that can `require()` (e.g. Node 6, RequireJS, webpack)

## Usage

### Has Permission
This checks if the user's permissions satisfies the the requested permission check.

```
const perm = require('functional-permissions-lib');
const adminPerms = perm.permissions.admin;
const userInfo = {
    permissions: [-8125, 31]
}

if (perm.util.hasAccessTo(adminPerms.org.create, userInfo.permissions)) {
    //allow user to perform action
} else {
    //deny the user
}
```

### Has Any Permission
This checks if the user's permissions satisfies any of the requested permission checks.

```
const perm = require('functional-permissions-lib');
const adminPerms = perm.permissions.admin;
const userInfo = {
    permissions: [-8125, 31]
}

if (perm.util.hasAccessToAny([adminPerms.org.create, adminPerms.group.create, adminPerms.role.create], userInfo.permissions)) {
    //allow user to perform action
} else {
    //deny the user
}
```

### Has All Permissions
This checks if the user's permissions satisfies all of the requested permission checks.

```
const perm = require('functional-permissions-lib');
const adminPerms = perm.permissions.admin;
const userInfo = {
    permissions: [-8125, 31]
}

if (perm.util.hasAccessToAll([adminPerms.org.create, adminPerms.group.create, adminPerms.role.create], userInfo.permissions)) {
    //allow user to perform action
} else {
    //deny the user
}
```

### Get Mask From Permissions
This converts permission ids to a mask.
Optionally, the caller can pass in a mask that will be used to add the permissions to.

```
const mask = getMaskFromPermissionIds([perm.permissions.admin]);

OR

const mask = getMaskFromPermissionIds([perm.permissions.admin], [-1526]);
```

## Go package

This repo an also be imported as a go package to help resolve user permissions in go projects.

```go
import (
	permissions "github.com/veritone/functional-permissions-lib"
)

// sample usage
func SomethingUseful(...) {
	...
	masks := []int{2147483648, 2}

	// getting permission IDs from masks
	perms := GetPermissionIDsFromMasks(masks)
	...

	
	perms2 := []int{1, 13, 26, 62}

	// getting permission masks from IDs
	masks2 := GetMasksFromPermissionIDs(perms2)

	...

	// getting permission ID for a permission path
	permID, err := GetPermissionID("cms.media.read")
	defer permission.Free()
	...

}
```
