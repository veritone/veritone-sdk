import React from 'react';
import { string, func } from 'prop-types';
import { RaisedTextField } from 'veritone-react-common';

import classes from './styles.scss';
import styles from '../PasswordField/styles.scss';

const Index = ({ name, email, onEditName, onEditEmail }) => {
  return (
    <div className={classes.container}>
      <RaisedTextField
        label="Name"
        value={name}
        action="edit"
        onClickAction={onEditName}
        className={styles.field}
      />

      <RaisedTextField
        label="Email"
        value={email}
        action="edit"
        onClickAction={onEditEmail}
        className={styles.field}
        disabled
      />
    </div>
  );
};

Index.propTypes = {
  name: string.isRequired,
  email: string.isRequired,
  onEditName: func.isRequired,
  onEditEmail: func.isRequired
};

export default Index;
