import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {
  func,
  string,
  arrayOf,
  shape,
  number
} from 'prop-types';
import { get, find } from 'lodash';

import styles from './styles.scss';

export default class AclGroups extends React.Component {
  static propTypes = {
    acls: arrayOf(
      shape({
        organizationId: string.isRequired,
        permission: string.isRequired
      })
    ),
    organizations: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    permissions: arrayOf(string).isRequired,
    defaultPermission: string,
    onAclsChange: func.isRequired,
    description: string
  };

  state = {
    acls: {
      ...this.props.acls
    }
  };

  openSelectAclGroupDialog = () => {
    console.log('Open Select acl groups dialog');
  };

  handleRevokeAcl = event => {
    console.log('revoking acl for ' + get(event, 'target.value'));
    this.props.onAclsUpdate(this.state.acls);
  };

  render() {
    const {
      description,
      organizations,
      acls
    } = this.props;

    // const {
    //   acls
    // } = this.state;

    return (
      <div className={styles.aclGroupsContainer}>
        <div className={styles.title}>
          <div className={styles.titleLabelSection}>
            <div className={styles.titleLabel}>ACL Groups</div>
            <div className={styles.titleDescription}>{description}</div>
          </div>
          <div className={styles.addAclGroupsButton}>
            <Button
              variant='outlined'
              color='primary'
              onClick={this.openSelectAclGroupDialog}
              classes={{
                label: styles.addAclGroupsButtonLabel
              }}
            >
              ADD ACL GROUP
            </Button>
          </div>
        </div>
        {get(acls, 'length') > 0 &&
          <div className={styles.aclsListSection}>
            <div className={styles.aclsListHelperText}>Organization</div>
            {acls.map(acl => {
              const aclOrg = find(organizations, { id: acl.organizationId });
              return (
                <div key={acl.organizationId} className={styles.aclRow}>
                  <div className={styles.aclRowLabel}>
                    {aclOrg ? aclOrg.name : acl.organizationId}
                  </div>
                  <IconButton
                    className={styles.aclRowDeleteIcon}
                    aria-label='Delete'
                    onClick={this.handleRevokeAcl(acl.organizationId)}>
                    <DeleteIcon />
                  </IconButton>
                </div>);
            })}
          </div>}
      </div>
    );
  }
}
