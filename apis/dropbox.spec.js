import { expect } from 'chai';

import { endpoints } from './config';
import { assertMatches } from '../apis/helper/test-util';
import dropboxHandlers from './dropbox';

const apiBaseUrl = 'http://fake.domain';

describe('DropboxWatcher', function() {
	describe('getDropboxWatchers', function() {
		it('validates options', function() {
			expect(() => this.api.getDropboxWatchers()).to.throw(/options/);
		});

		it('makes the correct request to the api', function(done) {
			const scope = nock(apiBaseUrl)
				.get(new RegExp(endpoints.dropboxWatcher))
				.query({
					watcherId: 'watcher-id'
				})
				.reply(200, 'ok');

			this.api.getDropboxWatchers(
				{
					watcherId: 'watcher-id'
				},
				() => {
					scope.done();
					done();
				}
			);
		});

		it('accepts watcherId as a string', function(done) {
			const scope = nock(apiBaseUrl)
				.get(new RegExp(endpoints.dropboxWatcher))
				.query({
					watcherId: 'watcher-id'
				})
				.reply(200, 'ok');

			this.api.getDropboxWatchers('watcher-id', () => {
				scope.done();
				done();
			});
		});
	});

	describe('createDropboxWatcher', function() {
		it('makes the correct request to the api', function(done) {
			const scope = nock(apiBaseUrl)
				.post(new RegExp(endpoints.dropboxWatcher), {
					watcherId: 'watcher-id'
				})
				.reply(200, 'ok');

			this.api.createDropboxWatcher(
				{
					watcherId: 'watcher-id'
				},
				() => {
					scope.done();
					done();
				}
			);
		});
	});

	describe('getDropboxWatcher', function() {
		it('validates watcherId', function() {
			expect(() => this.api.getDropboxWatcher()).to.throw(/watcherId/);
		});

		it('makes the correct request to the api', function(done) {
			const scope = nock(apiBaseUrl).get(/watcher-id/).reply(200, 'ok');

			this.api.getDropboxWatcher('watcher-id', () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateDropboxWatcher', function() {
		it('validates watcher', function() {
			expect(() => this.api.updateDropboxWatcher()).to.throw(/watcher/);
		});

		it('makes the correct request to the api', function(done) {
			const scope = nock(apiBaseUrl)
				.put(/watcher-id/, {
					watcherId: 'watcher-id'
				})
				.reply(200, 'ok');

			this.api.updateDropboxWatcher({ watcherId: 'watcher-id' }, () => {
				scope.done();
				done();
			});
		});
	});

	describe('deleteDropboxWatcher', function() {
		it('validates watcherId', function() {
			expect(() => this.api.deleteDropboxWatcher()).to.throw(/watcherId/);
		});

		it('makes the correct request to the api', function(done) {
			const scope = nock(apiBaseUrl).delete(/watcher-id/).reply(200, 'ok');

			this.api.deleteDropboxWatcher('watcher-id', () => {
				scope.done();
				done();
			});
		});
	});
});
