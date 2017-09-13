'use strict';

describe('authUtil', function() {
	const authUtil = require('../util.js');

	it('should contain expected functions', function() {
		expect(authUtil).toEqual({
			combinePermissions: jasmine.any(Function),
			getPermissionIdsFromMask: jasmine.any(Function),
			hasAccessTo: jasmine.any(Function),
			hasAccessToAny: jasmine.any(Function),
			hasAccessToAll: jasmine.any(Function),
			getMaskFromPermissionIds: jasmine.any(Function)
		});
	});

	describe('when accessing combinePermissions', function() {
		it('should return an empty array on invalid permissions types', function() {
			const perms = authUtil.combinePermissions(null, null);
			expect(perms).toEqual([]);
		});

		it('should return the permissions array if one of them is non-array', function() {
			let perms = authUtil.combinePermissions([2], null);
			expect(perms).toEqual([2]);

			perms = authUtil.combinePermissions(null, [3]);
			expect(perms).toEqual([3]);
		});

		it('should merge the permission sets', function() {
			const perms = authUtil.combinePermissions([2, null, -1], [8, 31, null, null]);
			expect(perms).toEqual([10, 31, -1, 0]);
		});
	});

	describe('when accessing getPermissionIdsFromMask', function() {
		it('should return empty array on non-array type', function() {
			const permIds = authUtil.getPermissionIdsFromMask(null);
			expect(permIds).toEqual([]);
		});

		it('should ignore min-bounds permission values', function() {
			const permIds = authUtil.getPermissionIdsFromMask([-2147483649, 2]);
			expect(permIds).toEqual([1]);
		});

		it('should ignore max-bounds permission values', function() {
			const permIds = authUtil.getPermissionIdsFromMask([2147483648, 2]);
			expect(permIds).toEqual([1]);
		});

		it('should return proper permission ids', function() {
			const permIds = authUtil.getPermissionIdsFromMask([31, 1]);
			expect(permIds).toEqual([0, 1, 2, 3, 4, 32]);
		});
	});

	describe('when accessing hasAccessTo', function() {
		it('should deny access to non-integer permission requests', function() {
			const access = authUtil.hasAccessTo('1', []);
			expect(access).toBe(false);
		});

		it('should deny access to negative integer requets', function() {
			const access = authUtil.hasAccessTo(-1, []);
			expect(access).toBe(false);
		});

		it('should deny access to non-array user permissions', function() {
			const access = authUtil.hasAccessTo(1, '123');
			expect(access).toBe(false);
		});

		it('should check access correctly', function() {
			let access  = authUtil.hasAccessTo(1, [-1, 5]);
			expect(access).toBe(true);

			//upper bound of first bucket
			access = authUtil.hasAccessTo(31, [-1, 5]);
			expect(access).toBe(true);

			//lower bound of first bucket
			access = authUtil.hasAccessTo(32, [-1, 5]);
			expect(access).toBe(true);

			access = authUtil.hasAccessTo(55, [-1, 5]);
			expect(access).toBe(false);

			//out of bounds, should be looking for bucket 8
			access = authUtil.hasAccessTo(256, [-1, 5]);
			expect(access).toBe(false);
		});
	});

	describe('when accessing hasAccessToAny', function() {
		it('should deny access to non-array permission requests', function() {
			const access = authUtil.hasAccessToAny('1', []);
			expect(access).toBe(false);
		});

		it('should deny access to non-array user permissions', function() {
			const access = authUtil.hasAccessToAny([1], '123');
			expect(access).toBe(false);
		});

		it('should ignore negative integer requets', function() {
			const access = authUtil.hasAccessToAny([-1, 2], [5]);
			expect(access).toBe(true);
		});

		it('should ignore non-integer permission requests', function() {
			const access = authUtil.hasAccessToAny(['1', 2], [5]);
			expect(access).toBe(true);
		});

		it('should check access correctly', function() {
			let access = authUtil.hasAccessToAny([1, 32], [null, 1]);
			expect(access).toBe(true);

			access = authUtil.hasAccessToAny([1, 32], []);
			expect(access).toBe(false);

			access = authUtil.hasAccessToAny([1, 32], [2]);
			expect(access).toBe(true);
		});
	});

	describe('when accessing hasAccessToAll', function() {
		it('should deny access to non-array permission requests', function() {
			const access = authUtil.hasAccessToAll('1', []);
			expect(access).toBe(false);
		});

		it('should deny access to non-array user permissions', function() {
			const access = authUtil.hasAccessToAll([1], '123');
			expect(access).toBe(false);
		});

		it('should deny access to negative integer requets', function() {
			const access = authUtil.hasAccessToAll([-1, 1], [5]);
			expect(access).toBe(false);
		});

		it('should deny access to non-integer requets', function() {
			const access = authUtil.hasAccessToAll(['-1', 1], [5]);
			expect(access).toBe(false);
		});

		it('should check access correctly', function() {
			let access = authUtil.hasAccessToAll([1, 32], [2, 1]);
			expect(access).toBe(true);

			access = authUtil.hasAccessToAll([1, 32], [1, 1]);
			expect(access).toBe(false);
		});
	});

	describe('when accessing getMaskFromPermissionIds', function() {
		it('should default to empty array on invalid input', function() {
			const mask = authUtil.getMaskFromPermissionIds('');
			expect(mask).toEqual([]);
		});

		it('should default to empty array on invalid input and invalid mask', function() {
			const mask = authUtil.getMaskFromPermissionIds('', '');
			expect(mask).toEqual([]);
		});

		it('should default to mask on invalid input', function() {
			const mask = authUtil.getMaskFromPermissionIds('', [-1]);
			expect(mask).toEqual([-1]);
		});

		it('should convert a permission id to a mask', function() {
			let mask = authUtil.getMaskFromPermissionIds(1);
			expect(mask).toEqual([2]);

			mask = authUtil.getMaskFromPermissionIds([1]);
			expect(mask).toEqual([2]);

			mask = authUtil.getMaskFromPermissionIds([32]);
			expect(mask).toEqual([0, 1]);

			mask = authUtil.getMaskFromPermissionIds(32, [null, '']);
			expect(mask).toEqual([0, 1]);
		});
	});
});
