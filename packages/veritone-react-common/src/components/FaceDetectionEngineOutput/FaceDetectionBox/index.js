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
    searchResults: arrayOf(shape(
      {
        entityName: string,
        libraryName: string,
        profileImageUrl: string
      }
    )),
    enableEdit: bool,
    updateEntity: func,
    addNewEntity: func
  };

  state = {
    editFaceEntity: false,
    hovered: false
  };

  handleMouseOver = () => {
    this.setState({ hovered: true });
  };

  handleMouseOut = () => {
    this.setState({ hovered: false });
  };

  itemToString = (item) => item && item.entityName;

  render() {
    let { face, searchResults, updateEntity, enableEdit, addNewEntity } = this.props;

    return (
      <div 
        className={classNames(styles.faceContainer, enableEdit && this.state.hovered && styles.faceContainerHover)} 
        onMouseOver={this.handleMouseOver} 
        onMouseLeave={this.handleMouseOut}
      >
        <div className={styles.entityImageContainer}>
          <img className={styles.entityImage} src={face.object.uri} />
          { enableEdit && this.state.hovered && <div className={styles.imageButtonOverlay}>Hello</div> }
        </div>
        <div className={styles.faceInformation}>
          <span className={styles.faceTimeOccurrence}>
            {msToReadableString(face.startTimeMs)} - {msToReadableString(face.endTimeMs)}
          </span>
          { this.state.editFaceEntity ? <Downshift
                itemToString={this.itemToString}
                onSelect={updateEntity}
              >
                {({
                  getInputProps,
                  getItemProps,
                  isOpen,
                  inputValue,
                  selectedItem,
                  highlightedIndex,
                }) => (
                  <div>
                    <TextField
                      {...getInputProps({
                        value: face.entityName,
                        placeholder: "Unkown",
                        autoFocus: true
                      })}
                    />
                    { isOpen ?
                        <Paper className={styles.autoCompleteDropdown} square>
                          <div className={styles.searchResultsList}>
                            { searchResults && searchResults.length ?
                                searchResults.map((result, index) => (
                                  <MenuItem 
                                    key={"menu_entity_" + index}
                                    component="div"
                                    {...getItemProps({
                                      item: result,
                                      index: index,
                                      selected: highlightedIndex === index
                                    })}
                                  >
                                    { result.profileImageUrl
                                        ? <Avatar src={ result.profileImageUrl } />
                                        : null
                                    }
                                    <div className={styles.entityInfo}>
                                      <div className={styles.menuEntityName}>{result.entityName}</div>
                                      <div className={styles.menuLibraryName}>{result.libraryName}</div>
                                    </div>
                                  </MenuItem>
                                )) : <div>Results Not Found</div>
                            }
                          </div>
                          <div className={styles.addNewEntity}>
                            <Button 
                              color="primary" 
                              className={styles.addNewEntityButton}
                              onClick={addNewEntity}
                            >
                              ADD NEW
                            </Button>
                          </div>
                        </Paper>
                        : null
                    }
                  </div>
                )}
              </Downshift> : <div>Unkown</div>
          }
        </div>
      </div> 
    );
  }
}

export default FaceDetectionBox;