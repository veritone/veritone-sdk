import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { func } from 'prop-types';

class SavedSearch extends React.Component {
  static propTypes = {
    onClose: func
  }

  render() {
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={ this.props.onClose }>
              <CloseIcon />
            </IconButton>
          }
          title="Save Search Profile"
          subheader="Create a saved search profile to efficiently run searches you frequently perform."
        />
        <CardContent />
        <CardActions>
          Test
        </CardActions>
      </Card>
    );
  }
}

export default SavedSearch;
