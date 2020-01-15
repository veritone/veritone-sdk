import React from 'react';
import { func, bool, node } from 'prop-types';

import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/styles';
import cx from 'classnames';
import styles from './styles';

const useStyles = makeStyles(styles);

function SelectionButton(props) {
  const classes = useStyles();
  return (
    <Button
      className={cx([
        classes.condensedButton,
        { [classes.selected]: props.selected }
      ])}
      variant="outlined"
      onClick={props.toggleSelection}
    >
      <Radio
        classes={{ root: classes.condensed }}
        className={classes.condensed}
        color={'primary'}
        checked={props.selected}
        onChange={props.toggleSelection}
      />
      {props.children}
    </Button>
  );
}

SelectionButton.propTypes = {
  selected: bool,
  toggleSelection: func,
  children: node
};

export default SelectionButton;
