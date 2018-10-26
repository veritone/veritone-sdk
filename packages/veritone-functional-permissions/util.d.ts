/**
 * Combine Permissions.
 * This combines two permissions into one.
 */
export declare function combinePermissions(
  permissions1: ReadonlyArray<number>,
  permissions2: ReadonlyArray<number>
): ReadonlyArray<number>;

/**
 * Get Permissions IDs from mask.
 * This converts a mask to permission ids.
 */
export declare function getPermissionIdsFromMask(
  permissions: ReadonlyArray<number>
): ReadonlyArray<number>;

/**
 * Get Mask From Permissions.
 * This converts permission ids to a mask. Optionally, the caller can pass in a mask that will be used to add the permissions to.
 */
export declare function getMaskFromPermissionIds(
  permissionIds: number | ReadonlyArray<number>,
  mask?: ReadonlyArray<number>
): ReadonlyArray<number>;

/**
 * Has Permission.
 * This checks if the user's permissions satisfies the the requested permission check.
 */
export declare function hasAccessTo(
  permissionId: number,
  userPermissions: ReadonlyArray<number>
): boolean;

/**
 * Has Any Permission.
 * This checks if the user's permissions satisfies any of the requested permission checks.
 */
export declare function hasAccessToAny(
  permissionIds: ReadonlyArray<number>,
  userPermissions: ReadonlyArray<number>
): boolean;

/**
 * Has All Permissions.
 * This checks if the user's permissions satisfies all of the requested permission checks.
 */
export declare function hasAccessToAll(
  permissionIds: ReadonlyArray<number>,
  userPermissions: ReadonlyArray<number>
): boolean;
