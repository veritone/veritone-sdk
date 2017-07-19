import { expect } from 'chai';

import { assertMatches } from '../apis/helper/test-util';
import folderHandlers from './folder';

const apiBaseUrl = 'http://fake.domain';

describe('Folder', function() {
	describe('getRootTreeFolder', function() {
		it('validates organizationId', function() {
			expect(() =>
				this.api.getRootTreeFolder(null, 'user-id', 'folder-type')
			).to.throw(/organizationId/);
		});

		it('validates userId', function() {
			expect(() =>
				this.api.getRootTreeFolder('org-id', null, 'folder-type')
			).to.throw(/userId/);
		});

		it('validates rootFolderType', function() {
			expect(() =>
				this.api.getRootTreeFolder('org-id', 'user-id', null)
			).to.throw(/rootFolderType/);
		});

		it('gets the widgetId with extra data in the query', function(done) {
			const query = {
				query: 'my-query'
			};

			const scope = nock(apiBaseUrl)
				.get(/org-id\/user-id\/type\/folder-type/)
				.query(query)
				.reply(200, 'ok');

			this.api.getRootTreeFolder(
				'org-id',
				'user-id',
				'folder-type',
				query,
				() => {
					scope.done();
					done();
				}
			);
		});

		it('can be called without options', function(done) {
			const scope = nock(apiBaseUrl)
				.get(/org-id\/user-id\/type\/folder-type/)
				.reply(200, 'ok');

			this.api.getRootTreeFolder('org-id', 'user-id', 'folder-type', () => {
				scope.done();
				done();
			});
		});
	});

	describe('getTreeObject', function() {
		it('validates organizationId', function() {
			expect(() => this.api.getTreeObject(null)).to.throw(/organizationId/);
		});

		it('gets the treeObjectId with extra data in the query', function(done) {
			const query = {
				query: 'my-query'
			};

			const scope = nock(apiBaseUrl)
				.get(/tree-object-id/)
				.query(query)
				.reply(200, 'ok');

			this.api.getTreeObject('tree-object-id', query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('createTreeFolder', function() {
		it('validates treeFolder', function() {
			expect(() => this.api.createTreeFolder()).to.throw(/tree folder/);
		});

		it('posts the treeFolder', function(done) {
			const data = {
				treeFolder: 'my-tree-folder'
			};

			const scope = nock(apiBaseUrl).post(/folder/, data).reply(200, 'ok');

			this.api.createTreeFolder(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('createTreeObject', function() {
		it('validates treeObject', function() {
			expect(() => this.api.createTreeObject()).to.throw(/tree object/);
		});

		it('posts the treeObject', function(done) {
			const data = {
				treeObject: 'my-tree-object'
			};

			const scope = nock(apiBaseUrl).post(/object/, data).reply(200, 'ok');

			this.api.createTreeObject(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('moveTreeFolder', function() {
		it('validates treeObjectId', function() {
			expect(() => this.api.moveTreeFolder()).to.throw(/object id/);
		});

		it('validates treeFolderMoveObj', function() {
			expect(() => this.api.moveTreeFolder('id')).to.throw(/move/);
		});

		it('puts the treeFolderMoveObj to the tree object id', function(done) {
			const data = {
				treeObject: 'my-tree-object'
			};

			const scope = nock(apiBaseUrl)
				.put(/move\/tree-object-id/, data)
				.reply(200, 'ok');

			this.api.moveTreeFolder('tree-object-id', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('updateTreeFolder', function() {
		it('validates treeObjectId', function() {
			expect(() => this.api.updateTreeFolder()).to.throw(/object id/);
		});

		it('validates treeFolderObj', function() {
			expect(() => this.api.updateTreeFolder('id')).to.throw(/folder/);
		});

		it('puts the treeFolderObj to the tree object id', function(done) {
			const data = {
				treeObject: 'my-tree-object'
			};

			const scope = nock(apiBaseUrl)
				.put(/tree-object-id/, data)
				.reply(200, 'ok');

			this.api.updateTreeFolder('tree-object-id', data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('deleteTreeFolder', function() {
		it('validates treeObjectId', function() {
			expect(() => this.api.deleteTreeFolder()).to.throw(/tree/);
		});

		it('deletes the treeObjectId with extra options in params', function(done) {
			const query = {
				my: 'query'
			};

			const scope = nock(apiBaseUrl)
				.delete(/tree-object-id/)
				.query(query)
				.reply(200, 'ok');

			this.api.deleteTreeFolder('tree-object-id', query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('deleteTreeObject', function() {
		it('validates treeObjectId', function() {
			expect(() => this.api.deleteTreeObject()).to.throw(/folder/);
		});

		it('deletes the treeObjectId with extra options in params', function(done) {
			const query = {
				my: 'query'
			};

			const scope = nock(apiBaseUrl)
				.delete(/object\/tree-object-id/)
				.query(query)
				.reply(200, 'ok');

			this.api.deleteTreeObject('tree-object-id', query, () => {
				scope.done();
				done();
			});
		});
	});

	describe('searchTreeFolder', function() {
		it('validates queryTerms', function() {
			expect(() => this.api.searchTreeFolder()).to.throw(/terms/);
		});

		it('posts to the search endpoint with queryTerms in the body', function(done) {
			const data = {
				my: 'data'
			};

			const scope = nock(apiBaseUrl).post(/search/, data).reply(200, 'ok');

			this.api.searchTreeFolder(data, () => {
				scope.done();
				done();
			});
		});
	});

	describe('folderSummary', function() {
		it('validates queryTerms', function() {
			expect(() => this.api.folderSummary()).to.throw(/terms/);
		});

		it('posts to the summary endpoint with queryTerms in the body', function(done) {
			const data = {
				my: 'data'
			};

			const scope = nock(apiBaseUrl).post(/summary/, data).reply(200, 'ok');

			this.api.folderSummary(data, () => {
				scope.done();
				done();
			});
		});
	});
});
