import React from 'react';
import { storiesOf } from '@storybook/react';

import MediaInfoPanel from './';

const tdo = {
  createdDateTime: "2019-05-10T06:43:39.430Z",
  modifiedDateTime: "2019-05-10T06:43:39.430Z",
  primaryAsset: {
    contentType: "video/mp4",
    id: "VlRBOm1lZGlhOjQ4MDk3NDAyNQ==",
    signedUri: "https://api.stage.veritone.com/media-streamer/download/tdo/480974025"
  },
  stopDateTime: "2019-05-10T06:42:42.000Z",
  startDateTime: "2019-05-10T06:46:48.646Z",
  thumbnailUrl: "https://stage-recordings-test.s3.amazonaws.com/assets/480974025/610467a1-d92a-4b3d-984f-92104ad94bae.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQMR5VATUCVFMAQJE%2F20190513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20190513T035740Z&X-Amz-Expires=3600&X-Amz-Security-Token=FQoGZXIvYXdzEM3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDElvRkioMyVux4iXLCKpBHqKt8kzBb7IvQU9Ja1rBBuu3sZ0mZboiTGjnf8JAk%2FtItRAZTB9gMBsHpicQuo3qAVkrfyAy6htmNg0JrXXVIF3p1yCU37QeHEww4Al2Fky3bpLKq6dJ7NZdTCT%2Fwwxa821H35k1EE82pja8b23g%2ByJ2KIinolzU52Velrgg%2FFBIOBI8X1VzvXg0WFNzyUGZiDcn8xwa%2ByohQ%2FWV3YvXsqnDZ9ATcC6A%2B6lUui7CW2F7u2cIJIwtRXc4DIt79hh6VQqcDS%2FSkPmHbw2rYNvMQLyT0cnFslFeblMs2zpHHR%2B3zW%2FzFnEyBU5MXviuEf4RKbETf5kNwdXqTL%2BVb5wHhyzFHvrEn9xWHB75aWMldR6GnubCE0uCJjjsaPbofJ1gpBZG7P9i1iD%2B8bZllYKGelRiKSW%2BvJ98RJP5BhAUxFMyXvygiWCkBI4%2F%2F34DH%2Bcg2y1A4NLmuuyN1jD9OzF9i4dXS66Ad8LbCZJNrwvaAy5rNEEqSOlWgbOcmHIFWez7ACUJvIIDOIQFh5PQTsf0S6HBe25lutZqHBPP2jmxAF9FUB75ySILuNIg8lcIRUAKwDWxaEyseqLL01Sst%2BlaZ1I8mtNdmJR2Ga%2FR0jSpn4crGylahHEBRPzQYIX5%2BsT8rD%2BbD%2BMLnCO%2F8HX5Vk%2Fctem1R5SGPEX5xwRl%2BQaluVsaK%2BqV%2BnMvuCWFhqULIO1El8AyMCvN1BVA%2BvcqUJ2CDOxZcDgN3OkdlYo273j5gU%3D&X-Amz-Signature=e03a9cf7c5d36ffb4a82f57b264fee58e62e191ba1ce52fa0569a7786b604952&X-Amz-SignedHeaders=host",
  streams: [
    {
      protocol: "hls",
      uri: "https://api.stage.veritone.com/media-streamer/stream/480974025/master.m3u8"
    },
    {
      protocol: "dash",
      uri: "https://api.stage.veritone.com/media-streamer/stream/480974025/dash.mpd"
    }
  ]

}

storiesOf('MediaInfoPanel', module)
  .add('One selected item', () => (
    <MediaInfoPanel open selectedItems={[tdo]} />
  ))
