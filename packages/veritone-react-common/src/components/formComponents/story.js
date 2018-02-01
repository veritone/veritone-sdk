import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer, reduxForm, Field } from 'redux-form';
import { storiesOf } from '@storybook/react';
import { InputLabel, InputAdornment } from 'material-ui/es/Input';
import {
  FormHelperText,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup
} from 'material-ui/es/Form';
import Radio from 'material-ui/es/Radio';
import { MenuItem } from 'material-ui/es/Menu';
import Visibility from 'material-ui-icons/Visibility';
import InfoIcon from 'material-ui-icons/Info';
import IconButton from 'material-ui/es/IconButton';
import Tooltip from 'material-ui/es/Tooltip';

import { defaultIntervals } from 'helpers/date';
import TextField from './TextField';
import Input from './Input';
import Select from './Select';
import Checkbox from './Checkbox';
import RadioGroup from './RadioGroup';
import DateIntervalSelect from './DateIntervalSelect';
import DateRangePicker from './DateRangePicker';

const store = createStore(
  combineReducers({
    form: formReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const StoryForm = reduxForm({
  form: 'story',
  initialValues: {}
})(({ handleSubmit, children, submitting, pristine }) => (
  <form onSubmit={handleSubmit}>
    {children}
    <br />
    <button type="submit" disabled={pristine || submitting}>
      Submit
    </button>
  </form>
));

/* eslint-disable react/jsx-no-bind */

storiesOf('Form Components', module)
  .add('TextField', () => (
    <Provider store={store}>
      <StoryForm onSubmit={values => alert(JSON.stringify(values))}>
        <div>
          <Field
            name="text-field"
            label="Plain TextField"
            placeholder="add your text here"
            component={TextField}
          />
          <FormHelperText>
            {"here's some help text "}
            {// fixme: this results in "<div> descendant of <p>" error
            false && (
              <Tooltip title="this is a tooltip">
                <InfoIcon
                  style={{ width: 12, height: 12, verticalAlign: 'bottom' }}
                />
              </Tooltip>
            )}
          </FormHelperText>
        </div>

        <FormControl>
          <InputLabel htmlFor="adorned-input">Adorned TextField</InputLabel>
          <Field
            component={Input}
            name="input-adorned"
            id="adorned-input"
            placeholder="add your text here"
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <Visibility />
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>{'Adorned input'}</FormHelperText>
        </FormControl>

        <div>
          <Field
            error
            name="text-field-error"
            label="Error state"
            component={TextField}
          />
          <FormHelperText error>error: value must be different</FormHelperText>
        </div>

        <div>
          <Field
            disabled
            name="text-field-disabled"
            label="disabled state"
            component={TextField}
          />
          <FormHelperText disabled>this field is disabled</FormHelperText>
        </div>

        <div>
          <Field
            type="number"
            name="text-field-number"
            label="Numeric input"
            component={TextField}
          />
        </div>
      </StoryForm>
    </Provider>
  ))
  .add('Select', () => (
    <Provider store={store}>
      <StoryForm
        onSubmit={values => alert(JSON.stringify(values))}
        initialValues={{ 'age-field-error': '10' }}
      >
        <FormControl>
          <InputLabel>Age</InputLabel>
          <Field component={Select} name="age-field" style={{ width: 250 }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Field>
          <FormHelperText>This is a basic input</FormHelperText>
        </FormControl>
        <br />

        {/* fixme-- figure out how to get the Field into an error state without using FormControl props.error */}

        <FormControl error>
          <InputLabel>Age</InputLabel>
          <Field
            component={Select}
            name="age-field-error"
            style={{ width: 250 }}
            renderValue={value => `⚠️  - ${value}`}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Field>
          <FormHelperText>This is an error input</FormHelperText>
        </FormControl>
        <br />
        <FormControl>
          <InputLabel>Age</InputLabel>
          <Field
            component={Select}
            name="age-field-disabled"
            style={{ width: 250 }}
            disabled
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Field>
          <FormHelperText disabled>This is a disabled input</FormHelperText>
        </FormControl>
      </StoryForm>
    </Provider>
  ))
  .add('Checkbox', () => {
    return (
      <Provider store={store}>
        <StoryForm onSubmit={values => alert(JSON.stringify(values))}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Options:</FormLabel>
            <FormGroup>
              <Field component={Checkbox} label="Option A" name="option-A" />
              <Field component={Checkbox} label="Option B" name="option-B" />
              <Field component={Checkbox} label="Option C" name="option-C" />
            </FormGroup>
          </FormControl>

          <br />
          <br />

          <FormControl component="fieldset">
            <FormLabel component="legend" error>
              Error group:
            </FormLabel>
            <FormGroup>
              <Field component={Checkbox} label="Option A" name="option-A" />
              <Field component={Checkbox} label="Option B" name="option-B" />
              <Field component={Checkbox} label="Option C" name="option-C" />
            </FormGroup>
            <FormHelperText error>
              selected options fail validation
            </FormHelperText>
          </FormControl>

          <br />
          <br />

          <FormControl component="fieldset">
            <FormLabel component="legend" disabled>
              Disabled group:
            </FormLabel>
            <FormGroup>
              <Field
                component={Checkbox}
                label="Option A"
                name="option-A"
                disabled
              />
              <Field
                component={Checkbox}
                label="Option B"
                name="option-B"
                disabled
              />
              <Field
                component={Checkbox}
                label="Option C"
                name="option-C"
                disabled
              />
            </FormGroup>
            <FormHelperText disabled>this form is disabled</FormHelperText>
          </FormControl>
        </StoryForm>
      </Provider>
    );
  })
  .add('RadioGroup', () => (
    <Provider store={store}>
      <StoryForm onSubmit={values => alert(JSON.stringify(values))}>
        <Field component={RadioGroup} name="animal">
          <FormLabel component="legend">Favorite Pet</FormLabel>
          <FormControlLabel value="dog" control={<Radio />} label="Dog" />
          <FormControlLabel value="cat" control={<Radio />} label="Cat" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
          <FormControlLabel
            value="disabled"
            disabled
            control={<Radio />}
            label="Disabled"
          />
        </Field>

        <br />
        <br />

        <FormGroup>
          <FormLabel component="legend" error>
            Favorite Pet (error)
          </FormLabel>
          <Field component={RadioGroup} name="animal">
            <FormControlLabel value="dog" control={<Radio />} label="Dog" />
            <FormControlLabel value="cat" control={<Radio />} label="Cat" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel
              value="disabled"
              label="Disabled"
              disabled
              control={<Radio />}
            />
          </Field>
          <FormHelperText error>This form has an error</FormHelperText>
        </FormGroup>

        <br />
        <br />

        <FormGroup>
          <FormLabel component="legend" disabled>
            Favorite Pet (disabled)
          </FormLabel>
          <Field component={RadioGroup} name="animal">
            <FormControlLabel
              value="dog"
              control={<Radio />}
              label="Dog"
              disabled
            />
            <FormControlLabel
              value="cat"
              control={<Radio />}
              label="Cat"
              disabled
            />
            <FormControlLabel
              value="other"
              control={<Radio />}
              label="Other"
              disabled
            />
            <FormControlLabel
              value="disabled"
              disabled
              control={<Radio />}
              label="Disabled"
            />
          </Field>
          <FormHelperText disabled>This form is disabled</FormHelperText>
        </FormGroup>
      </StoryForm>
    </Provider>
  ))
  .add('DateIntervalSelect', () => (
    <Provider store={store}>
      <StoryForm
        onSubmit={values => alert(JSON.stringify(values))}
        initialValues={{ 'date-interval': defaultIntervals.day }}
      >
        <Field
          component={DateIntervalSelect}
          name="date-interval"
          onChange={(a, inter) => console.log(inter.toString())}
        />
      </StoryForm>
    </Provider>
  ))
  .add('DateRangePicker', () => (
    <Provider store={store}>
      <StoryForm onSubmit={values => alert(JSON.stringify(values))}>
        <Field component={DateRangePicker} name="date" />
      </StoryForm>
    </Provider>
  ));
