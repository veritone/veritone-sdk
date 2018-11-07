import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';
import { pick, find, get, findIndex, isArray, isObject } from 'lodash';
import Grid from '@material-ui/core/Grid';
import { AutoSizer, Grid as VirtualizedGrid } from 'react-virtualized';
import NoFacesFound from '../NoFacesFound';
import FaceInfoBox from '../FaceInfoBox';
import MultiEditActionBar from './MultiEditActionBar';
import styles from './styles.scss';

class FaceGrid extends Component {
  static propTypes = {
    faces: arrayOf(
      shape({
        startTimeMs: number,
        endTimeMs: number,
        object: shape({
          label: string,
          originalImage: string
        })
      })
    ),
    selectedFaces: arrayOf(
      shape({
        startTimeMs: number,
        endTimeMs: number,
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
    itemsRecognized: bool,
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
    disableLibraryButtons: bool,
    columnWidth: number
  };

  static defaultProps = {
    columnWidth: 100
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

  renderCell = columnCount => ({
    columnIndex,
    isScrolling,
    isVisible,
    key,
    parent,
    rowIndex,
    style
  }) => {
    const {
      faces,
      selectedFaces,
      hideEntityLabels,
      editMode,
      entitySearchResults,
      columnWidth
    } = this.props;
    const detectionBoxProps = pick(this.props, [
      'onEditFaceDetection',
      'onSearchForEntities',
      'isSearchingEntities'
    ]);
    const face = faces[rowIndex * columnCount + columnIndex];
    if (!face) {
      return null;
    }
    const selectedFace = find(selectedFaces, { guid: face.guid });
    return (
      <div style={style} key={key}>
        <FaceInfoBox
          isSelected={!!selectedFace}
          onCheckboxClicked={this.handleSingleFaceSelect}
          face={face}
          enableEdit={editMode}
          addNewEntity={this.handleAddNewEntity}
          searchResults={entitySearchResults}
          onClick={this.handleFaceClick(face)}
          hideEntityLabel={hideEntityLabels}
          onRemoveFace={this.handleRemoveFaces(face)}
          width={columnWidth}
          {...detectionBoxProps}
        />
      </div>
    );
  };

  render() {
    const {
      faces,
      selectedFaces,
      editMode,
      itemsRecognized,
      disableLibraryButtons,
      hideEntityLabels,
      columnWidth
    } = this.props;

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
                  itemsRecognized={itemsRecognized}
                  onSelectAllChange={this.handleSelectAll}
                  onAddToExistingEntityClick={this.handleAddAllToExistingEntity}
                  onAddNewEntityClick={this.handleAllToNewEntity}
                  onDeleteItemClick={this.handleRemoveFaces(selectedFaces)}
                  disableLibraryButtons={disableLibraryButtons}
                />
              </Grid>
            )}
            <div style={{ flex: '1 1 auto' }}>
              <AutoSizer>
                {({ width, height }) => {
                  const columnCount = Math.floor(width / columnWidth);
                  return (
                    <VirtualizedGrid
                      cellRenderer={this.renderCell(columnCount)}
                      width={width}
                      height={height}
                      columnCount={columnCount}
                      columnWidth={columnWidth}
                      rowCount={Math.ceil(faces.length / columnCount)}
                      rowHeight={
                        hideEntityLabels ? columnWidth + 22 : columnWidth + 42
                      }
                      overscanRowCount={3}
                      style={{
                        overflowX: 'hidden'
                      }}
                    />
                  );
                }}
              </AutoSizer>
            </div>
          </Fragment>
        )}
      </Grid>
    );
  }
}

export default FaceGrid;
