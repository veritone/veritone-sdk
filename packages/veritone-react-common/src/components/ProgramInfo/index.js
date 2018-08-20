import React from 'react';
import {
  withTheme,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import EditIcon from '@material-ui/icons/ModeEdit';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { func, number, string, bool, arrayOf, shape } from 'prop-types';
import { reduxForm, Form } from 'redux-form';
import blue from '@material-ui/core//colors/blue';
import { get } from 'lodash';
import SharingConfiguration from '../SharingConfiguration';
import FilePicker from '../FilePicker';
import Affiliates from './Affiliates';

import styles from './styles.scss';

@reduxForm({
  form: 'programInfo'
})
class ProgramInfo extends React.Component {
  static propTypes = {
    program: shape({
      name: string,
      programImage: string,
      signedProgramImage: string,
      programLiveImage: string,
      signedProgramLiveImage: string,
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
          schedule: shape({
            scheduleType: string,
            start: string,
            end: string,
            repeatEvery: shape({
              number: string,
              period: string
            }),
            daily: arrayOf(
              shape({
                start: string,
                end: string
              })
            ),
            weekly: shape({
              selectedDays: arrayOf(string)
            })
          }).isRequired
        })
      )
    }),
    programFormats: arrayOf(string),
    canShare: bool,
    organizations: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    canEditAffiliates: bool,
    canBulkAddAffiliates: bool,
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        schedule: shape({
          scheduleType: string,
          start: string,
          end: string,
          repeatEvery: shape({
            number: string,
            period: string
          }),
          daily: arrayOf(
            shape({
              start: string,
              end: string
            })
          ),
          weekly: shape({
            selectedDays: arrayOf(string)
          })
        }).isRequired
      })
    ),
    readOnly: bool,
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
    },
    openFilePicker: false
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

  handleAffiliatesChange = affiliates => {
    this.setState(prevState => {
      return {
        program: {
          ...prevState.program,
          affiliates
        }
      };
    });
  };

  prepareResultData() {
    return {
      ...this.state.program,
      programLiveImage: this.state.programLiveImageFile,
      programImage: this.state.programImageFile
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

  handleFilesSelected = files => {
    const fileReader = new FileReader();
    console.log('handleFilesSelected');
    fileReader.onload = () => {
      this.setState((prevState, props) => {
        console.log(fileReader.result);
        console.log(files[0]);
        console.log('handleFilesSelected set state');
        return {
          [prevState.selectImageType]: fileReader.result,
          [prevState.selectImageType + 'File']: files[0],
          openFilePicker: false,
          selectImageType: null
        };
      });
    };
    console.log('handleFilesSelected before readAsDataURL');
    fileReader.readAsDataURL(files[0]);
  };

  handleCloseFilePicker = () => {
    this.setState({
      selectImageType: null,
      openFilePicker: false
    });
  };

  handleRemoveImage = imageType => event => {
    this.setState({
      [imageType]: undefined,
      [imageType + 'File']: undefined
    });
  };

  handleStartPickFiles = fileType => event => {
    if (this.props.readOnly) {
      return;
    }
    //TODO: uncomment when handled image url change on file upload
    // console.log('start handleStartPickFiles');
    // this.setState({
    //   selectImageType: fileType,
    //   openFilePicker: true
    // });
    console.log('end handleStartPickFiles');
  };

  renderFilePicker = () => {
    return (
      <Dialog open={this.state.openFilePicker}>
        <FilePicker
          accept="image/*"
          height={500}
          width={500}
          onRequestClose={this.handleCloseFilePicker}
          onPickFiles={this.handleFilesSelected}
        />
      </Dialog>
    );
  };

  render() {
    const {
      canShare,
      canEditAffiliates,
      canBulkAddAffiliates,
      programFormats,
      organizations,
      affiliates,
      readOnly
    } = this.props;

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
              <TextField
                label="Program Name"
                className={styles.programInfoInputField}
                margin="normal"
                onChange={this.handleNameChange}
                value={program.name}
                disabled={readOnly}
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
                  {get(program, 'programLiveImage.length') > 0 && (
                    <img className={styles.programInfoLiveImage} />
                  )}
                  {!get(program, 'programLiveImage.length') && (
                    <div
                      className={styles.programInfoLiveImageNullState}
                      onClick={this.handleStartPickFiles('programLiveImage')}
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
                  {get(program, 'programImage.length') > 0 && (
                    <img
                      className={styles.programInfoImage}
                      src={this.program.programImage}
                    />
                  )}
                  {get(program, 'programImage.length') > 0 && (
                    <div className={styles.imageOverlay}>
                      <EditIcon
                        classes={{ root: styles.editProgramImageIcon }}
                        className="icon-mode_edit2"
                        onClick={this.handleStartPickFiles('programImage')}
                      />
                      <DeleteIcon
                        classes={{ root: styles.editProgramImageIcon }}
                        className="icon-trashcan"
                        onClick={this.handleRemoveImage('programImage')}
                      />
                    </div>
                  )}
                  {!get(program, 'programImage.length') && (
                    <div
                      className={styles.programInfoImageNullState}
                      onClick={this.handleStartPickFiles('programImage')}
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
                disabled={readOnly}
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

            {canShare && !readOnly && <div className={styles.programInfoDivider} />}
            {canShare && !readOnly && (
              <div className={styles.shareSection}>
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

            {canEditAffiliates && !readOnly && <div className={styles.programInfoDivider} />}
            {canEditAffiliates && !readOnly && (
              <div className={styles.affiliatesSection}>
                <Affiliates
                  selectedAffiliates={program.affiliates}
                  affiliates={affiliates}
                  canBulkAddAffiliates={canBulkAddAffiliates}
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
