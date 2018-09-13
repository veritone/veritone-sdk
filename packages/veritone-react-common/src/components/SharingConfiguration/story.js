import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SharingConfiguration from './';

export const generateOrganizations = function(
  n,
  nWithPermission = 0,
  permission = 'viewer'
) {
  const organizationById = {};
  for (let i = 1; i <= n; i++) {
    const organization = {
      id: 'orgId' + i,
      name: 'Organization ' + i
    };
    if (i <= nWithPermission) {
      organization.permission = permission;
    }
    organizationById[organization.id] = organization;
  }
  return organizationById;
};

storiesOf('Sharing Configuration', module)
  .add('Base', () => (
    <SharingConfiguration
      organizations={generateOrganizations(21, 2, 'viewer')}
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
    <SharingConfiguration
      organizations={generateOrganizations(21, 2, 'viewer')}
      onAclsChange={action('onAclsChange')}
      showMakePublic
      onIsPublicChange={action('onAclsChange')}
      defaultPermission="viewer"
    />
  ))

  .add('Hide Public Section', () => (
    <SharingConfiguration
      organizations={generateOrganizations(21, 2, 'viewer')}
      onAclsChange={action('onAclsChange')}
      defaultPermission="viewer"
      sharingSectionDescription={
        'This sharing component does not allow setting public access.'
      }
    />
  ));
