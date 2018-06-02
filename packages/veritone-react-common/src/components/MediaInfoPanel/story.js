import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MediaInfoPanel from 'components/MediaInfoPanel';

const TDO = {
  id: '400003025',
  details: {
    tags: [
      { value: 'tag1' }, { value: 'longer tag' }, { value: 'a bit longer tag' },
      { value: 'very very very very very very very very very very very very very very long tag' },
      { value: 'tag 3' }, { value: 'tag 4' }, { value: 'tag 5' }, { value: 'tag 6' },
      { value: 'tag 7' }, { value: 'tag 8' }, { value: 'tag 9' }, { value: 'tag 0' },
      { value: 'hakuna' }, { value: 'matata' }
    ],
    veritoneFile: {
      filename: '2FOTUlhqRaQYqjrCLcahix_mikeandmike2FOTUlhqRaQYqjrCLcahix_mikeandmike2FOTUlhqRaQYqjrCLcahix_mikeandmike2FOTUlhqRaQYqjrCLcahix_mikeandmike.mp4'
    },
    date: '2018-01-18T00:09:06.685Z',
    veritoneProgram: {
      programId: '-1',
      programName: 'Upload',
      programImage: '',
      programLiveImage: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/4d498250-636a-4b69-8e0b-ab2d8cb6ceab.jpeg',
      signedProgramLiveImage: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/4d498250-636a-4b69-8e0b-ab2d8cb6ceab.jpeg'
    },
    source: { ingestionType: 'upload' },
    veritonePermissions: {
      acls: [ { groupId: 'ea738f5b-9f52-45f3-8db8-3167bfd625fe', permission: 'owner' } ],
      isPublic: false
    },
    veritoneCustom: { source: 'Los Angeles' },
    veritoneCreative: {}
  },
  startDateTime: '2018-01-20T00:44:21.402Z',
  stopDateTime: '2018-01-20T00:44:41.403Z',
  applicationId: 'ed075985-bc94-406b-8639-44d1da42c3fb',
  security: {
    global: true
  },
  thumbnailUrl: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/4d498250-636a-4b69-8e0b-ab2d8cb6ceab.jpeg',
  sourceImageUrl: null,
  primaryAsset: {
    id: '9926cdef-f848-4cbb-a1d5-de0b0ff035dd',
    signedUri: 'https://s3.amazonaws.com/dev.inspirent/assets/400003025/7bab3e8f-53ea-473c-bb96-8bc07d31264e.mp4'
  },
  streams:[]
};

const ENGINE_CATEGORIES = [{
  name: 'Fingerprint',
  id: '17d62b84-8b49-465b-a6be-fe3ea3bc8f05',
  engines: [ { id: 'fingerprint-audio', name: 'Mars' } ]
}, {
  name: 'Transcription',
  id: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
  engines: [ { id: 'transcribe-voicebase', name: 'Temporal' }, { id: 'transcribe-voicebase-benchmark', name: 'VoiceBase-Benchmark' } ]
}];

const CONTEXT_MENU_EXTENTIONS = {
  tdos: [{
    id: '400003025',
    label: 'TDO on CMS dev',
    url: 'https://cms.aws-dev.veritone.com/#/media-details/400003025'
  }]
};

const KVP = {
  features: {
    downloadMedia: 'enabled',
    downloadPublicMedia: 'enabled'
  },
  applicationIds: ['ed075985-bc94-406b-8639-44d1da42c3fb']
};

storiesOf('MediaInfoPanel', module).add('TDO Full Data', () => (
  <MediaInfoPanel
    tdo={TDO}
    engineCategories={ENGINE_CATEGORIES}
    contextMenuExtensions={CONTEXT_MENU_EXTENTIONS}
    kvp={KVP}
    onClose={action('onSaveMetadata')}
    onSaveMetadata={action('onSaveMetadata')} />
));
