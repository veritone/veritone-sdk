import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AclsGroups from './';

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

storiesOf('Acl Groups', module).add('Base', () => (
  <AclsGroups
    acls={generateAcls(2, 'VIEWER')} //TODO: check on correct value
    organizations={generateOrganizations(21)}
    permissions={['VIEWER', 'EDITOR', 'OWNER']} //TODO: check on correct value
    defaultPermission={'VIEWER'}
    onAclsChange={action('onAclsChange')}
    description={
      'Grant organizations permissions to this program and its contents. Sharing programs will also share related Sources.'
    }
  />
));
