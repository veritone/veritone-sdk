import React, { Component, Fragment } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { get, isUndefined } from 'lodash';
import cx from 'classnames';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import GroupIcon from '@material-ui/icons/Group';
import Downshift from 'downshift';
import * as faceEngineOutput from '../../../redux/modules/mediaDetails/faceEngineOutput';
import IdentifierSelector from './IdentifierSelector';
import { modules } from 'veritone-redux-common';
import styles from './styles.scss';

const { user: userModule } = modules;

function renderInput(inputProps) {
  const { classes, ...other } = inputProps;

  return (
    <TextField
      InputLabelProps={{
        shrink: true,
        classes: {
          shrink: classes.entityInputLabel
        }
      }}
      {...other}
    />
  );
}

@connect(
  state => ({
    open: faceEngineOutput.getAddToExistingEntityDialogOpen(state),
    entitySearchResults: faceEngineOutput.getEntitySearchResults(state),
    isSearchingEntities: faceEngineOutput.isSearchingEntities(state),
    currentlyEditedFaces: faceEngineOutput.getCurrentlyEditedFaces(state),
    isCreatingIdentifiers: faceEngineOutput.isCreatingIdentifiers(state),
    acknowledgedCantAddIdentifiers: userModule.selectUserSettingByKey(
      state,
      'acknowledgedCantAddIdentifiers'
    )
  }),
  {
    fetchEntitySearchResults: faceEngineOutput.fetchEntitySearchResults,
    createEntityIdentifiers: faceEngineOutput.createEntityIdentifiers,
    updateUserSetting: userModule.updateUserSetting
  },
  null,
  { withRef: true }
)
export default class AddToExistingEntityDialog extends Component {
  static propTypes = {
    open: bool,
    onSubmit: func,
    onClose: func,
    isSearchingEntities: bool,
    entitySearchResults: arrayOf(
      shape({
        name: string.isRequired,
        library: shape({
          name: string.isRequired
        }).isRequired,
        profileImageUrl: string,
        ownedByOrganization: bool
      })
    ),
    currentlyEditedFaces: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          label: string,
          uri: string,
          entityId: string,
          libraryId: string
        })
      })
    ),
    fetchEntitySearchResults: func,
    createEntityIdentifiers: func,
    isCreatingIdentifiers: bool,
    updateUserSetting: func,
    acknowledgedCantAddIdentifiers: shape({
      key: string.isRequired,
      value: string.isRequired
    })
  };

  state = {
    searchText: '',
    selectedEntity: null,
    selectingIdentifiers: false,
    identifierError: null
  };

  handleSearchEntities = evt => {
    this.setState(
      {
        searchText: evt.target.value,
        selectedEntity: null
      },
      () => {
        this.props.fetchEntitySearchResults('people', this.state.searchText);
      }
    );
  };

  getEntityNameElement = (entityName, searchEntityText) => {
    const matchIndex = entityName
      .toLowerCase()
      .indexOf(searchEntityText.toLowerCase());
    return (
      <span>
        {entityName.substr(0, matchIndex)}
        <span className={styles.menuEntityNameMatch}>
          {entityName.substr(matchIndex, searchEntityText.length)}
        </span>
        {entityName.substr(matchIndex + searchEntityText.length)}
      </span>
    );
  };

  handleSelectEntity = entity => evt => {
    this.setState({
      searchText: entity.name + ': ' + get(entity, 'library.name'),
      selectedEntity: entity
    });
  };

  calculatePaperStyles = inputRef => {
    return {
      width: get(inputRef, 'current')
        ? get(inputRef, 'current').getBoundingClientRect().width
        : null
    };
  };

  calculateListHeight = inputRef => {
    const distanceToBottom = get(inputRef, 'current')
      ? window.innerHeight -
        get(inputRef, 'current').getBoundingClientRect().bottom -
        8
      : 0;
    return Math.min(distanceToBottom - 52, 300);
  };

  onNextClick = () => {
    const { selectedEntity } = this.state;
    const {
      acknowledgedCantAddIdentifiers,
      onSubmit,
      currentlyEditedFaces
    } = this.props;
    if (
      !get(selectedEntity, 'ownedByOrganization') &&
      acknowledgedCantAddIdentifiers
    ) {
      this.setState(
        {
          searchText: '',
          selectedEntity: null,
          selectingIdentifiers: false,
          identifierError: null
        },
        () => {
          onSubmit(currentlyEditedFaces, selectedEntity);
        }
      );
    } else {
      this.setState({
        displayUnownedEntityMessage: !get(
          selectedEntity,
          'ownedByOrganization'
        ),
        selectingIdentifiers: true,
        identifierError: null
      });
    }
  };

  handleCancel = () => {
    this.setState(
      {
        searchText: '',
        selectedEntity: null,
        selectingIdentifiers: false,
        identifierError: null
      },
      () => {
        this.props.onClose();
      }
    );
  };

  handleBackClick = () => {
    this.setState({
      selectingIdentifiers: false,
      identifierError: null
    });
  };

  handleCreateIdentifiers = (
    selectedIdentifiers,
    saveAcknowledgedCantAddIdentifiers
  ) => {
    const {
      createEntityIdentifiers,
      currentlyEditedFaces,
      onSubmit,
      updateUserSetting
    } = this.props;
    const { selectedEntity } = this.state;
    if (get(selectedEntity, 'ownedByOrganization') && get(selectedIdentifiers, 'length')) {
      createEntityIdentifiers(
        selectedIdentifiers.map(face => {
          return {
            entityId: selectedEntity.id,
            identifierTypeId: 'face',
            contentType: 'image',
            url: get(face, 'object.uri'),
            isPriority: false
          };
        })
      ).then(
        res => {
          this.setState(
            {
              searchText: '',
              selectedEntity: null,
              selectingIdentifiers: false,
              identifierError: null
            },
            () => {
              onSubmit(currentlyEditedFaces, selectedEntity);
            }
          );
          return res;
        },
        e => {
          console.error(e);
          this.setState({
            identifierError:
              'An error occurred while creating identifiers. Please try again later.'
          });
        }
      );
    } else {
      if (saveAcknowledgedCantAddIdentifiers) {
        updateUserSetting({
          key: 'acknowledgedCantAddIdentifiers',
          value: new Date().toString()
        });
      }
      this.setState(
        {
          searchText: '',
          selectedEntity: null,
          selectingIdentifiers: false,
          identifierError: null
        },
        () => {
          onSubmit(currentlyEditedFaces, selectedEntity);
        }
      );
    }
  };

  inputRef = React.createRef();

  render() {
    const {
      entitySearchResults,
      isSearchingEntities,
      open,
      currentlyEditedFaces,
      isCreatingIdentifiers,
      acknowledgedCantAddIdentifiers
    } = this.props;
    return (
      <Dialog
        open={open}
        classes={{
          paper: styles.entityDialogPaper
        }}
        style={{ overflow: 'visible' }}
        data-veritone-component="add-to-existing-entity-dialog"
      >
        <DialogTitle
          id="add-to-existing-entity-title"
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div className={styles.dialogTitleLabel}>
            Assign a Person to the Images You Selected
          </div>
          <IconButton
            onClick={this.handleCancel}
            aria-label="Close Add to an Existing Person"
            classes={{
              root: styles.closeButton
            }}
            data-veritone-element="close-button"
            disabled={isCreatingIdentifiers}
          >
            <Icon className="icon-close-exit" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className={cx(styles.addEntityContent, {
            [styles.negativeMargins]: this.state.selectingIdentifiers
          })}
          style={{ overflow: 'visible' }}
        >
          {!this.state.selectingIdentifiers && (
            <Fragment>
              <DialogContentText
                classes={{
                  root: styles.dialogHintText
                }}
              >
                Type the name of the person you are looking for below and any
                matches from your library will be displayed.
              </DialogContentText>
              <Grid container direction="column" spacing={32}>
                <Grid item>
                  <Downshift
                    inputValue={this.state.searchText}
                    onChange={this.handleSearchEntities}
                    selectedItem={this.state.selectedItem}
                  >
                    {({
                      getInputProps,
                      getItemProps,
                      getMenuProps,
                      isOpen
                    }) => (
                      <div>
                        <div ref={this.inputRef}>
                          {renderInput({
                            fullWidth: true,
                            classes: {
                              entityInputLabel: styles.entityInputLabel
                            },
                            label: 'Name',
                            InputProps: getInputProps({
                              onChange: this.handleSearchEntities,
                              id: 'entity-search-text-field',
                              autoFocus: true,
                              classes: {
                                root: styles.inputField
                              },
                              placeholder: 'First or Last Name'
                            }),
                            'data-veritone-element': 'entity-search-input'
                          })}
                        </div>
                        {isOpen &&
                        !this.state.selectedEntity &&
                        !!this.state.searchText.length ? (
                          <Paper
                            square
                            style={this.calculatePaperStyles(this.inputRef)}
                            classes={{ root: styles.entitySearchPaper }}
                          >
                            <div className={styles.libraryMatchesTitle}>
                              Library Matches
                            </div>
                            {isSearchingEntities && (
                              <div className={styles.circularProgressContainer}>
                                <CircularProgress />
                              </div>
                            )}
                            <div
                              className={styles.entitySearchList}
                              style={{
                                maxHeight: this.calculateListHeight(
                                  this.inputRef
                                )
                              }}
                            >
                              {!!entitySearchResults.length &&
                                !isSearchingEntities &&
                                entitySearchResults.map(result => (
                                  <Tooltip
                                    id="unownedEntityTooltip"
                                    classes={{
                                      tooltip: styles.unownedEntityTooltip
                                    }}
                                    title={
                                      !isUndefined(
                                        result.ownedByOrganization
                                      ) && !result.ownedByOrganization
                                        ? 'This person belongs to a shared library.'
                                        : ''
                                    }
                                    placement="top-start"
                                    key={`menu-entity-${result.id}`}
                                  >
                                    <MenuItem
                                      component="div"
                                      classes={{ root: styles.entityMenuItem }}
                                      onClick={this.handleSelectEntity(result)}
                                    >
                                      <Avatar src={result.profileImageUrl} />
                                      <div className={styles.entityInfo}>
                                        <div className={styles.menuEntityName}>
                                          {this.getEntityNameElement(
                                            result.name,
                                            this.state.searchText
                                          )}
                                        </div>
                                        <div className={styles.menuLibraryName}>
                                          {result.library.name}
                                          {!isUndefined(
                                            result.ownedByOrganization
                                          ) &&
                                            !result.ownedByOrganization && (
                                              <GroupIcon
                                                className={
                                                  styles.unownedEntityIcon
                                                }
                                              />
                                            )}
                                        </div>
                                      </div>
                                    </MenuItem>
                                  </Tooltip>
                                ))}
                            </div>
                            {!isSearchingEntities &&
                              !entitySearchResults.length && (
                                <div className={styles.notFoundEntityMessage}>
                                  Results Not Found
                                </div>
                              )}
                          </Paper>
                        ) : null}
                      </div>
                    )}
                  </Downshift>
                </Grid>
                <Grid
                  item
                  spacing={32}
                  container
                  direction="row"
                  className={styles.addEntityActions}
                  justify="flex-end"
                >
                  <Grid item>
                    <Button
                      color="primary"
                      data-veritone-element="next-button"
                      disabled={!this.state.selectedEntity}
                      classes={{
                        root: cx(styles.entityDialogButton, styles.nextButton)
                      }}
                      onClick={this.onNextClick}
                    >
                      {!get(this.state.selectedEntity, 'ownedByOrganization') &&
                      acknowledgedCantAddIdentifiers
                        ? 'Finish'
                        : 'Next'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Fragment>
          )}
          {this.state.selectingIdentifiers && (
            <IdentifierSelector
              identifiers={currentlyEditedFaces}
              defaultSelectAll={get(
                this.state.selectedEntity,
                'ownedByOrganization'
              )}
              onConfirm={this.handleCreateIdentifiers}
              onCancel={this.handleBackClick}
              isCreatingIdentifiers={isCreatingIdentifiers}
              userDoesNotOwnEntity={
                !get(this.state.selectedEntity, 'ownedByOrganization')
              }
              error={this.state.identifierError}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
