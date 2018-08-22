import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SharingConfigurartion from './';

const generateAcls = function(n, permission) {
  const acls = [];
  for (let i = 1; i <= n; i++) {
    acls.push({
      organizationId: 'orgId' + i,
      permission: permission
    });
  }
  return acls;
};

const generateOrganizations = function(n) {
  const organizations = [];
  for (let i = 1; i <= n; i++) {
    organizations.push({
      id: 'orgId' + i,
      name: 'Organization ' + i
    });
  }
  return organizations;
};

storiesOf('Sharing Configuration', module)
  .add('Base', () => (
    <SharingConfigurartion
      acls={generateAcls(2, 'viewer')}
      organizations={generateOrganizations(21)}
      isPublic
      onAclsChange={action('onAclsChange')}
      showMakePublic
      onIsPublicChange={action('onAclsChange')}
      defaultPermission="viewer"
      sharingSectionDescription="Share this source or program across organizations."
      aclGroupsSectionDescription="Grant organizations permission to this program or source and its contents. Sharing programs will also share related Sources."
      publicSectionDescription="Share this source or program and all of its content with all of Veritone."
    />
  ))

  .add('No Descriptions', () => (
    <SharingConfigurartion
      acls={generateAcls(2, 'viewer')}
      organizations={generateOrganizations(21)}
      onAclsChange={action('onAclsChange')}
      showMakePublic
      onIsPublicChange={action('onAclsChange')}
      defaultPermission="viewer"
    />
  ))

  .add('Hide Public Section', () => (
    <SharingConfigurartion
      acls={generateAcls(2, 'viewer')}
      organizations={generateOrganizations(21)}
      onAclsChange={action('onAclsChange')}
      defaultPermission="viewer"
      sharingSectionDescription={
        'This sharing component does not allow setting public access.'
      }
    />
  ));
