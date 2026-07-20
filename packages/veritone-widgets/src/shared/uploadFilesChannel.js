// adapted from
// https://decembersoft.com/posts/file-upload-progress-with-redux-saga/

import { buffers, channel, END } from 'redux-saga';

const HEAD_POLL_MAX_RETRIES = 5;
const HEAD_POLL_BASE_DELAY_MS = 1000;

// After a PUT to a signed URL succeeds, S3 eventual consistency means the
// object may not be immediately readable. Poll with a HEAD request before
// signalling success so callers (e.g. createTDOWithAsset) don't race.
function pollForFileAvailability(
  getUrl,
  onReady,
  maxRetries = HEAD_POLL_MAX_RETRIES,
  baseDelay = HEAD_POLL_BASE_DELAY_MS
) {
  let retries = 0;

  const attempt = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', getUrl, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        onReady();
      } else if (retries < maxRetries) {
        retries += 1;
        // Exponential backoff: 1s, 2s, 4s, 8s, 16s
        setTimeout(attempt, baseDelay * Math.pow(2, retries - 1));
      } else {
        // PUT succeeded — proceed even if HEAD never confirmed readability
        onReady();
      }
    };
    xhr.send();
  };

  attempt();
}

export default function uploadFilesChannel(
  uploadDescriptors,
  files,
  method = 'PUT'
) {
  if (uploadDescriptors.length !== files.length) {
    throw new Error('Need an upload descriptor for each file to be uploaded!');
  }

  const requestMap = {};
  const chan = channel(buffers.sliding(2));
  // Decremented only after the full lifecycle (PUT + optional HEAD) completes
  let pendingFiles = files.length;

  const onFileDone = () => {
    pendingFiles -= 1;
    if (pendingFiles === 0) {
      chan.put(END);
    }
  };

  const onFileProgress = (
    file,
    descriptor,
    { lengthComputable, loaded, total }
  ) => {
    if (lengthComputable) {
      const progress = loaded / total * 100;
      chan.put({ progress, file, descriptor });
    }
  };

  const onXHRError = (file, descriptor) => {
    chan.put({ error: 'File upload error', file, descriptor });
  };

  const onFileReadyStateChange = (
    file,
    descriptor,
    { target: { readyState, status } }
  ) => {
    if (readyState !== XMLHttpRequest.DONE) {
      return;
    }

    delete requestMap[descriptor.key];

    if (status >= 200 && status < 300) {
      if (descriptor.getUrl) {
        pollForFileAvailability(descriptor.getUrl, () => {
          chan.put({ success: true, file, descriptor });
          onFileDone();
        });
      } else {
        chan.put({ success: true, file, descriptor });
        onFileDone();
      }
    } else if (status === 0) {
      chan.put({ error: 'Upload failed', aborted: 'Upload aborted', file, descriptor });
      onFileDone();
    } else {
      chan.put({ error: 'Upload failed', file, descriptor });
      onFileDone();
    }
  };

  files.forEach((file, i) => {
    const descriptor = uploadDescriptors[i];
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener(
      'progress',
      onFileProgress.bind(null, file, descriptor)
    );
    xhr.upload.addEventListener(
      'error',
      onXHRError.bind(null, file, descriptor)
    );
    xhr.onreadystatechange = onFileReadyStateChange.bind(
      null,
      file,
      descriptor
    );

    // Add to requestMap to enable abortions
    if (descriptor.key) {
      requestMap[descriptor.key] = xhr;
    }

    xhr.open(method, descriptor.url, true);
    // Need this header for azure
    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
    xhr.send(file);
  });

  return {
    channel: chan,
    requestMap
  };
}
