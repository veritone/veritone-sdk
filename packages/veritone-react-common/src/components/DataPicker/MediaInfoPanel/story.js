import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, number } from '@storybook/addon-knobs';

import MediaInfoPanel from './';

const videoTdo = {
  type: 'tdo',
  name: 'Fake Video TDO',
  createdDateTime: "2019-05-10T06:43:39.430Z",
  modifiedDateTime: "2019-05-10T06:43:39.430Z",
  primaryAsset: {
    contentType: "video/mp4",
    id: "VlRBOm1lZGlhOjQ4MDk3NDAyNQ==",
    signedUri: "https://api.stage.veritone.com/media-streamer/download/tdo/480974025"
  },
  startDateTime: "2019-05-10T06:42:42.000Z",
  stopDateTime: "2019-05-10T06:46:48.646Z",
  thumbnailUrl: "https://stage-recordings-test.s3.amazonaws.com/assets/480974025/610467a1-d92a-4b3d-984f-92104ad94bae.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQMR5VATUCVFMAQJE%2F20190513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190513T035740Z&X-Amz-Expires=3600&X-Amz-Security-Token=FQoGZXIvYXdzEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDElvRkioMyVux4iXLCKpBHqKt8kzBb7IvQU9Ja1rBBuu3sZ0mZboiTGjnf8JAk%2FtItRAZTB9gMBsHpicQuo3qAVkrfyAy6htmNg0JrXXVIF3p1yCU37QeHEww4Al2Fky3bpLKq6dJ7NZdTCT%2Fwwxa821H35k1EE82pja8b23g%2ByJ2KIinolzU52Velrgg%2FFBIOBI8X1VzvXg0WFNzyUGZiDcn8xwa%2ByohQ%2FWV3YvXsqnDZ9ATcC6A%2B6lUui7CW2F7u2cIJIwtRXc4DIt79hh6VQqcDS%2FSkPmHbw2rYNvMQLyT0cnFslFeblMs2zpHHR%2B3zW%2FzFnEyBU5MXviuEf4RKbETf5kNwdXqTL%2BVb5wHhyzFHvrEn9xWHB75aWMldR6GnubCE0uCJjjsaPbofJ1gpBZG7P9i1iD%2B8bZllYKGelRiKSW%2BvJ98RJP5BhAUxFMyXvygiWCkBI4%2F%2F34DH%2Bcg2y1A4NLmuuyN1jD9OzF9i4dXS66Ad8LbCZJNrwvaAy5rNEEqSOlWgbOcmHIFWez7ACUJvIIDOIQFh5PQTsf0S6HBe25lutZqHBPP2jmxAF9FUB75ySILuNIg8lcIRUAKwDWxaEyseqLL01Sst%2BlaZ1I8mtNdmJR2Ga%2FR0jSpn4crGylahHEBRPzQYIX5%2BsT8rD%2BbD%2BMLnCO%2F8HX5Vk%2Fctem1R5SGPEX5xwRl%2BQaluVsaK%2BqV%2BnMvuCWFhqULIO1El8AyMCvN1BVA%2BvcqUJ2CDOxZcDgN3OkdlYo273j5gU%3D&X-Amz-Signature=e03a9cf7c5d36ffb4a82f57b264fee58e62e191ba1ce52fa0569a7786b604952&X-Amz-SignedHeaders=host",
  streams: [
    {
      protocol: "hls",
      uri: "http://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
    },
    {
      protocol: "dash",
      uri: "http://yt-dash-mse-test.commondatastorage.googleapis.com/media/car-20120827-manifest.mpd"
    }
  ],
  childNode: (<div data-veritone-element="childNode">Whatever you want here!</div>)
};

const audioTdo = {
  type: 'tdo',
  name: 'Fake Audio TDO',
  createdDateTime: "2018-08-10T17:37:18.000Z",
  modifiedDateTime: "2018-08-10T17:38:52.000Z",
  startDateTime: "2018-08-10T17:37:19.000Z",
  stopDateTime: "2018-08-10T17:37:31.000Z",
  primaryAsset: {
    contentType: "audio/mp3",
    signedUri: "https://s3.amazonaws.com/static.veritone.com/e2e-resources/test_audio.mp3"
  }
}

const folderItem = {
  createdDateTime: "2019-05-10T06:43:39.430Z",
  modifiedDateTime: "2019-05-10T06:43:39.430Z",
  name: 'My folder',
  type: 'folder'
}

const imageItem = {
  type: 'tdo',
  createdDateTime: "2019-05-10T06:43:39.430Z",
  modifiedDateTime: "2019-05-10T06:43:39.430Z",
  name: "Screen Shot 2018-08-02 at 3.42.02 PM.png",
  primaryAsset: {
    id: "b9d73e8d-ef0d-402c-82d1-294f6c5d0448",
    name: "Screen Shot 2018-08-02 at 3.42.02 PM.png",
    contentType: "image/png",
    signedUri: "https://cdn.pixabay.com/photo/2019/04/19/14/43/dandelion-4139650__340.jpg"
  },
}


storiesOf('DataPicker', module)
  .add('MediaInfoPanel: selected video media item w/ childNode', () => (
    <MediaInfoPanel
      open={boolean('open', false)}
      selectedItems={[videoTdo]}
      width={number('width', 450)}
      toggleMediaInfoPanel={action('toggleMediaInfoPanel')}
    />
  ))
  .add('MediaInfoPanel: selected audio media item', () => (
    <MediaInfoPanel
      open={boolean('open', false)}
      selectedItems={[audioTdo]}
      width={number('width', 450)}
    />
  ))
  .add('MediaInfoPanel: select folder item', () => (
    <MediaInfoPanel
      open={boolean('open', false)}
      selectedItems={[folderItem]}
      width={number('width', 450)}
    />
  ))
  .add('MediaInfoPanel: select image item', () => (
    <MediaInfoPanel
      open={boolean('open', false)}
      selectedItems={[imageItem]}
      width={number('width', 450)}
    />
  ))


export {
  audioTdo,
  videoTdo,
  folderItem,
  imageItem
}