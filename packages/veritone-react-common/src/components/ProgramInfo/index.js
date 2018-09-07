import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/ModeEdit';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import {
  func,
  number,
  string,
  bool,
  arrayOf,
  shape,
  objectOf
} from 'prop-types';
import { reduxForm, Form } from 'redux-form';
import blue from '@material-ui/core//colors/blue';
import { get } from 'lodash';
import Affiliates from './Affiliates';

import styles from './styles.scss';

@reduxForm({
  form: 'programInfo'
})
class ProgramInfo extends React.Component {
  static propTypes = {
    program: shape({
      programImage: string,
      signedProgramImage: string,
      programLiveImage: string,
      signedProgramLiveImage: string,
      description: string,
      website: string,
      format: string,
      language: string,
      isNational: bool,
      affiliateById: objectOf(
        shape({
          id: string.isRequired,
          name: string.isRequired,
          timeZone: string,
          schedule: shape({
            scheduleType: string,
            start: string,
            end: string,
            repeatEvery: shape({
              number: string,
              period: string
            }),
            weekly: shape({
              selectedDays: objectOf(bool)
            })
          }).isRequired
        })
      )
    }),
    programFormats: arrayOf(string),
    loadNextAffiliates: func,
    canBulkAddAffiliates: bool,
    loadAllAffiliates: func,
    readOnly: bool,
    onUploadImage: func,
    onRemoveImage: func,
    onSubmit: func.isRequired, // user-provided callback for result values
    handleSubmit: func.isRequired, // provided by redux-form
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string
  };

  static defaultProps = {
    program: {},
    relativeSize: 14,
    color: '#2196F3'
  };

