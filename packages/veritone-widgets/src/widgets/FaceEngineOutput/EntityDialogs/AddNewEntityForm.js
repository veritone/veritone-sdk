import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { get } from 'lodash';
import { arrayOf, bool, shape, string } from 'prop-types';
import { formComponents } from 'veritone-react-common';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import styles from './styles.scss';

export const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name is Required';
  }
  if (!values.libraryId) {
    errors.libraryId = 'Library is Required';
  }
  return errors;
};

const AddNewEntityForm = reduxForm({
  form: 'addNewEntityForm',
  initialValues: {},
  validate
})(
  ({
    handleSubmit,
    onCancel,
    children,
    submitting,
    invalid,
    libraries,
    isFetchingLibraries,
    disableSubmit,
    showCreateLibraryButton,
    onCreateNewLibrary
  }) => (
    <form onSubmit={handleSubmit} data-veritone-component="add-new-entity-form">
      <Grid container direction="column" spacing={32}>
        <Grid
          item
          container
          direction="column"
          justify="space-between"
          spacing={32}
        >
          <Grid item xs={12}>
            <FormControl fullWidth data-veritone-element="entity-name">
              <Field
                name="name"
                label="Name *"
                component={formComponents.TextField}
                data-veritone-element="entity-name-input"
                InputProps={{
                  classes: {
                    root: styles.inputField
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  classes: {
                    shrink: styles.entityInputLabel
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth data-veritone-element="library-id">
              <InputLabel shrink classes={{ shrink: styles.entityInputLabel }}>
                Choose Library *
              </InputLabel>
              <Field
                component={formComponents.Select}
                name="libraryId"
                className={styles.librarySelect}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  },
                  getContentAnchorEl: null
                }}
                data-veritone-element="library-id-select"
              >
                {isFetchingLibraries && (
                  <MenuItem
                    value=""
                    classes={{
                      root: styles.librarySelectMenuItem
                    }}
                  >
                    Loading...
                  </MenuItem>
                )}
                {!isFetchingLibraries &&
                  !!get(libraries, 'length') &&
                  libraries.map(library => (
                    <MenuItem
                      key={library.id}
                      value={library.id}
                      classes={{
                        root: styles.librarySelectMenuItem
                      }}
                    >
                      {library.name}
                    </MenuItem>
                  ))}
                {!isFetchingLibraries &&
                  !get(libraries, 'length') && (
                    <MenuItem
                      value=""
                      classes={{
                        root: styles.librarySelectMenuItem
                      }}
                    >
                      Libraries not found
                    </MenuItem>
                  )}
              </Field>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="row"
          className={styles.addEntityActions}
        >
          {showCreateLibraryButton && (
            <Grid item xs>
              <Button
                color="primary"
                onClick={onCreateNewLibrary}
                data-veritone-element="create-new-library-button"
                classes={{ root: styles.entityDialogButton }}
              >
                Create New Library
              </Button>
            </Grid>
          )}
          <Grid item xs={6} container direction="row" justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                onClick={onCancel}
                data-veritone-element="cancel-button"
                classes={{ root: styles.entityDialogButton }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                color="primary"
                disabled={submitting || invalid || disableSubmit}
                data-veritone-element="create-button"
                classes={{ root: styles.entityDialogButton }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
);

AddNewEntityForm.propTypes = {
  isFetchingLibraries: bool,
  libraries: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired
    })
  ).isRequired,
  initialValues: shape({
    name: string,
    libraryId: string
  }),
  showCreateLibraryButton: bool
};

export default AddNewEntityForm;
