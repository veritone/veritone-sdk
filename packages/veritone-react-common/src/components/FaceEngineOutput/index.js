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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
import { find, reduce, get, findIndex, isArray, isObject } from 'lodash';

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
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetections: func,
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
    onRestoreOriginalClick: func.isRequired
  };

  state = {
    activeTab: 'faceRecognition',
    viewMode: 'summary',
    bulkEditActionItems: {
      faceRecognition: [],
      faceDetection: []
    }
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
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };

  handleViewModeChange = evt => {
    this.setState({
      viewMode: evt.target.value
    });
  };

  handleUserEditChange = evt => {
    if (evt.target.value == 'restoreOriginal') {
      this.props.onRestoreOriginalClick();
      return;
    }
    this.setState(
      {
        bulkEditActionItems: {
          faceRecognition: [],
          faceDetection: []
        }
      },
      () => {
        this.props.onToggleUserEditedOutput &&
          this.props.onToggleUserEditedOutput(
            evt.target.value === 'userEdited'
          );
      }
    );
  };

  handleSelectAllToggle = activeTab => evt => {
    if (!evt.target.checked) {
      this.setState({
        bulkEditActionItems: {
          [activeTab]: []
        }
      });
      return;
    }

    if (activeTab === 'faceDetection' && this.props.unrecognizedFaces.length) {
      this.setState({
        bulkEditActionItems: {
          [activeTab]: [...this.props.unrecognizedFaces]
        }
      });
    }
  };

  handleSelectFace = (face, checked) => {
    if (checked) {
      this.setState(prevState => ({
        bulkEditActionItems: {
          [prevState.activeTab]: [
            ...prevState.bulkEditActionItems[prevState.activeTab],
            face
          ]
        }
      }));
    } else {
      this.setState(prevState => {
        const faceIndex = findIndex(
          get(prevState.bulkEditActionItems, [prevState.activeTab]),
          { guid: face.guid }
        );
        if (faceIndex === -1) {
          return null;
        }
        return {
          bulkEditActionItems: {
            [prevState.activeTab]: [
              ...prevState.bulkEditActionItems[prevState.activeTab].slice(
                0,
                faceIndex
              ),
              ...prevState.bulkEditActionItems[prevState.activeTab].slice(
                faceIndex + 1
              )
            ]
          }
        };
      });
    }
  };

  handleRemoveFaceDetections = faces => evt => {
    if (isArray(faces)) {
      this.props.onRemoveFaceDetections(faces);
      this.setState(prevState => ({
        bulkEditActionItems: {
          ...prevState.bulkEditActionItems,
          [prevState.activeTab]: prevState.bulkEditActionItems[
            prevState.activeTab
          ].filter(actionItem => {
            return !find(faces, { guid: actionItem.guid });
          })
        }
      }));
    } else if (isObject(faces)) {
      this.props.onRemoveFaceDetections([faces]);
      this.setState(prevState => ({
        bulkEditActionItems: {
          ...prevState.bulkEditActionItems,
          [prevState.activeTab]: prevState.bulkEditActionItems[
            prevState.activeTab
          ].filter(actionItem => {
            return faces.guid !== actionItem.guid;
          })
        }
      }));
    }
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
      unrecognizedFaces
    } = this.props;
    const { viewMode, bulkEditActionItems, activeTab } = this.state;
    const recognizedFaceCount = reduce(
      Object.values(this.props.recognizedFaces),
      (acc, faces) => {
        return acc + faces.length;
      },
      0
    );
    const selectedEngine = find(this.props.engines, { id: selectedEngineId });
    return (
      <div className={cx(styles.faceEngineOutput, className)}>
        <EngineOutputHeader
          title="Faces"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
          moreMenuItems={moreMenuItems}
          showEditButton={showEditButton}
          onEditButtonClick={onEditButtonClick}
          disableEditButton={
            disableEditButton ||
            this.state.activeTab === 'faceRecognition' ||
            get(unrecognizedFaces, 'length') < 1
          }
          disableEngineSelect={!!editMode}
        >
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
                    } Faces Selected`
                  : 'Select All'
              }
              onChange={this.handleSelectAllToggle(activeTab)}
              classes={{
                root: styles.selectAllFormControl,
                label: styles.selectAllLabel
              }}
            />
            {get(bulkEditActionItems, [activeTab, 'length']) > 0 && (
              <div className={styles.bulkFaceEditActions}>
                <IconButton classes={{ root: styles.bulkFaceEditActionButton }}>
                  <CreateIcon />
                </IconButton>
                <IconButton
                  classes={{ root: styles.bulkFaceEditActionButton }}
                  onClick={this.handleRemoveFaceDetections(
                    get(bulkEditActionItems, [activeTab])
                  )}
                >
                  <DeleteIcon />
                </IconButton>
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
                entities={this.props.entities}
                currentMediaPlayerTime={currentMediaPlayerTime}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
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
                selectedFaces={get(bulkEditActionItems, 'faceDetection', [])}
                editMode={editMode}
                viewMode={viewMode}
                onAddNewEntity={onAddNewEntity}
                entitySearchResults={entitySearchResults}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
                onRemoveFaceDetection={this.handleRemoveFaceDetections}
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
