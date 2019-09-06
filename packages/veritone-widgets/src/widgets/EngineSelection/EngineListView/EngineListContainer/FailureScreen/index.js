import React from 'react';
import { string, number, shape, objectOf, oneOfType, func } from 'prop-types';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

import styles from './styles.scss';

const FailureScreen = ({
  message = 'Oops! Something went wrong.',
  classes = {
    errorOutlineIcon: {
      root: styles.errorIcon
    },
    message: {
      root: styles.message
    },
    button: {
      root: styles.button
    }
  },
  onRetry
}) => {
  return (
    <div className={styles.container}>
      <ErrorOutlineIcon classes={classes.errorOutlineIcon} />
      <Typography variant="h5" classes={classes.message}>
        {message}
      </Typography>
      <Button variant="contained" classes={classes.button} onClick={onRetry}>
        <RefreshIcon htmlColor={blue[500]} style={{ marginRight: '10px' }} />
        Retry
      </Button>
    </div>
  );
};

FailureScreen.propTypes = {
  message: string,
  classes: shape({
    errorIcon: objectOf(oneOfType([string, number])),
    message: objectOf(oneOfType([string, number])),
    button: objectOf(oneOfType([string, number]))
  }),
  onRetry: func.isRequired
};

export default FailureScreen;
