import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { filter } from 'lodash';
import { shape, number, string, bool, arrayOf, func } from 'prop-types';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import FaceGrid from './FaceGrid';

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
    enableEditMode: bool,
    mediaPlayerPosition: number,
    viewMode: string,
    onAddNewEntity: func
  };

  state = {
    activeTab: 'faceRecognition'
  };

  handleTabChange = (event, activeTab) => {
    this.setState({ activeTab });
  }

  render() {
    let { faces, enableEditMode, viewMode, onAddNewEntity } = this.props;
    let facesRecognized = filter(faces, face => face.entityId.length > 0);
    let facesDetected = filter(faces, face => face.entityId === undefined || face.entityId.length === 0);
    console.log(facesDetected, facesRecognized);
    return (
      <div>
        <Tabs 
          value={this.state.activeTab} 
          onChange={this.handleTabChange} 
          indicatorColor="primary"
        >
          <Tab label="Face Recognition" value="faceRecognition"/>
          <Tab label="Face Detection" value="faceDetection"/>
        </Tabs>
        { this.state.activeTab === 'faceRecognition' && 
            <div>Here is the face recognition screen</div>
        }
        { this.state.activeTab === 'faceDetection' && 
            <FaceGrid 
              faces={facesDetected} 
              enableEditMode={enableEditMode}
              viewMode={viewMode}
              onAddNewEntity={onAddNewEntity}
            />
        }
      </div>
    );
  }
}

export default FaceEngineOutput;