import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { func, string, arrayOf, shape } from 'prop-types';
import { get, find, reject } from 'lodash';
import SelectAclGroupDialog from './SelectAclGroupDialog';
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
    defaultPermission: string,
    onAclsChange: func.isRequired,
    description: string
  };

  state = {
    isSelectAclGroupDialogOpen: false
  };

  handleRemoveAcl = organizationId => {
    this.props.onAclsChange(
      reject(this.props.acls, { organizationId: organizationId })
    );
  };

  openSelectAclGroupDialog = () => {
    this.setState({
      isSelectAclGroupDialogOpen: true
    });
  };

  closeSelectAclGroupDialog = () => {
    this.setState({
      isSelectAclGroupDialogOpen: false
    });
  };

  handleSelectAclGroup = newAcls => {
    this.closeSelectAclGroupDialog();
    this.props.onAclsChange(newAcls);
  };

  render() {
    const { description, organizations, acls, defaultPermission } = this.props;

    return (
      <div className={styles.aclGroupsContainer}>
        <div className={styles.title}>
          <div className={styles.titleLabelSection}>
            <div className={styles.titleLabel}>ACL Groups</div>
            {description && (
              <div className={styles.titleDescription}>{description}</div>
            )}
          </div>
          <div className={styles.selectAclGroupButton}>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.openSelectAclGroupDialog}
              classes={{
                label: styles.selectAclGroupButtonLabel
              }}
            >
              ADD ACL GROUP
            </Button>
          </div>
        </div>
        {get(acls, 'length') > 0 && (
          <div className={styles.aclsListSection}>
            <div className={styles.aclsListHelperText}>Organization</div>
            {acls.map(acl => {
              const aclOrg = find(organizations, { id: acl.organizationId });
              return (
                /* eslint-disable react/jsx-no-bind */
                <div key={acl.organizationId} className={styles.aclRow}>
                  <div className={styles.aclRowLabel}>
                    {aclOrg ? aclOrg.name : acl.organizationId}
                  </div>
                  <IconButton
                    className={styles.aclRowDeleteIcon}
                    aria-label="Delete"
                    onClick={() => this.handleRemoveAcl(acl.organizationId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              );
            })}
          </div>
        )}
        {this.state.isSelectAclGroupDialogOpen && (
          <SelectAclGroupDialog
            acls={acls}
            organizations={organizations}
            defaultPermission={defaultPermission}
            onClose={this.closeSelectAclGroupDialog}
            onAdd={this.handleSelectAclGroup}
          />
        )}
      </div>
    );
  }
}
