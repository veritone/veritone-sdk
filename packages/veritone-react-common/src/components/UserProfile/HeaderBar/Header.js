import React from 'react'; 
import { string } from 'prop-types';

import classes from './styles.scss';

const Header = ({title}) => (
    <div className={classes.header}>
        <div className={classes.iconHolder}>
            <i className="icon-close-exit" />
        </div>
        <div className={classes.label}>{title}</div>
    </div>
);

Header.propTypes = {
    title: string.isRequired
}

export default Header;