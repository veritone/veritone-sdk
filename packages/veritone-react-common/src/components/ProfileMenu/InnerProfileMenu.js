import React, { Fragment } from 'react';
import { get } from 'lodash';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { string, func, shape, arrayOf, element } from 'prop-types';
import { withStyles } from 'helpers/withStyles';
import styles from './styles';

const classes = withStyles(styles);
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
      signedImageUrl: string
    }),
    additionMenuItems: arrayOf(element)
  };

  render() {
    const userExists = !!Object.keys(this.props.user).length;
    if (!userExists) {
      return <div className={classes.userNullState}>No user found</div>;
    }

    const userProfileImage =
      this.props.user.signedImageUrl ||
      get(this.props.user, 'kvp.image') ||
      '//static.veritone.com/veritone-ui/default-avatar-2.png';
    return (
      <Fragment>
        <ListSubheader className={classes['header']} key="header">
          <div className={classes['userAvatar']}>
            <Avatar src={userProfileImage} />
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
                variant="contained"
                color="secondary"
                onClick={this.props.onEditProfile}
                className="editProfileButton"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </ListSubheader>

        {this.props.additionMenuItems}

        <Divider />
        <MenuItem
          onClick={this.props.onLogout}
          key="logout"
          className="logoutButton"
        >
          <ListItemIcon>
            <PowerIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Fragment>
    );
  }
}

export default InnerProfileMenu;
