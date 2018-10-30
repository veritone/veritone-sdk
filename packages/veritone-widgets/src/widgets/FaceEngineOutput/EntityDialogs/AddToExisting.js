import React, { Component, Fragment } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { get, find } from 'lodash';
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
import Downshift from 'downshift';
import * as faceEngineOutput from '../../../redux/modules/mediaDetails/faceEngineOutput';
import IdentifierSelector from './IdentifierSelector';
import styles from './styles.scss';

function renderInput(inputProps) {
  const { classes, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        classes: {
          root: classes.inputField
        }
      }}
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
    isCreatingIdentifiers: faceEngineOutput.isCreatingIdentifiers(state)
  }),
  {
    fetchEntitySearchResults: faceEngineOutput.fetchEntitySearchResults,
    createEntityIdentifiers: faceEngineOutput.createEntityIdentifiers
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
        entityName: string,
        libraryName: string,
        profileImageUrl: string
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
    isCreatingIdentifiers: bool
  };

  state = {
    searchText: '',
    selectedEntity: null,
    selectingIdentifiers: false
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
      searchText: entity.name,
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
    this.setState({
      selectingIdentifiers: true
    });
  };

  handleCancel = () => {
    this.setState(
      {
        searchText: '',
        selectedEntity: null,
        selectingIdentifiers: false
      },
      () => {
        this.props.onClose();
      }
    );
  };

  handleBackClick = () => {
    this.setState({
      selectingIdentifiers: false
    });
  };

  handleCreateIdentifiers = selectedIdentifiers => {
    const {
      createEntityIdentifiers,
      currentlyEditedFaces,
      onSubmit
    } = this.props;
    const { selectedEntity } = this.state;
    createEntityIdentifiers(
      currentlyEditedFaces.map(face => {
        return {
          entityId: selectedEntity.id,
          identifierTypeId: 'face',
          contentType: 'image',
          url: get(face, 'object.uri'),
          isPriority: !!find(selectedIdentifiers, { guid: face.guid })
        };
      })
    ).then(res => {
      this.setState(
        {
          searchText: '',
          selectedEntity: null,
          selectingIdentifiers: false
        },
        () => {
          onSubmit(currentlyEditedFaces, selectedEntity);
        }
      );
      return res;
    });
  };

  inputRef = React.createRef();

  render() {
    const {
      entitySearchResults,
      isSearchingEntities,
      open,
      currentlyEditedFaces,
      isCreatingIdentifiers
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
            Add to an Existing Entity
          </div>
          <IconButton
            onClick={this.handleCancel}
            aria-label="Close Add to an Existing Entity"
            classes={{
              root: styles.closeButton
            }}
            data-veritone-element="close-button"
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
                Type the name of the person you are looking for.
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
                              inputField: styles.inputField,
                              entityInputLabel: styles.entityInputLabel
                            },
                            label: 'Name',
                            InputProps: getInputProps({
                              onChange: this.handleSearchEntities,
                              id: 'entity-search-text-field',
                              autoFocus: true
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
                                  <MenuItem
                                    key={`menu-entity-${result.id}`}
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
                                      </div>
                                    </div>
                                  </MenuItem>
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
                      Next
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Fragment>
          )}
          {this.state.selectingIdentifiers && (
            <IdentifierSelector
              identifiers={currentlyEditedFaces}
              classes={{ imageContainer: styles.imageContainer }}
              defaultSelectAll
              onConfirm={this.handleCreateIdentifiers}
              onCancel={this.handleBackClick}
              creatingIdentifiers={isCreatingIdentifiers}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
