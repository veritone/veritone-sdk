import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { FormBuilder } from 'veritone-react-common';
import FormPublishModal from './FormPublishModal';

import styles from './styles.scss';

function mapSelectedLocation(locations) {
  return locations.reduce((selectedLocations, { id }) => ({
    ...selectedLocations,
    [id]: true
  }), {});
}

export default function FormBuilderPage({
  id,
  fetchForm,
  form,
  loading,
  onChange,
  open,
  onClose
}) {
  const [showDialogName, setShowDialogName] = React.useState(false);
  const [formName, setFormName] = React.useState(form.name);
  const [tempFormName, setTempFormName] = React.useState(form.name);
  const [selectedLocations, setSelectedLocations] = React.useState(mapSelectedLocation(form.locations));
  const [showPublishForm, setShowPublishForm] = React.useState(false);

  const togglePublishForm = React.useCallback(() => {
    setShowPublishForm(x => !x);
  }, [])

  const updateTempFormName = React.useCallback((e) => {
    setTempFormName(e.target.value);
  }, [setTempFormName])

  const updateFormName = React.useCallback(() => {
    setFormName(tempFormName);
    setShowDialogName(false);
  }, [setFormName, tempFormName]);

  const toggleFormDialogName = React.useCallback(() => {
    setShowDialogName(!showDialogName);
    setTempFormName(formName);
  }, [showDialogName, showDialogName, formName]);

  React.useEffect(() => {
    setFormName(form.name);
    setTempFormName(form.name);
    setSelectedLocations(mapSelectedLocation(form.locations));
  }, form);

  React.useEffect(() => {
    if (id) {
      fetchForm(id);
    }
  }, [id]);

  return (
    <React.Fragment>
      <Dialog
        disableEnforceFocus
        open={open}
        fullScreen
        className={styles.dialog}
        classes={{
          paper: styles.dialogScrollPaper
        }}
        scroll="paper"
      >
        {
          loading ? (
            <CircularProgress className={styles.formLoading} />
          ) : (
              <React.Fragment>
                <DialogTitle className={styles.dialogTitle} disableTypography>
                  <Box component="div" display="flex" alignItems="center">
                    <Typography>{formName}</Typography>
                    <Edit
                      className={styles.titleItem}
                      onClick={toggleFormDialogName}
                    />
                  </Box>
                  <Box component="div" display="flex" alignItems="center">
                    <Button
                      color="primary"
                      variant="contained"
                      className={styles.titleItem}
                    >
                      Save
                  </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      className={styles.titleItem}
                      disabled={Boolean(form.dataRegistryId)}
                      onClick={togglePublishForm}
                    >
                      Publish
                  </Button>
                    <Divider
                      orientation="vertical"
                      className={styles.titleItem}
                    />
                    <Close
                      className={styles.titleItem}
                      onClick={onClose}
                    />
                  </Box>
                </DialogTitle>
                <div className={styles.dialogContent}>
                  <FormBuilder
                    form={form.definition}
                    onChange={onChange}
                    classes={{
                      previewContainer: styles.previewContainer,
                      previewContent: styles.previewContent
                    }}
                  />
                </div>
              </React.Fragment>
            )
        }
      </Dialog>
      <Dialog open={showDialogName} onClose={toggleFormDialogName}>
        <DialogTitle>
          Enter Form Name
        </DialogTitle>
        <TextField
          value={tempFormName}
          label="Form Title"
          variant="outlined"
          onChange={updateTempFormName}
          className={styles.formName}
        />
        <DialogActions>
          <Button onClick={updateFormName} variant="contained" color="primary">
            Save Title
          </Button>
        </DialogActions>
      </Dialog>
      {
        showPublishForm && (
          <FormPublishModal
            onClose={togglePublishForm}
          />
        )
      }
    </React.Fragment>
  )
}


FormBuilderPage.defaultProps = {
  form: {
    name: "New form",
    definition: [],
    locations: [],
    dataRegistryId: ''
  }
}
