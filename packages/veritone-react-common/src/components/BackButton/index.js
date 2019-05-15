import React from 'react';
import { string, func, shape } from 'prop-types';
import Button from '@material-ui/core/Button';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  button: {
    borderRadius: '1px',
    paddingRight: 16,
    paddingTop: 6,
    paddingBottom: 6,
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: 500,
    flexBasis: 120
  },
  icon: {
    marginRight: 8,
  }
}

const BackButton = ({ classes, onClick }) => (
  <Button onClick={onClick} className={classes.button}>
    <ArrowBack className={classes.icon} />
      Back
    </Button>
)

BackButton.propTypes = {
  classes: shape({
    button: string,
    icon: string,
  }),
  onClick: func.isRequired
}

export default withStyles(styles)(BackButton);
