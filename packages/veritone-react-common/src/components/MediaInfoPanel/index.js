import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { get } from 'lodash';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import { Manager, Reference, Popper } from 'react-popper';
import { func, arrayOf, shape, string, bool } from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import EditTagsDialog from './EditTagsDialog';
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
    isMenuOpen: false,
    isEditMetadataOpen: false,
    isEditTagsOpen: false
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

  onEditTagsOpen = () => {
    this.onMenuClose();
    this.toggleIsEditTagsOpen();
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
    if (!tagsToSave) {
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

  toggleIsMenuOpen = () => {
    this.setState(prevState => {
      return {
        isMenuOpen: !{ ...prevState }.isMenuOpen
      };
    });
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
                <Manager>
                  <Reference>
                    {({ ref }) => (
                      <div ref={ref}>
                        <div ref={this.setMenuTarget}>
                            <IconButton
                              className={styles.pageHeaderActionButton}
                              aria-label="Edit"
                              aria-haspopup="true"
                              aria-owns={isMenuOpen ? 'menu-list-grow' : null}
                              onClick={this.toggleIsMenuOpen}
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
                        </div>
                      </div>
                    )}
                  </Reference>
                  {isMenuOpen && (
                    <Popper
                      className={styles.popperContent}
                      placement="bottom-end"
                      eventsEnabled={isMenuOpen}
                    >

                    {({ ref, style, placement }) => (
                      <div ref={ref} style={style} data-placement={placement}>
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
                              </MenuList>
                            </Paper>
                          </Grow>
                        </ClickAwayListener>
                      </div>
                    )}
                    </Popper>
                  )}
                </Manager>
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
