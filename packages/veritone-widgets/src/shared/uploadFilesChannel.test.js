/* eslint-env node, jest */
import { END } from 'redux-saga';
import uploadFilesChannel from './uploadFilesChannel';

const XHR_DONE = 4;

class MockXHR {
  constructor() {
    this.upload = { addEventListener: jest.fn() };
    this.onreadystatechange = null;
    this.readyState = 0;
    this.status = 0;
    this.open = jest.fn();
    this.setRequestHeader = jest.fn();
    this.send = jest.fn();
    MockXHR.instances.push(this);
  }

  complete(status) {
    this.readyState = XHR_DONE;
    this.status = status;
    this.onreadystatechange && this.onreadystatechange({ target: this });
  }
}

MockXHR.instances = [];
MockXHR.DONE = XHR_DONE;

const take = chan => new Promise(resolve => chan.take(resolve));

const makeFile = (name = 'test.mp4') => ({ name, type: 'video/mp4', size: 1000 });
const makeDescriptor = (overrides = {}) => ({
  url: 'https://s3.example.com/signed-put-url',
  key: 'file-key',
  bucket: 'my-bucket',
  expiresInSeconds: 3600,
  getUrl: 'https://s3.example.com/file-key',
  unsignedUrl: 'https://s3.example.com/file-key',
  ...overrides
});

