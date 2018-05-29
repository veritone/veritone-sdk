import React, { Component } from 'react';
import { shape, number, string, arrayOf, bool, func } from 'prop-types';
import classNames from 'classnames';
import Downshift from 'downshift';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import { Manager, Target, Popper } from 'react-popper';

import { msToReadableString } from 'helpers/time';
import noAvatar from 'images/no-avatar.png';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './styles.scss';

const renderEntitySearchMenu = ({
  results,
  getItemProps,
  highlightedIndex
}) => {
  return results.map((result, index) => {
    return (
      <MenuItem
        key={`menu-entity-${result.id}`}
        component="div"
        {...getItemProps({
          item: result,
          index: index,
          selected: highlightedIndex === index
        })}
      >
        <Avatar
          src={result.profileImageUrl ? result.profileImageUrl : noAvatar}
        />
        <div className={styles.entityInfo}>
          <div className={styles.menuEntityName}>{result.name}</div>
          <div className={styles.menuLibraryName}>{result.libraryName}</div>
        </div>
      </MenuItem>
    );
  });
};

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

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(nextProps) {
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

  dropdownRef = r => {
    this._dropdown = r;
  };

  /*TODO: come back to this and fix it*/
  calculatePositionAndHeight = ref => {};

  itemToString = item => (item ? item.entityName : '');

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
        <Manager>
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
                isOpen={this.state.dropdownOpen}
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
                    <Target>
                      <Input
                        {...getInputProps({
                          value: inputValue,
                          placeholder: 'Unkown',
                          autoFocus: true,
                          className: styles.entitySearchInput
                        })}
                      />
                    </Target>
                    {isOpen ? (
                      <Popper placement="auto-start" style={{ zIndex: 1 }}>
                        <div ref={this.dropdownRef}>
                          <Paper className={styles.autoCompleteDropdown} square>
                            <div className={styles.searchResultsList}>
                              {searchResults && searchResults.length ? (
                                renderEntitySearchMenu({
                                  results: searchResults,
                                  getItemProps,
                                  highlightedIndex
                                })
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
                        </div>
                      </Popper>
                    ) : null}
                  </div>
                )}
              </Downshift>
            ) : (
              <div className={styles.unknownEntityText}>Unkown</div>
            )}
          </div>
        </Manager>
      </div>
    );
  }
}

export default FaceDetectionBox;
