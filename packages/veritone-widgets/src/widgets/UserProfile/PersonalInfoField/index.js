import React from 'react';
import { string, func } from 'prop-types';
import { RaisedTextField } from 'veritone-react-common';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const Index = ({ name, email, onEditName, onEditEmail }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <RaisedTextField
        label="Name"
        value={name}
        action="edit"
        onClickAction={onEditName}
        className={classes.field}
      />

      <RaisedTextField
        label="Email"
        value={email}
        action="edit"
        onClickAction={onEditEmail}
        actionTooltipLabel="This address is used to identify your Veritone account and cannot be changed."
        className={classes.field}
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
