import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { string, bool, shape, func, object, oneOf, arrayOf, number } from 'prop-types';

const TranscriptSearchModal = ( { open, filters, applyFilter, closeFilter } ) => (
  <Dialog open={ open }>
    <DialogTitle>Search Transcript</DialogTitle>
    <DialogContent style={ { width: '500px' } }>
      Search bar goes here
    </DialogContent>
    <DialogActions>
      <Button onClick={closeFilter} color="primary">
        Cancel
      </Button>
      <Button onClick={applyFilter} color="primary">
        Search
      </Button>
    </DialogActions>
  </Dialog>
)

const filterShape = {
  // name of the field to apply the search filter against:
  // GIVEN an engine category data { transcript: { transcript: "The Lakers used to have Kobe and Shaq" }, language: 'english' } }
  // and the search query ( Transcript.language = "English"  AND Transcript.transcript CONTAINS "Kobe" ), the first filter's field_name would be "language"
  field_name: string.isRequired,
  // given the above example, the filter_value for the first filter would be "English"
  filter_value: string, bool, number,
  // operators that should apply to the filter: GIVEN ( 3 + 4 ), ( would be a prefix operator
  prefix_operator: string,
  // operator used to join the next filter: GIVEN ( 3 + 4 ), + would be the joining operator
  joining_operator: string,
  // operator used to end the filter: GIVEN ( 3 + 4 ), ) would be the suffix operator
  suffix_operator: string,
};

TranscriptSearchModal.prototype = {
  open: bool,
  filter: oneOf( arrayOf(shape(filterShape)), shape(filterShape) ),
  onSave: func,
  onClose: func,
}

export default TranscriptSearchModal;