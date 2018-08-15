import React from 'react';
import { func, bool, string, arrayOf, shape } from 'prop-types';
import Switch from '@material-ui/core/Switch';
import AclGroups from '../AclGroups';
import styles from './styles.scss';

export default class SharingConfiguration extends React.Component {
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
    isPublic: bool,
    defaultPermission: string,
    onAclsChange: func.isRequired,
    showMakePublic: bool,
    onIsPublicChange: func,
    sharingSectionDescription: string,
    aclGroupsSectionDescription: string,
    publicSectionDescription: string
  };

  handleToggleIsPublic = event => {
    if (this.props.onIsPublicChange) {
      this.props.onIsPublicChange(event.target.checked);
    }
  };

  render() {
    const {
      acls,
      organizations,
      isPublic,
      defaultPermission,
      onAclsChange,
      showMakePublic,
      sharingSectionDescription,
      aclGroupsSectionDescription,
      publicSectionDescription
    } = this.props;

    return (
      <div className={styles.sharingConfigurationContainer}>
        <div className={styles.titleLabel}>Sharing</div>
        {sharingSectionDescription && (
          <div className={styles.titleDescription}>
            {sharingSectionDescription}
          </div>
        )}
        <div className={styles.selectAclGroupSection}>
          <AclGroups
            acls={acls}
            organizations={organizations}
            onAclsChange={onAclsChange}
            defaultPermission={defaultPermission}
            description={aclGroupsSectionDescription}
          />
        </div>
        {showMakePublic && (
          <div className={styles.makePublicSection}>
            <div className={styles.makePublicTitle}>
              <div className={styles.makePublicTitleLabel}>Make Public</div>
              <Switch
                checked={isPublic}
                onChange={this.handleToggleIsPublic}
                value="isPublic"
                color="primary"
              />
            </div>
            {publicSectionDescription && (
              <div className={styles.makePublicTitleDescription}>
                {publicSectionDescription}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
