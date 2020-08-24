import React, { Fragment } from 'react';
import { get, findIndex } from 'lodash';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import {
  string,
  func,
  shape,
  arrayOf,
  bool,
  element,
  any,
  number
} from 'prop-types';
import { withStyles } from '@material-ui/styles';
import styles from './styles';

class InnerProfileMenu extends React.Component {
  static propTypes = {
    onLogout: func.isRequired,
    onEditProfile: func.isRequired,
    user: shape({
      userName: string,
      kvp: shape({
        firstName: string,
        lastName: string,
        image: string
      }),
      organization: shape({
        organizationId: number
      }),
      signedImageUrl: string
    }),
    isDiscovery: bool,
    enabledApps: arrayOf(
      shape({
        name: string,
        permissionId: number,
        iconClass: string,
        displayName: string
      })
    ),
    additionMenuItems: arrayOf(element),
    classes: shape({ any })
  };

  sendToAdmin = route => () => {
    window.open(route, 'blank');
  };

  render() {
    const { isDiscovery, classes } = this.props;
    let adminRoute;
    const adminAppExists = findIndex(this.props.enabledApps, [
      'applicationId',
      'ea1d26ab-0d29-4e97-8ae7-d998a243374e'
    ]);
    const orgId = get(this.props.user, 'organization.organizationId');
    const isAdmin = adminAppExists >= 0 ? true : false;
    if (isAdmin) {
      adminRoute = `${
        this.props.enabledApps[adminAppExists]['applicationUrl']
      }/organizations/${orgId}/discovery `;
    }

    const userExists = !!Object.keys(this.props.user).length;
    if (!userExists) {
      return <div className={classes.userNullState}>No user found</div>;
    }
    let userInitials =
      get(this.props.user, 'kvp.firstName')
        .slice(0, 1)
        .toUpperCase() +
      get(this.props.user, 'kvp.lastName')
        .slice(0, 1)
        .toUpperCase();
    let userProfileImage =
      this.props.user.signedImageUrl || get(this.props.user, 'kvp.image');
    if (!userInitials && !userProfileImage) {
      userProfileImage =
        '//static.veritone.com/veritone-ui/default-avatar-2.png';
    }

    return (
      <Fragment>
        <ListSubheader className={classes['header']} key="header">
          <div className={classes['userAvatar']}>
            {userProfileImage ? (
              <Avatar
                data-test="userAvatar"
                className={classes.avatar}
                src={userProfileImage}
              />
            ) : (
              <Avatar data-test="userAvatarInitials" className={classes.avatar}>
                {userInitials}
              </Avatar>
            )}
          </div>
          <div className={classes['userProfile']}>
            <div className={classes['fullName']}>
              {get(this.props.user, 'kvp.firstName')}&nbsp;
              {get(this.props.user, 'kvp.lastName')}
            </div>
            <div className={classes['username']}>
              {get(this.props.user, 'userName')}
            </div>
            <div className={classes['editButton']}>
              <Button
                data-test="editProfileButton"
                variant="contained"
                color="primary"
                onClick={this.props.onEditProfile}
                className={classes.editProfileButton}
              >
                Edit Profile
              </Button>
              {isDiscovery &&
                isAdmin && (
                  <Button
                    data-test="discoverySettingsButton"
                    variant="outlined"
                    color="primary"
                    onClick={this.sendToAdmin(adminRoute)}
                    className={classes.settingsButton}
                  >
                    Settings
                  </Button>
                )}
            </div>
          </div>
        </ListSubheader>

        {this.props.additionMenuItems}

        <Divider />
        <div className={classes.center}>
          <Button
            data-test="logoutButton"
            variant="outlined"
            onClick={this.props.onLogout}
            className={classes.logoutButton}
          >
            Sign Out
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(InnerProfileMenu);
