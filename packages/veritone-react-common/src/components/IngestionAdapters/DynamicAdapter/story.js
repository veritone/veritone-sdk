import React from 'react';
import { storiesOf } from '@storybook/react';

import DynamicAdapterObj from './';
const DynamicAdapter = DynamicAdapterObj.adapter;

const ADAPTER_CONFIG = {
  adapterId: 'react-adapter',
  name: 'Open Weather Adapter',
  description: 'Pull weather data from Open Weather library',
  logoPath: 'https://www.filepicker.io/api/file/zieqnkkhTY6aGiNVwmMW',
  template: 'ingest/react-adapter',
  config: {
    adapterId: 'react-adapter',
    enableSchedule: true,
    enableProcess: true,
    enableCustomize: {
      setName: true
    }
  },
  namespace: 'configuration',
  title: 'Configuration',
  supportedSourceTypes: ['3'],
  fields: [
    {
      name: 'target',
      type: 'Picklist',
      defaultValue: 'en-US',
      info: 'Choose target language',
      options: [
        {
          key: 'English',
          value: 'en-US'
        },
        {
          key: 'Spanish',
          value: 'es-MX'
        },
        {
          key: 'French',
          value: 'fr-FR'
        }
      ]
    },
    {
      name: 'language',
      type: 'MultiPicklist',
      info: 'Pick multi-languages',
      defaultValues: ['en-US', 'es-MX'],
      options: [
        {
          key: 'English',
          value: 'en-US'
        },
        {
          key: 'Spanish',
          value: 'es-MX'
        },
        {
          key: 'French',
          value: 'fr-FR'
        }
      ]
    },
    {
      name: 'my-field-name',
      type: 'Text',
      defaultValue: 'Hello World',
      info: 'Anything you want'
    },
    {
      max: 0.9,
      min: 0.1,
      info:
        'The threshold is the minimum measure of confidence required for the result to be considered valid.',
      name: 'threshold',
      step: 0.01,
      type: 'Number',
      label: 'Threshold',
      defaultValue: '0.7'
    }
  ]
};

