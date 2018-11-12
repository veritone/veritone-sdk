import React, { Component, Fragment } from 'react';
import { shape, number, string, arrayOf, bool, func } from 'prop-types';
import cx from 'classnames';
import Downshift from 'downshift';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { Popper } from 'react-popper';

import { msToReadableString } from 'helpers/time';
import noAvatar from 'images/no-avatar.png';
import styles from './styles.scss';

const getEntityNameElement = (entityName, searchEntityText) => {
  const matchIndex = entityName
    .toLowerCase()
    .indexOf(searchEntityText.toLowerCase());
  return (
    <span>
      {entityName.substr(0, matchIndex)}
      <span className={styles.menuEntityNameMatch}>
        {entityName.substr(matchIndex, searchEntityText.length)}
      </span>
      {entityName.substr(matchIndex + searchEntityText.length)}
    </span>
  );
};

const renderEntitySearchMenu = ({
  results,
  getItemProps,
  highlightedIndex,
  searchEntityText
}) =>
  results.map((result, index) => {
    return (
      <MenuItem
        key={`menu-entity-${result.id}`}
        component="div"
        classes={{ root: styles.entityMenuItem }}
        {...getItemProps({
          item: result,
          index: index,
          selected: highlightedIndex === index
        })}
      >
        <Avatar src={result.profileImageUrl || noAvatar} />
        <div className={styles.entityInfo}>
          <div className={styles.menuEntityName}>
            {getEntityNameElement(result.name, searchEntityText)}
          </div>
          <div className={styles.menuLibraryName}>{result.library.name}</div>
        </div>
      </MenuItem>
    );
  });

class FaceInfoBox extends Component {
  static propTypes = {
    face: shape({
      startTimeMs: number,
      stopTimeMs: number,
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
    onAddNewEntity: func,
    onRemoveFace: func,
    onEditFaceDetection: func,
    onClick: func,
    onSearchForEntities: func,
    isSearchingEntities: bool,
    isSelected: bool,
    onCheckboxClicked: func,
    hideEntityLabel: bool,
    width: number
  };

  state = {
    isHovered: false,
    searchEntityText: '',
    imageIsLoading: true
  };

  handleMouseOver = () => {
    this.setState({ isHovered: true });
  };

  handleMouseOut = () => {
    this.setState({ isHovered: false });
  };

  // evt is mandatory here to avoid infinite call loop
  handleAddNewEntity = (face, inputValue) => evt => {
    this.props.addNewEntity(face, inputValue);
  };

  handleEntitySelect = entity => {
    this.props.onEditFaceDetection(this.props.face, entity);
  };

  onSearchEntityInputChange = text => {
    setTimeout(() => {
      this.setState({ searchEntityText: text });
    }, 1000);
    this.props.onSearchForEntities(text);
  };

  calculatePopperPlacement = () => {
    let shift = 'start';
    const distancFromTheSide =
      window.innerWidth - this._inputRef.getBoundingClientRect().right;
    if (
      distancFromTheSide <
      250 - this._inputRef.getBoundingClientRect().width
    ) {
      shift = 'end';
    }
    return `bottom-${shift}`;
  };

  itemToString = item => (item ? item.name : '');

  inputRef = node => (this._inputRef = node);

  handleCheckboxClicked = face => evt => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
    this.props.onCheckboxClicked(face, evt);
  };

  handleImageLoad = () => {
    this.setState({
      imageIsLoading: false
    });
  };

  handleImageLoadError = () => {
    this.setState({
      imageIsLoading: false
    });
  };

  render() {
    const {
      face,
      searchResults,
      enableEdit,
      onClick,
      isSearchingEntities,
      isSelected,
      onRemoveFace,
      hideEntityLabel,
      width
    } = this.props;

    return (
      <div
        className={cx(styles.faceContainer, {
          [styles.faceContainerHover]: this.state.isHovered
        })}
        style={{ width: width }}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseOut}
      >
        <div
          className={styles.entityImageContainer}
          style={{
            width: width - 20,
            height: width - 20
          }}
        >
          <img
            className={styles.entityImage}
            src={face.object.uri}
            onClick={onClick}
            onLoad={this.handleImageLoad}
            onError={this.handleImageLoadError}
          />
          {this.state.imageIsLoading && (
            <div className={styles.loadingContainer}>
              <CircularProgress />
            </div>
          )}
          {enableEdit &&
            !face.editAction && (
              <span className={styles.selectFaceCheckboxBackground} />
            )}
          {enableEdit &&
            !face.editAction && (
              <Checkbox
                checked={isSelected}
                color="primary"
                disableRipple
                classes={{ root: styles.selectFaceCheckbox }}
                onChange={this.handleCheckboxClicked(face)}
              />
            )}
          {enableEdit &&
            this.state.isHovered && (
              <div className={styles.imageButtonOverlay} onClick={onRemoveFace}>
                <DeleteIcon classes={{root: styles.faceActionIcon}}/>
              </div>
            )}
          {!!face.editAction && (
            <div className={styles.editActionOverlay}>
              <CheckCircleIcon className={styles.actionIcon} />
              <div>{face.editAction}</div>
            </div>
          )}
        </div>
        <div className={styles.faceInformation} onClick={onClick}>
          <span className={styles.faceTimeOccurrence}>
            {`${msToReadableString(face.startTimeMs)} - ${msToReadableString(
              face.stopTimeMs
            )}`}
          </span>
          {!hideEntityLabel && (
            <Fragment>
              {this.props.enableEdit && !isSelected ? (
                <Downshift
                  itemToString={this.itemToString}
                  onSelect={this.handleEntitySelect}
                  onInputValueChange={this.onSearchEntityInputChange}
                >
                  {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    selectedItem,
                    highlightedIndex,
                    inputValue
                  }) => (
                    <div>
                      <div ref={this.inputRef}>
                        <Input
                          {...getInputProps({
                            placeholder: 'Unknown',
                            className: styles.entitySearchInput
                          })}
                        />
                      </div>
                      {isOpen ? (
                        <Popper
                          modifiers={{
                            preventOverflow: {
                              enabled: false
                            }
                          }}
                          placement={this.calculatePopperPlacement()}
                          style={{ zIndex: 1 }}
                          target={this._inputRef}
                        >
                          <Paper className={styles.autoCompleteDropdown} square>
                            <div className={styles.libraryMatchesTitle}>
                              Library Matches
                            </div>
                            <div className={styles.searchResultsList}>
                              {isSearchingEntities ? (
                                <CircularProgress />
                              ) : searchResults && searchResults.length ? (
                                renderEntitySearchMenu({
                                  results: searchResults,
                                  getItemProps,
                                  highlightedIndex,
                                  searchEntityText: this.state.searchEntityText
                                })
                              ) : (
                                <div className={styles.notFoundEntityMessage}>
                                  Results Not Found
                                </div>
                              )}
                            </div>
                            <div className={styles.addNewEntity}>
                              <Button
                                color="primary"
                                className={styles.addNewEntityButton}
                                onClick={this.handleAddNewEntity(
                                  face,
                                  inputValue
                                )}
                              >
                                ADD NEW
                              </Button>
                            </div>
                          </Paper>
                        </Popper>
                      ) : null}
                    </div>
                  )}
                </Downshift>
              ) : (
                <div className={styles.unknownEntityText}>Unknown</div>
              )}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default FaceInfoBox;
