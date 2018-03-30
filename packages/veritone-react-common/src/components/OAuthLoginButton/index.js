import React from 'react';
import cx from 'classnames';

import { func, bool, string } from 'prop-types';

import veritoneIcon from 'images/veritone-logo-icon-transparent.svg';
import styles from './styles.scss';

const OAuthLoginButton = ({ onClick, iconOnly, className }) => {
  return (
    <button
      onClick={onClick}
      className={cx(styles.button, styles.resetButtonStyles, className)}
    >
      <img src={veritoneIcon} />

      {!iconOnly && (
        <div className={styles.textContainer}>Sign In With Veritone</div>
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
