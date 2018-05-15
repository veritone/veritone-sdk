import { expect } from 'chai';
import nock from 'nock';
nock.disableNetConnect();

import { headers } from './config';
import { noop } from './helper/util';
import { assertMatches } from '../apis/helper/test-util';
import recordingHandlers from './recording';

const apiBaseUrl = 'http://fake.domain';
const nonStandardHandlerOptions = {
  token: 'some-token',
  baseUrl: apiBaseUrl,
  maxRetries: 1,
  retryIntervalMs: 50
};

describe('Recording', function() {
  afterEach(function() {
    nock.cleanAll();
  });

  describe('createRecording', function() {
    it('validates recording', function() {
      expect(() =>
        recordingHandlers.createRecording(undefined, noop)
      ).to.throw();
    });

    it('posts to API with recording in json body', function() {
      const expected = {
        method: 'post',
        path: /record/,
        data: {
          startDateTime: 1,
          stopDateTime: 2
        }
      };

      const result = recordingHandlers.createRecording({
        startDateTime: 1,
        stopDateTime: 2
      });

      assertMatches(result, expected);
    });
  });

  describe('getRecordings', function() {
    it('can be called with options.limit and options.offset', function() {
      const expected = {
        method: 'get',
        path: /record/,
        query: {
          offset: 1,
          limit: 2
        }
      };

      const result = recordingHandlers.getRecordings({ offset: 1, limit: 2 });
      assertMatches(result, expected);
    });

    it('can be called with limit only', function() {
      const expected = {
        method: 'get',
        path: /record/,
        query: {
          limit: 2
        }
      };

      const result = recordingHandlers.getRecordings({ limit: 2 });
      assertMatches(result, expected);
    });

    it('can be called with offset only', function() {
      const expected = {
        method: 'get',
        path: /record/,
        query: {
          offset: 2
        }
      };

      const result = recordingHandlers.getRecordings({ offset: 2 });
      assertMatches(result, expected);
    });
  });

  describe('getRecording', function() {
    it('validates recordingId', function() {
      const incorrectIds = [undefined, noop];
      const correctIds = [123, '123'];

      incorrectIds.forEach(i => {
        expect(() => recordingHandlers.getRecording(i, noop)).to.throw();
      });

      correctIds.forEach(i => {
        expect(() => recordingHandlers.getRecording(i, noop)).not.to.throw();
      });
    });

    it('makes a get request to the api with the id', function() {
      const expected = {
        method: 'get',
        path: /some-recording-id/
      };

      const result = recordingHandlers.getRecording('some-recording-id');
      assertMatches(result, expected);
    });
  });

  describe('updateRecording', function() {
    it('validates recording', function() {
      expect(() =>
        recordingHandlers.updateRecording(undefined, noop)
      ).to.throw();
    });

    it('makes a put request to the api with the id and body', function() {
      const recording = {
        startDateTime: 1,
        stopDateTime: 2,
        recordingId: 'some-recording-id'
      };

      const expected = {
        method: 'put',
        data: recording,
        path: /some-recording-id/
      };

      const result = recordingHandlers.updateRecording(recording);
      assertMatches(result, expected);
    });
  });

  describe('updateRecordingFolder', function() {
    it('validates folder', function() {
      expect(() =>
        recordingHandlers.updateRecordingFolder(undefined, noop)
      ).to.throw(/folder/);

      expect(() => recordingHandlers.updateRecordingFolder({}, noop)).to.throw(
        /folder/
      );

      expect(() =>
        recordingHandlers.updateRecordingFolder(
          {
            folderId: '2'
          },
          noop
        )
      ).not.to.throw();
    });

    it('makes a put request to the api with the folder', function() {
      const folder = {
        folderId: 'some-folder-id'
      };

      const expected = {
        method: 'put',
        data: folder,
        path: /some-folder-id/
      };

      const result = recordingHandlers.updateRecordingFolder(folder);
      assertMatches(result, expected);
    });
  });

  describe('updateCms', function() {
    it('validates recordingId', function() {
      expect(() => recordingHandlers.updateCms(undefined, noop)).to.throw(
        /recordingId/
      );

      expect(() => recordingHandlers.updateCms({}, noop)).to.throw(
        /recordingId/
      );

      expect(() => recordingHandlers.updateCms('2', noop)).not.to.throw();
    });

    it('makes a put request to the correct endpoint (no body)', function() {
      const expected = {
        method: 'put',
        path: /some-id\/cms/
      };

      const result = recordingHandlers.updateCms('some-id');
      assertMatches(result, expected);
    });
  });

  describe('deleteRecording', function() {
    it('validates recordingId', function() {
      expect(() => recordingHandlers.deleteRecording(undefined, noop)).to.throw(
        /recordingId/
      );

      expect(() => recordingHandlers.deleteRecording({}, noop)).to.throw(
        /recordingId/
      );

      expect(() => recordingHandlers.deleteRecording('2', noop)).not.to.throw();
    });

    it('makes a delete request to the correct endpoint', function() {
      const expected = {
        method: 'delete',
        path: /some-id/
      };

      const result = recordingHandlers.deleteRecording('some-id');
      assertMatches(result, expected);
    });
  });

  describe('getRecordingTranscript', function() {
    it('validates recordingId', function() {
      expect(() =>
        recordingHandlers.getRecordingTranscript(undefined, noop)
      ).to.throw(/recordingId/);

      expect(() => recordingHandlers.getRecordingTranscript({}, noop)).to.throw(
        /recordingId/
      );

      expect(() =>
        recordingHandlers.getRecordingTranscript('2', noop)
      ).not.to.throw();
    });

    it("makes a get request to the recording's transcript", function() {
      const expected = {
        method: 'get',
        path: /some-id\/transcript/
      };

      const result = recordingHandlers.getRecordingTranscript('some-id');

      assertMatches(result, expected);
    });
  });

  describe('getRecordingMedia', function() {
    it('validates recordingId', function() {
      expect(() =>
        recordingHandlers.getRecordingMedia(
          nonStandardHandlerOptions,
          undefined,
          noop
        )
      ).to.throw(/recordingId/);

      expect(() =>
        recordingHandlers.getRecordingMedia(nonStandardHandlerOptions, {}, noop)
      ).to.throw(/recordingId/);

      expect(() =>
        recordingHandlers.getRecordingMedia(
          nonStandardHandlerOptions,
          '2',
          noop
        )
      ).not.to.throw();
    });

    it("makes a get request to the recording's media", function(done) {
      const scope = nock(apiBaseUrl)
        .get(/some-id\/media/)
        .reply(200, 'ok');

      recordingHandlers.getRecordingMedia(
        nonStandardHandlerOptions,
        'some-id',
        () => {
          scope.done();
          done();
        }
      );
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

      recordingHandlers.getRecordingMedia(
        nonStandardHandlerOptions,
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
      expect(() =>
        recordingHandlers.getRecordingAssets(undefined, noop)
      ).to.throw(/recordingId/);

      expect(() => recordingHandlers.getRecordingAssets({}, noop)).to.throw(
        /recordingId/
      );

      expect(() =>
        recordingHandlers.getRecordingAssets('2', noop)
      ).not.to.throw();
    });

    it("makes a get request to the recording's asset", function() {
      const expected = {
        method: 'get',
        path: /rec-id\/asset/
      };

      const result = recordingHandlers.getRecordingAssets('rec-id');

      assertMatches(result, expected);
    });
  });

  describe('getAsset', function() {
    it('validates recordingId', function() {
      expect(() =>
        recordingHandlers.getAsset(
          nonStandardHandlerOptions,
          undefined,
          '5',
          noop
        )
      ).to.throw(/recordingId/);

      expect(() =>
        recordingHandlers.getAsset(nonStandardHandlerOptions, {}, '5', noop)
      ).to.throw(/recordingId/);

      expect(() =>
        recordingHandlers.getAsset(nonStandardHandlerOptions, '2', '5', noop)
      ).not.to.throw();
    });

    it('validates assetId', function() {
      expect(() =>
        recordingHandlers.getAsset(
          nonStandardHandlerOptions,
          '2',
          undefined,
          noop
        )
      ).to.throw(/assetId/);

      expect(() =>
        recordingHandlers.getAsset(nonStandardHandlerOptions, '2', '5', noop)
      ).not.to.throw(/assetId/);
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

      recordingHandlers.getAsset(
        nonStandardHandlerOptions,
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
      expect(() =>
        recordingHandlers.getAssetMetadata(undefined, '5', noop)
      ).to.throw(/recordingId/);

      expect(() => recordingHandlers.getAssetMetadata({}, '5', noop)).to.throw(
        /recordingId/
      );

      expect(() =>
        recordingHandlers.getAssetMetadata('2', '5', noop)
      ).not.to.throw();
    });

    it('validates assetId', function() {
      expect(() =>
        recordingHandlers.getAssetMetadata('2', undefined, noop)
      ).to.throw(/assetId/);

      expect(() =>
        recordingHandlers.getAssetMetadata('2', '5', noop)
      ).not.to.throw(/assetId/);
    });

    it("makes a get request to the recording's asset metadata", function() {
      const expected = {
        method: 'get',
        path: /rec-id\/asset\/asset-id\/meta/
      };

      const result = recordingHandlers.getAssetMetadata('rec-id', 'asset-id');

      assertMatches(result, expected);
    });
  });
  describe('updateAssetMetadata', function() {
    it('validates recordingId', function() {
      const asset = {
        assetId: '1'
      };

      expect(() =>
        recordingHandlers.updateAssetMetadata(undefined, asset, noop)
      ).to.throw(/recordingId/);

      expect(() =>
        recordingHandlers.updateAssetMetadata({}, asset, noop)
      ).to.throw(/recordingId/);

      expect(() =>
        recordingHandlers.updateAssetMetadata('2', asset, noop)
      ).not.to.throw();
    });

    it('validates assetId', function() {
      expect(() =>
        recordingHandlers.updateAssetMetadata('2', undefined, noop)
      ).to.throw(/asset/);

      expect(() =>
        recordingHandlers.updateAssetMetadata('2', {}, noop)
      ).to.throw(/assetId/);

      expect(() =>
        recordingHandlers.updateAssetMetadata(
          '2',
          {
            assetId: '1'
          },
          noop
        )
      ).not.to.throw(/asset/);
    });

    it("makes a put request to the recording's asset metadata", function() {
      const expected = {
        method: 'put',
        path: /rec-id\/asset\/asset-id\/metadata/,
        data: {
          meta: 'meta'
        }
      };

      const result = recordingHandlers.updateAssetMetadata('rec-id', {
        assetId: 'asset-id',
        metadata: { meta: 'meta' }
      });

      assertMatches(result, expected);
    });
  });

  describe('saveAssetToFile', function() {
    // todo: mock the fs write stream somehow
    it('saves the asset to a file');
  });

  describe('createAssetFromFile', function() {
    it('streams the asset to the server');
  });

  describe('createAsset', function() {
    it('makes the correct request', function() {
      const asset = {
        name: 'my-file',
        type: 'video/mp4'
      };

      const expected = {
        method: 'post',
        path: /rec-id\/asset/,
        headers: {
          'X-Veritone-Asset-Type': 'media',
          'content-type': 'video/mp4'
        },
        data: asset
      };

      const result = recordingHandlers.createAsset('rec-id', asset);

      assertMatches(result, expected);
    });
  });

  describe('updateAsset', function() {
    it('streams the asset to the server');
  });

  describe('deleteAsset', function() {
    it('validates recordingId', function() {
      expect(() =>
        recordingHandlers.deleteAsset(undefined, '5', noop)
      ).to.throw(/recordingId/);

      expect(() => recordingHandlers.deleteAsset({}, '5', noop)).to.throw(
        /recordingId/
      );

      expect(() =>
        recordingHandlers.deleteAsset('2', '5', noop)
      ).not.to.throw();
    });

    it('validates assetId', function() {
      expect(() =>
        recordingHandlers.deleteAsset('2', undefined, noop)
      ).to.throw(/assetId/);

      expect(() => recordingHandlers.deleteAsset('2', '5', noop)).not.to.throw(
        /assetId/
      );
    });

    it('makes a delete request to the asset', function() {
      const expected = {
        method: 'delete',
        path: /rec-id\/asset\/asset-id/
      };

      const result = recordingHandlers.deleteAsset('rec-id', 'asset-id');

      assertMatches(result, expected);
    });
  });
});
