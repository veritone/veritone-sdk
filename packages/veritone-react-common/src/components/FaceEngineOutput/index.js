import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { filter, groupBy, remove } from 'lodash';
import { shape, number, string, bool, arrayOf, func } from 'prop-types';
import classNames from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import FaceGrid from './FaceGrid';
import Chip from '../Chip';
import Avatar from '../Avatar';
import EntityInformation from './EntityInformation';

import noAvatar from 'images/no-avatar.png';

import styles from './styles.scss';

@withMuiThemeProvider
class FaceEngineOutput extends Component {
  static propTypes = {
    faces: arrayOf(shape({
      startTimeMs: number,
      endTimeMs: number,
      object: shape({
        label: string,
        uri: string
      })
    })),
    libraries: arrayOf(shape({
      id: string,
      name: string
    })),
    entitySearchResults: arrayOf(shape({
      entityName: string,
      libraryName: string,
      profileImageUrl: string
    })),
    enableEditMode: bool,
    mediaPlayerPosition: number,
    viewMode: string,
    onAddNewEntity: func,
    className: string,
    onFaceOccurrenceClicked: func
  };

  state = {
    activeTab: 'faceRecognition',
    selectedEntity: null
  };

  filterFaces = (faces, viewMode) => {
    let allFaces = faces.reduce((accumulator, faceSeries) => {
      if (faceSeries.series && faceSeries.series.length) {
        return [...accumulator, ...faceSeries.series];
      }
    }, []);

    if (viewMode === 'byFrame') {
      allFaces = allFaces.filter((face) => {
        return this.props.mediaPlayerPosition >= face.startTimeMs && this.props.mediaPlayerPosition <= face.endTimeMs;
      })
    }

    return {
      facesDetected: remove(allFaces, face => face.entityId === undefined || face.entityId.length === 0),
      facesRecognized: groupBy(filter(allFaces, face => face.entityId.length > 0), 'libraryId'),
    };
  }

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activetab) {
      this.setState({activeTab});
    }
  }

  getLibraryById = (id) => {
    return this.props.libraries.find((library) => library.id == id);
  }

  getEntity = (library, entityId) => {
    return library.entities.find(e => e.entityId === entityId);
  }

  handleEntityClick = (entity, library) => evt => {
    this.setState({
      selectedEntity: {
        ...entity,
        libraryInfo: library
      }
    });
  }

  drawEntityChips = (facesGroupedByEnity, library) => {
    return Object.keys(facesGroupedByEnity).map(entityId => {
      let entity = this.getEntity(library, entityId);
      return <Chip 
        onClick={this.handleEntityClick(entity, library)}
        key={'entity-' + entityId}
        label={
          <span>{entity.entityName} <a>({facesGroupedByEnity[entityId].length})</a></span>
        }
        classes={{
          root: styles.entityCountChip
        }}
        avatar={<Avatar src={entity.profileImageUrl || noAvatar} size={40}/>}
      />;
    })
  }

  drawLibraryEntityBoxes = (recognizedFaces) => {
    return Object.keys(recognizedFaces).map(libraryId => {
      let library = this.getLibraryById(libraryId);
      let facesGroupedByEnity = groupBy(recognizedFaces[libraryId], 'entityId');
      if (library) {
        return <div key={'library-' + library.id}>
          <div className={styles.libraryName}>
            <i className="icon-library-app"/>&nbsp;
            <span>Library: <strong>{library.name}</strong></span>
          </div>
          <div className={styles.entityCountContainer}>
            { this.drawEntityChips(facesGroupedByEnity, library) }
          </div>
        </div>
      }
      return null;
    })
  }

  removeSelectedEntity = () => {
    this.setState({
      selectedEntity: null
    });
  }

  render() {
    let { 
      faces, 
      enableEditMode, 
      viewMode, 
      onAddNewEntity, 
      entitySearchResults, 
      className,
      onFaceOccurrenceClicked
    } = this.props;

    let filteredFaces = this.filterFaces(faces, viewMode);

    return (
      <div className={classNames(styles.faceEngineOutput, className)}>
        <Tabs
          value={this.state.activeTab} 
          onChange={this.handleTabChange} 
          indicatorColor="primary"
        >
          <Tab label="Face Recognition" value="faceRecognition"/>
          <Tab label="Face Detection" value="faceDetection"/>
        </Tabs>
        { this.state.activeTab === 'faceRecognition' &&
            <div className={styles.faceTab}>
              { this.state.selectedEntity ?
                  <EntityInformation 
                    entity={this.state.selectedEntity} 
                    faces={filteredFaces.facesRecognized}
                    onBackClicked={this.removeSelectedEntity}
                    onOccurrenceClicked={onFaceOccurrenceClicked}
                  /> : Object.keys(filteredFaces.facesRecognized).length ?
                    this.drawLibraryEntityBoxes(filteredFaces.facesRecognized) :
                    <div>No Face Matches Found</div>
              }
            </div>
        }
        { this.state.activeTab === 'faceDetection' && 
            <div className={styles.faceTab}>
              <FaceGrid 
                faces={filteredFaces.facesDetected} 
                enableEditMode={enableEditMode}
                viewMode={viewMode}
                onAddNewEntity={onAddNewEntity}
                entitySearchResults={entitySearchResults}
                onFaceOccurrenceClicked={onFaceOccurrenceClicked}
              />
            </div>
        }
      </div>
    );
  }
}

export default FaceEngineOutput;