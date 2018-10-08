import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
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
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
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
    this.props.onToggleUserEditedOutput &&
      this.props.onToggleUserEditedOutput(evt.target.value === 'userEdited');
  };

  handleSelectAllToggle = activeTab => evt => {
    if(!evt.target.checked) {
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
      })
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
      onRemoveFaceDetection,
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
      disableEditButton
    } = this.props;
    const { viewMode, bulkEditActionItems } = this.state;
    const recognizedFaceCount = reduce(Object.values(this.props.recognizedFaces), (acc, faces) => {
      return acc + faces.length;
    }, 0);
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
          disableEditButton={disableEditButton || this.state.activeTab === 'faceRecognition'}
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
                renderValue={() => showingUserEditedOutput ? 'User-Edited' : 'Original (View Only)'}
              >
                <MenuItem
                  value="userEdited"
                >
                  {showingUserEditedOutput && <ListItemIcon classes={{root: styles.userEditListItemIcon}}><DoneIcon /></ListItemIcon>}
                  <ListItemText classes={{primary: cx(styles.selectMenuItem, {
                      [styles.menuItemInset]: !showingUserEditedOutput
                    })}} primary="User-Edited" />
                </MenuItem>
                <MenuItem
                  value="original"
                >
                  {!showingUserEditedOutput && <ListItemIcon classes={{root: styles.userEditListItemIcon}}><DoneIcon /></ListItemIcon>}
                  <ListItemText classes={{primary: cx(styles.selectMenuItem, {
                      [styles.menuItemInset]: showingUserEditedOutput
                    })}} primary="Original (View Only)" />
                </MenuItem>
                <Divider light />
                <MenuItem
                  value="restoreOriginal"
                >
                  <ListItemText classes={{root: styles.restoreOriginalMenuItem, primary: cx(styles.selectMenuItem, styles.menuItemInset)}} primary="Restore Original" />
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
          value={this.state.activeTab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
        >
          <Tab
            classes={{ root: styles.faceTab }}
            label={`Face Recognition (${recognizedFaceCount})`}
            value="faceRecognition"
          />
          <Tab
            classes={{ root: styles.faceTab }}
            label={`Face Detection (${this.props.unrecognizedFaces.length})`}
            value="faceDetection"
          />
        </Tabs>
        {outputNullState}
        {editMode && <div className={styles.multiEditActionBox}>
          <FormControlLabel
            checked={get(bulkEditActionItems, [this.state.activeTab, 'length']) > 0}
            control={
              <Checkbox
                value="selectAll"
                color="primary"
              />
            }
            label="Select All"
            onChange={this.handleSelectAllToggle(this.state.activeTab)}
            classes={{root: styles.selectAllFormControl, label: styles.selectAllLabel}}
          />
        </div>}
        {!outputNullState &&
          this.state.activeTab === 'faceRecognition' && (
            <div className={cx(styles.faceTabBody, {[styles.editMode]: editMode})}>
              <FaceEntities
                viewMode={viewMode}
                faces={this.props.recognizedFaces}
                entities={this.props.entities}
                currentMediaPlayerTime={currentMediaPlayerTime}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
              />
            </div>
          )}
        {!outputNullState &&
          this.state.activeTab === 'faceDetection' && (
            <div className={cx(styles.faceTabBody, {[styles.editMode]: editMode})}>
              <FaceGrid
                faces={this.props.unrecognizedFaces}
                selectedFaces={get(bulkEditActionItems, 'faceDetection', [])}
                editMode={editMode}
                viewMode={viewMode}
                onAddNewEntity={onAddNewEntity}
                entitySearchResults={entitySearchResults}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
                onRemoveFaceDetection={onRemoveFaceDetection}
                onEditFaceDetection={onEditFaceDetection}
                onSearchForEntities={onSearchForEntities}
                isSearchingEntities={this.props.isSearchingEntities}
              />
            </div>
          )}
      </div>
    );
  }
}

export default FaceEngineOutput;
