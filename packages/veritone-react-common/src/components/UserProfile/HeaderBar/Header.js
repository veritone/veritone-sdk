import React from 'react'; 
import { func } from 'prop-types';

import classes from './styles.scss';

const Header = ({close}) => (
    <div className={classes.header}>
        <div className={classes.iconHolder}>
            <i className="icon-close-exit" onClick={close()}/>
        </div>
        <div className={classes.label}>My Account</div>
    </div>
);

Header.propTypes = {
    close: func.isRequired,
}

export default Header;