const SOURCES = [
  {
    id: '23957',
    name: 'gabbers77',
    organization: {
      id: '7478',
      name: 'Maker Studios',
      jsondata: {
        platformType: 'existing',
        applicationIds: [
          '92269e7a-2859-406a-ad5e-1a00c30b3512',
          '7f402a84-4ae6-451f-85ca-9447397610b7',
          '1b8d45db-dc7e-4a19-b5f0-7096f711c0bd',
          '8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5',
          'cc4e0e89-3420-49c2-b06d-8d9a929c941c',
          'ea1d26ab-0d29-4e97-8ae7-d998a243374e'
        ],
        dataSources: ['arbitron'],
        features: {
          media: 'enabled',
          mentionListing: {
            comments: true,
            edit: true
          },
          notifications: {
            email: true,
            sms: true
          },
          shareMentions: {
            email: true,
            twitter: true,
            facebook: true,
            link: true
          },
          postToCollections: 'enabled',
          shareCollections: {
            internal: 'enabled'
          },
          ratings: 'enabled',
          sendMentionsToSalesForce: 'enabled',
          sendMentionsToWebService: 'enabled',
          includeDataSources: 'enabled'
        },
        metadata: {
          fields: []
        },
        url: 'http://www.makerstudios.com/',
        primaryContactName: 'Veritone PartnerOps',
        primaryContactEmail: 'partnerops@veritone.com',
        companyType: 'YouTube MCN',
        employeeCount: '2',
        primaryContactPhone: '0123456789',
        image:
          'https://s3.amazonaws.com/prod-veritone-ugc/organizations/7478/KEInQrCSSmKwqWRllbgz_j7xsiq7-_400x400.png',
        customCmsAndAclApplicationIds: [
          '92269e7a-2859-406a-ad5e-1a00c30b3512',
          '7f402a84-4ae6-451f-85ca-9447397610b7',
          '1b8d45db-dc7e-4a19-b5f0-7096f711c0bd'
        ]
      }
    },
    isPublic: true,
    details: {
      liveTimezone: 'US/Pacific',
      youtubeChannelId: 'UCZTR9wnEghg8FnN0jNBZaow',
      youtubeChannelUrl:
        'https://www.youtube.com/channel/UCZTR9wnEghg8FnN0jNBZaow'
    },
    sourceType: {
      id: '3',
      name: 'YouTube',
      sourceSchema: {
        id: 'f8af5c4b-3326-40ce-bd63-ce5611afe0d3',
        definition: {
          type: 'object',
          definitions: {},
          $schema: 'http://json-schema.org/draft-07/schema#',
          properties: {
            youtubeChannelUrl: {
              $id: '/properties/youtubeChannelUrl',
              type: 'string',
              title: 'YouTube Channel URL'
            },
            youtubeChannelId: {
              $id: '/properties/youtubeChannelId',
              type: 'string',
              title: 'YouTube Channel ID'
            }
          },
          required: ['youtubeChannelUrl']
        },
        majorVersion: 1,
        minorVersion: 0,
        validActions: ['view', 'edit', 'deactivate', 'delete'],
        status: 'published'
      }
    }
  },
  {
    id: '38910',
    name: 'Nicolas11x12TECHX',
    organization: {
      id: '8276',
      name: 'Nicolas11x12TECHX',
      jsondata: {
        applicationIds: [
          '92269e7a-2859-406a-ad5e-1a00c30b3512',
          'e29a028b-4948-43c2-8036-2794dab2d4b5',
          '8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5',
          'cc4e0e89-3420-49c2-b06d-8d9a929c941c',
          'ea1d26ab-0d29-4e97-8ae7-d998a243374e'
        ],
        companyType: 'YouTube channel owner',
        sfAccountId: '001U000001jh8lJ',
        platformType: 'existing',
        features: {},
        dataSources: [],
        metadata: {
          fields: []
        },
        url: 'http://www.veritone.com',
        primaryContactName: 'Veritone PartnerOps',
        primaryContactEmail: 'partnerops@veritone.com',
        employeeCount: '0',
        primaryContactPhone: '0123456789',
        image:
          'https://s3.amazonaws.com/prod-veritone-ugc/organizations/8276/TFHAwppuTgCMOBTboC9j_tacho.png',
        customCmsAndAclApplicationIds: [
          '92269e7a-2859-406a-ad5e-1a00c30b3512',
          'e29a028b-4948-43c2-8036-2794dab2d4b5'
        ]
      }
    },
    isPublic: true,
    details: {
      youtubeChannelId: 'UCb0N0jgHiCwoGgkf5slDVUg',
      youtubeChannelCreatedDate: '2011-09-30 12:53:26'
    },
    sourceType: {
      id: '3',
      name: 'YouTube',
      sourceSchema: {
        id: 'f8af5c4b-3326-40ce-bd63-ce5611afe0d3',
        definition: {
          type: 'object',
          definitions: {},
          $schema: 'http://json-schema.org/draft-07/schema#',
          properties: {
            youtubeChannelUrl: {
              $id: '/properties/youtubeChannelUrl',
              type: 'string',
              title: 'YouTube Channel URL'
            },
            youtubeChannelId: {
              $id: '/properties/youtubeChannelId',
              type: 'string',
              title: 'YouTube Channel ID'
            }
          },
          required: ['youtubeChannelUrl']
        },
        majorVersion: 1,
        minorVersion: 0,
        validActions: ['view', 'edit', 'deactivate', 'delete'],
        status: 'published'
      }
    }
  },
  {
    id: '23995',
    name: 'Ana Viernes TV',
    organization: {
      id: '7478',
      name: 'Maker Studios',
      jsondata: {
        platformType: 'existing',
        applicationIds: [
          '92269e7a-2859-406a-ad5e-1a00c30b3512',
          '7f402a84-4ae6-451f-85ca-9447397610b7',
          '1b8d45db-dc7e-4a19-b5f0-7096f711c0bd',
          '8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5',
          'cc4e0e89-3420-49c2-b06d-8d9a929c941c',
          'ea1d26ab-0d29-4e97-8ae7-d998a243374e'
        ],
        dataSources: ['arbitron'],
        features: {
          media: 'enabled',
          mentionListing: {
            comments: true,
            edit: true
          },
          notifications: {
            email: true,
            sms: true
          },
          shareMentions: {
            email: true,
            twitter: true,
            facebook: true,
            link: true
          },
          postToCollections: 'enabled',
          shareCollections: {
            internal: 'enabled'
          },
          ratings: 'enabled',
          sendMentionsToSalesForce: 'enabled',
          sendMentionsToWebService: 'enabled',
          includeDataSources: 'enabled'
        },
        metadata: {
          fields: []
        },
        url: 'http://www.makerstudios.com/',
        primaryContactName: 'Veritone PartnerOps',
        primaryContactEmail: 'partnerops@veritone.com',
        companyType: 'YouTube MCN',
        employeeCount: '2',
        primaryContactPhone: '0123456789',
        image:
          'https://s3.amazonaws.com/prod-veritone-ugc/organizations/7478/KEInQrCSSmKwqWRllbgz_j7xsiq7-_400x400.png',
        customCmsAndAclApplicationIds: [
          '92269e7a-2859-406a-ad5e-1a00c30b3512',
          '7f402a84-4ae6-451f-85ca-9447397610b7',
          '1b8d45db-dc7e-4a19-b5f0-7096f711c0bd'
        ]
      }
    }
  }
];

const SOURCE_TYPES = [
  {
    id: '3',
    name: 'YouTube',
    isPublic: true,
    organizationId: '7682',
    sourceSchema: {
      id: 'f8af5c4b-3326-40ce-bd63-ce5611afe0d3',
      definition: {
        type: 'object',
        definitions: {},
        $schema: 'http://json-schema.org/draft-07/schema#',
        properties: {
          youtubeChannelUrl: {
            $id: '/properties/youtubeChannelUrl',
            type: 'string',
            title: 'YouTube Channel URL'
          },
          youtubeChannelId: {
            $id: '/properties/youtubeChannelId',
            type: 'string',
            title: 'YouTube Channel ID'
          }
        },
        required: ['youtubeChannelUrl']
      },
      status: 'published',
      majorVersion: 1,
      minorVersion: 0,
      validActions: ['view', 'edit', 'deactivate', 'delete'],
      dataRegistryId: '7adfa472-2bad-4961-bd7d-2ec0ae8f4dab'
    }
  }
];

function updateConfiguration(config) {
  console.log('updateConfiguration', config);
  Object.keys(config).forEach(key => (configuration[key] = config[key]));
  // configuration = config;
}

function openCreateSource() {
  console.log('openCreateSource');
}

function closeCreateSource() {
  console.log('closeCreateSource');
}

let configuration = {
  sourceId: SOURCES[0].id
};

storiesOf('DynamicAdapter', module).add('DynamicAdapter', () => (
  <DynamicAdapter
    sources={SOURCES}
    configuration={configuration}
    adapterConfig={ADAPTER_CONFIG}
    updateConfiguration={updateConfiguration}
    openCreateSource={openCreateSource}
    closeCreateSource={closeCreateSource}
  />
));
