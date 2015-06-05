//'use strict';
//
//describe('core-server-base.rights', function() {
//
//	var Rights = require('./rights');
//
//	it('it should create (w/ rights)', function(done) {
//		var rights = new Rights({ applicationId: 'test2', rights: ['job:create','job:update'] });
//
//		expect(rights).toNotBe(undefined);
//		expect(rights.rights).toNotBe(undefined);
//		expect(rights.applicationId).toNotBe(undefined);
//		
//		expect(typeof rights).toBe('object');
//		expect(typeof rights.rights).toBe('object');
//		expect(typeof rights.applicationId).toBe('string');
//
//		expect(rights.rights.length).toNotBe(undefined);
//		expect(rights.rights.length).toBe(2);
//		expect(rights.rights[0]).toBe('job:create');
//		expect(rights.rights[1]).toBe('job:update');
//
//		expect(rights.applicationId).toBe('test2');
//
//		expect(rights.checkForRights).toNotBe(undefined);
//		expect(typeof rights.checkForRights).toBe('function');
//
//		done();
//	});
//});
