import React from 'react';
import { string, func } from 'prop-types';
import format from 'date-fns/format';
import { RaisedTextField } from 'veritone-react-common';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const PasswordField = ({ lastUpdated, onEdit }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <RaisedTextField
        label="Password"
        value={`Last updated ${format(lastUpdated, 'MMMM dd, yyyy')}`}
        action="RESET"
        onClickAction={onEdit}
        className={classes.field}
      />
    </div>
  )
};

PasswordField.propTypes = {
  lastUpdated: string,
  onEdit: func.isRequired
};

export default PasswordField;
