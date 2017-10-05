import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AppBar from './';

storiesOf('AppBar', module)
  .add('Base', () => (
    <AppBar
      profileMenu
      appSwitcher
      currentAppName="Storybook"
      logout={action('logout')}
      user={{
        userName: 'mrobb@veritone.com',
        kvp: {
          firstName: 'Mitch',
          lastName: 'Robb'
        }
      }}
      enabledApps={sampleApps}
    />
  ))
  .add('Title/close', () => (
    <AppBar title="My Veritone App" closeButton onClose={action('close')} />
  ));

const sampleApps = [
  {
    applicationId: '32babe30-fb42-11e4-89bc-27b69865858a',
    applicationName: 'Discovery',
    applicationKey: 'discovery',
    applicationStatus: 'active',
    applicationDescription:
      'Transform the way audio and vido is captured, accessed and leveraged throughout an organization.',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/discovery.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/discovery-app.svg',
    applicationUrl: 'https://enterprise.aws-dev.veritone.com',
    oauth2RedirectUrls: null,
    oauth2ClientSecret: null,
    permissionsRequired: null,
    createdDate: '2017-05-03T22:04:44.000Z',
    updatedDate: '2017-05-03T22:04:44.000Z',
    ownerOrganizationId: 7682,
    deploymentModel: 0,
    applicationCheckPermissions: true,
    permissionId: 45
  },
  {
    applicationId: '820015f9-36ab-454b-b5db-0bf0b36e4495',
    applicationName: 'Brainwasher',
    applicationKey: 'brainwasher',
    applicationStatus: 'active',
    applicationDescription:
      "This application is to brainwash the user using this! It's dangerous, so use with caution... ",
    applicationIconUrl: '',
    applicationIconSvg: null,
    applicationUrl: 'https://brainwasher.com',
    oauth2RedirectUrls: 'http://wash.me, http://wash.me/too',
    oauth2ClientSecret: 'dont tell jason',
    permissionsRequired: '*',
    createdDate: '2017-07-20T22:04:18.000Z',
    updatedDate: '2017-07-20T22:04:18.000Z',
    ownerOrganizationId: 14588,
    deploymentModel: 0,
    applicationCheckPermissions: false
  },
  {
    applicationId: '8a37c1d0-3f3b-48d0-a84e-2b8e3646fbe5',
    applicationName: 'CMS',
    applicationKey: 'cms',
    applicationStatus: 'active',
    applicationDescription:
      'With Veritone CMS, you can create, share, run cognitive engines, and keep all your files together to share with your organization.',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/cms.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/cms-app.svg',
    applicationUrl: 'https://cms.aws-dev.veritone.com',
    oauth2RedirectUrls: null,
    oauth2ClientSecret: null,
    permissionsRequired: null,
    createdDate: '2017-05-03T22:04:44.000Z',
    updatedDate: '2017-05-03T22:04:44.000Z',
    ownerOrganizationId: 7682,
    deploymentModel: 0,
    applicationCheckPermissions: true,
    permissionId: 13
  },
  {
    applicationId: 'cc4e0e89-3420-49c2-b06d-8d9a929c941c',
    applicationName: 'Collections',
    applicationKey: 'collections',
    applicationStatus: 'active',
    applicationDescription:
      'Easily syndicate your Veritone Collections to your website and share an interactive narrative with your viewers.',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/collections.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/collections-app.svg',
    applicationUrl: 'https://collections.aws-dev.veritone.com',
    oauth2RedirectUrls: null,
    oauth2ClientSecret: null,
    permissionsRequired: null,
    createdDate: '2017-05-03T22:04:44.000Z',
    updatedDate: '2017-05-03T22:04:44.000Z',
    ownerOrganizationId: 7682,
    deploymentModel: 0,
    applicationCheckPermissions: true,
    permissionId: 40
  },
  {
    applicationId: 'cf05552b-52e0-46fa-8f7f-4c9eee135c51',
    applicationName: 'Library',
    applicationKey: 'library',
    applicationStatus: 'active',
    applicationDescription:
      'Create training models for cognitive engines to find what’s important in your media quickly, easily, and more accurately.',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/library.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/library-app.svg',
    applicationUrl: 'https://library.aws-dev.veritone.com',
    oauth2RedirectUrls: null,
    oauth2ClientSecret: null,
    permissionsRequired: null,
    createdDate: '2017-04-27T23:12:10.000Z',
    updatedDate: '2017-04-27T23:12:10.000Z',
    ownerOrganizationId: 7682,
    deploymentModel: 0,
    applicationCheckPermissions: false
  },
  {
    applicationId: 'ea1d26ab-0d29-4e97-8ae7-d998a243374e',
    applicationName: 'Admin',
    applicationKey: 'admin',
    applicationStatus: 'active',
    applicationDescription:
      "Manage your organization's information, users and permissions",
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/admin.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/admin-app.svg',
    applicationUrl: 'https://admin.aws-dev.veritone.com',
    oauth2RedirectUrls: null,
    oauth2ClientSecret: null,
    permissionsRequired: null,
    createdDate: '2017-05-03T22:04:44.000Z',
    updatedDate: '2017-05-03T22:04:44.000Z',
    ownerOrganizationId: 7682,
    deploymentModel: 0,
    applicationCheckPermissions: true,
    permissionId: 2
  }
];
