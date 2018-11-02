import React, { Component, Fragment } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { find, get } from 'lodash';
import cx from 'classnames';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import AddNewEntityForm from './AddNewEntityForm';
import IdentifierSelector from './IdentifierSelector';
import NoLibrary from './NoLibrary';
import CreateLibrarySuccess from './CreateLibrarySuccess';
import * as faceEngineOutput from '../../../redux/modules/mediaDetails/faceEngineOutput';
import { removeAwsSignatureParams } from '../../../shared/asset';
import { LibraryForm } from 'veritone-react-common';
import styles from './styles.scss';

@connect(
  state => ({
    open: faceEngineOutput.getAddNewEntityDialogOpen(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state),
    isFetchingLibraryTypes: faceEngineOutput.isFetchingLibraryTypes(state),
    libraries: faceEngineOutput.getLibraries(state),
    currentlyEditedFaces: faceEngineOutput.getCurrentlyEditedFaces(state),
    isCreatingIdentifiers: faceEngineOutput.isCreatingIdentifiers(state),
    initialEntityName: faceEngineOutput.getInitialEntityName(state),
    faceLibraryTypes: faceEngineOutput.getLibraryTypesByIdentifierType(
      state,
      'face'
    )
  }),
  {
    fetchLibraries: faceEngineOutput.fetchLibraries,
    fetchLibraryTypes: faceEngineOutput.fetchLibraryTypes,
    createEntity: faceEngineOutput.createEntity,
    createNewLibrary: faceEngineOutput.createNewLibrary,
    createEntityIdentifiers: faceEngineOutput.createEntityIdentifiers,
    updateInitialEntityName: faceEngineOutput.updateInitialEntityName
  },
  null,
  { withRef: true }
)
export default class AddNewEntityDialog extends Component {
  static propTypes = {
    open: bool,
    libraries: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    fetchLibraries: func.isRequired,
    fetchLibraryTypes: func.isRequired,
    isFetchingLibraries: bool,
    isFetchingLibraryTypes: bool,
    createEntity: func,
    onSubmit: func.isRequired,
    onCancel: func.isRequired,
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
    createNewLibrary: func,
    isCreatingIdentifiers: bool,
    createEntityIdentifiers: func,
    initialEntityName: string,
    updateInitialEntityName: func,
    faceLibraryTypes: arrayOf(
      shape({
        id: string.isRequired,
        label: string.isRequired
      })
    ).isRequired
  };

  state = {
    selectedLibraryId: null,
    configuringNewLibrary: false,
    selectingIdentifiers: false,
    cachedEntity: null,
    firstLibraryCreation: get(this.props, 'libraries.length') === 0,
    showLibraryCreationSuccess: false
  };

  componentDidMount() {
    const {
      libraries,
      faceLibraryTypes,
      isFetchingLibraries,
      isFetchingLibraryTypes
    } = this.props;
    if (!libraries.length && !isFetchingLibraries) {
      this.props.fetchLibraries(['face']);
    }
    if (!faceLibraryTypes.length & !isFetchingLibraryTypes) {
      this.props.fetchLibraryTypes();
    }
  }

  handleCreateNewEntity = formData => {
    const { currentlyEditedFaces, createEntity } = this.props;
    if (currentlyEditedFaces) {
      return createEntity({
        ...formData,
        profileImageUrl: removeAwsSignatureParams(
          get(currentlyEditedFaces, '[0].object.uri')
        )
      })
        .then(res => {
          this.setState({
            configuringNewLibrary: false,
            selectingIdentifiers: true,
            cachedEntity: {
              ...res
            }
          });
          return res;
        })
        .catch(error => {
          if (get(error, 'errors[0].name') === 'resource_conflict') {
            throw new SubmissionError({
              name: 'An entity with that name already exists in that library.',
              _error: 'An entity with that name already exists in that library.'
            });
          } else {
            throw new SubmissionError({
              _error: 'Unable to create entity. Please try again later.'
            });
          }
        });
    }
  };

  handleBackClick = () => {
    this.setState({
      configuringNewLibrary: false,
      selectingIdentifiers: false
    });
  };

