import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import VeritoneApi from '../index.js';
import { headers } from '../apis/config';

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

	describe('Recording', function() {
		// describe('createRecording', function() {
		// 	it('validates recording', function() {
		// 		expect(() =>
		// 			this.api.recording.createRecording(undefined, noop)
		// 		).to.throw();
		// 	});
		//
		// 	it('posts to API with recording in json body', function(done) {
		// 		const scope = nock(apiBaseUrl)
		// 			.post(/record/, {
		// 				startDateTime: 1,
		// 				stopDateTime: 2
		// 			})
		// 			.reply(200, 'ok');
		//
		// 		this.api.recording.createRecording(
		// 			{
		// 				startDateTime: 1,
		// 				stopDateTime: 2
		// 			},
		// 			() => {
		// 				scope.done();
		// 				done();
		// 			}
		// 		);
		// 	});
		// });
		//
		// describe('getRecordings', function() {
		// 	it('can be called with only a callback', function(done) {
		// 		const scope = nock(apiBaseUrl).get(/record/).reply(200, 'ok');
		//
		// 		this.api.recording.getRecordings(() => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		//
		// 	it('can be called with options.limit and options.offset', function(done) {
		// 		const scope = nock(apiBaseUrl)
		// 			.get(/record/)
		// 			.query({
		// 				offset: 1,
		// 				limit: 2
		// 			})
		// 			.reply(200, 'ok');
		//
		// 		this.api.recording.getRecordings({ offset: 1, limit: 2 }, () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		//
		// 	it('can be called with limit only', function(done) {
		// 		const scope = nock(apiBaseUrl)
		// 			.get(/record/)
		// 			.query({
		// 				limit: 2
		// 			})
		// 			.reply(200, 'ok');
		//
		// 		this.api.recording.getRecordings({ limit: 2 }, () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		//
		// 	it('can be called with offset only', function(done) {
		// 		const scope = nock(apiBaseUrl)
		// 			.get(/record/)
		// 			.query({
		// 				offset: 2
		// 			})
		// 			.reply(200, 'ok');
		//
		// 		this.api.recording.getRecordings({ offset: 2 }, () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		// });
		//
		// describe('getRecording', function() {
		// 	it('validates recordingId', function() {
		// 		const incorrectIds = [undefined, noop];
		// 		const correctIds = [123, '123'];
		//
		// 		incorrectIds.forEach(i => {
		// 			expect(() => this.api.recording.getRecording(i, noop)).to.throw();
		// 		});
		//
		// 		correctIds.forEach(i => {
		// 			expect(() => this.api.recording.getRecording(i, noop)).not.to.throw();
		// 		});
		// 	});
		//
		// 	it('makes a get request to the api with the id', function(done) {
		// 		const scope = nock(apiBaseUrl)
		// 			.get(/some-recording-id/)
		// 			.reply(200, 'ok');
		//
		// 		this.api.recording.getRecording('some-recording-id', () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		// });
		//
		// describe('updateRecording', function() {
		// 	it('validates recording', function() {
		// 		expect(() =>
		// 			this.api.recording.updateRecording(undefined, noop)
		// 		).to.throw();
		// 	});
		//
		// 	it('makes a put request to the api with the id and body', function(done) {
		// 		const recording = {
		// 			startDateTime: 1,
		// 			stopDateTime: 2,
		// 			recordingId: 'some-recording-id'
		// 		};
		//
		// 		const scope = nock(apiBaseUrl)
		// 			.put(/some-recording-id/, recording)
		// 			.reply(200, 'ok');
		//
		// 		this.api.recording.updateRecording(recording, () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		// });
		//
		// describe('updateRecordingFolder', function() {
		// 	it('validates folder', function() {
		// 		expect(() => this.api.updateRecordingFolder(undefined, noop)).to.throw(
		// 			/folder/
		// 		);
		// 		expect(() => this.api.updateRecordingFolder({}, noop)).to.throw(
		// 			/folder/
		// 		);
		// 		expect(() =>
		// 			this.api.updateRecordingFolder(
		// 				{
		// 					folderId: '2'
		// 				},
		// 				noop
		// 			)
		// 		).not.to.throw();
		// 	});
		//
		// 	it('makes a put request to the api with the folder', function(done) {
		// 		const folder = {
		// 			folderId: 'some-folder-id'
		// 		};
		//
		// 		const scope = nock(apiBaseUrl)
		// 			.put(/some-folder-id/, folder)
		// 			.reply(200, 'ok');
		//
		// 		this.api.updateRecordingFolder(folder, () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		// });
		//
		// describe('updateCms', function() {
		// 	it('validates recordingId', function() {
		// 		expect(() => this.api.updateCms(undefined, noop)).to.throw(
		// 			/recordingId/
		// 		);
		//
		// 		expect(() => this.api.updateCms({}, noop)).to.throw(/recordingId/);
		//
		// 		expect(() => this.api.updateCms('2', noop)).not.to.throw();
		// 	});
		//
		// 	it('makes a put request to the correct endpoint (no body)', function(
		// 		done
		// 	) {
		// 		const scope = nock(apiBaseUrl).put(/some-id\/cms/).reply(200, 'ok');
		//
		// 		this.api.updateCms('some-id', () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		// });
		//
		// describe('deleteRecording', function() {
		// 	it('validates recordingId', function() {
		// 		expect(() => this.api.deleteRecording(undefined, noop)).to.throw(
		// 			/recordingId/
		// 		);
		//
		// 		expect(() => this.api.deleteRecording({}, noop)).to.throw(
		// 			/recordingId/
		// 		);
		//
		// 		expect(() => this.api.deleteRecording('2', noop)).not.to.throw();
		// 	});
		//
		// 	it('makes a delete request to the correct endpoint', function(done) {
		// 		const scope = nock(apiBaseUrl).delete(/some-id/).reply(200, 'ok');
		//
		// 		this.api.deleteRecording('some-id', () => {
		// 			scope.done();
		// 			done();
		// 		});
		// 	});
		// });

		describe('getRecordingTranscript', function() {
			it('validates recordingId', function() {
				expect(() => this.api.getRecordingTranscript(undefined, noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getRecordingTranscript({}, noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getRecordingTranscript('2', noop)).not.to.throw();
			});

			it("makes a get request to the recording's transcript", function(done) {
				const scope = nock(apiBaseUrl)
					.get(/some-id\/transcript/)
					.reply(200, 'ok');

				this.api.getRecordingTranscript('some-id', () => {
					scope.done();
					done();
				});
			});
		});

		describe('getRecordingMedia', function() {
			it('validates recordingId', function() {
				expect(() => this.api.getRecordingMedia(undefined, noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getRecordingMedia({}, noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getRecordingMedia('2', noop)).not.to.throw();
			});

			it("makes a get request to the recording's media", function(done) {
				const scope = nock(apiBaseUrl).get(/some-id\/media/).reply(200, 'ok');

				this.api.getRecordingMedia('some-id', () => {
					scope.done();
					done();
				});
			});

			it('provides progress and success callbacks', function(done) {
				const fs = require('fs');

				const contentLength = 10000;
				const metaHeader = { meta: 'meta-header' };
				const scope = nock(apiBaseUrl)
					.get(/some-id\/media/)
					.reply(200, () => fs.createReadStream('index.js'), {
						'Content-length': contentLength,
						'Content-type': 'some-type',
						[headers.metadataHeader]: JSON.stringify(metaHeader)
					});

				let sawProgress = false;

				this.api.getRecordingMedia(
					'some-id',
					(err, res) => {
						expect(res.contentType).to.equal('some-type');
						expect(res.metadata).to.deep.equal(metaHeader);
						expect(err).to.equal(null);
					},
					progress => {
						expect(progress.received).to.be.a('number');
						expect(progress.total).to.be.a('number');

						if (progress.received !== progress.total) {
							sawProgress = true;
						} else {
							expect(sawProgress).to.equal(true);

							scope.done();
							done();
						}
					}
				);
			});
		});

		describe('getRecordingAssets', function() {
			it('validates recordingId', function() {
				expect(() => this.api.getRecordingAssets(undefined, noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getRecordingAssets({}, noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getRecordingAssets('2', noop)).not.to.throw();
			});

			it("makes a get request to the recording's asset", function(done) {
				const scope = nock(apiBaseUrl).get(/some-id\/asset/).reply(200, 'ok');

				this.api.getRecordingAssets('some-id', () => {
					scope.done();
					done();
				});
			});
		});

		describe('getAsset', function() {
			it('validates recordingId', function() {
				expect(() => this.api.getAsset(undefined, '5', noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getAsset({}, '5', noop)).to.throw(/recordingId/);

				expect(() => this.api.getAsset('2', '5', noop)).not.to.throw();
			});

			it('validates assetId', function() {
				expect(() => this.api.getAsset('2', undefined, noop)).to.throw(
					/assetId/
				);

				expect(() => this.api.getAsset('2', '5', noop)).not.to.throw(/assetId/);
			});

			it('provides progress and success callbacks', function(done) {
				const fs = require('fs');

				const contentLength = 10000;
				const metaHeader = { meta: 'meta-header' };
				const scope = nock(apiBaseUrl)
					.get(/recording-id\/asset\/asset-id/)
					.reply(200, () => fs.createReadStream('index.js'), {
						'Content-length': contentLength,
						'Content-type': 'some-type',
						[headers.metadataHeader]: JSON.stringify(metaHeader)
					});

				let sawProgress = false;

				this.api.getAsset(
					'recording-id',
					'asset-id',
					(err, res) => {
						expect(res.contentType).to.equal('some-type');
						expect(res.metadata).to.deep.equal(metaHeader);
						expect(err).to.equal(null);
					},
					progress => {
						expect(progress.received).to.be.a('number');
						expect(progress.total).to.be.a('number');
						if (progress.received !== progress.total) {
							sawProgress = true;
						} else {
							expect(sawProgress).to.equal(true);

							scope.done();
							done();
						}
					}
				);
			});
		});
		describe('getAssetMetadata', function() {
			it('validates recordingId', function() {
				expect(() => this.api.getAssetMetadata(undefined, '5', noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getAssetMetadata({}, '5', noop)).to.throw(
					/recordingId/
				);

				expect(() => this.api.getAssetMetadata('2', '5', noop)).not.to.throw();
			});

			it('validates assetId', function() {
				expect(() => this.api.getAssetMetadata('2', undefined, noop)).to.throw(
					/assetId/
				);

				expect(() => this.api.getAssetMetadata('2', '5', noop)).not.to.throw(
					/assetId/
				);
			});

			it("makes a get request to the recording's asset metadata", function(
				done
			) {
				const scope = nock(apiBaseUrl)
					.get(/rec-id\/asset\/asset-id\/meta/)
					.reply(200, 'ok');

				this.api.getAssetMetadata('rec-id', 'asset-id', () => {
					scope.done();
					done();
				});
			});
		});
		describe('updateAssetMetadata', function() {
			it('validates recordingId', function() {
				const asset = {
					assetId: '1'
				};

				expect(() =>
					this.api.updateAssetMetadata(undefined, asset, noop)
				).to.throw(/recordingId/);

				expect(() => this.api.updateAssetMetadata({}, asset, noop)).to.throw(
					/recordingId/
				);

				expect(() =>
					this.api.updateAssetMetadata('2', asset, noop)
				).not.to.throw();
			});

			it('validates assetId', function() {
				expect(() =>
					this.api.updateAssetMetadata('2', undefined, noop)
				).to.throw(/asset/);

				expect(() => this.api.updateAssetMetadata('2', {}, noop)).to.throw(
					/assetId/
				);

				expect(() =>
					this.api.updateAssetMetadata(
						'2',
						{
							assetId: '1'
						},
						noop
					)
				).not.to.throw(/asset/);
			});

			it("makes a put request to the recording's asset metadata", function(
				done
			) {
				const scope = nock(apiBaseUrl)
					.put(/rec-id\/asset\/asset-id\/meta/, {
						meta: 'meta'
					})
					.reply(200, 'ok');

				this.api.updateAssetMetadata(
					'rec-id',
					{ assetId: 'asset-id', metadata: { meta: 'meta'} },
					() => {
						scope.done();
						done();
					}
				);
			});
		});
		// xdescribe('saveAssetToFile');
		// xdescribe('createAsset');
		// xdescribe('updateAsset');
		// xdescribe('deleteAsset');
	});

	// xdescribe('Asset');
	// xdescribe('Job');
	// xdescribe('Engine');
	// xdescribe('Task');
	// xdescribe('DropboxWatcher');
	// xdescribe('Faces');
	// xdescribe('Mentions');
	// xdescribe('Widgets');
	// xdescribe('Folder');
	// xdescribe('Collection');
	// xdescribe('Ingestion');
});
