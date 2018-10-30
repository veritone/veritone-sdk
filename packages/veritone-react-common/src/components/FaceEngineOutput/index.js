import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import PizzaIcon from '@material-ui/icons/LocalPizza';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import {
  shape,
  number,
  string,
  bool,
  arrayOf,
  func,
  objectOf,
  oneOfType,
  node
} from 'prop-types';
import cx from 'classnames';
import { find, reduce, get, isArray, isObject, findIndex } from 'lodash';

import EngineOutputHeader from '../EngineOutputHeader';
import FaceGrid from './FaceGrid';
import FaceEntities from './FaceEntities';

import styles from './styles.scss';

class FaceEngineOutput extends Component {
  static propTypes = {
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        libraryId: string.isRequired,
        profileImageUrl: string,
        jsondata: objectOf(oneOfType([string, number]))
      })
    ).isRequired,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    selectedEngineId: string,
    onEngineChange: func,
    entitySearchResults: arrayOf(
      shape({
        name: string.isRequired,
        // libraryName: string.isRequired,
        library: shape({
          id: string,
          name: string.isRequired
        }),
        profileImageUrl: string
      })
    ),
    editMode: bool,
    outputNullState: node,
    currentMediaPlayerTime: number,
    onAddNewEntity: func,
    onAddToExistingEntity: func,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaces: func,
    onEditFaceDetection: func,
    onSearchForEntities: func,
    onExpandClick: func,
    recognizedFaces: objectOf(
      arrayOf(
        shape({
          startTimeMs: number.isRequired,
          stopTimeMs: number.isRequired,
          object: shape({
            label: string,
            uri: string,
            confidence: number,
            type: string,
            entityId: string.isRequired,
            libraryId: string.isRequired
          })
        })
      )
    ).isRequired,
    unrecognizedFaces: arrayOf(
      shape({
        startTimeMs: number.isRequired,
        stopTimeMs: number.isRequired,
        object: shape({
          label: string,
          uri: string
        })
      })
    ).isRequired,
    isSearchingEntities: bool,
    showingUserEditedOutput: bool,
    onToggleUserEditedOutput: func,
    moreMenuItems: arrayOf(node),
    showEditButton: bool,
    onEditButtonClick: func,
    disableEditButton: bool,
    onRestoreOriginalClick: func.isRequired,
    bulkEditActionItems: shape({
      faceDetection: arrayOf(
        shape({
          startTimeMs: number.isRequired,
          stopTimeMs: number.isRequired,
          object: shape({
            label: string,
            uri: string
          })
        })
      ),
      faceRecognition: arrayOf(
        shape({
          startTimeMs: number.isRequired,
          stopTimeMs: number.isRequired,
          object: shape({
            label: string,
            uri: string,
            confidence: number,
            type: string,
            entityId: string.isRequired,
            libraryId: string.isRequired
          })
        })
      )
    }),
    onSelectFaces: func,
    onUnselectFaces: func,
    activeTab: string,
    setActiveTab: func
  };

  state = {
    viewMode: 'summary',
    selectedEntityId: null,
    lastCheckedFace: null
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.editMode && state.viewMode !== 'summary') {
      return {
        viewMode: 'summary'
      };
    } else if (!nextProps.editMode) {
      return {
        bulkEditActionItems: {
          faceRecognition: [],
          faceDetection: []
        }
      };
    }
    return null;
  }

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.props.activeTab) {
      this.props.setActiveTab(activeTab);
    }
  };

  handleViewModeChange = evt => {
    this.setState({
      viewMode: evt.target.value,
      selectedEntityId: null
    });
  };

  handleUserEditChange = evt => {
    if (evt.target.value == 'restoreOriginal') {
      this.props.onRestoreOriginalClick();
      return;
    }
    this.props.onToggleUserEditedOutput &&
      this.props.onToggleUserEditedOutput(evt.target.value === 'userEdited');
  };

  handleSelectAllToggle = evt => {
    const { selectedEntityId } = this.state;
    const {
      recognizedFaces,
      activeTab,
      unrecognizedFaces,
      onUnselectFaces,
      onSelectFaces
    } = this.props;

    if (activeTab === 'faceDetection' && unrecognizedFaces.length) {
      if (!evt.target.checked) {
        onUnselectFaces(unrecognizedFaces);
        return;
      }

      onSelectFaces(unrecognizedFaces);
    } else if (activeTab === 'faceRecognition') {
      let selectedRecognizedFaces = [];
      if (selectedEntityId) {
        selectedRecognizedFaces = recognizedFaces[selectedEntityId];
      } else {
        selectedRecognizedFaces = reduce(
          Object.values(recognizedFaces),
          (acc, faces) => {
            return acc.concat(faces);
          },
          []
        );
      }
      if (selectedRecognizedFaces.length > 0) {
        if (!evt.target.checked) {
          onUnselectFaces(selectedRecognizedFaces);
          return;
        }

        onSelectFaces(selectedRecognizedFaces);
      }
    }
  };

  handleSelectFace = (face, evt) => {
    const { lastCheckedFace, selectedEntityId } = this.state;
    const { activeTab, unrecognizedFaces, recognizedFaces, onSelectFaces, onUnselectFaces } = this.props;
    if (evt.target.checked) {
      if (get(evt, 'nativeEvent.shiftKey') && lastCheckedFace) {
        let faces;
        if (activeTab === 'faceDetection') {
          faces = unrecognizedFaces;
        } else if (activeTab === 'faceRecognition') {
          if (selectedEntityId) {
            faces = recognizedFaces[selectedEntityId];
          }
        }
        const selectedIndex = findIndex(faces, {'guid': face.guid});
        const lastIndex = findIndex(faces,  {'guid': lastCheckedFace.guid});
        onSelectFaces(
          faces.slice(
            Math.min(selectedIndex, lastIndex),
            Math.max(selectedIndex, lastIndex) + 1
          )
        );
      } else {
        onSelectFaces([face]);
      }
      this.setState({
        lastCheckedFace: { ...face }
      });
    } else {
      onUnselectFaces([face]);
    }
  };

  handleRemoveFaces = faces => () => {
    if (isArray(faces)) {
      this.props.onRemoveFaces(faces);
    } else if (isObject(faces)) {
      this.props.onRemoveFaces([faces]);
    }
  };

  handleSelectEntity = entityId => {
    this.setState({
      selectedEntityId: entityId
    });
  };

  render() {
    const {
      editMode,
      onAddNewEntity,
      entitySearchResults,
      className,
      onFaceOccurrenceClicked,
      currentMediaPlayerTime,
      onEditFaceDetection,
      onSearchForEntities,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClick,
      outputNullState,
      showingUserEditedOutput,
      moreMenuItems,
      showEditButton,
      onEditButtonClick,
      disableEditButton,
      unrecognizedFaces,
      bulkEditActionItems,
      activeTab,
      onAddToExistingEntity
    } = this.props;

    const { viewMode, selectedEntityId } = this.state;
    const recognizedFaceCount = reduce(
      Object.values(this.props.recognizedFaces),
      (acc, faces) => {
        return acc + faces.length;
      },
      0
    );
    const selectedEngine = find(this.props.engines, { id: selectedEngineId });
    const faceTabs = (
      <Tabs
        value={activeTab}
        onChange={this.handleTabChange}
        indicatorColor="primary"
      >
        <Tab
          classes={{ root: styles.faceTab }}
          label={`Face Recognition (${recognizedFaceCount || 0})`}
          value="faceRecognition"
        />
        <Tab
          classes={{ root: styles.faceTab }}
          label={`Face Detection (${get(unrecognizedFaces, 'length', 0)})`}
          value="faceDetection"
        />
      </Tabs>
    );
    return (
      <div className={cx(styles.faceEngineOutput, className)}>
        <EngineOutputHeader
          title="Faces"
          hideTitle={editMode}
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
          moreMenuItems={moreMenuItems}
          showEditButton={showEditButton}
          onEditButtonClick={onEditButtonClick}
          disableEditButton={
            disableEditButton ||
            (recognizedFaceCount < 1 && get(unrecognizedFaces, 'length') < 1)
          }
          disableEngineSelect={!!editMode}
        >
          {editMode && (
            <div className={styles.faceTabHeaderContainer}>{faceTabs}</div>
          )}
          {!editMode &&
            selectedEngine &&
            selectedEngine.hasUserEdits && (
              <Select
                autoWidth
                value={showingUserEditedOutput ? 'userEdited' : 'original'}
                onChange={this.handleUserEditChange}
                className={styles.outputHeaderSelect}
                MenuProps={{
                  anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'bottom'
                  },
                  transformOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                  },
                  getContentAnchorEl: null
                }}
                // eslint-disable-next-line
                renderValue={() =>
                  showingUserEditedOutput
                    ? 'User-Edited'
                    : 'Original (View Only)'
                }
              >
                <MenuItem value="userEdited">
                  {showingUserEditedOutput && (
                    <ListItemIcon
                      classes={{ root: styles.userEditListItemIcon }}
                    >
                      <DoneIcon />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    classes={{
                      primary: cx(styles.selectMenuItem, {
                        [styles.menuItemInset]: !showingUserEditedOutput
                      })
                    }}
                    primary="User-Edited"
                  />
                </MenuItem>
                <MenuItem value="original">
                  {!showingUserEditedOutput && (
                    <ListItemIcon
                      classes={{ root: styles.userEditListItemIcon }}
                    >
                      <DoneIcon />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    classes={{
                      primary: cx(styles.selectMenuItem, {
                        [styles.menuItemInset]: showingUserEditedOutput
                      })
                    }}
                    primary="Original (View Only)"
                  />
                </MenuItem>
                <Divider light />
                <MenuItem value="restoreOriginal">
                  <ListItemText
                    classes={{
                      root: styles.restoreOriginalMenuItem,
                      primary: cx(styles.selectMenuItem, styles.menuItemInset)
                    }}
                    primary="Restore Original"
                  />
                </MenuItem>
              </Select>
            )}
          {!editMode && (
            <Select
              autoWidth
              value={viewMode}
              onChange={this.handleViewModeChange}
              className={cx(styles.outputHeaderSelect)}
              MenuProps={{
                anchorOrigin: {
                  horizontal: 'center',
                  vertical: 'bottom'
                },
                transformOrigin: {
                  horizontal: 'center',
                  vertical: 'top'
                },
                getContentAnchorEl: null
              }}
            >
              <MenuItem value="summary" className={cx(styles.selectMenuItem)}>
                Summary
              </MenuItem>
              <MenuItem value="byFrame" className={cx(styles.selectMenuItem)}>
                By Frame
              </MenuItem>
              <MenuItem value="byScene" className={cx(styles.selectMenuItem)}>
                By Scene
              </MenuItem>
            </Select>
          )}
        </EngineOutputHeader>
        {!editMode && faceTabs}
        {outputNullState}
        {editMode && (
          <div className={styles.multiEditActionBox}>
            <FormControlLabel
              checked={get(bulkEditActionItems, [activeTab, 'length']) > 0}
              control={
                <Checkbox
                  value="selectAll"
                  color="primary"
                  indeterminate={
                    !!get(bulkEditActionItems, [activeTab, 'length'])
                  }
                />
              }
              label={
                get(bulkEditActionItems, [activeTab, 'length']) > 0
                  ? `${get(bulkEditActionItems, [activeTab, 'length'])} ${
                      activeTab === 'faceDetection' ? 'Unknown' : 'Known'
                    } Face${
                      get(bulkEditActionItems, [activeTab, 'length']) > 1
                        ? 's'
                        : ''
                    } Selected`
                  : 'Select All'
              }
              onChange={this.handleSelectAllToggle}
              classes={{
                root: styles.selectAllFormControl,
                label: styles.selectAllLabel
              }}
            />
            {get(bulkEditActionItems, [activeTab, 'length']) > 0 && (
              <div className={styles.bulkFaceEditActions}>
                <Tooltip
                  title="Add to an Existing Entity"
                  placement="bottom-start"
                >
                  <IconButton
                    classes={{ root: styles.bulkFaceEditActionButton }}
                    // eslint-disable-next-line
                    onClick={() => {
                      onAddToExistingEntity(
                        get(bulkEditActionItems, [activeTab])
                      );
                    }}
                  >
                    <PizzaIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Create New Entity" placement="bottom-start">
                  <IconButton
                    classes={{ root: styles.bulkFaceEditActionButton }}
                    // eslint-disable-next-line
                    onClick={() => {
                      onAddNewEntity(get(bulkEditActionItems, [activeTab]));
                    }}
                  >
                    <CreateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    activeTab === 'faceRecognition'
                      ? `Remove Entit${
                          get(bulkEditActionItems, [activeTab, 'length']) > 1
                            ? 'ies'
                            : 'y'
                        }`
                      : `Delete Face Detection${
                          get(bulkEditActionItems, [activeTab, 'length']) > 1
                            ? 's'
                            : ''
                        }`
                  }
                  placement="bottom-start"
                >
                  <IconButton
                    classes={{ root: styles.bulkFaceEditActionButton }}
                    onClick={this.handleRemoveFaces(
                      get(bulkEditActionItems, [activeTab])
                    )}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        )}
        {!outputNullState &&
          activeTab === 'faceRecognition' && (
            <div
              className={cx(styles.faceTabBody, {
                [styles.editMode]: editMode
              })}
            >
              <FaceEntities
                editMode={editMode}
                viewMode={viewMode}
                faces={this.props.recognizedFaces}
                selectedFaces={get(bulkEditActionItems, activeTab, [])}
                entities={this.props.entities}
                onSelectEntity={this.handleSelectEntity}
                selectedEntityId={selectedEntityId}
                currentMediaPlayerTime={currentMediaPlayerTime}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
                onRemoveFaceRecognition={this.handleRemoveFaces}
                onFaceCheckboxClicked={this.handleSelectFace}
              />
            </div>
          )}
        {!outputNullState &&
          activeTab === 'faceDetection' && (
            <div
              className={cx(styles.faceTabBody, {
                [styles.editMode]: editMode
              })}
            >
              <FaceGrid
                faces={unrecognizedFaces}
                selectedFaces={get(bulkEditActionItems, activeTab, [])}
                editMode={editMode}
                viewMode={viewMode}
                onAddNewEntity={onAddNewEntity}
                entitySearchResults={entitySearchResults}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
                onRemoveFace={this.handleRemoveFaces}
                onEditFaceDetection={onEditFaceDetection}
                onSearchForEntities={onSearchForEntities}
                isSearchingEntities={this.props.isSearchingEntities}
                onFaceCheckboxClicked={this.handleSelectFace}
              />
            </div>
          )}
      </div>
    );
  }
}

export default FaceEngineOutput;
