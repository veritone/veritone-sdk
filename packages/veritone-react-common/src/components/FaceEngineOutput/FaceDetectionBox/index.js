import React, { Component } from 'react';
import { shape, number, string, arrayOf, bool, func } from 'prop-types';
import classNames from 'classnames';
import Downshift from 'downshift';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
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
    onAddNewEntity: func,
    onRemoveFaceDetection: func,
    onEditFaceDetection: func,
    onClick: func,
    onSearchForEntities: func,
    isSearchingEntities: bool,
    isSelected: bool,
    onCheckboxClicked: func
  };

  state = {
    hovered: false,
    searchEntityText: ''
  };

  handleMouseOver = () => {
    this.setState({ hovered: true });
  };

  handleMouseOut = () => {
    this.setState({ hovered: false });
  };

  // evt is mandatory here to avoid infinite call loop
  handleAddNewEntity = entity => evt => {
    this.props.addNewEntity(this.props.face, entity);
  };

  handleEntitySelect = entity => {
    this.props.onEditFaceDetection(this.props.face, entity);
  };

  handleDeleteFaceDetection = () => {
    this.props.onRemoveFaceDetection(this.props.face);
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
    this.props.onCheckboxClicked(face, evt.target.checked);
  };

  render() {
    const {
      face,
      searchResults,
      enableEdit,
      onClick,
      isSearchingEntities,
      isSelected
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
          {enableEdit && <span className={styles.selectFaceCheckboxBackground}/>}
          {enableEdit && <Checkbox
            checked={isSelected}
            color="primary"
            disableRipple
            classes={{root: styles.selectFaceCheckbox}}
            onChange={this.handleCheckboxClicked(face)}
          />}
          {enableEdit &&
            this.state.hovered && (
              <div className={styles.imageButtonOverlay}>
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
            {`${msToReadableString(face.startTimeMs)} - ${msToReadableString(
              face.stopTimeMs
            )}`}
          </span>
          {this.props.enableEdit ? (
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
                highlightedIndex
              }) => (
                <div>
                  <div ref={this.inputRef}>
                    <Input
                      {...getInputProps({
                        placeholder: (face.object.label ? face.object.label : 'Unknown'),
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
                        <div className={styles.libraryMatchesTitle}>Library Matches</div>
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
                            onClick={this.handleAddNewEntity(face)}
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
            face.object.label && face.object.label.length ? (
              <div className={styles.unknownEntityText}>{face.object.label}</div>
            ) : (
              <div className={styles.unknownEntityText}>Unknown</div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default FaceDetectionBox;
