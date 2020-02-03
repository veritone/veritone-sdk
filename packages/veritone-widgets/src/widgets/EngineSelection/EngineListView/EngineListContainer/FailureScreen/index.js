import React from 'react';
import { string, number, shape, objectOf, oneOfType, func } from 'prop-types';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

const FailureScreen = ({
  message = 'Oops! Something went wrong.',
  classes,
  onRetry
}) => {
  const muiClasses = useStyles();
  const classesProps = classes ? classes : {
    errorOutlineIcon: {
      root: muiClasses.errorIcon
    },
    message: {
      root: muiClasses.message
    },
    button: {
      root: muiClasses.button
    }
  };

  return (
    <div className={muiClasses.container}>
      <ErrorOutlineIcon classes={classesProps.errorOutlineIcon} />
      <Typography variant="h5" classes={classesProps.message}>
        {message}
      </Typography>
      <Button variant="contained" classes={classesProps.button} onClick={onRetry}>
        <RefreshIcon htmlColor={blue[500]} className={muiClasses.icon} />
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
