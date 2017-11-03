import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

import {
  string,
  bool,
  shape,
  func,
  object,
  oneOf,
  arrayOf,
  number
} from 'prop-types';

const TranscriptSearchModal = ({ open, filters, applyFilter, closeFilter }) => {
  let filterValue;
  return (
    <Dialog open={open} onRequestClose={ closeFilter } onEscapeKeyUp={ closeFilter }>
      <DialogTitle>Search By Keyword</DialogTitle>
      <DialogContent style={{ width: '500px', margin: 'none' }}>
        <TextField
          id="full-width"
          InputLabelProps={{
            shrink: true
          }}
          margin="none"
          defaultValue={ filters && filters.filter_value }
          onChange={ (value) => filterValue = value.target.value }
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
        <Button onClick={ () => applyFilter( {field_name: "transcript.transcript", filter_value: filterValue, operator: "query_string", engineId: "guid-1" }) } color="primary" raised={true}>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const filterShape = {
  // name of the field to apply the search filter against:
  // GIVEN an engine category data { transcript: { transcript: "The Lakers used to have Kobe and Shaq" }, language: 'english' } }
  // and the search query ( Transcript.language = "English"  AND Transcript.transcript CONTAINS "Kobe" ), the first filter's field_name would be "language"
  field_name: string.isRequired,
  // given the above example, the filter_value for the first filter would be "English"
  filter_value: oneOf(string, bool, number),
  // contains, >, <, =, >=, <=
  operator: string,
  boolean_operator: bool,
  // operators that should apply before the filter: GIVEN ( 3 + 4 ), ( would be a prefix operator
  prefix_operator: string,
  // operator used to join the next filter: GIVEN ( 3 + 4 ), + would be the joining operator
  joining_operator: string,
  // operator used to end the filter: GIVEN ( 3 + 4 ), ) would be the suffix operator
  suffix_operator: string,
  // state (arbitrary object used to rehydrate the modal's state)
  state: object
};

TranscriptSearchModal.prototype = {
  open: bool,
  filters: oneOf(arrayOf(shape(filterShape)), shape(filterShape)),
  applyFilter: func.isRequired,
  closeFilter: func.isRequired
};

export default TranscriptSearchModal;
