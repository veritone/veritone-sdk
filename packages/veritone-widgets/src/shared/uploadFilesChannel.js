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

  const chan = channel(buffers.sliding(2));
  let remainingFiles = files.length;

  const onFileProgress = (
    file,
    descriptor,
    { lengthComputable, loaded, total }
  ) => {
    if (lengthComputable) {
      const progress = (loaded / total) * 100;
      chan.put({ progress, file, descriptor });
    }
  };

  const onStatusCodeFailure = (file, descriptor) => {
    chan.put({ error: new Error('Upload failed'), file, descriptor });
  };
  const onXHRError = (file, descriptor, e) => {
    // todo: does this need to go onto the channel, or do we always handle
    // via onStatusCodeFailure?
    console.log('xhr error', e);
  };

  const onFileReadyStateChange = (
    file,
    descriptor,
    { target: { readyState, status } }
  ) => {
    if (readyState === XMLHttpRequest.DONE) {
      remainingFiles -= 1;

      if (status === 200) {
        chan.put({ success: true, file, descriptor });
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
    // xhr.upload.addEventListener('abort', onFailure.bind(null, file, descriptor));

    xhr.open(method, descriptor.url, true);
    xhr.send(file);
  });

  return chan;
}
