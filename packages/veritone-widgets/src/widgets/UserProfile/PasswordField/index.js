import React from 'react';
import { string, func } from 'prop-types';
import format from 'date-fns/format';
import { RaisedTextField } from 'veritone-react-common';

import styles from './styles.scss';

const PasswordField = ({ lastUpdated, onEdit }) => (
  <div className={styles.container}>
    <RaisedTextField
      label="Password"
      value={`Last updated ${format(lastUpdated, 'MMMM dd, yyyy')}`}
      action="RESET"
      onClickAction={onEdit}
      className={styles.field}
    />
  </div>
);

PasswordField.propTypes = {
  lastUpdated: string,
  onEdit: func.isRequired
};

export default PasswordField;
