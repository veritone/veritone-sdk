import React from 'react';
import { string, func, shape } from 'prop-types';
import Button from '@material-ui/core/Button';
import AddBox from '@material-ui/icons/AddBox';
import { withStyles } from '@material-ui/core/styles';
import { defaultVSDKTheme } from '../../helpers/withVeritoneSDKThemeProvider';

const styles = {
  button: {
    border: `1px solid ${defaultVSDKTheme.palette.primary.main}`,
    borderRadius: '1px',
    paddingRight: 16
  },
  icon: {
    marginRight: 8
  }
}

const UploadButton = ({ classes, onClick }) => (
  <Button onClick={onClick} className={classes.button} variant="outlined" color="primary">
    <AddBox className={classes.icon} />
      Upload
    </Button>
)

UploadButton.propTypes = {
  classes: shape({
    button: string,
    icon: string,
  }),
  onClick: func.isRequired
}

export default withStyles(styles)(UploadButton);
