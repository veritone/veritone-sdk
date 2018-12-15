import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { shape, number, string, arrayOf, bool, func } from 'prop-types';
import { get } from 'lodash';
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
          <div className={styles.menuLibraryName}>
            {result.library.name}
          </div>
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
        name: string.isRequired,
        library: shape({
          name: string.isRequired
        }).isRequired,
        profileImageUrl: string,
        ownedByOrganization: bool
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
    imageIsLoading: true,
    sourceImage: ''
  };

  componentDidMount() {
    this.controller = new AbortController();
    const signal = this.controller.signal;
    fetch(get(this.props, 'face.object.uri'), {signal})
      .then(res => {
        if (!res.ok) {
          this.setState({
            sourceImage: '',
            imageIsLoading: false
          });
        }
        return res.blob();
      })
      .then(imageBlob => {
        const reader = new FileReader() ;
        reader.onload = () => {
          this.setState({
            sourceImage: reader.result,
            imageIsLoading: false
          });
        };
        reader.readAsDataURL(imageBlob) ;
        return imageBlob;
      }).catch(err => {
        if (err.name == 'AbortError') {
          return;
        }
        this.setState({
          sourceImage: '',
          imageIsLoading: false
        });
        // It's important to rethrow all other errors so you don't silence them!
        // For example, any error thrown by setState(), will pass through here.
        throw err;
      });
  }

  componentWillUnmount() {
    this.controller.abort();
  }

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

  preventClickPropagation = evt => {
    evt.stopPropagation();
    evt.nativeEvent.stopImmediatePropagation();
  };

  handleCheckboxClicked = face => evt => {
    this.preventClickPropagation(evt);
    this.props.onCheckboxClicked(face, evt);
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
          {this.state.sourceImage && (
            <img
              className={styles.entityImage}
              src={this.state.sourceImage}
              onClick={onClick}
            />
          )}
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
                <DeleteIcon classes={{ root: styles.faceActionIcon }} />
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
                          onClick={this.preventClickPropagation}
                          {...getInputProps({
                            placeholder: 'Unknown',
                            className: styles.entitySearchInput
                          })}
                        />
                      </div>
                      {isOpen ? (
                        ReactDOM.createPortal(
                          <Popper
                            modifiers={{
                              preventOverflow: {
                                enabled: false
                              }
                            }}
                            placement={this.calculatePopperPlacement()}
                            style={{ zIndex: 1300 }}
                            target={this._inputRef}
                          >
                            <Paper className={styles.autoCompleteDropdown} square>
                              <div className={styles.libraryMatchesTitle}>
                                Library Matches
                              </div>
                              <div className={styles.searchResultsList}>
                                {isSearchingEntities ? (
                                  <div className={styles.progressContainer}>
                                    <CircularProgress />
                                  </div>
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
                          </Popper>,
                          document.querySelector('body')
                        )
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
