import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
import { pick, find, get, findIndex, isArray, isObject } from 'lodash';
import Grid from '@material-ui/core/Grid';
import NoFacesFound from '../NoFacesFound';
import FaceInfoBox from '../FaceInfoBox';
import MultiEditActionBar from './MultiEditActionBar';
import styles from './styles.scss';

class FaceGrid extends Component {
  static propTypes = {
    faces: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          label: string,
          originalImage: string
        })
      })
    ),
    selectedFaces: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        object: shape({
          label: string,
          originalImage: string
        })
      })
    ),
    entitySearchResults: arrayOf(
      shape({
        entityName: string,
        libraryName: string,
        profileImageUrl: string
      })
    ),
    editMode: bool,
    hasRecognizedItems: bool,
    onAddNewEntity: func,
    onEditFaceDetection: func,
    onFaceOccurrenceClicked: func,
    onRemoveFaces: func,
    onSearchForEntities: func,
    isSearchingEntities: bool,
    hideEntityLabels: bool,
    onSelectFaces: func,
    onUnselectFaces: func,
    onAddToExistingEntity: func,
    disableLibraryButtons: bool
  };

  state = {
    lastCheckedFace: null
  };

  // evt is mandatory here to avoid infinite call loop
  handleFaceClick = face => evt => {
    if (this.props.onFaceOccurrenceClicked) {
      this.props.onFaceOccurrenceClicked(face.startTimeMs, face.stopTimeMs);
    }
  };

  handleAddNewEntity = (face, inputValue) => {
    this.props.onAddNewEntity([face], inputValue);
  };

  handleSelectAll = evt => {
    const { faces, onUnselectFaces, onSelectFaces } = this.props;
    if (evt.target.checked) {
      onSelectFaces(faces);
    } else {
      onUnselectFaces(faces);
    }
  };

  handleAllToNewEntity = () => {
    const { selectedFaces } = this.props;
    this.props.onAddNewEntity(selectedFaces);
  };

  handleAddAllToExistingEntity = () => {
    const { selectedFaces } = this.props;
    this.props.onAddToExistingEntity(selectedFaces);
  };

  handleSingleFaceSelect = (face, evt) => {
    const { faces, onUnselectFaces, onSelectFaces } = this.props;
    const { lastCheckedFace } = this.state;
    if (evt.target.checked) {
      if (get(evt, 'nativeEvent.shiftKey') && lastCheckedFace) {
        const selectedIndex = findIndex(faces, { guid: face.guid });
        const lastIndex = findIndex(faces, { guid: lastCheckedFace.guid });
        onSelectFaces(
          faces.slice(
            Math.min(selectedIndex, lastIndex),
            Math.max(selectedIndex, lastIndex) + 1
          )
        );
      } else {
        onSelectFaces([face]);
      }
    } else {
      onUnselectFaces([face]);
    }
    this.setState({
      lastCheckedFace: { ...face }
    });
  };

  handleRemoveFaces = faces => () => {
    if (isArray(faces)) {
      this.props.onRemoveFaces(faces);
    } else if (isObject(faces)) {
      this.props.onRemoveFaces([faces]);
    }
  };

  render() {
    const {
      faces,
      selectedFaces,
      hideEntityLabels,
      editMode,
      entitySearchResults,
      hasRecognizedItems,
      disableLibraryButtons
    } = this.props;
    const detectionBoxProps = pick(this.props, [
      'onEditFaceDetection',
      'onSearchForEntities',
      'isSearchingEntities'
    ]);

    return (
      <Grid item container direction="column" className={styles.faceGrid}>
        {!faces.length ? (
          <Grid item>
            <NoFacesFound />
          </Grid>
        ) : (
          <Fragment>
            {editMode && (
              <Grid item>
                <MultiEditActionBar
                  selectedItemsCount={selectedFaces.length}
                  itemType="Face"
                  hasRecognizedItems={hasRecognizedItems}
                  onSelectAllChange={this.handleSelectAll}
                  onAddToExistingEntityClick={this.handleAddAllToExistingEntity}
                  onAddNewEntityClick={this.handleAllToNewEntity}
                  onDeleteItemClick={this.handleRemoveFaces(selectedFaces)}
                  disableLibraryButtons={disableLibraryButtons}
                />
              </Grid>
            )}
            <Grid
              item
              xs
              container
              direction="row"
              className={styles.imageList}
            >
              {faces.map(face => {
                const selectedFace = find(selectedFaces, { guid: face.guid });
                return (
                  <FaceInfoBox
                    key={`face-${face.guid}-${face.startTimeMs}-${
                      face.stopTimeMs
                    }-${face.object.uri}`}
                    isSelected={!!selectedFace}
                    onCheckboxClicked={this.handleSingleFaceSelect}
                    face={face}
                    enableEdit={editMode}
                    addNewEntity={this.handleAddNewEntity}
                    searchResults={entitySearchResults}
                    onClick={this.handleFaceClick(face)}
                    hideEntityLabel={hideEntityLabels}
                    onRemoveFace={this.handleRemoveFaces(face)}
                    {...detectionBoxProps}
                  />
                );
              })}
            </Grid>
          </Fragment>
        )}
      </Grid>
    );
  }
}

export default FaceGrid;
