import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import EngineOutputHeader from '../EngineOutputHeader';
import FaceGrid from './FaceGrid';
import FaceEntities from './FaceEntities';

import styles from './styles.scss';

@withMuiThemeProvider
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
      arrayOf(shape({
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
      }))
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
    isSearchingEntities: bool
  };

  state = {
    activeTab: 'faceRecognition',
    viewMode: 'summary'
  };

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
      outputNullState
    } = this.props;
    const { viewMode } = this.state;

    return (
      <div className={cx(styles.faceEngineOutput, className)}>
        <EngineOutputHeader
          title="Faces"
          engines={engines}
          selectedEngineId={selectedEngineId}
          onEngineChange={onEngineChange}
          onExpandClick={onExpandClick}
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
            <MenuItem value="byFrame" className={cx(styles.view)}>
              By Frame
            </MenuItem>
            <MenuItem value="byScene" className={cx(styles.view)}>
              By Scene
            </MenuItem>
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
        {outputNullState}
        {!outputNullState &&
          this.state.activeTab === 'faceRecognition' && (
            <div className={styles.faceTabBody}>
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
                isSearchingEntities={this.props.isSearchingEntities}
              />
            </div>
          )}
      </div>
    );
  }
}

export default FaceEngineOutput;
