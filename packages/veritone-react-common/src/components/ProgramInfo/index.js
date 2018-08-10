import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { func, number, string, bool, objectOf, arrayOf, any, shape } from 'prop-types';
import { reduxForm, Form } from 'redux-form';
import blue from '@material-ui/core//colors/blue';
import {
  noop,
  get,
  isEqual,
} from 'lodash';
import { withProps } from 'recompose';

import styles from './styles.scss';

@reduxForm({
  form: 'programInfo'
})
class ProgramInfo extends React.Component {
  static propTypes = {
    sourceData: objectOf(any).isRequired,
    program: shape({
      id: string.isRequired,
      name: string,
      imageUri: string,
      liveImageUri: string,
      description: string,
      website: string,
      format: string,
      language: string,
      isNational: bool,
      acls: arrayOf(
        shape({
          organizationId: string.isRequired,
          organizationName: string.isRequired
        })),
      isPublic: bool,
      affiliates: arrayOf(
        shape({
          id: string.isRequired,
          name: string.isRequired,
          schedule: objectOf(any).isRequired
        })),
    }),
    programFormats: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })),
    canShare: bool,
    acls: arrayOf(
      shape({
        organizationId: string.isRequired,
        organizationName: string.isRequired
      })),
    canEditAffiliates: bool,
    canBulkAddAffiliates: bool,
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })),
    onSubmit: func.isRequired, // user-provided callback for result values
    handleSubmit: func.isRequired, // provided by redux-form
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string
  };

  static defaultProps = {
    program: {},
    onSubmit: noop,
    relativeSize: 14,
    color: '#2196F3'
  };

  static getDerivedStateFromProps(nextProps) {
    // TODO fix updating field values
    return {
      program: {
        ...nextProps.program
      }
    };
  }

  state = {
    program: {}
  };

  handleNameChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
        return {
          program: {
            ...prevState.program,
            name: newValue
          }
        }
      }
    );
  };

  handleDescriptionChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
        return {
          program: {
            ...prevState.program,
            description: newValue
          }
        }
      }
    );
  };

  handleWebsiteChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
        return {
          program: {
            ...prevState.program,
            website: newValue
          }
        }
      }
    );
  };

  handleFormatChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
        return {
          program: {
            ...prevState.program,
            format: newValue
          }
        }
      }
    );
  };

  toggleIsNational = event => {
    this.setState(prevState => {
        return {
          program: {
            ...prevState.program,
            isNational: !prevState.isNational
          }
        }
      }
    );
  };

  // handleMuiCheckboxFieldChange = name

  prepareResultData() {
    return {
      data: {
        ... this.state.program
      }
    };
  }

  handleSubmit = () => {
    this.props.onSubmit(this.prepareResultData());
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
      acls,
      canEditAffiliates,
      canBulkAddAffiliates,
      affiliates,
      programFormats
    } = this.props;

    const {
      program
    } = this.state;

    return (
      <MuiThemeProvider
        theme={this.getTheme({
          color: this.props.color,
          relativeSize: this.props.relativeSize
        })}
      >
        <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div className={styles.activeSectionContainer}>
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
                onChange={this.handleNameChange}
                value={program.name}
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
                value={program.description}
                onChange={this.handleDescriptionChange}
              />
            </div>
            <div className={styles.programInfoSection}>
              <TextField
                label='Program Website (Optional)'
                className={styles.programInfoInputField}
                margin='normal'
                value={program.website}
                onChange={this.handleWebsiteChange}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>http://</InputAdornment>,
                }}
              />
            </div>

            <div className={styles.programInfoSection}>
              <FormControl>
                <InputLabel htmlFor='program-format-select-input' className={styles.programInfoSelectLabel}>Program Format</InputLabel>
                <Select
                  value={program.format}
                  onChange={this.handleFormatChange}
                  className={styles.programInfoSelect}
                  inputProps={{
                    name: 'program-format',
                    id: 'program-format-simple',
                  }}
                >
                  {programFormats && programFormats.map(programFormatItem =>
                    <MenuItem key={programFormatItem.id} value={programFormatItem.id}>{programFormatItem.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>

            <div className={styles.programInfoSection}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={program.isNational}
                    onChange={this.toggleIsNational}
                    value='program.isNational'
                    color='primary'
                  />
                }
                label='Is National'
                className={styles.isPublicLabel}
              />
            </div>

            {canShare && <div>
              <div className={styles.programInfoDivider} />
              TODO: Share component goes here
              <div className={styles.shareContainer}>
              </div>
            </div>}

            {(canEditAffiliates || get(program, 'affiliates.length') > 0 ) &&
              <div>
                <div className={styles.programInfoDivider}/>
                TODO: Affiliates part goes here
                {canBulkAddAffiliates && <div>Bulk Add Affiliates Button</div>}
              </div>}

          </div>
        </Form>
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(ProgramInfo);
