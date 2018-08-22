import React from 'react';

import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';

import { CSPToSearchParameters } from './parser';

import SearchParameters from './';

storiesOf('SearchBar', module).add('Base (render only)', () => {
  const csp = {
    'and(': [
      {
        state: { search: 'Lakers', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      },
      {
        or: [
          {
            state: { search: 'Kobe', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Lebron', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Shaq', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          }
        ]
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar', module).add('with groups', () => {
  const csp = {
    and: [
      {
        'and(': [
          {
            state: { search: 'Lakers', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            'and(': [
              {
                state: { search: 'Kobe', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              },
              {
                state: { search: 'Bryant', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              }
            ]
          },
          {
            state: { search: 'Shaq', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Friendly', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          }
        ]
      },
      {
        state: { search: 'Hello', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar', module).add('with double nested group', () => {
  const csp = {
    and: [
      {
        'and(': [
          {
            and: [
              {
                state: { search: 'Lakers', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              },
              {
                'and(': [
                  {
                    state: { search: 'Kobe', language: 'en' },
                    engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
                  },
                  {
                    state: { search: 'Bryant', language: 'en' },
                    engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
                  }
                ]
              }
            ]
          },
          {
            'and(': [
              {
                state: { search: 'Shaq', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              },
              {
                state: { search: 'Friendly', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              }
            ]
          }
        ]
      },
      {
        state: { search: 'Hello', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Transcript', () => {
  const csp = {
    'and(': [
      {
        state: { search: 'Lakers', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      },
      {
        or: [
          {
            state: { search: 'Kobe', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Lebron', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Shaq', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          }
        ]
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Face', () => {
  const csp = {
    and: [
      {
        state: {
          exclude: false,
          id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
          type: 'entity',
          label: 'Kobe Bryant',
          image:
            'https://prod-veritone-library.s3.amazonaws.com/2277175f-5a26-4199-bdbc-cff3311297b0/237eca2b-bbd8-4591-a5d3-91d37a458916/profile-1507911101521.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQMR5VATUAQBMLPKB%2F20180813%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180813T233936Z&X-Amz-Expires=900&X-Amz-Security-Token=FQoGZXIvYXdzEEcaDOG%2BsUm7nk3zapTfXSK3A5RgSVjpMx9jDzMUZy38INE6a2DFBJD86VBkaC%2BtMdY3EH2mRLdmhIT2rIk4SI4hmUvXZ0VL2InNN4ovSxWZ4139PliArygHSRhtbsyTibi4H%2FRdrShsLw%2FzyOcA0I5VoQ6Uq6hkvQipRA4xRbzotPDilMUH4Z7CE35MoYUsbJ4%2FlDyiQKwXIJoYz2qryronjAGF4%2B6XdcLj4UlrT9MGJK2WtHky%2FIlU%2F%2BZcrubdsI0CDECz4OUdZRSKSlvaHVq%2BqrJHJhLvUQaEu7xgurNmvx9xbqOXYpRS3pktFYnRb1EGg0PJZIa3Y0P7UUE9Yxk9J3L8fjqkjVFmikB49Cqg6uuaDDNwTf1qyghFHhOiwuCobrVcKlUzpw2uHHzNyMxV7rkwZIBZgllodR2iapyIjAyIK%2FUT34Ul7KWkm8cgc01v5NcCttf0GPe3eA6lPL1uNiTcRsyLMJjVHOEuLfwEhNcFOx8nWEJccZ0ZhK7SWuZDTfo46HD7sOZitiXKKpBAQFakoHEt36UPrDrLQmV4Pb3NsaKcqGwMl8Qakhngx9wjo9d4BL1EY2bKW8gxYwTobXRyETxkABkom%2FXH2wU%3D&X-Amz-Signature=abce48b45fadd13c67dbb66083385667258ede69e5ce5bc18554045f3fd61316&X-Amz-SignedHeaders=host',
          description: 'TV-News-Personality'
        },
        engineCategoryId: '6faad6b7-0837-45f9-b161-2f6bf31b7a07'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Fingerprint', () => {
  const csp = {
    and: [
      {
        state: {
          exclude: false,
          id: '21bb9c49-255b-480d-bc06-9be5e5ab8612',
          type: 'library',
          label: 'Horizon - Jingle Ball Test',
          image: null,
          description: '1 Item'
        },
        engineCategoryId: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Geolocation', () => {
  const csp = {
    and: [
      {
        state: {
          latitude: 33.49171540729409,
          longitude: -119.696044921875,
          distance: 508089.89735746884,
          units: 'm'
        },
        engineCategoryId: '203ad7c2-3dbd-45f9-95a6-855f911563d0'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Logo', () => {
  const csp = {
    and: [
      {
        state: { exclude: false, id: 'espn', type: 'fullText', label: 'ESPN' },
        engineCategoryId: '5a511c83-2cbd-4f2d-927e-cd03803a8a9c'
      },
      {
        state: { exclude: false, id: 'ESPN', type: 'custom', label: 'ESPN' },
        engineCategoryId: '5a511c83-2cbd-4f2d-927e-cd03803a8a9c'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Object', () => {
  const csp = {
    and: [
      {
        state: {
          exclude: false,
          id: 'basketball',
          type: 'fullText',
          label: 'Basketball'
        },
        engineCategoryId: '088a31be-9bd6-4628-a6f0-e4004e362ea0'
      },
      {
        state: {
          exclude: false,
          id: 'Basketball',
          type: 'custom',
          label: 'Basketball'
        },
        engineCategoryId: '088a31be-9bd6-4628-a6f0-e4004e362ea0'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('OCR', () => {
  const csp = {
    and: [
      {
        state: { search: 'Lakers' },
        engineCategoryId: '3b4ac603-9bfa-49d3-96b3-25ca3b502325'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Sentiment', () => {
  const csp = {
    and: [
      {
        state: { search: 'positive' },
        engineCategoryId: 'f2554098-f14b-4d81-9be1-41d0f992a22f'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('TagModal', () => {
  const csp = {
    and: [
      {
        state: { exclude: false, id: 'test', type: 'custom', label: 'test' },
        engineCategoryId: 'tag-search-id'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('TimeModal', () => {
  const csp = {
    and: [
      {
        state: {
          search: {
            dayPartStartTime: '10:00',
            dayPartEndTime: '10:59',
            stationBroadcastTime: true,
            selectedDays: [true, true, true, true, true, true, true]
          }
        },
        engineCategoryId: 'time-search-id'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});
