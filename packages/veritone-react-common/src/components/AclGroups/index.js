import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {
  func,
  string,
  arrayOf,
  shape
} from 'prop-types';
import blue from '@material-ui/core//colors/blue';
import { get, find } from 'lodash';

import styles from './styles.scss';

class AclGroups extends React.Component {
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
    onAclsUpdate: func.isRequired,
    description: string,
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string
  };

  static defaultProps = {
    relativeSize: 14,
    color: '#2196F3'
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

  getTheme = ({ color, relativeSize }) => {
    const theme = createMuiTheme({
      typography: {
        htmlFontSize: relativeSize || 13,
        subheading: {
          fontSize: '1em'
        }
      },
      palette: {
        primary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        },
        secondary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        }
      }
    });
    return theme;
  };

  render() {
    const {
      description,
      organizations
    } = this.props;

    const {
      acls
    } = this.state;

    return (
      <MuiThemeProvider
        theme={this.getTheme({
          color: this.props.color,
          relativeSize: this.props.relativeSize
        })}
      >
        <div className={styles.aclGroupsContainer}>
          <div className={styles.title}>
            <div className={styles.titleLabelSection}>
              <div className={styles.titleLabel}>ACL Groups</div>
              <div className={styles.titleDescription}>{description}</div>
            </div>
            <Button
              variant='outlined'
              color='primary'
              className={styles.addAclsButton}
              onClick={this.openSelectAclGroupDialog}
            >
              ADD ACL GROUPS
            </Button>
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
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(AclGroups);
