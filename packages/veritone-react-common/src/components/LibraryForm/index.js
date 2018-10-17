import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { func, string, shape, arrayOf } from 'prop-types';
import { get } from 'lodash';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText';
import TextField from '../formComponents/TextField';
import Select from '../formComponents/Select';
import ImageSelect from './ImageSelect';
import styles from './styles.scss';

const validate = values => {
  const errors = {};
  if (!values.libraryName) {
    errors.libraryName = 'Required';
  }
  if (!values.libraryType) {
    errors.libraryType = 'Required';
  }
  if (values.description && values.description.length > 240) {
    errors.description = 'Must be 240 characters or less';
  }
  return errors;
};

const formName = 'creatLibrary';
const LibraryForm = reduxForm({
  form: formName,
  initialValues: {},
  validate
})(
  ({
    handleSubmit,
    onCancel,
    children,
    submitting,
    invalid,
    libraryNameLabel,
    libraryTypesLabel,
    descriptionLabel,
    libraryTypes,
    description
  }) => {
    return (
      <form onSubmit={handleSubmit} data-veritone-component="library-form">
        <Grid container direction="column" spacing={32}>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={32}>
              <Grid item xs={12} sm={6}>
                <Grid container direction="column" spacing={16}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Field
                        name="libraryName"
                        label={libraryNameLabel || 'Library Name'}
                        component={TextField}
                        data-veritone-element="library-name-input"
                        InputLabelProps={{
                          shrink: true
                        }}
                        InputProps={{
                          autoFocus: true
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel shrink>
                        {libraryTypesLabel || 'What will this Library contain?'}
                      </InputLabel>
                      <Field
                        component={Select}
                        name="libraryType"
                        data-veritone-element="library-type-select"
                      >
                        {libraryTypes.map(libraryType => (
                          <MenuItem value={libraryType.id} key={libraryType.id}>
                            {libraryType.name}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Field
                        name="description"
                        label={descriptionLabel || 'Description (optional)'}
                        component={TextField}
                        data-veritone-element="library-description-input"
                        multiline
                        rows={4}
                        rowsmax={4}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <FormHelperText
                        classes={{ root: styles.descriptionCharCount }}
                      >{`${get(
                        description,
                        'length',
                        0
                      )} / 240`}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={styles.addCoverImageText}>
                  Add a cover image{' '}
                  <span className={styles.optionalText}>(optional)</span>
                </div>
                <Field
                  name="coverImage"
                  component={ImageSelect}
                  data-veritone-element="library-cover-image-input"
                  ButtonProps={{
                    color: 'primary',
                    variant: 'contained'
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} s={6}>
            <Grid container direction="row" justify="flex-end" spacing={16}>
              <Grid item>
                <Button
                  onClick={onCancel}
                  data-veritone-element="cancel-button"
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={submitting || invalid}
                  data-veritone-element="create-button"
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
);

LibraryForm.propTypes = {
  handleCancel: func,
  initialValues: shape({
    libraryName: string,
    libraryType: string,
    description: string
  }),
  onSubmit: func,
  libraryNameLabel: string,
  libraryTypesLabel: string,
  descriptionLabel: string,
  libraryTypes: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired
    })
  ).isRequired,
  description: string
};

const selector = formValueSelector(formName);
export default connect(state => ({
  description: selector(state, 'description')
}))(LibraryForm);
