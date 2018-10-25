export namespace util {
  /**
   * Combine Permissions.
   * This combines two permissions into one.
   */
  export function combinePermissions(
    permissions1: number[],
    permissions2: number[]
  ): number[];

  /**
   * Get Permissions IDs from mask.
   * This converts a mask to permission ids.
   */
  export function getPermissionIdsFromMask(permissions: number[]): number[];

  /**
   * Get Mask From Permissions.
   * This converts permission ids to a mask. Optionally, the caller can pass in a mask that will be used to add the permissions to.
   */
  export function getMaskFromPermissionIds(
    permissionIds: number | number[],
    mask?: number[]
  ): number[];

  /**
   * Has Permission.
   * This checks if the user's permissions satisfies the the requested permission check.
   */
  export function hasAccessTo(
    permissionId: number,
    userPermissions: number[]
  ): boolean;

  /**
   * Has Any Permission.
   * This checks if the user's permissions satisfies any of the requested permission checks.
   */
  export function hasAccessToAny(
    permissionIds: number[],
    userPermissions: number[]
  ): boolean;

  /**
   * Has All Permissions.
   * This checks if the user's permissions satisfies all of the requested permission checks.
   */
  export function hasAccessToAll(
    permissionIds: number[],
    userPermissions: number[]
  ): boolean;
}
