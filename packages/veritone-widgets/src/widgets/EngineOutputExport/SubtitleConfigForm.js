import React from 'react';
import { Field, reduxForm } from "redux-form";
import { formComponents } from "veritone-react-common";

import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import styles from "./styles.scss";


const SubtitleConfigForm = reduxForm({
  form: 'subtitleConfig',
  initialValues: {}
})(({ handleSubmit, handleCancel, children, submitting, invalid }) => (
  <form onSubmit={handleSubmit}>
    <div className={styles.subtitleConfigField}>
      <FormControl>
        <Field
          type="number"
          name="maxLinesPerCaptionLine"
          label="Max Characters per Caption Line"
          style={{ width: 195 }}
          component={formComponents.TextField}
          normalize={parseInt}
          InputLabelProps={{
            classes: {
              root: styles.subtitleFieldLabel,
              shrink: styles.subtitleFieldLabelShrink
            }
          }}
        />
      </FormControl>
    </div>
    <div className={styles.subtitleConfigField}>
      <FormControl>
        <InputLabel
          classes={{
            root: styles.subtitleFieldLabel,
            shrink: styles.subtitleFieldLabelShrink
          }}
        >
          Number of Lines per Screen
        </InputLabel>
        <Field
          component={formComponents.Select}
          name="linesPerScreen"
          style={{ width: 195 }}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </Field>
      </FormControl>
    </div>
    <div className={styles.subtitleConfigField}>
      <Field
        component={formComponents.Switch}
        color="primary"
        name="newLineOnPunctuation"
        label="New Caption Line on Punctuation"
      />
    </div>
    <br />
    <DialogActions>
      <Button onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" color="primary" disabled={submitting || invalid}>
        Save
      </Button>
    </DialogActions>
  </form>
));

export default SubtitleConfigForm;
