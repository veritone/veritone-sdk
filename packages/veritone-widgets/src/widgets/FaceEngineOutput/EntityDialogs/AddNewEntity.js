import React, { Component, Fragment } from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import { find, get } from 'lodash';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import AddNewEntityForm from './AddNewEntityForm';
import IdentifierSelector from './IdentifierSelector';
import * as faceEngineOutput from '../../../redux/modules/mediaDetails/faceEngineOutput';
import { removeAwsSignatureParams } from '../../../shared/asset';
import { LibraryForm } from 'veritone-react-common';

import styles from './styles.scss';
import cx from 'classnames';

@connect(
  state => ({
    open: faceEngineOutput.getAddNewEntityDialogOpen(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state),
    libraries: faceEngineOutput.getLibraries(state),
    currentlyEditedFaces: faceEngineOutput.getCurrentlyEditedFaces(state),
    isCreatingIdentifiers: faceEngineOutput.isCreatingIdentifiers(state)
  }),
  {
    fetchLibraries: faceEngineOutput.fetchLibraries,
    createEntity: faceEngineOutput.createEntity,
    createNewLibrary: faceEngineOutput.createNewLibrary,
    createEntityIdentifiers: faceEngineOutput.createEntityIdentifiers
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
    isFetchingLibraries: bool,
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
    createEntityIdentifiers: func
  };

  state = {
    selectedLibraryId: null,
    configuringNewLibrary: false,
    selectingIdentifiers: false,
    cachedEntity: null
  };

  componentDidMount() {
    if (!get(this.props, 'libraries.length')) {
      this.props.fetchLibraries({
        libraryType: 'people'
      });
    }
  }

  handleCreateNewEntity = formData => {
    const { currentlyEditedFaces } = this.props;
    if (currentlyEditedFaces) {
      this.setState({
        configuringNewLibrary: false,
        selectingIdentifiers: true,
        cachedEntity: {
          ...formData,
          profileImageUrl: removeAwsSignatureParams(
            get(currentlyEditedFaces, '[0].object.uri')
          )
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

  handleCreateIdentifiers = async selectedIdentifiers => {
    const {
      createEntityIdentifiers,
      currentlyEditedFaces,
      createEntity,
      onSubmit
    } = this.props;
    const { cachedEntity } = this.state;
    let entityRes;
    if (cachedEntity) {
      entityRes = await createEntity(cachedEntity);

      if (get(entityRes, 'entity.id')) {
        await createEntityIdentifiers(
          currentlyEditedFaces.map(face => {
            return {
              entityId: get(entityRes, 'entity.id'),
              identifierTypeId: 'face',
              contentType: 'image',
              url: get(face, 'object.uri'),
              isPriority: !!find(selectedIdentifiers, { guid: face.guid })
            };
          })
        );

        this.setState(
          {
            selectedLibraryId: null,
            configuringNewLibrary: false,
            selectingIdentifiers: false
          },
          () => {
            onSubmit(currentlyEditedFaces, get(entityRes, 'entity'));
          }
        );
      }
    }
  };

  handleNewLibraryClick = () => {
    this.setState({
      configuringNewLibrary: true
    });
  };

  handleCreateLibrary = library => {
    this.props.createNewLibrary(library).then(res => {
      this.setState({
        configuringNewLibrary: false,
        selectedLibraryId: get(res, 'createLibrary.id')
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

  render() {
    const {
      libraries,
      isFetchingLibraries,
      currentlyEditedFaces,
      isCreatingIdentifiers
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
            {!this.state.configuringNewLibrary && 'Add to Library'}
            {this.state.configuringNewLibrary && 'Create New Library'}
          </div>
          <IconButton
            onClick={this.props.onCancel}
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
          {!this.state.configuringNewLibrary &&
            !this.state.selectingIdentifiers && (
              <Fragment>
                <DialogContentText
                  classes={{
                    root: styles.dialogHintText
                  }}
                >
                  Identify and help train face recognition engines to find this
                  individual. You can view and add additional images in the
                  Library application.
                </DialogContentText>
                <AddNewEntityForm
                  isFetchingLibraries={isFetchingLibraries}
                  libraries={libraries}
                  initialValues={{
                    libraryId: initialLibraryId
                  }}
                  showCreateLibraryButton
                  onCreateNewLibrary={this.handleNewLibraryClick}
                  onSubmit={this.handleCreateNewEntity}
                  onCancel={this.handleCancel}
                  destroyOnUnmount={
                    !this.state.configuringNewLibrary &&
                    !this.state.selectingIdentifiers
                  }
                />
              </Fragment>
            )}
          {this.state.configuringNewLibrary && (
            <LibraryForm
              initialValues={{ libraryTypeId: 'people' }}
              libraryTypes={[{ id: 'people', name: 'People' }]}
              onSubmit={this.handleCreateLibrary}
              onCancel={this.handleBackClick}
            />
          )}
          {this.state.selectingIdentifiers && (
            <IdentifierSelector
              identifiers={currentlyEditedFaces}
              classes={{ imageContainer: styles.imageContainer }}
              defaultSelectAll
              onConfirm={this.handleCreateIdentifiers}
              onCancel={this.handleBackClick}
              disableConfirm={isCreatingIdentifiers}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
