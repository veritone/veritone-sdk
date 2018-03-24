import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { filter, groupBy, remove } from 'lodash';
import { shape, number, string, bool, arrayOf, func } from 'prop-types';
import classNames from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import FaceGrid from './FaceGrid';
import Chip from '../Chip';
import Avatar from '../Avatar';

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
    className: string
  };

  state = {
    activeTab: 'faceRecognition'
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
    this.setState({ activeTab });
  }

  getLibraryById = (id) => {
    return this.props.libraries.find((library) => library.id == id);
  }

  getEntity = (library, entityId) => {
    return library.entities.find(e => e.entityId === entityId);
  }

  render() {
    let { 
      faces, 
      enableEditMode, 
      viewMode, 
      onAddNewEntity, 
      entitySearchResults, 
      className 
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
            Object.keys(filteredFaces.facesRecognized).map(libraryId => {
              let library = this.getLibraryById(libraryId);
              let facesGroupedByEnity = groupBy(filteredFaces.facesRecognized[libraryId], 'entityId');
              if (library) {
                return <div key={'library-' + library.id}>
                  <div className={styles.libraryName}>
                    <i className="icon-library-app"/>&nbsp;
                    <span>Library: <strong>{library.name}</strong></span>
                  </div>
                  <div className={styles.entityCountContainer}>
                    { Object.keys(facesGroupedByEnity).map(entityId => {
                        let entity = this.getEntity(library, entityId);
                        return <Chip 
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
                  </div>
                </div>
              }
              return null;
            })
        }
        { this.state.activeTab === 'faceDetection' && 
            <FaceGrid 
              faces={filteredFaces.facesDetected} 
              enableEditMode={enableEditMode}
              viewMode={viewMode}
              onAddNewEntity={onAddNewEntity}
              entitySearchResults={entitySearchResults}
            />
        }
      </div>
    );
  }
}

export default FaceEngineOutput;