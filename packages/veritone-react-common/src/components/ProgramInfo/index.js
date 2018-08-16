import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import {
  func,
  number,
  string,
  bool,
  objectOf,
  arrayOf,
  any,
  shape
} from 'prop-types';
import { reduxForm, Form } from 'redux-form';
import blue from '@material-ui/core//colors/blue';
import { get } from 'lodash';
import SharingConfiguration from '../SharingConfiguration';

import styles from './styles.scss';

// TODO: either use form or state, not both. Get done when defcons rush is over.
@reduxForm({
  form: 'programInfo'
})
class ProgramInfo extends React.Component {
  static propTypes = {
    program: shape({
      id: string,
      name: string,
      imageUri: string,
      signedImageUri: string,
      liveImageUri: string,
      signedLiveImageUri: string,
      description: string,
      website: string,
      format: string,
      language: string,
      isNational: bool,
      acls: arrayOf(
        shape({
          organizationId: string.isRequired,
          permission: string.isRequired
        })
      ),
      isPublic: bool,
      affiliates: arrayOf(
        shape({
          id: string.isRequired,
          name: string.isRequired,
          schedule: objectOf(any).isRequired
        })
      )
    }),
    programFormats: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    canShare: bool,
    organizations: arrayOf(
      shape({
        organizationId: string.isRequired,
        organizationName: string.isRequired
      })
    ),
    canEditAffiliates: bool,
    canBulkAddAffiliates: bool,
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
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

  handleNameChange = event => {
    const newValue = event.target.value;
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          name: newValue
        }
      };
    });
  };

  openFilePickerForLiveImage = event => {
    console.log('start upload program live image');
  };

  openFilePickerForImage = event => {
    console.log('start upload program image');
  };

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

  handleAclsChange = acls => {
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          acls
        }
      };
    });
  };

  handleIsPublicChange = isPublic => {
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          isPublic
        }
      };
    });
  };

  prepareResultData() {
    return {
      ...this.state.program
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
      canEditAffiliates,
      canBulkAddAffiliates,
      programFormats
    } = this.props;

    // TODO: use when ready
    // eslint-disable-next-line no-unused-vars
    const { organizations, affiliates } = this.props;

    const { program } = this.state;

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
              <TextField
                label="Program Name"
                className={styles.programInfoInputField}
                margin="normal"
                onChange={this.handleNameChange}
                value={program.name}
              />
            </div>
            <div className={styles.programInfoSection}>
              <div className={styles.programInfoImagesSection}>
                <div className={styles.programInfoLiveImageSection}>
                  <div className={styles.programInfoFieldHeader}>
                    Program Live Image
                  </div>
                  <div className={styles.programInfoFieldDescription}>
                    Recommended image size: 500x350 .jpg or .png
                  </div>
                  {get(program, 'signedLiveImageUri.length') > 0 && (
                    <img className={styles.programInfoLiveImage} />
                  )}
                  {!get(program, 'signedLiveImageUri.length') && (
                    <div
                      className={styles.programInfoLiveImageNullState}
                      onClick={this.openFilePickerForLiveImage}
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
                <div className={styles.programInfoImageSection}>
                  <div className={styles.programInfoFieldHeader}>
                    Program Image
                  </div>
                  <div className={styles.programInfoFieldDescription}>
                    Recommended image size: 250x250 .jpg or .png
                  </div>
                  {get(program, 'signedImageUri.length') > 0 && (
                    <img className={styles.programInfoImage} />
                  )}
                  {!get(program, 'signedImageUri.length') && (
                    <div
                      className={styles.programInfoImageNullState}
                      onClick={this.openFilePickerForImage}
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
              />
            </div>
            <div className={styles.programInfoSection}>
              <TextField
                label="Program Website (Optional)"
                className={styles.programInfoInputField}
                margin="normal"
                value={program.website}
                onChange={this.handleWebsiteChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      classes={{ positionStart: styles.websitePrefix }}
                    >
                      http://
                    </InputAdornment>
                  )
                }}
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
                  value={program.format}
                  onChange={this.handleFormatChange}
                  className={styles.programInfoSelect}
                  inputProps={{
                    name: 'program-format',
                    id: 'program-format-simple'
                  }}
                >
                  {programFormats &&
                    programFormats.map(programFormatItem => (
                      <MenuItem
                        key={programFormatItem.id}
                        value={programFormatItem.id}
                      >
                        {programFormatItem.name}
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
                  />
                }
                label="Is National"
                className={styles.isNationalLabel}
              />
            </div>

            {canShare && <div className={styles.programInfoDivider} />}
            {canShare && (
              <div className={styles.shareContainer}>
                <SharingConfiguration
                  acls={program.acls}
                  organizations={organizations}
                  isPublic={program.isPublic}
                  defaultPermission="viewer"
                  onAclsChange={this.handleAclsChange}
                  showMakePublic
                  onIsPublicChange={this.handleIsPublicChange}
                  sharingSectionDescription="Share this program across organizations."
                  aclGroupsSectionDescription="Grant organizations permission to this program and its contents. Sharing programs will also share related Sources."
                  publicSectionDescription="Share this program and all of its content with all of Veritone."
                />
              </div>
            )}

            {/*TODO: Affiliates part goes here*/}
            {false &&
              (canEditAffiliates || get(program, 'affiliates.length') > 0) && (
                <div className={styles.programInfoDivider} />
              )}
            {false &&
              (canEditAffiliates || get(program, 'affiliates.length') > 0) && (
                <div className={styles.affiliatesContainer}>
                  {canBulkAddAffiliates && (
                    <div>Bulk Add Affiliates Button</div>
                  )}
                </div>
              )}
          </div>
        </Form>
      </MuiThemeProvider>
    );
  }
}

export default withTheme()(ProgramInfo);
