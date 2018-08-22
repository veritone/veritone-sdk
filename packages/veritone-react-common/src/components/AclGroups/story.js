import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AclGroups from './';

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

storiesOf('Acl Groups', module)
  .add('Base', () => (
    <AclGroups
      acls={generateAcls(2, 'viewer')}
      organizations={generateOrganizations(21)}
      defaultPermission={'viewer'}
      onAclsChange={action('onAclsChange')}
      description={
        'Grant organizations permission to this program and its contents. Sharing programs will also share related Sources.'
      }
    />
  ))
  .add('No Initial ACLs', () => (
    <AclGroups
      organizations={generateOrganizations(21)}
      defaultPermission={'viewer'}
      onAclsChange={action('onAclsChange')}
      description={
        'Grant organizations permission to this program and its contents. Sharing programs will also share related Sources.'
      }
    />
  ));
