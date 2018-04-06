import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Paper from 'material-ui/Paper';
import { objectOf, func, bool, arrayOf, any } from 'prop-types';
import EditMetadataDialog from './EditMetadataDialog';
import EditTagsDialog from './EditTagsDialog';
import styles from './styles.scss';

class MediaInfoPanel extends Component {
  static propTypes = {
    tdo: objectOf(any),
    engineCategories: arrayOf(any),
    onClose: func,
    onSaveMetadata: func,
    isInfoPanelOpen: bool
  };

  state = {
    isOpen: true,
    menuAnchorEl: null,
    isOpenEditMetadata: false,
    isOpenEditTags: false
  };

  onSaveMetadata = metadataToSave => {
    this.toggleIsOpenEditMetadata();
    if (!metadataToSave) {
      return;
    }
    const detailsParams = [];
    if (metadataToSave.veritoneFile && metadataToSave.veritoneFile.filename) {
      detailsParams.push(
        `veritoneFile: { filename: "${metadataToSave.veritoneFile.filename}" }`
      );
    }
    if (metadataToSave.veritoneCustom && (typeof metadataToSave.veritoneCustom.source === 'string')) {
      detailsParams.push(
        `veritoneCustom: { source: "${metadataToSave.veritoneCustom.source}" }`
      );
    }
    if (
      metadataToSave.veritoneProgram &&
      ((typeof metadataToSave.veritoneProgram.programLiveImage === 'string') ||
        (typeof metadataToSave.veritoneProgram.programImage === 'string'))
    ) {
      let programData = '';
      if (typeof metadataToSave.veritoneProgram.programLiveImage === 'string') {
        programData += `programLiveImage: "${
          metadataToSave.veritoneProgram.programLiveImage
        }"`;
      }
      if (typeof metadataToSave.veritoneProgram.programImage === 'string') {
        programData += ` programImage: "${
          metadataToSave.veritoneProgram.programImage
        }"`;
      }
      if (programData.length) {
        detailsParams.push(`veritoneProgram: { ${programData} }`);
      }
    }
    if (!detailsParams.length) {
      return;
    }
    const detailsToSave = `details: { ${detailsParams.join(' ')} }`;
    this.props.onSaveMetadata(detailsToSave);
  };

  toggleIsOpenEditMetadata = () => {
    this.setState({
      isOpenEditMetadata: !this.state.isOpenEditMetadata
    });
  };

  onSaveTags = tagsToSave => {
    this.toggleIsOpenEditTags();
    if (!tagsToSave || !tagsToSave.length) {
      return;
    }
    const tagsObjects = [];
    tagsToSave.forEach(tag => tagsObjects.push(`{ value: "${tag.value}" }`));
    const detailsToSave = `details: { tags: [ ${tagsObjects.join(', ')} ] }`;
    this.props.onSaveMetadata(detailsToSave);
  };

  toggleIsOpenEditTags = () => {
    this.setState({
      isOpenEditTags: !this.state.isOpenEditTags
    });
  };

  toggleIsOpen = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
    this.props.onClose();
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

  onMenuClick = event => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  onMetadataOpen = () => {
    this.onMenuClose();
    this.toggleIsOpenEditMetadata();
  };

  onEditTagsOpen = () => {
    this.onMenuClose();
    this.toggleIsOpenEditTags();
  };

  render() {
    const { menuAnchorEl } = this.state;

    const contentElement = (
      <div className={styles.mediaInfoPanel}>
        <div>
          <div className={styles.infoPanelHeader}>
            <span>Metadata</span>
            <div className={styles.headerMenu}>
              <IconButton
                aria-label="More"
                aria-owns={menuAnchorEl ? 'metadata-menu' : null}
                onClick={this.onMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="metadata-menu"
                anchorEl={this.state.menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={this.onMenuClose}
              >
                <MenuItem onClick={this.onMetadataOpen}>Edit Metadata</MenuItem>
                <MenuItem onClick={this.onEditTagsOpen}>Edit Tags</MenuItem>
                {/* TODO: uncomment when can download large/chunked files
                  <MenuItem onClick={this.onMenuClose}>Download</MenuItem>
                */}
              </Menu>
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
                {this.props.tdo.details.veritoneFile.filename}
              </div>
            </div>
            {this.props.tdo.details.date &&
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Date Created</div>
                <div className={styles.infoFieldData}>
                  {this.toFormattedDate(this.props.tdo.details.date)}
                </div>
              </div>}
            <div className={styles.infoField}>
              <div className={styles.infoFieldLabel}>Duration</div>
              <div className={styles.infoFieldData}>
                {this.differenceToHhMmSs(
                  this.props.tdo.startDateTime,
                  this.props.tdo.stopDateTime
                )}
              </div>
            </div>
            {this.props.engineCategories && this.props.engineCategories.length && (
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
                        {category.engines.map(engine => engine.name).join(', ')}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {this.props.tdo.details.tags && this.props.tdo.details.tags.length > 0 && (
              <div className={styles.infoField}>
                <div className={styles.infoFieldLabel}>Tags</div>
                <div className={styles.infoFieldData}>
                  {this.props.tdo.details.tags.map(tag => tag.value).join(', ')}
                </div>
              </div>
            )}
            <div className={styles.programImagesSection}>
              <div>
                Program Live Image
                {this.props.tdo.details.veritoneProgram.programLiveImage &&
                  this.props.tdo.details.veritoneProgram.programLiveImage
                    .length && (
                    <img
                      className={styles.programLiveImage}
                      src={
                        this.props.tdo.details.veritoneProgram.programLiveImage
                      }
                    />
                  )}
                {(!this.props.tdo.details.veritoneProgram.programLiveImage ||
                  !this.props.tdo.details.veritoneProgram.programLiveImage
                    .length) && (
                  <img
                    className={styles.programLiveImage}
                    src="//static.veritone.com/veritone-ui/default-nullstate.svg"
                  />
                )}
              </div>
              <div>
                Program Image
                {this.props.tdo.details.veritoneProgram.programImage &&
                  this.props.tdo.details.veritoneProgram.programImage
                    .length && (
                    <img
                      className={styles.programImage}
                      src={this.props.tdo.details.veritoneProgram.programImage}
                    />
                  )}
                {(!this.props.tdo.details.veritoneProgram.programImage ||
                  !this.props.tdo.details.veritoneProgram.programImage
                    .length) && (
                  <img
                    className={styles.programImage}
                    src="//static.veritone.com/veritone-ui/program_image_null.svg"
                  />
                )}
              </div>
            </div>
          </Paper>
        </div>
        {this.props.tdo &&
          this.props.tdo.details &&
            this.state.isOpenEditMetadata && (
              <EditMetadataDialog
                isOpen={this.state.isOpenEditMetadata}
                metadata={this.props.tdo.details}
                onClose={this.toggleIsOpenEditMetadata}
                onSave={this.onSaveMetadata}
              />
          )}
        {this.props.tdo &&
          this.props.tdo.details &&
            this.state.isOpenEditTags && (
              <EditTagsDialog
                isOpen={this.state.isOpenEditTags}
                tags={this.props.tdo.details.tags}
                onClose={this.toggleIsOpenEditTags}
                onSave={this.onSaveTags}
              />
          )}
      </div>
    );

    return (
      <Drawer
        anchor="right"
        open={this.state.isOpen}
        onClose={this.toggleIsOpen}
      >
        {contentElement}
      </Drawer>
    );
  }
}

export default withStyles(styles)(MediaInfoPanel);
