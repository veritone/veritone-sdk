import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AddAclGroupDialog from './';

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

storiesOf('Add Acl Group Dialog', module).add('Base', () => (
  <AddAclGroupDialog
    isOpen
    acls={generateAcls(2, 'viewer')}
    organizations={generateOrganizations(21)}
    defaultPermission={'viewer'}
    onAdd={action('onAdd')}
    onClose={action('onClose')}
  />
));