  handleCreateIdentifiers = selectedIdentifiers => {
    const {
      createEntityIdentifiers,
      currentlyEditedFaces,
      onSubmit
    } = this.props;
    const { cachedEntity } = this.state;
    if (get(cachedEntity, 'id')) {
      if (cachedEntity.id) {
        createEntityIdentifiers(
          currentlyEditedFaces.map(face => {
            return {
              entityId: get(cachedEntity, 'id'),
              identifierTypeId: 'face',
              contentType: 'image',
              url: get(face, 'object.uri'),
              isPriority: !!find(selectedIdentifiers, { guid: face.guid })
            };
          })
        ).then(res => {
          this.setState(
            {
              selectedLibraryId: null,
              configuringNewLibrary: false,
              selectingIdentifiers: false,
              cachedEntity: null
            },
            () => {
              onSubmit(currentlyEditedFaces, cachedEntity);
            }
          );
          return res;
        });
      }
    }
  };

  handleNewLibraryClick = () => {
    this.setState({
      configuringNewLibrary: true
    });
  };

  handleCreateLibrary = library => {
    const { createNewLibrary } = this.props;
    return createNewLibrary(library).then(res => {
      this.setState(prevState => {
        return {
          configuringNewLibrary: false,
          firstLibraryCreation: false,
          showLibraryCreationSuccess: prevState.firstLibraryCreation,
          selectedLibraryId: get(res, 'createLibrary.id')
        };
      });
      return res;
    });
  };

  handleCancel = () => {
    this.setState(
      {
        selectedLibraryId: null,
        configuringNewLibrary: false,
        selectingIdentifiers: false,
        cachedEntity: null
      },
      () => {
        this.props.onCancel();
      }
    );
  };

  handleNameChange = evt => {
    const { value } = evt.target;
    this.props.updateInitialEntityName(value);
  };

  handleContinueCreateEntity = () => {
    this.setState({
      showLibraryCreationSuccess: false
    });
  };

  render() {
    const {
      libraries,
      isFetchingLibraries,
      currentlyEditedFaces,
      isCreatingIdentifiers,
      initialEntityName,
      faceLibraryTypes
    } = this.props;
    const initialLibraryId =
      this.state.selectedLibraryId || get(libraries, '[0].id');
    return (
      <Dialog
        open={this.props.open}
        classes={{
          paper: styles.entityDialogPaper
        }}
        data-veritone-component="add-to-new-entity-dialog"
      >
        <DialogTitle
          id="add-new-entity-title"
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div className={styles.dialogTitleLabel}>
            {!this.state.configuringNewLibrary &&
              !this.state.showLibraryCreationSuccess &&
              get(libraries, 'length') > 0 &&
              'Create New Entity'}
            {(this.state.configuringNewLibrary ||
              this.state.showLibraryCreationSuccess) &&
              'Create New Library'}
          </div>
          <IconButton
            onClick={this.handleCancel}
            aria-label="Close Add New Entity"
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
        >
          {get(libraries, 'length') === 0 &&
            !this.state.configuringNewLibrary && (
              <NoLibrary onButtonClick={this.handleNewLibraryClick} />
            )}
          {this.state.showLibraryCreationSuccess && (
            <CreateLibrarySuccess
              libraryName={get(
                find(libraries, { id: this.state.selectedLibraryId }),
                'name'
              )}
              onButtonClick={this.handleContinueCreateEntity}
            />
          )}
          {get(libraries, 'length') > 0 &&
            !this.state.showLibraryCreationSuccess && (
              <Fragment>
                {!this.state.configuringNewLibrary &&
                  !this.state.selectingIdentifiers && (
                    <Fragment>
                      <DialogContentText
                        classes={{
                          root: styles.dialogHintText
                        }}
                      >
                        Identify and help train face recognition engines to find
                        this individual. You can view and add additional images
                        in the Library application.
                      </DialogContentText>
                      <AddNewEntityForm
                        isFetchingLibraries={isFetchingLibraries}
                        libraries={libraries}
                        initialValues={{
                          libraryId: initialLibraryId,
                          name: initialEntityName
                        }}
                        showCreateLibraryButton
                        onCreateNewLibrary={this.handleNewLibraryClick}
                        onSubmit={this.handleCreateNewEntity}
                        onCancel={this.handleCancel}
                        destroyOnUnmount={
                          !this.state.configuringNewLibrary &&
                          !this.state.selectingIdentifiers
                        }
                        onNameChange={this.handleNameChange}
                      />
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
              </Fragment>
            )}
          {this.state.configuringNewLibrary && (
            <LibraryForm
              initialValues={{ libraryTypeId: faceLibraryTypes[0].id }}
              libraryTypes={faceLibraryTypes}
              onSubmit={this.handleCreateLibrary}
              onCancel={this.handleBackClick}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
