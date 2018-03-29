import React, { Component } from 'react';
import { shape, number, string, arrayOf, bool, func } from 'prop-types';
import classNames from 'classnames';
import Downshift from 'downshift';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Avatar from 'material-ui/Avatar';

import { msToReadableString } from 'helpers/time';
import noAvatar from 'images/no-avatar.png';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
class FaceDetectionBox extends Component {
  static propTypes = {
    face: shape({
      startTimeMs: number,
      endTimeMs: number,
      object: shape({
        label: string,
        uri: string
      })
    }),
    searchResults: arrayOf(
      shape({
        entityName: string,
        libraryName: string,
        profileImageUrl: string
      })
    ),
    enableEdit: bool,
    onUpdateEntity: func,
    addNewEntity: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onClick: func,
    onSearchForEntities: func
  };

  state = {
    editFaceEntity: false,
    hovered: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.enableEdit === false) {
      this.setState({ editFaceEntity: false });
    }
  }

  handleMouseOver = () => {
    this.setState({ hovered: true });
  };

  handleMouseOut = () => {
    this.setState({ hovered: false });
  };

  makeEditable = () => {
    this.setState({ editFaceEntity: true });
  };

  handleAddNewEntity = entity => evt => {
    this.props.addNewEntity(this.props.face, entity);
  };

  handleEntitySelect = entity => {
    this.props.onEditFaceDetection(this.props.face, entity);
  };

  handleDeleteFaceDetection = face => {
    this.props.onRemoveFaceDetection(this.props.face);
  };

  inputRef = c => {
    this._input = c;
  };

  /*TODO: come back to this and fix it*/
  calculatePositionAndHeight = () => {
    let distanceFromBottom =
      document.body.clientHeight - this._input.getBoundingClientRect().bottom;
    let distanceFromTop = this._input.getBoundingClientRect().top;
    let autocompleteMenuStyle = {
      maxHeight: '350px'
    };

    if (distanceFromBottom > 150) {
      autocompleteMenuStyle.maxHeight =
        distanceFromBottom > 350 ? '350px' : distanceFromBottom;
    } else if (distanceFromTop > distanceFromBottom && distanceFromTop > 150) {
      autocompleteMenuStyle.maxHeight =
        distanceFromTop > 350 ? '350px' : distanceFromBottom;
      autocompleteMenuStyle.bottom =
        document.body.clientHeight - distanceFromTop;
    }
    return autocompleteMenuStyle;
  };

  itemToString = item => item && item.entityName;

  render() {
    let {
      face,
      searchResults,
      enableEdit,
      onClick,
      onSearchForEntities
    } = this.props;

    return (
      <div
        className={classNames(
          styles.faceContainer,
          this.state.hovered && styles.faceContainerHover
        )}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseOut}
        onClick={onClick}
      >
        <div className={styles.entityImageContainer}>
          <img className={styles.entityImage} src={face.object.uri} />
          {enableEdit &&
            this.state.hovered && (
              <div className={styles.imageButtonOverlay}>
                <div
                  className={styles.faceActionIcon}
                  onClick={this.makeEditable}
                >
                  <i className="icon-mode_edit2" />
                </div>
                <div
                  className={styles.faceActionIcon}
                  onClick={this.handleDeleteFaceDetection}
                >
                  <i className="icon-trashcan" />
                </div>
              </div>
            )}
        </div>
        <div className={styles.faceInformation}>
          <span className={styles.faceTimeOccurrence}>
            {msToReadableString(face.startTimeMs)} -{' '}
            {msToReadableString(face.stopTimeMs)}
          </span>
          {this.state.editFaceEntity ? (
            <Downshift
              inputValue={styles.entityName}
              itemToString={this.itemToString}
              onSelect={this.handleEntitySelect}
              onInputValueChange={onSearchForEntities}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                selectedItem,
                highlightedIndex
              }) => (
                <div>
                  <TextField
                    inputProps={{
                      className: styles.entitySearchInput,
                      ref: this.inputRef
                    }}
                    {...getInputProps({
                      value: face.entityName,
                      placeholder: 'Unkown',
                      autoFocus: true
                    })}
                  />
                  {isOpen ? (
                    <Paper className={styles.autoCompleteDropdown} square>
                      <div className={styles.searchResultsList}>
                        {searchResults && searchResults.length ? (
                          searchResults.map((result, index) => (
                            <MenuItem
                              key={'menu_entity_' + index}
                              component="div"
                              {...getItemProps({
                                item: result,
                                index: index,
                                selected: highlightedIndex === index
                              })}
                            >
                              {result.profileImageUrl ? (
                                <Avatar
                                  src={
                                    result.profileImageUrl
                                      ? result.profileImageUrl
                                      : noAvatar
                                  }
                                />
                              ) : null}
                              <div className={styles.entityInfo}>
                                <div className={styles.menuEntityName}>
                                  {result.entityName}
                                </div>
                                <div className={styles.menuLibraryName}>
                                  {result.libraryName}
                                </div>
                              </div>
                            </MenuItem>
                          ))
                        ) : (
                          <div>Results Not Found</div>
                        )}
                      </div>
                      <div className={styles.addNewEntity}>
                        <Button
                          color="primary"
                          className={styles.addNewEntityButton}
                          onClick={this.handleAddNewEntity(face)}
                        >
                          ADD NEW
                        </Button>
                      </div>
                    </Paper>
                  ) : null}
                </div>
              )}
            </Downshift>
          ) : (
            <div className={styles.unknownEntityText}>Unkown</div>
          )}
        </div>
      </div>
    );
  }
}

export default FaceDetectionBox;
