import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SDOAdapterObj from './';
const SDOAdapter = SDOAdapterObj.adapter;

const adapterConfig = {
  "adapterId": "react-adapter",
  "name": "Open Weather Adapter",
  "description": "Pull weather data from Open Weather library",
  "logoPath": "https://www.filepicker.io/api/file/zieqnkkhTY6aGiNVwmMW",
  "template": "ingest/react-adapter",
  "config": {
    "adapterId": "react-adapter",
    "enableSchedule": true,
    "enableProcess": true,
    "enableCustomize": {
      "setName": true
    }
  },
  "namespace": "configuration",
  "title": "Configuration"
};

const sources = [{
  "id": "38721",
  "name": "Video Monitor",
  "organization": null,
  "isPublic": true,
  "details": {
    "liveTimezone": "US/Pacific",
    "youtubeChannelId": null,
    "youtubeChannelUrl": null,
    "youtubeChannelCreatedDate": null,
    "stationChannel": "123",
    "radioStationCode": "XXXX",
    "radioStreamUrl": "http://veritone.com/",
    "biaStationCode": null,
    "stationCallSign": null,
    "stationBand": null,
    "businessUnit": null
  }
},
{
  "id": "21495",
  "name": "WHBY-AM",
  "organization": {
    "id": "6572",
    "name": "Woodward Communications Incorporated",
    "jsondata": {
      "platformType": "existing",
      "features": {},
      "dataSources": [],
      "metadata": {
        "fields": []
      },
      "url": "http://www.wcinet.com/",
      "companyType": "Radio station owner",
      "primaryContactName": "Veritone PartnerOps",
      "primaryContactEmail": "partnerops@veritone.com",
      "primaryContactPhone": "0123456789",
      "employeeCount": "2",
      "applicationIds": [
        "92269e7a-2859-406a-ad5e-1a00c30b3512",
        "30c6668d-ebc3-47b6-9c04-927c26375919",
        "8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5",
        "cc4e0e89-3420-49c2-b06d-8d9a929c941c",
        "ea1d26ab-0d29-4e97-8ae7-d998a243374e"
      ],
      "image": "https://s3.amazonaws.com/prod-veritone-ugc/organizations/6572/h7izeqTTOGZXvXyi2swQ_logo.png",
      "customCmsAndAclApplicationIds": [
        "92269e7a-2859-406a-ad5e-1a00c30b3512",
        "30c6668d-ebc3-47b6-9c04-927c26375919"
      ]
    }
  },
  "isPublic": true,
  "details": {
    "liveTimezone": "US/Central",
    "youtubeChannelId": null,
    "youtubeChannelUrl": null,
    "youtubeChannelCreatedDate": null,
    "stationChannel": "1150",
    "radioStationCode": "WHBY-AM",
    "radioStreamUrl": "http://50.22.253.46:80/whby-am.mp3",
    "biaStationCode": 18667,
    "stationCallSign": "WHBY",
    "stationBand": "AM",
    "businessUnit": null,
    "description": "THE VOICE OF FOX CITIES",
    "frequency": "1150",
    "webSiteUrl": "http://www.whby.com/",
    "image": "https://s3.amazonaws.com/prod-veritone-ugc/media_sources/21495/a8U7bT4rTQ6bb8LlVTSF_13179246_10153957282150358_5900200230495528277_n.png"
  }
},
{
  "id": "19089",
  "name": "KKEA-AM",
  "organization": {
    "id": "5412",
    "name": "Blow Up LLC",
    "jsondata": {
      "platformType": "existing",
      "features": {},
      "dataSources": [],
      "metadata": {
        "fields": []
      },
      "applicationIds": [
        "92269e7a-2859-406a-ad5e-1a00c30b3512",
        "8592c4f4-371a-45fa-b561-f47e92eb1942",
        "8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5",
        "cc4e0e89-3420-49c2-b06d-8d9a929c941c",
        "ea1d26ab-0d29-4e97-8ae7-d998a243374e"
      ],
      "url": "http://www.espn1420am.com/",
      "companyType": "Radio station owner",
      "employeeCount": "2",
      "primaryContactName": "Veritone Partner Ops",
      "primaryContactEmail": "partnerops@veritone.com",
      "primaryContactPhone": "1234567890",
      "image": "https://s3.amazonaws.com/prod-veritone-ugc/organizations/5412/7k85KZYuRymmtoaGlnEt_radio_tower.gif",
      "customCmsAndAclApplicationIds": [
        "92269e7a-2859-406a-ad5e-1a00c30b3512",
        "8592c4f4-371a-45fa-b561-f47e92eb1942"
      ]
    }
  }
}];

function updateConfiguration(config) {
  console.log('updateConfiguration', config);
  configuration = config;
}

function getConfiguration(config) {
  console.log('getConfiguration', config);
}

let configuration = {
  sourceId: sources[0].id
};

storiesOf('SDOAdapter', module)
  .add('SDOAdapter', () => <SDOAdapter sources={sources} configuration={configuration} adapterConfig={adapterConfig} updateConfiguration={updateConfiguration}/>);
