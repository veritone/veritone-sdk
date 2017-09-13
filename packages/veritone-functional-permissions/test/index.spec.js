'use strict';

describe('functional-permissions-lib', function() {
	const mod = require('../index.js');

	it('should contain permissions and utils', function() {
		expect(mod).toEqual({
			permissions: jasmine.any(Object),
			util: jasmine.any(Object)
		});
	});


	it('should check hasAccessTo correctly', function() {
		let access  = mod.util.hasAccessTo(mod.permissions.superadmin, [-1, 5]);
		expect(access).toBe(true);

		//upper bound of first bucket
		access = mod.util.hasAccessTo(mod.permissions.cms.task.read, [-1, 5]);
		expect(access).toBe(true);

		//lower bound of first bucket
		access = mod.util.hasAccessTo(mod.permissions.cms.task.update, [-1, 5]);
		expect(access).toBe(true);

		access = mod.util.hasAccessTo(mod.permissions.discovery.watchlist.read, [-1, 5]);
		expect(access).toBe(false);
	});
});
