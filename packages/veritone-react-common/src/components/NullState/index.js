import React from 'react';
import Button from '@material-ui/core/Button';
import { string, func, shape, node, bool } from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const NullState = ({ imgProps, titleText, btnProps, children, inWidgets }) => {
  const classes = useStyles();
  const containerClassName = inWidgets ?
    classes.inWidgetView : classes.nullStateView;

  return (
    <div className={containerClassName}>
      {imgProps && <img {...imgProps} />}
      {titleText && <div className={classes.titleText}>{titleText}</div>}
      {children}
      {btnProps && (
        <Button
          className={classes.buttonStyle}
          variant="contained"
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
  imgProps: shape({
    src: string.isRequired,
    alt: string
  }),
  titleText: string,
  btnProps: shape({
    onClick: func.isRequired,
    text: string.isRequired
  }),
  children: node,
  inWidgets: bool
};

export default NullState;
