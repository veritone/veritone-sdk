import React, { Component } from 'react';
import { shape, string, number, func, arrayOf, bool } from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { startCase } from 'lodash';

import noAvatar from 'images/no-avatar.png';
import FaceGrid from '../FaceGrid';

import styles from './styles.scss';

class EntityInformation extends Component {
  static propTypes = {
    entity: shape({
      entityId: string,
      entityName: string,
      libraryId: string,
      profileImage: string
    }).isRequired,
    count: number,
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
    onBackClicked: func,
    onOccurrenceClicked: func,
    editModeEnabled: bool,
    onRemoveFaceRecognition: func,
    onFaceCheckboxClicked: func
  };

  state = {
    activeTab: 'faceMatches'
  };

  handleTabChange = (event, activeTab) => {
    if (activeTab !== this.state.activetab) {
      this.setState({ activeTab });
    }
  };

  render() {
    const {
      entity,
      count,
      faces,
      onBackClicked,
      editModeEnabled,
      onRemoveFaceRecognition,
      selectedFaces,
      onFaceCheckboxClicked
    } = this.props;

    return (
      <div className={styles.entityInformation}>
        <div className={styles.entityBackButtonContainer}>
          <Button
            color="default"
            className={styles.entityBackButton}
            onClick={onBackClicked}
          >
            <Icon
              className={classNames(styles.entityBackIcon, 'icon-arrow-back')}
            />
            <span className={styles.entityBackLabel}>Back</span>
          </Button>
        </div>
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
        <div className={styles.selectedEntityTabs}>
          <Tabs
            value={this.state.activeTab}
            onChange={this.handleTabChange}
            indicatorColor="primary"
          >
            <Tab
              label="Matched in this Video"
              value="faceMatches"
              classes={{ root: styles.infoTab }}
            />
            <Tab
              label="Metadata"
              value="metadata"
              classes={{ root: styles.infoTab }}
            />
          </Tabs>
          {this.state.activeTab === 'faceMatches' && (
            <div className={styles.tabContainer}>
              <FaceGrid
                faces={faces}
                selectedFaces={selectedFaces}
                onFaceOccurrenceClicked={this.props.onOccurrenceClicked}
                hideEntityLabels
                editMode={editModeEnabled}
                onRemoveFace={onRemoveFaceRecognition}
                onFaceCheckboxClicked={onFaceCheckboxClicked}
              />
            </div>
          )}
          {this.state.activeTab === 'metadata' && (
            <div className={styles.tabContainer}>
              <div className={styles.entityJson}>
                {entity.jsondata &&
                  !!Object.keys(entity.jsondata).length &&
                  Object.keys(entity.jsondata).map(objKey => {
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
