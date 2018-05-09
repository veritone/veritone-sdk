import React from 'react';
import { string } from 'prop-types';

import Avatar from '../../Avatar/index';

import classes from './styles.scss';

const Profile = ({greeting, firstName, lastName}) => {
    const userName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)} `

    return (
        <div className={classes.container}>
            <div className={classes.context}>
                <div className={classes.avatarHolder}>
                    <Avatar src="http://placekitten.com/g/400/300" label="Change"/>
                </div>
                <div className={classes.greeting}>
                    <span>{greeting}, {userName}</span>
                </div>
            </div>
        </div>
    )
}

Profile.propTypes = {
    greeting: string.isRequired,
    firstName: string,
    lastName: string
}

export default Profile;