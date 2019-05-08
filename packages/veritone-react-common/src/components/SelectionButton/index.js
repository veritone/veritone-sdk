import React from 'react';
import { func, bool, node } from 'prop-types';

import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';

import cx from 'classnames';
import styles from './styles.scss';

function SelectionButton(props) {
  return (
    <Button
      className={cx([
        styles.condensedButton,
        { [styles.selected]: props.selected }
      ])}
      variant="outlined"
      onClick={props.toggleSelection}
    >
      <Radio
        classes={{ root: styles.condensed }}
        className={styles.condensed}
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
