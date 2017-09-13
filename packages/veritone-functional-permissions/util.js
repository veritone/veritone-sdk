module.exports = {
	combinePermissions: function combinePermissions(permissions1, permissions2) {
		if (!Array.isArray(permissions1) && !Array.isArray(permissions2)) {
			return [];
		} else if (!Array.isArray(permissions1)) {
			return permissions2.slice();
		} else if (!Array.isArray(permissions2)) {
			return permissions1.slice();
		}

		const permissionMasks = [];
		//combine all the permission masks across the user's roles
		const maxIndex = permissions1.length > permissions2.length ? permissions1.length : permissions2.length;
		for (let i = 0; i < maxIndex; i++) {
			let mask = permissions1[i] || 0;
			mask |= permissions2[i] || 0;
			permissionMasks[i] = mask;
		}

		return permissionMasks;
	},
	getPermissionIdsFromMask: function getPermissionIdsFromMask(permissions) {
		if (!Array.isArray(permissions)) {
			return [];
		}

		const permissionIds = [];
		let bucket = 0;
		permissions.forEach(function readBucket(mask) {
			//invalid mask range
			if (mask > 0x7fffffff || mask < -0x80000000) {
				return;
			}

			for (let shift = mask, index = 0; shift; shift >>>= 1, index++) {
				if (shift & 1) {
					permissionIds.push(bucket * 32 + index);
				}
			}

			bucket++;
		});

		return permissionIds;
	},
	getMaskFromPermissionIds: function getMaskFromPermissionIds(permissionIds, mask) {
		if (!Array.isArray(permissionIds)) {
			if (!Number.isInteger(permissionIds)) {
				return mask || [];
			}
			permissionIds = [permissionIds];
		}

		mask = mask || [];
		permissionIds.forEach(function setMask(permissionId) {
			const bucket = Math.floor(permissionId / 32);
			const index = permissionId % 32;

			//initialize the buckets with 0, if needed
			for (let i = 0; i <= bucket; i++) {
				if (!Number.isInteger(mask[i])) {
					mask[i] = 0;
				}
			}

			mask[bucket] |= 1 << index;
		});

		return mask;
	},
	hasAccessTo: function hasAccessTo(permissionId, userPermissions) {
		if (!Number.isInteger(permissionId) || permissionId < 1 || !Array.isArray(userPermissions)) {
			return false;
		}

		const index = permissionId % 32;
		const bucket = Math.floor(permissionId / 32);
		if (((userPermissions[bucket] >>> index) & 1)) {
			return true;
		}

		return false;
	},
	hasAccessToAny: function hasAccessToAny(permissionIds, userPermissions) {
		if (!Array.isArray(permissionIds) || !Array.isArray(userPermissions)) {
			return false;
		}

		return permissionIds.some(id => this.hasAccessTo(id, userPermissions));
	},
	hasAccessToAll: function hasAccessToAll(permissionIds, userPermissions) {
		if (!Array.isArray(permissionIds) || !Array.isArray(userPermissions)) {
			return false;
		}

		return permissionIds.every(id => this.hasAccessTo(id, userPermissions));
	}
};