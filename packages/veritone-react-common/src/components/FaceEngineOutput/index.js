import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { find, isObject, isEmpty, get } from 'lodash';
import {
  shape,
  number,
  string,
  bool,
  arrayOf,
  func,
  objectOf,
  oneOfType
} from 'prop-types';
import cx from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import EngineOutputHeader from '../EngineOutputHeader';
import FaceGrid from './FaceGrid';
import EntityInformation from './EntityInformation';
import FacesByScene from './FacesByScene';
import FacesByFrame from './FacesByFrame';
import FacesByLibrary from './FacesByLibrary';

import styles from './styles.scss';

@withMuiThemeProvider
class FaceEngineOutput extends Component {
  static propTypes = {
    // data: arrayOf(
    //   shape({
    //     series: arrayOf(
    //       shape({
    //         startTimeMs: number.isRequired,
    //         stopTimeMs: number.isRequired,
    //         object: shape({
    //           label: string,
    //           uri: string
    //         })
    //       })
    //     )
    //   })
    // ).isRequired,
    // libraries: arrayOf(
    //   shape({
    //     id: string,
    //     name: string
    //   })
    // ).isRequired,
    // entities: arrayOf(
    //   shape({
    //     id: string.isRequired,
    //     name: string.isRequired,
    //     libraryId: string.isRequired,
    //     profileImageUrl: string,
    //     jsondata: objectOf(oneOfType([string, number]))
    //   })
    // ).isRequired,
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
    currentMediaPlayerTime: number,
    onAddNewEntity: func,
    className: string,
    onFaceOccurrenceClicked: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onSearchForEntities: func,
    onExpandClicked: func
  };

  state = {
    activeTab: 'faceRecognition',
    detectedFaces: [],
    recognizedEntityObjects: [],
    recognizedEntityObjectMap: {},
    framesBySeconds: {},
    selectedEntity: null,
    viewMode: 'summary'
  };

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activeTab) {
      this.setState({ activeTab });
    }
  };

  getLibraryById = id => {
    return this.props.libraries.find(library => library.id == id);
  };

  getEntityById = (library, entityId) => {
    return library.entities.find(e => e.entityId === entityId);
  };

  handleEntitySelect = entityId => evt => {
    // if (this.state.recognizedEntityObjectMap[entityId]) {
    if (this.props.recognizedFaces[entityId]) {
      console.log('face:', this.props.recognizedFaces[entityId])
      this.setState(prevState => ({
        selectedEntity: {
          // ...prevState.recognizedEntityObjectMap[entityId]
          ...this.props.recognizedFaces[entityId]
        }
      }));
    }
  };

  handleViewModeChange = evt => {
    this.setState({
      viewMode: evt.target.value,
      selectedEntity: null
    });
  };

  removeSelectedEntity = () => {
    this.setState({
      selectedEntity: null
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
      onRemoveFaceDetection,
      onEditFaceDetection,
      onSearchForEntities,
      engines,
      selectedEngineId,
      onEngineChange,
      onExpandClicked
    } = this.props;
    const { viewMode } = this.state;

    return (
      <div className={cx(styles.faceEngineOutput, className)}>
        <EngineOutputHeader
          title="Faces"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClicked={onExpandClicked}
        >
          <Select
            autoWidth
            value={viewMode}
            onChange={this.handleViewModeChange}
            className={cx(styles.displayOptions)}
            MenuProps={{
              anchorOrigin: {
                horizontal: 'center',
                vertical: 'bottom'
              },
              transformOrigin: {
                horizontal: 'center'
              },
              getContentAnchorEl: null
            }}
          >
            <MenuItem value="summary" className={cx(styles.view)}>
              Summary
            </MenuItem>
            <MenuItem value="byFrame">By Frame</MenuItem>
            <MenuItem value="byScene">By Scene</MenuItem>
          </Select>
        </EngineOutputHeader>
        <Tabs
          value={this.state.activeTab}
          onChange={this.handleTabChange}
          indicatorColor="primary"
        >
          <Tab
            classes={{ root: styles.faceTab }}
            label="Face Recognition"
            value="faceRecognition"
          />
          <Tab
            classes={{ root: styles.faceTab }}
            label="Face Detection"
            value="faceDetection"
          />
        </Tabs>
        {this.state.activeTab === 'faceRecognition' && (
          <div className={styles.faceTabBody}>
            {this.state.selectedEntity
              ?
              <EntityInformation
                entity={this.state.selectedEntity.entity}
                count={this.state.selectedEntity.count}
                timeSlots={this.state.selectedEntity.timeSlots}
                onBackClicked={this.removeSelectedEntity}
                onOccurrenceClicked={onFaceOccurrenceClicked}
              />
              : <FaceEntitiesView
                viewMode={viewMode}
                entitiesByLibrary={this.props.entitiesByLibrary}
                recognizedEntityObjectMap={this.props.recognizedFaces}
                currentMediaPlayerTime={currentMediaPlayerTime}
                framesBySeconds={this.props.framesBySeconds}
                onSelectEntity={this.handleEntitySelect}
              />
            }
          </div>
        )}
        {this.state.activeTab === 'faceDetection' && (
          <div className={styles.faceTabBody}>
            <FaceGrid
              faces={this.props.unrecognizedFaces}
              editMode={editMode}
              viewMode={viewMode}
              onAddNewEntity={onAddNewEntity}
              entitySearchResults={entitySearchResults}
              onFaceOccurrenceClicked={onFaceOccurrenceClicked}
              onRemoveFaceDetection={onRemoveFaceDetection}
              onEditFaceDetection={onEditFaceDetection}
              onSearchForEntities={onSearchForEntities}
            />
          </div>
        )}
      </div>
    );
  }
}

export const FaceEntitiesView = ({
  viewMode,
  entitiesByLibrary,
  currentMediaPlayerTime,
  recognizedEntityObjectMap,
  framesBySeconds,
  onSelectEntity
}) => {
  if (viewMode === 'summary') {
    return (
      <FacesByLibrary
        faceEntityLibraries={entitiesByLibrary}
        onSelectEntity={onSelectEntity}
      />
    )
  } else if (viewMode === 'byFrame') {
    return (
      <FacesByFrame
        currentMediaPlayerTime={currentMediaPlayerTime}
        recognizedEntityObjectMap={recognizedEntityObjectMap}
        framesBySeconds={framesBySeconds}
        onSelectEntity={onSelectEntity}
      />
    )
  } else if (viewMode === 'byScene') {
    return (
      <FacesByScene
        currentMediaPlayerTime={currentMediaPlayerTime}
        recognizedEntityObjects={Object.values(recognizedEntityObjectMap)}
        onSelectEntity={onSelectEntity}
      />
    );
  }

  return;
};

export default FaceEngineOutput;
