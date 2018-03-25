import React, { Component } from 'react';
import { shape, string, objectOf, array, func } from 'prop-types';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { msToReadableString } from 'helpers/time';
import noAvatar from 'images/no-avatar.png';

import styles from './styles.scss';

@withMuiThemeProvider
class EntityInformation extends Component {
  static propTypes = {
    entity: shape({
      entityId: string,
      entityName: string,
      libraryId: string,
      profileImageUrl: string,
      jsondata: shape({
        description: string
      })
    }),
    faces: objectOf(array),
    onBackClicked: func,
    onOccurrenceClicked: func
  }

  state = {
    activeTab: 'faceMatches'
  }

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activetab) {
      this.setState({activeTab});
    }
  }

  handleFaceOccurrenceClicked = face => (evt) => {
    this.props.onOccurrenceClicked(face, evt);
  }

  render() {
    let { entity, faces, onBackClicked } = this.props;

    return (
      <div>
        <Button 
          color="default" 
          className={styles.entityBackButton}
          onClick={onBackClicked}
        >
          <Icon className={classNames("icon-keyboard_backspace", styles.entityBackIcon)}/>
          <span className={styles.entityBackLabel}>Back</span>
        </Button>
        <div className={styles.selectedEntity}>
          <img className={styles.entityProgramImage} src={entity.profileImageUrl || noAvatar} />
          <div className={styles.selectedEntityInfo}>
            <div>
              <span>{entity.entityName} </span>
              <span>
                ({faces[entity.libraryInfo.id] ? faces[entity.libraryInfo.id].length : '0'})
              </span>
            </div>
            <div>
              <i className="icon-library-app"/>&nbsp;
              <span>Library: <strong>{entity.libraryInfo.name}</strong></span>
            </div>
          </div>
        </div>
        <div>
          <Tabs
            value={this.state.activeTab} 
            onChange={this.handleTabChange} 
            indicatorColor="primary"
          >
            <Tab label="Matched in this Video" value="faceMatches"/>
            <Tab label="Metadata" value="metadata"/>
          </Tabs>
          { this.state.activeTab === 'faceMatches' &&
              <div className={styles.tabContainer}>
                { faces[entity.libraryId] ?
                    <div className={styles.faceOccurrenceList}>
                      { faces[entity.libraryId].map((face, index) => {
                          return <div
                            onClick={this.handleFaceOccurrenceClicked(face)}
                            className={styles.faceOccurrenceTimestamp}
                            key={'face-timestamp-' + face.startTimeMs + '-' + face.endTimeMs + '-' + index}
                          >
                            {msToReadableString(face.startTimeMs)} - {msToReadableString(face.endTimeMs)}
                          </div>
                        })
                      }
                    </div> :
                    <div> No faces found</div>
                }
              </div>
          }
          { this.state.activeTab === 'metadata' &&
              <div className={styles.tabContainer}>
                <div className={styles.metadataLabel}>Description</div>
                <span className={styles.metadataValue}>{entity.jsondata.description || '-'}</span>
              </div>
          }
        </div>
      </div>
    )
  }
}

export default EntityInformation;