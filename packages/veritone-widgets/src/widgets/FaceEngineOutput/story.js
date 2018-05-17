import React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { util } from 'veritone-redux-common';
import configureStore from '../../redux/configureStore';

import FaceEngineOutput from '.';

const Sagas = util.reactReduxSaga.Sagas;
const store = configureStore();

const faceObjects = [
  {
    series: [
      {
        startTimeMs: 0,
        stopTimeMs: 2000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.5,
              y: 0.2
            }
          ]
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
          libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
          boundingPoly: [
            {
              x: 0.1,
              y: 0.2
            }
          ],
          confidence: 0.81
        }
      },
      {
        startTimeMs: 1000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '1945a3ba-f0a3-411e-8419-78e31c73150a',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.4,
              y: 0.2
            }
          ],
          confidence: 0.81
        }
      },
      {
        startTimeMs: 2000,
        stopTimeMs: 3000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.2,
              y: 0.5
            }
          ],
          confidence: 0.86
        }
      },
      {
        startTimeMs: 3000,
        stopTimeMs: 4000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
          libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
          boundingPoly: [
            {
              x: 0.3,
              y: 0.4
            }
          ],
          confidence: 0.9
        }
      }
    ]
  },
  {
    series: [
      {
        startTimeMs: 4000,
        stopTimeMs: 6000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          boundingPoly: [
            {
              x: 0.4,
              y: 0.3
            }
          ]
        }
      },
      {
        startTimeMs: 5000,
        stopTimeMs: 6000,
        object: {
          type: 'face',
          uri: 'https://images.radio-online.com/images/logos/Veritonexl.png',
          entityId: '13595602-3a7f-48d3-bfde-2d029af479f6',
          libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
          boundingPoly: [
            {
              x: 0.5,
              y: 0.2
            }
          ],
          confidence: 0.94
        }
      }
    ]
  }
];

const entities = [
  {
    id: 'c36e8b95-6d46-4a5a-a272-8507319a5a54',
    name: 'Paul McCartney',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl:
      'https://pbs.twimg.com/profile_images/806883889146957824/VbnEycIm_normal.jpg',
    jsondata: {
      name: 'Paul McCartney',
      middleName: 'Bob',
      age: 75,
      gender: 'Male',
      description:
        'A member of the beatles. I am typing this to test a long string that will be used in a description for this person or not.'
    }
  },
  {
    id: '1945a3ba-f0a3-411e-8419-78e31c73150a',
    name: 'Ringo Starr',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl: null,
    jsondata: {}
  },
  {
    id: '8e35f28c-34aa-4ee3-8690-f62bf1a704fa',
    name: 'George Harrison',
    libraryId: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
    library: {
      id: 'f1297e1c-9c20-48fa-a8fd-46f1e6d62c43',
      name: 'Beatles'
    },
    profileImageUrl:
      'https://prod-veritone-library.s3.amazonaws.com/f1297e1c-9c20-48fa-a8fd-46f1e6d62c43/8e35f28c-34aa-4ee3-8690-f62bf1a704fa/profile-1514492325832.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUCF3BCNMSE5YZEQ%2F20180326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180326T234640Z&X-Amz-Expires=900&X-Amz-Signature=7222a63cb831c34be639407ce6206df011853a7f01d7b020b101661152efcbb4&X-Amz-SignedHeaders=host',
    jsondata: {
      description: ''
    }
  },
  {
    id: '13595602-3a7f-48d3-bfde-2d029af479f6',
    name: 'Gomez Addams',
    libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    libraryName: 'Addams Family',
    library: {
      id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      name: 'Addams Family'
    },
    profileImage: null,
    jsondata: {}
  },
  {
    id: 'c1666e9f-9dc0-40f9-aece-0ec1bfeae29a',
    name: 'James Williams',
    libraryId: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
    library: {
      id: 'b64ef50a-0a5b-47ff-a403-a9a30f9241a4',
      name: 'Addams Family'
    },
    profileImage: null,
    jsondata: {}
  }
];

