import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import EngineCategorySelector from './EngineCategorySelector';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import { number, func, arrayOf, any} from 'prop-types';
import styles from './styles.scss';

export default class MediaDetails extends Component {
  static propTypes = {
    mediaId: number,
    onClose: func,
    engineCategories: arrayOf(any)
  };

  state = {
    selectedEngineCategory: this.props.engineCategories && this.props.engineCategories.length ? this.props.engineCategories[0] : null,
    isEditMode: false,
    isInfoPanelOpen: false,
    hasPendingChanges: false
  };

  componentWillReceiveProps(nextProps) {
    // preselect 1st engine category - only on the first load
    if(!this.state.selectedEngineCategory && nextProps.engineCategories && nextProps.engineCategories.length) {
      this.setState({
        selectedEngineCategory: nextProps.engineCategories[0]
      });
    }
  }

  handleEngineCategoryChange = selectedCategoryId => {
    const selectedCategory = this.props.engineCategories.find(category => category.id === selectedCategoryId);
    this.setState({
      // ...this.state, // check if needed
      selectedEngineCategory: selectedCategory
    });
  };

  getSelectedCategoryMessage = () => {
    return 'Use the edit screen below to correct ' + this.state.selectedEngineCategory.name.toLowerCase() + 's.';
  };

  toggleEditMode = () => {
    this.setState({
      // ...this.state, // check if needed
      isEditMode: !this.state.isEditMode
    });
  };

  onSaveEdit = () => {
    this.toggleEditMode();
  };

  onCancelEdit = () => {
    this.toggleEditMode();
  };

  onRunProcess = () => {
  };

  toggleInfoPanel = () => {
    this.setState({
      isInfoPanelOpen : !this.state.isInfoPanelOpen
    });
  };

  render() {

    // TODOs:
    // add header
    // add action buttons menu
    // Media player segment

    return (
      <Paper className={styles.mediaDetailsPageContent}>

        {!this.state.isEditMode &&
          <div>
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderTitleLabel}>{this.props.mediaId}</div>
              <div className={styles.pageHeaderActionButtons}>
                <IconButton className={styles.pageHeaderActionButton} onClick={this.onRunProcess} aria-label='Run process' disableRipple={true}>
                  <Icon className='icon-run-process' classes={{root: styles.iconClass}}></Icon>
                </IconButton>
                <IconButton className={styles.pageHeaderActionButton} onClick={this.toggleInfoPanel} aria-label='Info Panel' disableRipple={true}>
                  <Icon className='icon-info-panel' classes={{root: styles.iconClass}}></Icon>
                </IconButton>
                <div className={styles.pageHeaderActionButtonsSeparator}></div>
                <IconButton className={styles.pageCloseButton} onClick={this.props.onClose} aria-label='Close' disableRipple={true}>
                  <Icon className='icon-close-exit' classes={{root: styles.iconClass}}></Icon>
                </IconButton>
              </div>
            </div>
            <div className={styles.mediaDetailsPageTabSelector}>
            </div>
            {this.state.selectedEngineCategory &&
              <div className={styles.engineActionHeader}>
                <div className={styles.engineActionContainer}>
                  <div className={styles.engineCategorySelector}>
                    <EngineCategorySelector engineCategories={this.props.engineCategories}
                                            selectedEngineCategoryId={this.state.selectedEngineCategory.id}
                                            onSelectEngineCategory={this.handleEngineCategoryChange}/>
                  </div>
                  <Button variant='raised'
                          color='primary'
                          className={styles.toEditModeButton}
                          onClick={this.toggleEditMode}>EDIT MODE</Button>
                </div>
              </div>}
          </div>}

        {this.state.isEditMode &&
          <div>
            <div className={styles.pageHeaderEditMode}>
              <IconButton className={styles.backButtonEditMode} onClick={this.onCancelEdit} aria-label='Back' disableRipple={true}>
                <Icon className='icon-arrow-back' classes={{root: styles.iconClass}}></Icon>
              </IconButton>
              <div className={styles.pageHeaderTitleLabelEditMode}>Edit Mode: {this.state.selectedEngineCategory.name}</div>
            </div>
            <div className={styles.pageSubHeaderEditMode}>
              <div className={styles.editCategoryHelperMessage}>
                {this.getSelectedCategoryMessage()}
              </div>
              <div className={styles.actionButtonsEditMode}>
                <Button className={styles.runProcessButtonEditMode}
                        onClick={this.onRunProcess}>
                  <Icon className='icon-run-process' classes={{root: styles.iconClass}}></Icon>
                  RUN PROCESS</Button>
                <div className={styles.actionButtonsSeparatorEditMode}></div>
                <Button className={styles.actionButtonEditMode}
                        onClick={this.onCancelEdit}>CANCEL</Button>
                <Button className={styles.actionButtonEditMode}
                        disabled={!this.state.hasPendingChanges}
                        onClick={this.onSaveEdit}>SAVE</Button>
              </div>
            </div>
          </div>}

        <div>
          Currently Selected category: {this.state.selectedEngineCategory &&
          <span>{this.state.selectedEngineCategory.name}</span>}
        </div>

        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'transcript' &&
          <div>Transcript component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'face' &&
        <div>Face component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'object' &&
        <div>Object component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'logo' &&
        <div>Logo component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'ocr' &&
        <div>OCR component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'fingerprint' &&
        <div>Fingerprint component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'translate' &&
        <div>Translation component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'sentiment' &&
        <div>Sentiment component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'geolocation' &&
        <div>Geolocation component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'stationPlayout' &&
        <div>Station playout component</div>}
        {/* Thumbnail is not supported: remove before release */}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'thumbnail' &&
        <div>Thumbnail component</div>}

        <Drawer anchor="right" open={this.state.isInfoPanelOpen} onClose={this.toggleInfoPanel}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleInfoPanel}
            onKeyDown={this.toggleInfoPanel}
          >
            {this.state.mediaId}
          </div>
          Whatever happens - happens.
        </Drawer>
      </Paper>
    );
  }
}
