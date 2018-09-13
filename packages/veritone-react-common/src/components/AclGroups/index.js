import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { func, string, objectOf, shape } from 'prop-types';
import { map, values } from 'lodash';
import SelectAclGroupDialog from './SelectAclGroupDialog';
import styles from './styles.scss';

export default class AclGroups extends React.Component {
  static propTypes = {
    organizations: objectOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        permission: string
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
    const organization = {
      ...this.props.organizations[organizationId]
    };
    organization.permission = null;
    const modifiedAcls = {};
    modifiedAcls[organization.id] = organization;
    this.props.onAclsChange(modifiedAcls);
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

  handleSelectAclGroup = modifiedAcls => {
    this.closeSelectAclGroupDialog();
    this.props.onAclsChange(modifiedAcls);
  };

  render() {
    const { description, organizations, defaultPermission } = this.props;

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
        {organizations &&
          values(organizations).length > 0 && (
            <div className={styles.aclsListSection}>
              <div className={styles.aclsListHelperText}>Organization</div>
              {map(organizations, organization => {
                if (!organization.permission) {
                  return null;
                }
                return (
                  /* eslint-disable react/jsx-no-bind */
                  <div key={organization.id} className={styles.aclRow}>
                    <div className={styles.aclRowLabel}>
                      {organization.name}
                    </div>
                    <IconButton
                      className={styles.aclRowDeleteIcon}
                      aria-label="Delete"
                      onClick={() => this.handleRemoveAcl(organization.id)}
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
