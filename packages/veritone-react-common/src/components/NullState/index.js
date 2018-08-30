import React from 'react';
import Button from '@material-ui/core/Button';
import { string, func, shape, node, objectOf, any } from 'prop-types';

import styles from './styles.scss';

const NullState = ({ imgSrc, imgProps, titleText, btnProps, children }) => {
  return (
    <div className={styles.nullStateView}>
      {imgSrc &&
      <img
        src={imgSrc}
        {...imgProps}
      />}
      {titleText &&
        <div className={styles.titleText}>
          {titleText}
        </div>
      }
      {children}
      {btnProps && (
        <Button
          className={styles.buttonStyle}
          variant="raised"
          color="primary"
          onClick={btnProps.onClick}
        >
          {btnProps.text}
        </Button>
      )}
    </div>
  );
};

NullState.propTypes = {
  imgSrc: string.isRequired,
  imgProps: objectOf(any),
  titleText: string,
  btnProps: shape({
    onClick: func.isRequired,
    text: string.isRequired
  }),
  children: node
};

export default NullState;
