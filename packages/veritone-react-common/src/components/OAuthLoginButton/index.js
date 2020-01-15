import React from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { func, bool, string } from 'prop-types';

import veritoneIcon from 'images/veritone-logo-icon-transparent.svg';
import styles from './styles';

const useStyles = makeStyles(styles);

const OAuthLoginButton = ({ onClick, iconOnly, className }) => {
  const classes = useStyles();
  return (
    <button
      onClick={onClick}
      className={cx(classes.button, classes.resetButtonStyles, className)}
    >
      <img src={veritoneIcon} />

      {!iconOnly && (
        <div className={classes.textContainer}>Sign In With Veritone</div>
      )}
    </button>
  );
};

OAuthLoginButton.propTypes = {
  onClick: func,
  iconOnly: bool,
  className: string
};

export default OAuthLoginButton;