describe('uploadFilesChannel', () => {
  beforeEach(() => {
    MockXHR.instances = [];
    jest.useFakeTimers();
    global.XMLHttpRequest = MockXHR;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throws if descriptor and file counts differ', () => {
    expect(() => uploadFilesChannel([makeDescriptor()], [])).toThrow();
  });

  describe('PUT success + HEAD check', () => {
    it('emits success after HEAD confirms file is readable', async () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { channel } = uploadFilesChannel([descriptor], [file]);

      // PUT XHR is created first
      const putXhr = MockXHR.instances[0];
      expect(putXhr.open).toHaveBeenCalledWith('PUT', descriptor.url, true);
      expect(putXhr.setRequestHeader).toHaveBeenCalledWith('x-ms-blob-type', 'BlockBlob');

      putXhr.complete(200);

      // HEAD XHR should now exist
      const headXhr = MockXHR.instances[1];
      expect(headXhr.open).toHaveBeenCalledWith('HEAD', descriptor.getUrl, true);

      headXhr.complete(200);

      const event = await take(channel);
      expect(event).toMatchObject({ success: true, file, descriptor });

      const endEvent = await take(channel);
      expect(endEvent).toBe(END);
    });

    it('retries HEAD with exponential backoff on non-2xx response', async () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { channel } = uploadFilesChannel([descriptor], [file]);

      MockXHR.instances[0].complete(200); // PUT success

      // Initial HEAD attempt fails
      MockXHR.instances[1].complete(404);
      expect(MockXHR.instances.length).toBe(2); // no new XHR yet

      // First retry fires after 1s backoff
      jest.advanceTimersByTime(1000);
      expect(MockXHR.instances.length).toBe(3);

      MockXHR.instances[2].complete(200); // HEAD succeeds on retry

      const event = await take(channel);
      expect(event.success).toBe(true);
    });

    it('emits success after all HEAD retries are exhausted', async () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { channel } = uploadFilesChannel([descriptor], [file]);

      MockXHR.instances[0].complete(200); // PUT success

      // 6 total HEAD attempts: initial + 5 retries (HEAD_POLL_MAX_RETRIES = 5)
      const delays = [1000, 2000, 4000, 8000, 16000];

      MockXHR.instances[1].complete(404); // initial HEAD fails
      delays.forEach((delay, i) => {
        jest.advanceTimersByTime(delay);
        MockXHR.instances[i + 2].complete(404); // each retry fails
      });

      // After the 5th retry fails, should proceed anyway
      const event = await take(channel);
      expect(event.success).toBe(true);
    });

    it('emits success immediately when getUrl is absent', async () => {
      const file = makeFile();
      const descriptor = makeDescriptor({ getUrl: null });
      const { channel } = uploadFilesChannel([descriptor], [file]);

      MockXHR.instances[0].complete(200);

      expect(MockXHR.instances.length).toBe(1); // no HEAD XHR created

      const event = await take(channel);
      expect(event.success).toBe(true);
    });
  });

  describe('PUT failure', () => {
    it('emits error on PUT non-2xx and skips HEAD', async () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { channel } = uploadFilesChannel([descriptor], [file]);

      MockXHR.instances[0].complete(500);

      expect(MockXHR.instances.length).toBe(1); // no HEAD XHR

      const event = await take(channel);
      expect(event.error).toBeTruthy();
      expect(event.success).toBeUndefined();
    });

    it('emits abort error when PUT status is 0', async () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { channel } = uploadFilesChannel([descriptor], [file]);

      MockXHR.instances[0].complete(0);

      expect(MockXHR.instances.length).toBe(1); // no HEAD XHR

      const event = await take(channel);
      expect(event.error).toBeTruthy();
      expect(event.aborted).toBeTruthy();
    });
  });

  describe('multiple files', () => {
    it('emits success for each file and then END', async () => {
      const files = [makeFile('a.mp4'), makeFile('b.mp4')];
      const descriptors = [
        makeDescriptor({ key: 'key-a', url: 'https://s3.example.com/a', getUrl: 'https://s3.example.com/ga' }),
        makeDescriptor({ key: 'key-b', url: 'https://s3.example.com/b', getUrl: 'https://s3.example.com/gb' })
      ];
      const { channel } = uploadFilesChannel(descriptors, files);

      // forEach creates both PUT XHRs synchronously:
      // instances[0] = PUT a, instances[1] = PUT b
      // HEAD XHRs appear only after their respective PUTs complete.
      MockXHR.instances[0].complete(200); // PUT a → HEAD a created (instances[2])
      MockXHR.instances[1].complete(200); // PUT b → HEAD b created (instances[3])

      // Interleave takes with puts to avoid overflowing the sliding(2) buffer.
      MockXHR.instances[2].complete(200); // HEAD a → success a put
      const successA = await take(channel);
      expect(successA).toMatchObject({ success: true, file: files[0] });

      MockXHR.instances[3].complete(200); // HEAD b → success b put, then END put
      const successB = await take(channel);
      expect(successB).toMatchObject({ success: true, file: files[1] });

      const endEvent = await take(channel);
      expect(endEvent).toBe(END);
    });

    it('only sends END after all files complete their full lifecycle', async () => {
      const files = [makeFile('a.mp4'), makeFile('b.mp4')];
      const descriptors = [
        makeDescriptor({ key: 'key-a', url: 'https://s3.example.com/a', getUrl: 'https://s3.example.com/ga' }),
        makeDescriptor({ key: 'key-b', url: 'https://s3.example.com/b', getUrl: 'https://s3.example.com/gb' })
      ];
      const { channel } = uploadFilesChannel(descriptors, files);

      // instances[0] = PUT a, instances[1] = PUT b
      MockXHR.instances[0].complete(200); // PUT a → HEAD a (instances[2])
      MockXHR.instances[1].complete(200); // PUT b → HEAD b (instances[3])

      // Complete only HEAD for file a — pendingFiles is still 1, no END yet
      MockXHR.instances[2].complete(200);
      await take(channel); // consume success a

      // Register a take; it will be fulfilled by the next put (success b, not END)
      let nextValue = null;
      channel.take(val => { nextValue = val; });
      expect(nextValue).toBeNull(); // nothing put yet

      // Complete HEAD for b: puts success b (triggers our callback) then END
      MockXHR.instances[3].complete(200);
      expect(nextValue).toMatchObject({ success: true }); // success b, not END

      // END is now buffered — confirm it arrives last
      const endEvent = await take(channel);
      expect(endEvent).toBe(END);
    });
  });

  describe('requestMap', () => {
    it('populates requestMap with PUT XHRs keyed by descriptor.key', () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { requestMap } = uploadFilesChannel([descriptor], [file]);

      expect(requestMap[descriptor.key]).toBe(MockXHR.instances[0]);
    });

    it('removes the entry from requestMap when PUT completes', () => {
      const file = makeFile();
      const descriptor = makeDescriptor();
      const { requestMap } = uploadFilesChannel([descriptor], [file]);

      MockXHR.instances[0].complete(200);

      expect(requestMap[descriptor.key]).toBeUndefined();
    });
  });
});
