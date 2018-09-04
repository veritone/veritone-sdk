import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { generateAcls, generateOrganizations } from './test-helpers';

import AclGroups from './';

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
