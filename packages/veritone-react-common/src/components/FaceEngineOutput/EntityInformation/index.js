import React, { Component } from 'react';
import { shape, string, number, func, arrayOf } from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { startCase } from 'lodash';

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
      profileImage: string
    }).isRequired,
    count: number,
    timeSlots: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        originalImage: string,
        confidence: number
      })
    ),
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
    this.props.onOccurrenceClicked &&
      this.props.onOccurrenceClicked(face.startTimeMs, face.stopTimeMs);
  };

  render() {
    const { entity, count, timeSlots, onBackClicked } = this.props;

    return (
      <div>
        <Button
          color="default"
          className={styles.entityBackButton}
          onClick={onBackClicked}
        >
          <Icon className={classNames(styles.entityBackIcon, 'icon-arrow-back')} />
          <span className={styles.entityBackLabel}>Back</span>
        </Button>
        <div className={styles.selectedEntity}>
          <img
            className={styles.entityProfileImage}
            src={entity.profileImageUrl || noAvatar}
          />
          <div className={styles.selectedEntityInfo}>
            <div className={styles.entityNameAndCount}>
              <span>{entity.name} </span>
              <span>({count})</span>
            </div>
            <div className={styles.libraryName}>
              <i className="icon-library-app" />&nbsp;
              <span>
                Library: <strong>{entity.libraryName}</strong>
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
            <Tab label="Matched in this Video" value="faceMatches" classes={{root: styles.infoTab}}/>
            <Tab label="Metadata" value="metadata" classes={{root: styles.infoTab}}/>
          </Tabs>
          {this.state.activeTab === 'faceMatches' && (
            <div className={styles.tabContainer}>
              {timeSlots.length && (
                <div className={styles.faceOccurrenceList}>
                  {timeSlots.map(timeSlot => {
                    return (
                      <div
                        onClick={this.handleFaceOccurrenceClicked(timeSlot)}
                        className={styles.faceOccurrence}
                        key={`face-match-${entity.entityId}-${
                          timeSlot.startTimeMs
                        }-${timeSlot.stopTimeMs}-${timeSlot.originalImage}`}
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
              <div className={styles.entityJson}>
                {entity.jsondata &&
                  !!Object.keys(entity.jsondata).length &&
                  Object.keys(entity.jsondata).map((objKey, index) => {
                    return (
                      <div
                        key={`entity-${entity.entityId}-jsondata-${objKey}`}
                        className={styles.jsondataItem}
                      >
                        <div className={styles.metadataLabel}>
                          {startCase(objKey)}
                        </div>
                        <div className={styles.metadataValue}>
                          {entity.jsondata[objKey]}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EntityInformation;