const tdo = {
  "id": "10314032",
  "details": {
    "filename": "NFLNetworkPrimetimeProgramming_20160205_0510_edit",
    "veritoneFile": {
      "filename": "NFLNetworkPrimetimeProgramming_20160205_0510"
    },
    "veritoneMediaSource": {
      "mediaSourceId": "38402",
      "mediaSourceTypeId": "2"
    },
    "veritoneCustom": {},
    "veritoneProgram": {
      "programId": "20622",
      "programName": "NFL Network Primetime Programming",
      "programImage": "https://s3.amazonaws.com/prod-veritone-ugc/programs/20622/I362KHzOSBO8ySTB5mBQ_ZJzJEcVm_400x400.jpg",
      "programLiveImage": "https://s3.amazonaws.com/prod-veritone-ugc/cb5e52b4-a986-4e2b-b525-482319df3350%2FbrdProgram%2FBeQ5IMMdTnuMCl25MRon_nfln.jpg"
    }
  },
  "startDateTime": "2016-02-05T05:10:00.000Z",
  "stopDateTime": "2016-02-05T05:15:00.000Z",
  "security": {
    "global": true
  }
};

// const tdo = {
//   "id": "50360384",
//   "details": {
//     "veritoneFile": {
//       "size": 17513308,
//       "filename": "Ripple CEO Explains Why His Digital Currency Can Transform Banking _ CNBC-Ket7OgJXrZY.mp4"
//     },
//     "veritoneMediaSource": {
//       "mediaSourceId": "-1",
//       "mediaSourceName": "OCR test",
//       "mediaSourceTypeId": "5"
//     },
//     "veritoneProgram": {
//       "programId": "-1",
//       "programName": "OCR test",
//       "programImage": "",
//       "programLiveImage": "https://inspirent.s3.amazonaws.com/assets/50360384/b9d66d49-cf70-4dd6-b8cf-29cd71459f71.jpeg",
//       "primaryMediaSourceId": "390atg6e"
//     },
//     "youtubeAdapter": {
//       "id": "Ket7OgJXrZY",
//       "name": "Ripple CEO Explains Why His Digital Currency Can Transform Banking _ CNBC-Ket7OgJXrZY.mp4",
//       "metadata": {
//         "id": "Ket7OgJXrZY",
//         "abr": 192,
//         "ext": "mp4",
//         "url": "https://r5---sn-p5qlsnd6.googlevideo.com/videoplayback?ratebypass=yes&mn=sn-p5qlsnd6%2Csn-vgqskne6&mm=31%2C26&requiressl=yes&mime=video%2Fmp4&expire=1517027351&dur=173.453&pl=13&key=yt6&source=youtube&ms=au%2Conr&mv=m&mt=1517005635&ipbits=0&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&signature=54C9A1716345BB5CF6123EB3D3462F2FD85607F7.D2FAEEC76B893C35AA54F8A4541BB8E5F12E46A3&ip=34.203.70.16&fvip=5&lmt=1514415359556714&ei=t6trWrykJoHu8wSwyJuoBQ&id=o-AIMbbocUNyzm9spNN0dwFS8GKhmWmHxiGOf38iEV2YeS&initcwndbps=2723750&itag=22",
//         "size": 17513308,
//         "tags": [
//           "CNBC",
//           "Mad Money",
//           "Squawk Box",
//           "Power Lunch",
//           "Opening Bell",
//           "Closing Bell",
//           "Financial News",
//           "Finance News",
//           "Stock News",
//           "Stocks",
//           "Trading",
//           "Investing",
//           "Stock Market",
//           "US News",
//           "World News",
//           "ripple",
//           "ripple ceo",
//           "ripple ceo interview",
//           "brad garlinghouse",
//           "block chain",
//           "blockchain",
//           "blockchain technology",
//           "real time settlements",
//           "sending money in real time settlements",
//           "ripple digital currency",
//           "banking in 2018",
//           "2018 banking",
//           "banking trends",
//           "future of cryptocurrency",
//           "future of crypto",
//           "bitcoin futures"
//         ],
//         "title": "Ripple CEO Explains Why His Digital Currency Can Transform Banking | CNBC",
//         "width": 1280,
//         "acodec": "mp4a.40.2",
//         "format": "22 - 1280x720 (hd720)",
//         "height": 720,
//         "series": null,
//         "vcodec": "avc1.64001F",
//         "creator": null,
//         "formats": [],
//         "is_live": null,
//         "license": "Standard YouTube License",
//         "chapters": null,
//         "duration": "2:53",
//         "end_time": null,
//         "playlist": null,
//         "protocol": "https",
//         "uploader": "CNBC",
//         "_filename": "Ripple CEO Explains Why His Digital Currency Can Transform Banking _ CNBC-Ket7OgJXrZY.mp4",
//         "age_limit": 0,
//         "alt_title": null,
//         "extractor": "youtube",
//         "format_id": "22",
//         "fulltitle": "Ripple CEO Explains Why His Digital Currency Can Transform Banking | CNBC",
//         "subtitles": {},
//         "thumbnail": "https://i.ytimg.com/vi/Ket7OgJXrZY/hqdefault.jpg",
//         "categories": [
//           "News & Politics"
//         ],
//         "display_id": "Ket7OgJXrZY",
//         "like_count": 507,
//         "player_url": "/yts/jsbin/player-vflX4ueE4/en_US/base.js",
//         "resolution": "1280x720 (hd720)",
//         "start_time": null,
//         "thumbnails": [
//           {
//             "id": "0",
//             "url": "https://i.ytimg.com/vi/Ket7OgJXrZY/hqdefault.jpg"
//           }
//         ],
//         "view_count": 54385,
//         "annotations": null,
//         "description": "Ripple CEO Brad Garlinghouse discusses the use of block chain technology to send money across the world in real time settlements.\n» Subscribe to CNBC: http://cnb.cx/SubscribeCNBC\n\nAbout CNBC: From 'Wall Street' to 'Main Street' to award winning original documentaries and Reality TV series, CNBC has you covered. Experience special sneak peeks of your favorite shows, exclusive video and more.\n\nConnect with CNBC News Online\nGet the latest news: http://www.cnbc.com/\nFind CNBC News on Facebook: http://cnb.cx/LikeCNBC\nFollow CNBC News on Twitter: http://cnb.cx/FollowCNBC\nFollow CNBC News on Google+: http://cnb.cx/PlusCNBC\nFollow CNBC News on Instagram: http://cnb.cx/InstagramCNBC\n\nRipple CEO Explains Why His Digital Currency Can Transform Banking | CNBC",
//         "format_note": "hd720",
//         "upload_date": "20171227",
//         "uploader_id": "cnbc",
//         "webpage_url": "https://www.youtube.com/watch?v=Ket7OgJXrZY",
//         "http_headers": {
//           "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
//           "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20150101 Firefox/47.0 (Chrome)",
//           "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
//           "Accept-Encoding": "gzip, deflate",
//           "Accept-Language": "en-us,en;q=0.5"
//         },
//         "uploader_url": "http://www.youtube.com/user/cnbc",
//         "_duration_hms": "00:02:53",
//         "_duration_raw": 173,
//         "dislike_count": 39,
//         "extractor_key": "Youtube",
//         "season_number": null,
//         "average_rating": 4.71428585052,
//         "episode_number": null,
//         "playlist_index": null,
//         "automatic_captions": {},
//         "requested_subtitles": null,
//         "webpage_url_basename": "Ket7OgJXrZY"
//       }
//     },
//     "veritonePermissions": {
//       "acls": [
//         {
//           "groupId": "ea738f5b-9f52-45f3-8db8-3167bfd625fe",
//           "permission": "owner"
//         }
//       ],
//       "isPublic": false
//     },
//     "tags": [],
//     "date": "2018-01-26T22:25:12.285Z"
//   },
//   "startDateTime": "2018-01-26T22:29:13.000Z",
//   "stopDateTime": "2018-01-26T22:32:06.000Z",
//   "security": {
//     "global": false
//   }
// }

const engines = [
  {
    // "id": "imagedetection-facerecognition-veritone",
    "id": "84b513bd-d64d-3a35-9d42-579c8611fdbf",
    // "id": "imagedetection-facerecognition-kairos",
    "name": "Semblance"
  }
];

storiesOf('FaceEngineOutput', module)
.addDecorator(story =>(
  <Provider store={store}>
    <Sagas middleware={store.sagaMiddleware}>
      {story()}
    </Sagas>
  </Provider>
))
.add('Base', () => {
  // const faceSeries = faceObjects.reduce((accumulator, faceSeries) => {
  //   if (faceSeries.series.length) {
  //     const unrecognizedFaces = faceSeries.series.filter(faceObj => !faceObj.object.entityId);
  //     return [...accumulator, ...unrecognizedFaces];
  //   }
  //   return accumulator;
  // }, []);

  // console.log('faceSeries:', faceSeries)

  return (
    <FaceEngineOutput
      // data={faceObjects}
      tdo={tdo}
      engines={engines}
      // entities={entities}
      selectedEngineId={engines[0].id}
      // unrecognizedFaces={faceSeries}
      enableEditMode
      baseUrlImagePrefix="https://s3-us-west-1.amazonaws.com/prod-veritone-face"
    />
  )
});
