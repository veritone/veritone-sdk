import React from 'react';
import { withTheme } from 'material-ui/styles';
import Typography  from 'material-ui/Typography';

export default withTheme()(( {value, theme, marginLeft, marginRight} ) => (
  <Typography
    variant={ 'headline' }
    style={{
      paddingTop: theme.spacing.unit * 3,
      marginLeft: marginLeft ? '0.5em' : null,
      marginRight: marginRight ? "0.5em" : null
    }}
  >
    { value }
  </Typography>
))
