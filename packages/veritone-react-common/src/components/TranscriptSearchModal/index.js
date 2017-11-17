import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import { bool, func, object } from 'prop-types';

const TranscriptSearchModal = ({ open, state, applyFilter, closeFilter }) => {
  let filterValue;
  return (
    <Dialog
      open={open}
      onRequestClose={closeFilter}
      onEscapeKeyUp={closeFilter}
    >
      <DialogTitle>Search By Keyword</DialogTitle>
      <DialogContent style={{ width: '500px', margin: 'none' }}>
        <TextField
          id="full-width"
          InputLabelProps={{
            shrink: true
          }}
          margin="none"
          defaultValue={state.value}
          onChange={value => (filterValue = value.target.value)}
          placeholder="Keyword(s)"
          helperText="Searches within our database of media transcripts."
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeFilter} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() =>
            applyFilter({
              operator: 'query_string',
              field: 'transcript.transcript',
              value: filterValue
            })}
          color="primary"
          raised={true}
        >
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TranscriptSearchModal.prototype = {
  open: bool,
  state: object.isRequired,
  applyFilter: func.isRequired,
  closeFilter: func.isRequired
};

export default TranscriptSearchModal;
