import React from 'react';
import { string, func } from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const ReplaceDialog = ({ onClose, searchProfileName, onReplace }) => (
  <Card style={{ maxWidth: "35em" }}>
    <CardHeader
      action={
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
      title="Replace Search Profile"
    />
    <CardContent>
      <Typography variant="subheading">
        <b>"{searchProfileName}"</b> search profile already exists. Replacing it
        will overwrite its content. Would you like to replace it?
      </Typography>
    </CardContent>
    <CardActions style={{ float: 'right' }}>
      <Button color="primary" onClick={onClose}>
        Cancel
      </Button>
      <Button color="primary" onClick={onReplace}>
        Save
      </Button>
    </CardActions>
  </Card>
);

ReplaceDialog.propTypes = {
  onClose: func,
  onReplace: func,
  searchProfileName: string
};

export default ReplaceDialog;
