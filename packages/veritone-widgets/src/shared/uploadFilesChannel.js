// adapted from
// https://decembersoft.com/posts/file-upload-progress-with-redux-saga/

import { buffers, channel, END } from 'redux-saga';

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
  let remainingFiles = files.length;

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

  const onStatusCodeFailure = (file, descriptor) => {
    chan.put({ error: 'Upload failed', file, descriptor });
  };

  const onXHRError = (file, descriptor, e) => {
    chan.put({ error: 'File upload error', file, descriptor });
  };

  const onStatusCodeAbort = (file, descriptor) => {
    chan.put({ error: 'Upload failed', aborted: 'Upload aborted', file, descriptor });
  }

  const onFileReadyStateChange = (
    file,
    descriptor,
    { target: { readyState, status } }
  ) => {
    if (readyState === XMLHttpRequest.DONE) {
      remainingFiles -= 1;
      // Remove from requestMap cuz it finished
      delete requestMap[descriptor.key];

      if (status >= 200 && status < 300) {
        chan.put({ success: true, file, descriptor });
      } else if (status == 0) {
        onStatusCodeAbort(file, descriptor);
      } else {
        onStatusCodeFailure(file, descriptor);
      }

      if (remainingFiles === 0) {
        chan.put(END);
      }
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
