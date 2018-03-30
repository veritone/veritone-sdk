import React from 'react';

import { storiesOf } from '@storybook/react';

import {
  objectOf,
  any
} from 'prop-types';

import SourceManagerModal from './';

const TEMPLATES = [];

const SOURCE = {
  "id": "23957",
  "name": "gabbers77",
  "organization": {
    "id": "7478",
    "name": "Maker Studios",
    "jsondata": {
      "platformType": "existing",
      "applicationIds": [
        "92269e7a-2859-406a-ad5e-1a00c30b3512",
        "7f402a84-4ae6-451f-85ca-9447397610b7",
        "1b8d45db-dc7e-4a19-b5f0-7096f711c0bd",
        "8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5",
        "cc4e0e89-3420-49c2-b06d-8d9a929c941c",
        "ea1d26ab-0d29-4e97-8ae7-d998a243374e"
      ],
      "dataSources": [
        "arbitron"
      ],
      "features": {
        "media": "enabled",
        "mentionListing": {
          "comments": true,
          "edit": true
        },
        "notifications": {
          "email": true,
          "sms": true
        },
        "shareMentions": {
          "email": true,
          "twitter": true,
          "facebook": true,
          "link": true
        },
        "postToCollections": "enabled",
        "shareCollections": {
          "internal": "enabled"
        },
        "ratings": "enabled",
        "sendMentionsToSalesForce": "enabled",
        "sendMentionsToWebService": "enabled",
        "includeDataSources": "enabled"
      },
      "metadata": {
        "fields": []
      },
      "url": "http://www.makerstudios.com/",
      "primaryContactName": "Veritone PartnerOps",
      "primaryContactEmail": "partnerops@veritone.com",
      "companyType": "YouTube MCN",
      "employeeCount": "2",
      "primaryContactPhone": "0123456789",
      "image": "https://s3.amazonaws.com/prod-veritone-ugc/organizations/7478/KEInQrCSSmKwqWRllbgz_j7xsiq7-_400x400.png",
      "customCmsAndAclApplicationIds": [
        "92269e7a-2859-406a-ad5e-1a00c30b3512",
        "7f402a84-4ae6-451f-85ca-9447397610b7",
        "1b8d45db-dc7e-4a19-b5f0-7096f711c0bd"
      ]
    }
  },
  "isPublic": true,
  "details": {
    "liveTimezone": "US/Pacific",
    "youtubeChannelId": "UCZTR9wnEghg8FnN0jNBZaow",
    "youtubeChannelUrl": "https://www.youtube.com/channel/UCZTR9wnEghg8FnN0jNBZaow"
  },
  "sourceType": {
    "id": "3",
    "name": "YouTube",
    "sourceSchema": {
      "id": "f8af5c4b-3326-40ce-bd63-ce5611afe0d3",
      "definition": {
        "type": "object",
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
          "youtubeChannelUrl": {
            "$id": "/properties/youtubeChannelUrl",
            "type": "string",
            "title": "YouTube Channel URL"
          },
          "youtubeChannelId": {
            "$id": "/properties/youtubeChannelId",
            "type": "string",
            "title": "YouTube Channel ID"
          }
        },
        "required": [
          "youtubeChannelUrl"
        ]
      },
      "validActions": [
        "view",
        "edit",
        "deactivate",
        "delete"
      ],
      "status": "published"
    }
  }
};

const SOURCE_TYPES = [{
  "id": "3",
  "name": "YouTube",
  "isPublic": true,
  "organizationId": "7682",
  "sourceSchema": {
    "id": "f8af5c4b-3326-40ce-bd63-ce5611afe0d3",
    "definition": {
      "type": "object",
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "properties": {
        "youtubeChannelUrl": {
          "$id": "/properties/youtubeChannelUrl",
          "type": "string",
          "title": "YouTube Channel URL"
        },
        "youtubeChannelId": {
          "$id": "/properties/youtubeChannelId",
          "type": "string",
          "title": "YouTube Channel ID"
        }
      },
      "required": [
        "youtubeChannelUrl"
      ]
    },
    "status": "published",
    "majorVersion": 1,
    "minorVersion": 0,
    "validActions": [
      "view",
      "edit",
      "deactivate",
      "delete"
    ],
    "dataRegistryId": "7adfa472-2bad-4961-bd7d-2ec0ae8f4dab"
  }
}];

class ModalContainer extends React.Component {
  static propTypes = {
    source: objectOf(any)
  };

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      source: this.props.source
    }
  }

  handleClose = () => {
    console.log('Clicked close/back');
  };

  getSavedSource = source => {
    console.log(source);
  }

  render() {
    return (
      <SourceManagerModal
        open={this.state.open}
        templates={TEMPLATES}
        sourceTypes={SOURCE_TYPES}
        source={this.state.source}
        handleClose={this.handleClose}
        getSavedSource={this.getSavedSource}/>
    );
  }
}

storiesOf('SourceManagerModal', module)
  .add('Create Source', () => (
    <ModalContainer />
  ))
  .add('Edit Source', () => (
    <ModalContainer source={SOURCE} />
  ))