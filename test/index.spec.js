import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';
import { endpoints } from '../apis/config';

const noop = () => {};
const apiBaseUrl = 'http://fake.domain';

describe('API methods', function() {
	beforeEach(function() {
		this.api = VeritoneApi({
			token: 'api-token-abc',
			baseUrl: apiBaseUrl
		});
	});

	afterEach(function() {
		nock.cleanAll();
	});

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

	describe('Faceset', function() {
		describe('queryFaceset', function() {
			it('validates q', function() {
				expect(() => this.api.queryFaceset()).to.throw(/query/);
			});

			it('makes the correct request to the api', function(done) {
				const scope = nock(apiBaseUrl)
					.get(/autocomplete\/my-face/)
					.reply(200, 'ok');

				this.api.queryFaceset('my-face', () => {
					scope.done();
					done();
				});
			});
		});

		describe('createFaceset', function() {
			it('validates faceSet', function() {
				expect(() => this.api.createFaceset()).to.throw(/faceset/);
				expect(() => this.api.createFaceset({})).to.throw(/faceSetId/);
			});

			it('makes the correct request to the api', function(done) {
				const data = {
					faceSetId: 'my-face'
				};

				const scope = nock(apiBaseUrl).post(/my-face/, data).reply(200, 'ok');

				this.api.createFaceset(data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateFaceset', function() {
			it('validates faceSet', function() {
				expect(() => this.api.updateFaceset()).to.throw(/faceset/);
				expect(() => this.api.updateFaceset({})).to.throw(/faceSetId/);
			});

			it('makes the correct request to the api', function(done) {
				const data = {
					faceSetId: 'my-face'
				};

				const scope = nock(apiBaseUrl).put(/my-face/, data).reply(200, 'ok');

				this.api.updateFaceset(data, () => {
					scope.done();
					done();
				});
			});
		});
	});

	describe('Mentions', function() {
		describe('searchMentions', function() {
			it('posts to the search api with the body', function(done) {
				const data = {
					option: 'my-option'
				};

				const scope = nock(apiBaseUrl).post(/search/, data).reply(200, 'ok');

				this.api.searchMentions(data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('getMentions', function() {
			it('gets the mentionId with filter in the query', function(done) {
				const filter = {
					filter: 'my-filter'
				};

				const scope = nock(apiBaseUrl)
					.get(/my-mention/)
					.query(filter)
					.reply(200, 'ok');

				this.api.getMentions('my-mention', filter, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateMentionSelectively', function() {
			it('puts to the mentionId with the body', function(done) {
				const data = {
					mention: 'my-mention'
				};

				const scope = nock(apiBaseUrl).put(/my-mention/, data).reply(200, 'ok');

				this.api.updateMentionSelectively('my-mention', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('createMentionComment', function() {
			it('puts to the mentionId with the comment', function(done) {
				const data = {
					comment: 'my-comment'
				};

				const scope = nock(apiBaseUrl)
					.post(/my-mention\/comment/, data)
					.reply(200, 'ok');

				this.api.createMentionComment('my-mention', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateMentionComment', function() {
			it('puts to the mentionId/commentId with the comment', function(done) {
				const data = {
					comment: 'my-comment'
				};

				const scope = nock(apiBaseUrl)
					.put(/my-mention\/comment\/my-comment/, data)
					.reply(200, 'ok');

				this.api.updateMentionComment('my-mention', 'my-comment', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('deleteMentionComment', function() {
			it('deletes to the mentionId/commentId with the comment', function(done) {
				const data = {
					comment: 'my-comment'
				};

				const scope = nock(apiBaseUrl)
					.delete(/my-mention\/comment\/my-comment/)
					.query(data)
					.reply(200, 'ok');

				this.api.deleteMentionComment('my-mention', 'my-comment', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('createMentionRating', function() {
			it('posts to the mentionId rating with the rating', function(done) {
				const data = {
					rating: 'my-rating'
				};

				const scope = nock(apiBaseUrl)
					.post(/my-mention\/rating/, data)
					.reply(200, 'ok');

				this.api.createMentionRating('my-mention', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateMentionRating', function() {
			it('puts to the mentionId rating with the rating', function(done) {
				const data = {
					rating: 'my-rating'
				};

				const scope = nock(apiBaseUrl)
					.put(/my-mention\/comment\/my-rating/, data)
					.reply(200, 'ok');

				this.api.updateMentionRating('my-mention', 'my-rating', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('deleteMentionRating', function() {
			it('deletes to the mentionId/commentId with the comment', function(done) {
				const data = {
					rating: 'my-rating'
				};

				const scope = nock(apiBaseUrl)
					.delete(/my-mention\/comment\/my-rating/)
					.query(data)
					.reply(200, 'ok');

				this.api.deleteMentionRating('my-mention', 'my-rating', data, () => {
					scope.done();
					done();
				});
			});
		});
	});

	describe('Widgets', function() {
		describe('getWidget', function() {
			it('validates widgetId', function() {
				expect(() => this.api.getWidget()).to.throw(/widgetId/);
			});

			it('gets the widgetId with extra data in the query', function(done) {
				const query = {
					query: 'my-query'
				};

				const scope = nock(apiBaseUrl)
					.get(/my-widget/)
					.query(query)
					.reply(200, 'ok');

				this.api.getWidget('my-widget', query, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateWidget', function() {
			it('puts to the widget endpoint with the widget', function(done) {
				const data = {
					widget: 'my-widget'
				};

				const scope = nock(apiBaseUrl)
					.put(endpoints.widget, data)
					.reply(200, 'ok');

				this.api.updateWidget(data, () => {
					scope.done();
					done();
				});
			});
		});
	});

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

			it('deletes the treeObjectId with extra options in params', function(
				done
			) {
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

			it('deletes the treeObjectId with extra options in params', function(
				done
			) {
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

			it('posts to the search endpoint with queryTerms in the body', function(
				done
			) {
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

			it('posts to the summary endpoint with queryTerms in the body', function(
				done
			) {
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
	describe('Collection', function() {
		describe('createCollection', function() {
			it('posts to the collection endpoint with collection in the body', function(
				done
			) {
				const data = {
					my: 'collection'
				};

				const scope = nock(apiBaseUrl)
					.post(/collection/, data)
					.reply(200, 'ok');

				this.api.createCollection(data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('getCollections', function() {
			it('makes a get request to collections with the provided query', function(
				done
			) {
				const query = {
					my: 'query'
				};

				const scope = nock(apiBaseUrl)
					.get(/collection/)
					.query(query)
					.reply(200, 'ok');

				this.api.getCollections(query, () => {
					scope.done();
					done();
				});
			});
		});

		describe('getCollection', function() {
			it('validates collectionId', function() {
				expect(() => this.api.getCollection()).to.throw(/collectionId/);
			});

			it('makes a get request to collections with the provided query', function(
				done
			) {
				const query = {
					my: 'query'
				};

				const scope = nock(apiBaseUrl)
					.get(/collection-id/)
					.query(query)
					.reply(200, 'ok');

				this.api.getCollection('collection-id', query, () => {
					scope.done();
					done();
				});
			});
		});

		describe('updateCollection', function() {
			it('validates collectionId', function() {
				expect(() => this.api.updateCollection()).to.throw(/collectionId/);
			});

			it('makes a put request to collection with the provided data', function(
				done
			) {
				const data = {
					my: 'data'
				};

				const scope = nock(apiBaseUrl)
					.put(/collection-id/, data)
					.reply(200, 'ok');

				this.api.updateCollection('collection-id', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('deleteCollection', function() {
			it('validates collectionId', function() {
				expect(() => this.api.deleteCollection()).to.throw(/collectionId/);
			});

			it('makes a delete request to the collection with the id and options in the query', function(
				done
			) {
				const options = {
					additional: 'options'
				};

				const scope = nock(apiBaseUrl)
					.delete(/collection/)
					.query({
						collectionId: 'my-collection',
						...options
					})
					.reply(200, 'ok');

				this.api.deleteCollection('my-collection', options, () => {
					scope.done();
					done();
				});
			});

			it('works with multiple collectionIds', function(done) {
				const scope = nock(apiBaseUrl)
					.delete(/collection/)
					.query({
						collectionId: 'one,two'
					})
					.reply(200, 'ok');

				this.api.deleteCollection(['one', 'two'], () => {
					scope.done();
					done();
				});
			});
		});

		describe('shareCollection', function() {
			it('validates collectionId', function() {
				expect(() => this.api.shareCollection()).to.throw(/collectionId/);
			});

			it("posts to the collection's share endpoint with the share", function(
				done
			) {
				const data = {
					data: 'ok'
				};

				const scope = nock(apiBaseUrl)
					.post(/my-collection\/share/, data)
					.reply(200, 'ok');

				this.api.shareCollection('my-collection', data, () => {
					scope.done();
					done();
				});
			});
		});

		describe('shareMentionFromCollection', function() {
			it('validates collectionId', function() {
				expect(() => this.api.shareMentionFromCollection()).to.throw(
					/collectionId/
				);
			});

			it('validates collectionId', function() {
				expect(() =>
					this.api.shareMentionFromCollection('collection-id')
				).to.throw(/mentionId/);
			});

			it('posts to the collection/mention share endpoint with the share', function(
				done
			) {
				const data = {
					data: 'ok'
				};

				const scope = nock(apiBaseUrl)
					.post(/my-collection\/mention\/my-mention\/share/, data)
					.reply(200, 'ok');

				this.api.shareMentionFromCollection(
					'my-collection',
					'my-mention',
					data,
					() => {
						scope.done();
						done();
					}
				);
			});
		});

		describe('getShare', function() {
			it('validates shareId', function() {
				expect(() => this.api.getShare()).to.throw(/shareId/);
			});

			it('gets the share', function(done) {
				const options = {
					option: 'ok'
				};

				const scope = nock(apiBaseUrl)
					.get(/share\/share-id/)
					.query(options)
					.reply(200, 'ok');

				this.api.getShare('share-id', options, () => {
					scope.done();
					done();
				});
			});
		});

		describe('deleteCollectionMention', function() {
			it('validates collectionId', function() {
				expect(() => this.api.deleteCollectionMention()).to.throw(
					/collectionId/
				);
			});

			it('validates mentionId', function() {
				expect(() =>
					this.api.deleteCollectionMention('my-collection')
				).to.throw(/mentionId/);
			});

			it('deletes to the collection/mention', function(done) {
				const options = {
					option: 'ok'
				};

				const scope = nock(apiBaseUrl)
					.delete(/collection-id\/mention\/mention-id/)
					.query(options)
					.reply(200, 'ok');

				this.api.deleteCollectionMention(
					'collection-id',
					'mention-id',
					options,
					() => {
						scope.done();
						done();
					}
				);
			});
		});

		describe('getMetricsForAllCollections', function() {
			it('gets the metrics endpoint including options', function(done) {
				const options = {
					option: 'ok'
				};

				const scope = nock(apiBaseUrl)
					.get(/metric/)
					.query(options)
					.reply(200, 'ok');

				this.api.getMetricsForAllCollections(options, () => {
					scope.done();
					done();
				});
			});
		});
	});

	describe('Ingestion', function() {
		describe('createIngestion', function() {});

		describe('getIngestions', function() {});

		describe('getIngestion', function() {});

		describe('updateIngestion', function() {});

		describe('deleteIngestion', function() {});

		describe('ingestionConnect', function() {});

		describe('verifyEmailIngestion', function() {});
	});
});