  state = {
    program: {
      ...this.props.program
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (
      get(props, 'program.programImage') !==
        get(state, 'program.programImage') ||
      get(props, 'program.signedProgramImage') !==
        get(state, 'program.signedProgramImage')
    ) {
      return {
        program: {
          ...state.program,
          programImage: get(props, 'program.programImage'),
          signedProgramImage: get(props, 'program.signedProgramImage')
        }
      };
    }
    if (
      get(props, 'program.programLiveImage') !==
        get(state, 'program.programLiveImage') ||
      get(props, 'program.signedProgramLiveImage') !==
        get(state, 'program.signedProgramLiveImage')
    ) {
      return {
        program: {
          ...state.program,
          programLiveImage: get(props, 'program.programLiveImage'),
          signedProgramLiveImage: get(props, 'program.signedProgramLiveImage')
        }
      };
    }
    return null;
  }

  handleDescriptionChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          description: newValue
        }
      };
    });
  };

  handleWebsiteChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          website: newValue
        }
      };
    });
  };

  handleFormatChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          format: newValue
        }
      };
    });
  };

  toggleIsNational = event => {
    const newValue = event.target.checked;
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          isNational: newValue
        }
      };
    });
  };

  handleAffiliatesChange = affiliateById => {
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          affiliateById
        }
      };
    });
  };

  prepareResultData() {
    const program = {
      ...this.state.program
    };
    delete program.signedProgramLiveImage;
    delete program.signedProgramImage;
    return program;
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
      programFormats,
      readOnly,
      onUploadImage,
      onRemoveImage,
      loadNextAffiliates,
      loadAllAffiliates
    } = this.props;

    // TODO OLEKS: intentionally disabled. Enable when bulk add is implemented
    let { canBulkAddAffiliates } = this.props;
    canBulkAddAffiliates = false;

    const { program, openFilePicker } = this.state;

    return (
      <MuiThemeProvider
        theme={this.getTheme({
          color: this.props.color,
          relativeSize: this.props.relativeSize
        })}
      >
        {openFilePicker && this.renderFilePicker()}
        <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div className={styles.activeSectionContainer}>
            <div className={styles.programInfoSection}>
              <div className={styles.programImagesSection}>
                <div className={styles.programLiveImageSection}>
                  <div className={styles.programInfoFieldHeader}>
                    Program Live Image
                  </div>
                  <div className={styles.programInfoFieldDescription}>
                    Recommended image size: 500x350 .jpg or .png
                  </div>
                  {(get(program, 'signedProgramLiveImage.length') > 0 ||
                    get(program, 'programLiveImage.length') > 0) && (
                    /* eslint-disable react/jsx-no-bind */
                    <div className={styles.programLiveImageContainer}>
                      <img
                        className={styles.programLiveImage}
                        src={
                          program.signedProgramLiveImage ||
                          program.programLiveImage
                        }
                      />
                      <div className={styles.imageOverlay}>
                        <EditIcon
                          classes={{ root: styles.editProgramLiveImageIcon }}
                          className="icon-mode_edit2"
                          onClick={() => onUploadImage('programLiveImage')}
                        />
                        <DeleteIcon
                          classes={{ root: styles.editProgramLiveImageIcon }}
                          className="icon-trashcan"
                          onClick={() => onRemoveImage('programLiveImage')}
                        />
                      </div>
                    </div>
                  )}
                  {!get(program, 'signedProgramLiveImage.length') &&
                    !get(program, 'programLiveImage.length') && (
                      <div
                        className={styles.programLiveImageNullState}
                        onClick={() => onUploadImage('programLiveImage')}
                      >
                        <div className={styles.uploadImageIconSection}>
                          <Icon
                            className={'icon-cloud_upload'}
                            color="disabled"
                            style={{ fontSize: 40 }}
                          />
                          <div className={styles.uploadImageLabel}>
                            Browse to upload
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                <div className={styles.programImageSection}>
                  <div className={styles.programInfoFieldHeader}>
                    Program Image
                  </div>
                  <div className={styles.programInfoFieldDescription}>
                    Recommended image size: 250x250 .jpg or .png
                  </div>
                  {(get(program, 'signedProgramImage.length') > 0 ||
                    get(program, 'programImage.length') > 0) && (
                    <div className={styles.programImageContainer}>
                      <img
                        className={styles.programImage}
                        src={program.signedProgramImage || program.programImage}
                      />
                      <div className={styles.imageOverlay}>
                        <EditIcon
                          classes={{ root: styles.editProgramImageIcon }}
                          className="icon-mode_edit2"
                          onClick={() => onUploadImage('programImage')}
                        />
                        <DeleteIcon
                          classes={{ root: styles.editProgramImageIcon }}
                          className="icon-trashcan"
                          onClick={() => onRemoveImage('programImage')}
                        />
                      </div>
                    </div>
                  )}
                  {!get(program, 'signedProgramImage.length') &&
                    !get(program, 'programImage.length') && (
                      <div
                        className={styles.programImageNullState}
                        onClick={() => onUploadImage('programImage')}
                      >
                        <div className={styles.uploadImageIconSection}>
                          <Icon
                            className={'icon-cloud_upload'}
                            color="disabled"
                            style={{ fontSize: 40 }}
                          />
                          <div className={styles.uploadImageLabel}>
                            Browse to upload
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className={styles.programInfoSection}>
              <TextField
                label="Description"
                className={styles.programInfoInputField}
                margin="normal"
                value={program.description}
                onChange={this.handleDescriptionChange}
                disabled={readOnly}
              />
            </div>
            <div className={styles.programInfoSection}>
              <TextField
                label="Program Website (Optional)"
                className={styles.programInfoInputField}
                margin="normal"
                value={program.website}
                onChange={this.handleWebsiteChange}
                placeholder="http://"
                disabled={readOnly}
              />
            </div>

            <div className={styles.programInfoSection}>
              <FormControl>
                <InputLabel
                  htmlFor="program-format-select-input"
                  className={styles.programInfoSelectLabel}
                >
                  Program Format
                </InputLabel>
                <Select
                  value={program.format || ''}
                  onChange={this.handleFormatChange}
                  className={styles.programInfoSelect}
                  disabled={readOnly}
                  inputProps={{
                    name: 'program-format',
                    id: 'program-format-simple'
                  }}
                >
                  {programFormats &&
                    programFormats.map(programFormatItem => (
                      <MenuItem
                        key={programFormatItem}
                        value={programFormatItem}
                      >
                        {programFormatItem}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>

            <div className={styles.programInfoSection}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={program.isNational}
                    onChange={this.toggleIsNational}
                    value="program.isNational"
                    color="primary"
                    disabled={readOnly}
                  />
                }
                label="Is National"
                className={styles.isNationalLabel}
              />
            </div>

            {!readOnly && <div className={styles.programInfoDivider} />}
            {!readOnly && (
              <div className={styles.affiliatesSection}>
                <Affiliates
                  selectedAffiliateById={program.affiliateById}
                  loadNextAffiliates={loadNextAffiliates}
                  canBulkAddAffiliates={canBulkAddAffiliates}
                  loadAllAffiliates={loadAllAffiliates}
                  onAffiliatesChange={this.handleAffiliatesChange}
                />
              </div>
            )}
          </div>
        </Form>
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(ProgramInfo);
