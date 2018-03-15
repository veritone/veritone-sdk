import React, { Component } from 'react';
import Button from 'material-ui/Button';
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
    isEditMode: false
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
    return 'Use the edit screen below to edit.';
  };

  toggleEditMode = () => {
    this.setState({
      // ...this.state, // check if needed
      isEditMode: !this.state.isEditMode
    });
  };

  onSave = () => {
    this.toggleEditMode();
  };

  onCancel = () => {
    this.toggleEditMode();
  };

  onRunProcess = () => {
    this.toggleEditMode();
  };

  render() {

    // TODOs:
    // add header
    // add action buttons menu
    // Media player segment

    return (
      <Paper className={styles.mediaDetailsPageContent}>
        <div className={styles.mediaDetailsPageHeader}>
          <div className={styles.headerMediaName}>{this.props.mediaId}</div>
          <div className={styles.headerMediaActions}>
            <div className={styles.pageCloseIcon}>
              <IconButton
                onClick={this.props.onClose}
                className='icon-close-exit'
                disableRipple={true}/>
            </div>
          </div>
        </div>
        <div className={styles.mediaDetailsPageSubHeader}>
        </div>

        {this.state.selectedEngineCategory &&
          <div className={styles.engineActionHeader}>
            {!this.state.isEditMode &&
              <div className={styles.readModeHeader}>
                <div className={styles.engineCategorySelector}>
                  <EngineCategorySelector engineCategories={this.props.engineCategories}
                                          selectedEngineCategoryId={this.state.selectedEngineCategory.id}
                                          onSelectEngineCategory={this.handleEngineCategoryChange}/>
                </div>
                <Button variant='raised'
                        color='primary'
                        className={styles.editModeButton}
                        onClick={this.toggleEditMode}>EDIT MODE</Button>
              </div>}
            {this.state.isEditMode &&
              <div className={styles.editModeHeader}>
                <div className={styles.editCategoryHelperMessage}>
                  {this.getSelectedCategoryMessage()}
                </div>
                <div className={styles.editModeActionButtons}>
                  <Button className={styles.runProcessButton}
                          onClick={this.onRunProcess}>
                    <Icon className='icon-run-process' classes={{root: styles.iconClass}}></Icon>
                    RUN PROCESS</Button>
                  <Button className={styles.actionButton}
                          onClick={this.onCancel}>CANCEL</Button>
                  <Button className={styles.actionButton}
                          onClick={this.onSave}>SAVE</Button>
                </div>
              </div>}
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

      </Paper>
    );
  }
}
