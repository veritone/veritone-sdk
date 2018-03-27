import React, { Component } from 'react';
import { shape, string, number, func, arrayOf } from 'prop-types';
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
    selectedEntity: shape({
      count: number,
      entity: shape({
        entityId: string,
        entityName: string,
        libraryId: string,
        profileImage: string
      }),
      entityId: string,
      fullName: string,
      profileImage: string,
      timeSlots: arrayOf(
        shape({
          startTimeMs: number,
          stopTimeMs: number,
          originalImage: string,
          confidence: number
        })
      )
    }),
    onBackClicked: func,
    onOccurrenceClicked: func
  };

  state = {
    activeTab: 'faceMatches'
  };

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activetab) {
      this.setState({ activeTab });
    }
  };

  handleFaceOccurrenceClicked = face => evt => {
    this.props.onOccurrenceClicked(face, evt);
  };

  render() {
    let { selectedEntity, onBackClicked } = this.props;

    return (
      <div>
        <Button
          color="default"
          className={styles.entityBackButton}
          onClick={onBackClicked}
        >
          <Icon
            className={classNames(
              'icon-keyboard_backspace',
              styles.entityBackIcon
            )}
          />
          <span className={styles.entityBackLabel}>Back</span>
        </Button>
        <div className={styles.selectedEntity}>
          <img
            className={styles.entityProfileImage}
            src={selectedEntity.entity.profileImageUrl || noAvatar}
          />
          <div className={styles.selectedEntityInfo}>
            <div>
              <span>{selectedEntity.entity.entityName} </span>
              <span>({selectedEntity.timeSlots.length})</span>
            </div>
            <div>
              <i className="icon-library-app" />&nbsp;
              <span>
                Library: <strong>{selectedEntity.entity.library.name}</strong>
              </span>
            </div>
          </div>
        </div>
        <div>
          <Tabs
            value={this.state.activeTab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
          >
            <Tab label="Matched in this Video" value="faceMatches" />
            <Tab label="Metadata" value="metadata" />
          </Tabs>
          {this.state.activeTab === 'faceMatches' && (
            <div className={styles.tabContainer}>
              {!selectedEntity.timeSlots.length ? (
                <div>No Face Matches Found</div>
              ) : (
                <div className={styles.faceOccurrenceList}>
                  {selectedEntity.timeSlots.map((timeSlot, index) => {
                    return (
                      <div
                        onClick={this.handleFaceOccurrenceClicked(timeSlot)}
                        className={styles.faceOccurrence}
                        key={
                          'face-timestamp-' +
                          timeSlot.startTimeMs +
                          '-' +
                          timeSlot.stopTimeMs +
                          '-' +
                          index
                        }
                      >
                        <span className={styles.faceOccurrenceTimestamp}>
                          {msToReadableString(timeSlot.startTimeMs)} -{' '}
                          {msToReadableString(timeSlot.stopTimeMs)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {this.state.activeTab === 'metadata' && (
            <div className={styles.tabContainer}>
              <div className={styles.metadataLabel}>Description</div>
              <span className={styles.metadataValue}>
                {selectedEntity.entity.jsondata.description || '-'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EntityInformation;
