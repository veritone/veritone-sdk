import React from "react";
import { shape, func, arrayOf, string } from 'prop-types';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Form from './Form';
import { generateState } from "./utils";


export default function PreviewDialog({ form, handleClose }) {
  const [formState, setFormState] = React.useState(
    generateState(form)
  );

  return (
    <div>
      <Dialog
        open
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Form builder Preview</DialogTitle>
        <DialogContent dividers>
          <Form
            formDefinition={form}
            value={formState}
            onChange={setFormState}
          />
        </DialogContent>
        <DialogActions className="dialog-footer">
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

PreviewDialog.propTypes = {
  form: arrayOf(shape({
    name: string
  })),
  handleClose: func
}
