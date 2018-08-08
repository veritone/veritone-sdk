import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { func, number, string, bool, objectOf, arrayOf, any } from 'prop-types';
import { reduxForm, Form } from 'redux-form';
import blue from '@material-ui/core//colors/blue';
import {
  noop,
  get,
} from 'lodash';
import { withProps } from 'recompose';

import styles from './styles.scss';

@withProps(props => {
  return {
    initialValues: {
      // This provides defaults to the form. Shallow merged with
      // props.initialValues to allow overriding.
      ...props.initialValues
    }
  };
})
@reduxForm({
  form: 'programInfo'
})
class ProgramInfo extends React.Component {
  static propTypes = {
    sourceData: objectOf(any).isRequired,
    canShare: bool,
    organizations: arrayOf(any),
    canEditAffiliateSources: bool,
    canBulkAddAffiliates: bool,
    selectedAffiliateSources: arrayOf(any),
    affiliateSources: arrayOf(any),
    onProgramImageSave: func.isRequired,
    onProgramLiveImageSave: func.isRequired,
    onSubmit: func.isRequired, // user-provided callback for result values
    handleSubmit: func.isRequired, // provided by redux-form
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string
  };

  static defaultProps = {
    onSubmit: noop,
    relativeSize: 14,
    color: '#2196F3'
  };

  prepareResultData(formResult) {
    const someData = get(formResult, 'someData');
    // TODO: pass up
    // - program data: name

    return {
      data: someData
    };
  }

  handleSubmit = value => {
    this.props.onSubmit(this.prepareResultData(value));
  };

  getTheme = ({ color, relativeSize }) => {
    const theme = createMuiTheme({
      typography: {
        htmlFontSize: relativeSize || 13,
        subheading: {
          fontSize: '1em'
        }
      },
      palette: {
        primary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        },
        secondary: {
          light: blue[300],
          main: blue[500],
          dark: blue[700]
        }
      }
    });
    return theme;
  };

  render() {
    const {
      canShare,
      canEditAffiliateSources,
      canBulkAddAffiliates,
      selectedAffiliateSources
    } = this.props;

    return (
      <MuiThemeProvider
        theme={this.getTheme({
          color: this.props.color,
          relativeSize: this.props.relativeSize
        })}
      >
        <div className={styles.programInfoSection}>
          <div className={styles.programInfoHeader}>Program Information</div>
          <div className={styles.programInfoDescription}>
            Programs represent the schedule and all content ingested during each time slot set in this job.
          </div>
        </div>
        <div className={styles.programInfoSection}>
          <TextField
            label='Program Name'
            className={styles.programInfoInputField}
            margin='normal'
          />
        </div>
        <div className={styles.programInfoSection}>
          <div className={styles.programInfoLiveImageSection}>
            <div className={styles.programInfoFieldHeader}>Program Live Image</div>
            <div className={styles.programInfoFieldDescription}>
              Recommended image size: 500x350 .jpg or .png
            </div>
          </div>
          <div className={styles.programInfoImageSection}>
            <div className={styles.programInfoFieldHeader}>Program Image</div>
            <div className={styles.programInfoFieldDescription}>
              Recommended image size: 250x250 .jpg or .png
            </div>
          </div>
        </div>

        <div className={styles.programInfoSection}>
          <TextField
            label='Description'
            className={styles.programInfoInputField}
            margin='normal'
          />
        </div>
        <div className={styles.programInfoSection}>
          <TextField
            label='Program Website (Optional)'
            placeholder='http://'
            className={styles.programInfoInputField}
            margin='normal'
          />
        </div>

        <div className={styles.programInfoSection}>
          <FormControl className={styles.programInfoSelectControl}>
            <InputLabel shrink htmlFor='program-format-select-input'>
              Program Format
            </InputLabel>
            <Select
              value={this.state.programFormat}
              onChange={this.handleProgramFormatChange}
              input={<Input name='programFormat' id='program-format-select-input'/>}
              displayEmpty
              name='programFormat'
              className={styles.programInfoSelect}
            >
              <MenuItem value=''>
                <em>Program Format</em>
              </MenuItem>
              <MenuItem value={1}>First</MenuItem>
              <MenuItem value={2}>Second</MenuItem>
            </Select>
          </FormControl>
        </div>



        <div className={styles.programInfoSection}>
          <FormControl className={styles.programInfoSelectControl}>
            <InputLabel shrink htmlFor='program-language-select-input'>
              Language
            </InputLabel>
            <Select
              value={this.state.programLanguage}
              onChange={this.handleProgramLanguageChange}
              input={<Input name='programLanguage' id='program-language-select-input'/>}
              displayEmpty
              name='programLanguage'
              className={styles.programInfoSelect}
            >
              <MenuItem value={1}>English</MenuItem>
              <MenuItem value={2}>Second</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={styles.programInfoSection}>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.isNational}
                onChange={this.handleIsNationalChange}
                value={this.state.isNational}
                color='primary'
              />
            }
            label='Is National'
          />
        </div>

        {canShare &&
          <div className={styles.programInfoDivider}/>}

        {(canEditAffiliateSources || get(selectedAffiliateSources, 'length') > 0 ) &&
          <div className={styles.programInfoDivider}/>}

        {canBulkAddAffiliates && <div>Bulk Add Affiliates Button</div>}

        <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div className={styles.activeSectionContainer}>
            <span>Program Info TOBE implemented</span>
          </div>
        </Form>
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(ProgramInfo);
