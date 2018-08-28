import React from 'react';
import { string, func } from 'prop-types';

import Avatar from '../../Avatar/index';

import classes from './styles.scss';

const Profile = ({ firstName, lastName, filePickerHandler }) => {
  const userName = `${firstName.charAt(0).toUpperCase() +
    firstName.slice(1)} ${lastName.charAt(0).toUpperCase() +
    lastName.slice(1)} `;

  return (
    <div className={classes.container}>
      <div className={classes.context}>
        <div className={classes.avatarHolder} onClick={filePickerHandler}>
          <Avatar src="http://placekitten.com/g/400/300" label="Change" />
        </div>
        <div className={classes.greeting}>
          <span>Welcome, {userName}</span>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  firstName: string,
  lastName: string,
  filePickerHandler: func.isRequired
};

export default Profile;
