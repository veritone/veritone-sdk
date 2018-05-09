import React from 'react';
import { string } from 'prop-types';

import TextField from 'material-ui/TextField';

import classes from './styles.scss';

const PersonalInfo = ({firstName, lastName, email}) => {

    const name  = `${firstName} ${lastName}`;
    return (
        <div className={classes.container}>
            <div className={classes.context}>
                <h2>Your Personal info</h2>
                <p>Manage this basic information - your name and email.</p>
                <div className={classes.inputBoxes}>
                <div className={classes.inputBoxe}>
                    <TextField  
                        id="name"
                        className={classes.textField}
                       value={name}
                    />
                </div>
                <div className={classes.inputBoxe}>
                    <TextField  
                        id="email"
                        className={classes.textField}
                        value={email}
                    />
                </div>
                
                </div>
            </div>
        </div>
    )
}

PersonalInfo.propTypes = {
    email: string.isRequired,
    firstName: string,
    lastName: string
}

export default PersonalInfo;