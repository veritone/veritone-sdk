import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
import { find, reduce, get } from 'lodash';

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
    onActiveTabChange: func,
    selectedEntityId: string,
    onSelectEntity: func,
    hasLibraryAccess: bool,
    viewMode: string,
    onViewModeChange: func
  };

  state = {
    lastCheckedFace: null
  };

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.props.activeTab) {
      this.props.onActiveTabChange(activeTab);
    }
  };

  handleViewModeChange = evt => {
    this.props.onViewModeChange(evt.target.value);
    this.props.onSelectEntity(null);
  };

  handleUserEditChange = evt => {
    if (evt.target.value == 'restoreOriginal') {
      this.props.onRestoreOriginalClick();
      return;
    }
    this.props.onToggleUserEditedOutput &&
      this.props.onToggleUserEditedOutput(evt.target.value === 'userEdited');
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
      bulkEditActionItems,
      activeTab,
      onSelectFaces,
      onUnselectFaces,
      onRemoveFaces,
      onAddToExistingEntity,
      selectedEntityId,
      onSelectEntity,
      hasLibraryAccess,
      viewMode,
      entities,
      isSearchingEntities
    } = this.props;
    let { unrecognizedFaces, recognizedFaces } = this.props;
    if (viewMode === 'byScene') {
      unrecognizedFaces = unrecognizedFaces.filter(face => {
        return (
          currentMediaPlayerTime >= face.startTimeMs &&
          currentMediaPlayerTime <= face.stopTimeMs
        );
      });
      recognizedFaces = Object.keys(recognizedFaces).reduce((acc, entityId) => {
        return {
          ...acc,
          [entityId]: recognizedFaces[entityId].filter(face => {
            return (
              currentMediaPlayerTime >= face.startTimeMs &&
              currentMediaPlayerTime <= face.stopTimeMs
            );
          })
        };
      }, {});
    }

    const recognizedFaceCount = reduce(
      Object.values(recognizedFaces),
      (acc, faces) => {
        return acc + faces.length;
      },
      0
    );
    const selectedEngine = find(engines, { id: selectedEngineId });
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
      <div 
        className={cx(styles.faceEngineOutput, className)}
        data-veritone-component="face-engine-output"                  
        >
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
            {activeTab === 'faceRecognition' && (
              <MenuItem value="byFrame" className={cx(styles.selectMenuItem)}>
                By Frame
              </MenuItem>
            )}
            <MenuItem value="byScene" className={cx(styles.selectMenuItem)}>
              By Scene
            </MenuItem>
          </Select>
        </EngineOutputHeader>
        {!editMode && faceTabs}
        {outputNullState}
        {!outputNullState &&
          activeTab === 'faceRecognition' && (
            <div
              className={cx(styles.faceTabBody, {
                [styles.editMode]: editMode
              })}
              data-veritone-component="face-engine-output-faceentities"          
            >
              <FaceEntities
                editMode={editMode}
                viewMode={viewMode}
                faces={recognizedFaces}
                selectedFaces={get(bulkEditActionItems, activeTab, [])}
                onSelectFaces={onSelectFaces}
                onUnselectFaces={onUnselectFaces}
                entities={entities}
                onSelectEntity={onSelectEntity}
                selectedEntityId={selectedEntityId}
                currentMediaPlayerTime={currentMediaPlayerTime}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
                onRemoveFaceRecognition={onRemoveFaces}
                onAddNewEntity={onAddNewEntity}
                onAddToExistingEntity={onAddToExistingEntity}
                hasLibraryAccess={hasLibraryAccess}
              />
            </div>
          )}
        {!outputNullState &&
          activeTab === 'faceDetection' && (
            <div
              className={cx(styles.faceTabBody, {
                [styles.editMode]: editMode
              })}
              data-veritone-component="face-engine-output-facegrid"
            >
              <FaceGrid
                faces={unrecognizedFaces}
                selectedFaces={get(bulkEditActionItems, activeTab, [])}
                editMode={editMode}
                onAddNewEntity={onAddNewEntity}
                entitySearchResults={entitySearchResults}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
                onRemoveFaces={onRemoveFaces}
                onEditFaceDetection={onEditFaceDetection}
                onSearchForEntities={onSearchForEntities}
                isSearchingEntities={isSearchingEntities}
                onSelectFaces={onSelectFaces}
                onUnselectFaces={onUnselectFaces}
                onAddToExistingEntity={onAddToExistingEntity}
                disableLibraryButtons={!hasLibraryAccess}
              />
            </div>
          )}
      </div>
    );
  }
}

export default FaceEngineOutput;
