import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AclsGroups from './';

const generateAcls = function(n, permission) {
  const acls = [];
  for (let i = 1; i <= n; i++) {
    acls.push({
      organizationId: 'org' + i,
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

storiesOf('Acl Groups', module).add('Base', () => (
  <AclsGroups
    acls={generateAcls(n, 'VIEWER')} //TODO: check on correct value
    organizations={generateOrganizations(10)}
    permissions={['VIEWER', 'EDITOR', 'OWNER']} //TODO: check on correct value
    defaultPermission={'VIEWER'}
    onAclsUpdate={action('onAclsUpdate')}
    description={'Grant organizations permissions to this program and its contents. Sharing programs will also share related Sources.'}
  />
));
