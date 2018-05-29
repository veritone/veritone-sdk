import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Drawer from '@material-ui/core/Drawer';
import { get } from 'lodash';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import { func, arrayOf, shape, string, bool } from 'prop-types';
import EditMetadataDialog from './EditMetadataDialog';
import EditTagsDialog from './EditTagsDialog';
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
    contextMenuExtensions: shape({
      mentions: arrayOf(
        shape({
          id: string.isRequired,
          label: string.isRequired,
          url: string.isRequired
        })
      ),
      tdos: arrayOf(
        shape({
          id: string.isRequired,
          label: string.isRequired,
          url: string.isRequired
        })
      )
    }),
    onClose: func,
    onSaveMetadata: func
  };

  state = {
    isOpen: true,
    isMenuOpen: false,
    isEditMetadataOpen: false,
    isEditTagsOpen: false
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

  onSaveTags = tagsToSave => {
    this.toggleIsEditTagsOpen();
    if (!tagsToSave || !tagsToSave.length) {
      return;
    }
    this.props.onSaveMetadata({ tags: tagsToSave });
  };

  toggleIsEditTagsOpen = () => {
    this.setState(prevState => {
      return {
        isEditTagsOpen: !{ ...prevState }.isEditTagsOpen
      };
    });
  };

  toggleIsOpen = () => {
    this.setState(prevState => {
      return {
        isOpen: !{ ...prevState }.isOpen
      };
    });
    this.props.onClose();
  };

  isDownloadMediaEnabled = () => {
    return get(this.props.kvp, 'features.downloadMedia') === 'enabled';
  };

  isDownloadAllowed = () => {
    if (!this.isMediaPublic(this.props.tdo)) {
      return true;
    }
    const publicMediaDownloadEnabled =
      get(this.props.kvp, 'features.downloadPublicMedia') === 'enabled';
    if (this.isOwnMedia() || publicMediaDownloadEnabled) {
      return true;
    }
    return false;
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

  downloadFile = () => {
    const element = document.createElement('a');
    element.href = get(this.props.tdo, 'primaryAsset.signedUri', '');
    element.download = get(this.props, 'tdo.details.veritoneFile.filename');
    element.target = '_blank';
    element.click();
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

  toggleIsMenuOpen = () => {
    this.setState(prevState => {
      return {
        isMenuOpen: !{ ...prevState }.isMenuOpen
      };
    });
  };

  onMenuClose = event => {
    if (event && this.target1.contains(event.target)) {
      return;
    }
    this.setState({ isMenuOpen: false });
  };

  onMetadataOpen = () => {
    this.onMenuClose();
    this.toggleIsEditMetadataOpen();
  };

  onEditTagsOpen = () => {
    this.onMenuClose();
    this.toggleIsEditTagsOpen();
  };

  setMenuTarget = node => {
    this.target1 = node;
  };

  handleContextMenuClick = cme => {
    window.open(cme.url.replace('${tdoId}', this.props.tdo.id), '_blank');
  };

  render() {
    const {
      isOpen,
      isMenuOpen,
      isEditMetadataOpen,
      isEditTagsOpen
    } = this.state;

    const { tdo } = this.props;

    const metadata = {
      ...tdo.details,
      veritoneProgram: {
        ...tdo.details.veritoneProgram,
        programImage:
          tdo.sourceImageUrl || tdo.details.veritoneProgram.programImage,
        programLiveImage:
          tdo.thumbnailUrl || tdo.details.veritoneProgram.programLiveImage
      }
    };

    const contentElement = (
      <div className={styles.mediaInfoPanel}>
        <div>
          <div className={styles.infoPanelHeader}>
            <span>Metadata</span>
            <div className={styles.headerMenu}>
              <Manager>
                <Target>
                  <div ref={this.setMenuTarget}>
                    <IconButton
                      aria-label="More"
                      aria-haspopup="true"
                      aria-owns={isMenuOpen ? 'menu-list-grow' : null}
                      onClick={this.toggleIsMenuOpen}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </div>
                </Target>
                <Popper placement="bottom-end" eventsEnabled={isMenuOpen}>
                  <ClickAwayListener onClickAway={this.onMenuClose}>
                    <Grow
                      in={isMenuOpen}
                      id="menu-list-grow"
                      style={{ transformOrigin: '0 0 0' }}
                    >
                      <Paper>
                        <MenuList role="menu">
                          <MenuItem
                            classes={{ root: styles.headerMenuItem }}
                            onClick={this.onMetadataOpen}
                          >
                            Edit Metadata
                          </MenuItem>
                          <MenuItem
                            classes={{ root: styles.headerMenuItem }}
                            onClick={this.onEditTagsOpen}
                          >
                            Edit Tags
                          </MenuItem>
                          {this.isDownloadMediaEnabled() && (
                            <MenuItem
                              classes={{ root: styles.headerMenuItem }}
                              disabled={!this.isDownloadAllowed()}
                              onClick={this.downloadFile}
                            >
                              Download
                            </MenuItem>
                          )}
                          {this.props.contextMenuExtensions &&
                            this.props.contextMenuExtensions.tdos.map(
                              tdoMenu => (
                                <MenuItem
                                  key={tdoMenu.id}
                                  classes={{ root: styles.headerMenuItem }}
                                  // eslint-disable-next-line
                                  onClick={() =>
                                    this.handleContextMenuClick(tdoMenu)
                                  }
                                >
                                  {tdoMenu.label}
                                </MenuItem>
                              )
                            )}
                        </MenuList>
                      </Paper>
                    </Grow>
                  </ClickAwayListener>
                </Popper>
              </Manager>
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
            {tdo.startDateTime && tdo.stopDateTime &&
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Duration</div>
                <div className={styles.infoFieldData}>
                  {this.differenceToHhMmSs(
                    tdo.startDateTime,
                    tdo.stopDateTime
                  )}
                </div>
              </div>}
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
            {get(tdo, 'details.tags.length', 0) > 0 && (
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Tags</div>
                <div className={styles.infoFieldData}>
                  {tdo.details.tags.map(tag => tag.value).join(', ')}
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
        {tdo &&
          tdo.details &&
          isEditTagsOpen && (
            <EditTagsDialog
              isOpen={isEditTagsOpen}
              tags={tdo.details.tags}
              onClose={this.toggleIsEditTagsOpen}
              onSave={this.onSaveTags}
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
