import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { get } from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { func, arrayOf, shape, string, bool } from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import EditMetadataDialog from './EditMetadataDialog';
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
      stopDateTime: string,
      createdDateTime: string
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
    canEditMedia: func.isRequired,
    onSaveMetadata: func.isRequired,
    onClose: func
  };

  state = {
    isOpen: true,
    isEditMetadataOpen: false
  };

  toggleIsOpen = () => {
    this.setState(prevState => {
      return {
        isOpen: !{ ...prevState }.isOpen
      };
    });
    this.props.onClose();
  };

  setMenuTarget = node => {
    this.target1 = node;
  };

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

  onSaveMetadata = metadataToSave => {
    this.toggleIsEditMetadataOpen();
    if (!metadataToSave) {
      return;
    }
    this.props.onSaveMetadata(metadataToSave);
  };

  toggleIsEditMetadataOpen = () => {
    this.setState(prevState => {
      return {
        isEditMetadataOpen: !{ ...prevState }.isEditMetadataOpen
      };
    });
  };

  onMetadataOpen = () => {
    this.toggleIsEditMetadataOpen();
  };

  render() {
    const {
      isOpen,
      isEditMetadataOpen
    } = this.state;

    const { tdo } = this.props;

    const metadata = {
      ...tdo.details,
      veritoneProgram: {
        ...tdo.details.veritoneProgram,
        programImage:
          tdo.sourceImageUrl ||
          get(tdo, 'details.veritoneProgram.programImage'),
        programLiveImage:
          tdo.thumbnailUrl ||
          get(tdo, 'details.veritoneProgram.programLiveImage')
      }
    };

    const contentElement = (
      <div
        className={styles.mediaInfoPanel}
        data-veritone-component="media-info-panel"
      >
        <div>
          <div
            className={styles.infoPanelHeader}
            data-veritone-component="media-info-panel-header"
          >
            <span>Metadata</span>
            <div className={styles.headerMenu}>
              {this.props.canEditMedia() && (
                <IconButton
                  className={styles.pageHeaderActionButton}
                  aria-label="Edit"
                  onClick={this.onMetadataOpen}
                >
                  <Tooltip
                    id="tooltip-show-edit-menu"
                    title="Edit"
                    PopperProps={{
                      style: {
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              )}
              {this.props.canEditMedia() && (
                <div className={styles.pageHeaderActionButtonsSeparator} />
              )}
              <IconButton
                className={styles.closeButton}
                onClick={this.toggleIsOpen}
                aria-label="Close"
              >
                <Icon className="icon-close-exit" />
              </IconButton>
            </div>
          </div>
          <Paper
            className={styles.infoPanelContent}
            data-veritone-component="media-info-panel-content"
          >
            <div className={styles.infoField}>
              <div className={styles.infoFieldLabel}>Filename</div>
              <div className={styles.infoFieldData}>
                {get(tdo, 'details.veritoneFile.filename', 'No Filename')}
              </div>
            </div>
            {tdo.createdDateTime && (
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Date Created</div>
                <div className={styles.infoFieldData}>
                  {this.toFormattedDate(tdo.createdDateTime)}
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
        {tdo &&
          tdo.details &&
          isEditMetadataOpen && (
            <EditMetadataDialog
              isOpen={isEditMetadataOpen}
              metadata={metadata}
              onClose={this.toggleIsEditMetadataOpen}
              onSave={this.onSaveMetadata}
            />
          )}
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
