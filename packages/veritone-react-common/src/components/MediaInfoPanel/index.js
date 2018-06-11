import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { get } from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import { func, arrayOf, shape, string, bool } from 'prop-types';
import styles from './styles.scss';

class MediaInfoPanel extends Component {
  static propTypes = {
    tdo: shape({
      applicationId: string,
      details: shape({
        veritoneProgram: shape({
          programLiveImage: string,
          programImage: string
        }),
        veritoneFile: shape({
          filename: string
        }),
        veritoneCustom: shape({
          source: string
        })
      }),
      id: string,
      primaryAsset: shape({
        id: string,
        uri: string
      }),
      security: shape({
        global: bool
      }),
      startDateTime: string,
      stopDateTime: string
    }).isRequired,
    engineCategories: arrayOf(
      shape({
        id: string,
        editable: bool,
        engines: arrayOf(
          shape({
            category: shape({
              id: string,
              editable: bool,
              iconClass: string,
              categoryType: string,
              name: string
            }),
            name: string,
            id: string,
            status: string
          })
        )
      })
    ).isRequired,
    kvp: shape({
      features: shape({
        downloadMedia: string,
        downloadPublicMedia: string
      }),
      applicationIds: arrayOf(string)
    }).isRequired,
    onClose: func
  };

  state = {
    isOpen: true
  };

  toggleIsOpen = () => {
    this.setState(prevState => {
      return {
        isOpen: !{ ...prevState }.isOpen
      };
    });
    this.props.onClose();
  };

  isMediaPublic = () => {
    if (!get(this.props.tdo, 'security.global', false)) {
      return false;
    }
    if (this.props.tdo.isPublic === false) {
      return false;
    }
    return true;
  };

  isOwnMedia() {
    if (this.props.tdo.isOwn === true) {
      return true;
    }
    const applicationIds = get(this.props.kvp, 'applicationIds', []);
    if (
      this.props.tdo.applicationId &&
      applicationIds.includes(this.props.tdo.applicationId)
    ) {
      return true;
    }
    return false;
  }

  toFormattedDate = dateString => {
    if (!dateString || !dateString.length) {
      return '';
    }
    const dateOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    const dateParts = new Date(dateString)
      .toLocaleDateString([], dateOptions)
      .split(',');
    return `${dateParts[0]}${dateParts[1]},${dateParts[2]}${dateParts[3]}`;
  };

  differenceToHhMmSs = (startDateTime, stopDateTime) => {
    if (
      !startDateTime ||
      !startDateTime.length ||
      !stopDateTime ||
      !stopDateTime.length
    ) {
      return '00:00:00';
    }
    const millis = Date.parse(stopDateTime) - Date.parse(startDateTime);
    const hh = Math.floor((millis / (1000 * 60 * 60)) % 24);
    const mm = Math.floor((millis / (1000 * 60)) % 60);
    const ss = Math.floor((millis / 1000) % 60);
    return `${hh < 10 ? '0' + hh : hh}:${mm < 10 ? '0' + mm : mm}:${
      ss < 10 ? '0' + ss : ss
    }`;
  };

  render() {
    const { isOpen } = this.state;

    const { tdo } = this.props;

    const contentElement = (
      <div className={styles.mediaInfoPanel}>
        <div>
          <div className={styles.infoPanelHeader}>
            <span>Metadata</span>
            <div className={styles.headerMenu}>
              <IconButton
                className={styles.closeButton}
                onClick={this.toggleIsOpen}
                aria-label="Close"
              >
                <Icon className="icon-close-exit" />
              </IconButton>
            </div>
          </div>
          <Paper className={styles.infoPanelContent}>
            <div className={styles.infoField}>
              <div className={styles.infoFieldLabel}>Filename</div>
              <div className={styles.infoFieldData}>
                {get(tdo, 'details.veritoneFile.filename', 'No Filename')}
              </div>
            </div>
            {tdo.details.date && (
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Date Created</div>
                <div className={styles.infoFieldData}>
                  {this.toFormattedDate(get(tdo, 'details.date'))}
                </div>
              </div>
            )}
            {tdo.startDateTime &&
              tdo.stopDateTime && (
                <div className={styles.infoField}>
                  <div className={styles.infoFieldLabel}>Duration</div>
                  <div className={styles.infoFieldData}>
                    {this.differenceToHhMmSs(
                      tdo.startDateTime,
                      tdo.stopDateTime
                    )}
                  </div>
                </div>
              )}
            {this.props.engineCategories &&
              this.props.engineCategories.length && (
                <div className={styles.infoField}>
                  <div className={styles.infoFieldLabel}>Engines</div>
                  <div className={styles.infoFieldData}>
                    {this.props.engineCategories
                      .filter(
                        category => category.engines && category.engines.length
                      )
                      .map(category => (
                        <div key={category.id}>
                          <b>{category.name}:</b>{' '}
                          {category.engines
                            .map(engine => engine.name)
                            .join(', ')}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            {get(tdo, 'details.tags', []).filter(
              item => !item.hasOwnProperty('redactionStatus')
            ).length > 0 && (
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Tags</div>
                <div className={styles.infoFieldData}>
                  {tdo.details.tags
                    .filter(item => !item.hasOwnProperty('redactionStatus'))
                    .map(tag => {
                      if (tag.hasOwnProperty('value')) {
                        return tag.value;
                      } else if (Object.keys(tag).length) {
                        const tagKey = Object.keys(tag)[0];
                        return `${tagKey}:${tag[tagKey]}`;
                      }
                    })
                    .join(', ')}
                </div>
              </div>
            )}
            {get(tdo, 'details.tags', []).some(item =>
              item.hasOwnProperty('redactionStatus')
            ) && (
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Redaction Status</div>
                <div className={styles.infoFieldData}>
                  {
                    tdo.details.tags.find(item =>
                      item.hasOwnProperty('redactionStatus')
                    ).redactionStatus
                  }
                </div>
              </div>
            )}
            <div className={styles.programImagesSection}>
              <div>
                Program Live Image
                <img
                  className={styles.programLiveImage}
                  src={
                    tdo.thumbnailUrl ||
                    '//static.veritone.com/veritone-ui/default-nullstate.svg'
                  }
                />
              </div>
              <div>
                Program Image
                <img
                  className={styles.programImage}
                  src={
                    tdo.sourceImageUrl ||
                    '//static.veritone.com/veritone-ui/program_image_null.svg'
                  }
                />
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );

    return (
      <Drawer anchor="right" open={isOpen} onClose={this.toggleIsOpen}>
        {contentElement}
      </Drawer>
    );
  }
}

export default withStyles(styles)(MediaInfoPanel);
