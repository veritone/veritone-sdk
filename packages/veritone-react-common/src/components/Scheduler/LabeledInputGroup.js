import React from 'react';
import { string, node } from 'prop-types';
import {
  FormControl,
  FormLabel,
} from 'material-ui/Form';
import styles from './styles.scss';

const LabeledInputGroup = ({ label, children }) => (
  <FormControl component="fieldset">
    <div className={styles.fieldsetGroup}>
      <div className={styles.label}>
        <FormLabel>{label}</FormLabel>
      </div>
      <div className={styles.input}>{children}</div>
    </div>
  </FormControl>
);

LabeledInputGroup.propTypes = {
  label: string,
  children: node
};

export default LabeledInputGroup;
