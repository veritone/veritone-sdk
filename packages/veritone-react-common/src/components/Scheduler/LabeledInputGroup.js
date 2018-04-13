import React from 'react';
import cx from 'classnames';
import { string, node, bool } from 'prop-types';
import { FormControl, FormLabel } from 'material-ui/Form';
import styles from './styles.scss';

const LabeledInputGroup = ({ label, hasIconOffset, children }) => (
  <FormControl component="fieldset">
    <div className={styles.fieldsetGroup}>
      <div className={cx(styles.label, {
        [styles.hasIconOffset]: hasIconOffset
      })}>
        <FormLabel focused={false}>{label}</FormLabel>
      </div>
      <div className={styles.input}>{children}</div>
    </div>
  </FormControl>
);

LabeledInputGroup.propTypes = {
  label: string,
  hasIconOffset: bool,
  children: node
};

export default LabeledInputGroup;
