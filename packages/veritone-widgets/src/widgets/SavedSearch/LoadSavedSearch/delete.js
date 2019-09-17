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

const DeleteDialog = ({ onClose, searchProfileName, onDelete }) => (
  <Card style={{ maxWidth: "35em" }}>
    <CardHeader
      action={
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
      title="Delete Search Profile"
    />
    <CardContent>
      <Typography variant="subheading">
        Are you sure you want to permanently delete <b>"{searchProfileName}"</b> search profile?
      </Typography>
    </CardContent>
    <CardActions style={{ float: 'right' }}>
      <Button color="primary" onClick={onClose}>
        Cancel
      </Button>
      <Button color="primary" onClick={onDelete} data-veritone-element="delete_save_search">
        Delete
      </Button>
    </CardActions>
  </Card>
);

DeleteDialog.propTypes = {
  onClose: func,
  onDelete: func,
  searchProfileName: string
};

export default DeleteDialog;
