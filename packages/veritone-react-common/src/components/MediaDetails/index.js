import React, { Component } from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import { number, func, object, arrayOf, any} from 'prop-types';
import EngineCategorySelector from './EngineCategorySelector';
import MediaInfoPanel from './MediaInfoPanel';
import styles from './styles.scss';

export default class MediaDetails extends Component {
  static propTypes = {
    mediaId: number.isRequired,
    onClose: func,
    engineCategories: arrayOf(any),
    tdo: object,
  };

  state = {
    selectedEngineCategory: this.props.engineCategories && this.props.engineCategories.length ? this.props.engineCategories[0] : null,
    selectedTabValue: 0,
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

  handleTabChange = (event, value) => {
    this.setState({ selectedTabValue: value });
  };

  handleEngineCategoryChange = selectedCategoryId => {
    const selectedCategory = this.props.engineCategories.find(category => category.id === selectedCategoryId);
    this.setState({
      selectedEngineCategory: selectedCategory
    });
  };

  getSelectedCategoryMessage = () => {
    return 'Use the edit screen below to correct ' + this.state.selectedEngineCategory.name.toLowerCase() + 's.';
  };

  getMediaFileName = () => {
    if (this.props.tdo && this.props.tdo.details &&
        this.props.tdo.details.veritoneFile && this.props.tdo.details.veritoneFile.filename) {
      return this.props.tdo.details.veritoneFile.filename;
    }
    return this.props.mediaId;
  };

  getMediaSource = () => {
    if (this.props.tdo && this.props.tdo.details && this.props.tdo.details.veritoneProgram) {
      const veritoneProgram = this.props.tdo.details.veritoneProgram;
      if (veritoneProgram.programId === '-1') {
        return 'Private Media';
      } else {
        return veritoneProgram.programName;
      }
    }
    return '';
  };

  toggleEditMode = () => {
    this.setState({
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

    // TODO: hookup run process action button menu
    // TODO: order engine categories in this page. Keep order hardcoded.

    return (
      <Paper className={styles.mediaDetailsPageContent}>

        {!this.state.isEditMode &&
          <div>
            <div className={styles.pageHeader}>
              <div className={styles.pageHeaderTitleLabel}>
                {this.getMediaFileName()}
                </div>
              <div className={styles.pageHeaderActionButtons}>
                <IconButton className={styles.pageHeaderActionButton} onClick={this.onRunProcess} aria-label='Run process'>
                    <Icon className='icon-run-process' classes={{root: styles.iconClass}}/>
                </IconButton>
                <IconButton className={styles.pageHeaderActionButton} onClick={this.toggleInfoPanel} aria-label='Info Panel'>
                  <Icon className='icon-info-panel' classes={{root: styles.iconClass}}/>
                </IconButton>
                <div className={styles.pageHeaderActionButtonsSeparator}/>
                <IconButton className={styles.pageCloseButton} onClick={this.props.onClose} aria-label='Close'>
                  <Icon className='icon-close-exit' classes={{root: styles.iconClass}}/>
                </IconButton>
              </div>
            </div>
            <Tabs value={this.state.selectedTabValue}
                    onChange={this.handleTabChange}
                    classes={{
                      flexContainer: styles.mediaDetailsPageTabSelector
                    }}>
              <Tab label="Media Details" classes={{root: styles.pageTabLabel}} style={{fontWeight: this.state.selectedTabValue === 0 ? 500 : 400}}/>
              <Tab label="Content Templates" classes={{root: styles.pageTabLabel}} style={{fontWeight: this.state.selectedTabValue === 1 ? 500 : 400}}/>
            </Tabs>

            {this.state.selectedEngineCategory && this.state.selectedTabValue === 0 &&
              <div className={styles.engineActionHeader}>
                <div className={styles.engineActionContainer}>
                  <div className={styles.engineCategorySelector}>
                    <EngineCategorySelector engineCategories={this.props.engineCategories}
                                            selectedEngineCategoryId={this.state.selectedEngineCategory.id}
                                            onSelectEngineCategory={this.handleEngineCategoryChange}/>
                  </div>
                  {this.state.selectedEngineCategory.editable &&
                    <Button variant='raised'
                            color='primary'
                            className={styles.toEditModeButton}
                            onClick={this.toggleEditMode}>EDIT MODE</Button>}
                </div>
              </div>}
          </div>}

        {this.state.isEditMode && this.state.selectedTabValue === 0 &&
          <div>
            <div className={styles.pageHeaderEditMode}>
              <IconButton className={styles.backButtonEditMode} onClick={this.onCancelEdit} aria-label='Back' disableRipple>
                <Icon className='icon-arrow-back' classes={{root: styles.iconClass}}/>
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
                  <Icon className='icon-run-process' classes={{root: styles.iconClass}}/>
                  RUN PROCESS</Button>
                <div className={styles.actionButtonsSeparatorEditMode}/>
                <Button className={styles.actionButtonEditMode}
                        onClick={this.onCancelEdit}>CANCEL</Button>
                <Button className={styles.actionButtonEditMode}
                        disabled={!this.state.hasPendingChanges}
                        onClick={this.onSaveEdit}>SAVE</Button>
              </div>
            </div>
          </div>}

        {this.state.selectedTabValue === 0 &&
          <div className={styles.mediaScreen}>
            <div className={styles.mediaView}>
              <div className={styles.mediaPlayerView}/>
              <div className={styles.sourceLabel}>
                Source: {this.getMediaSource()}
              </div>
            </div>

            <div className={styles.engineCategoryView}>

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
              {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'music' &&
              <div>Music component</div>}

            </div>
          </div>}

        {this.state.isInfoPanelOpen &&
          <MediaInfoPanel tdo={this.props.tdo} engineCategories={this.props.engineCategories} onClose={this.toggleInfoPanel} />}


        {this.state.selectedTabValue === 1 && <div>Content Template</div>}
      </Paper>
    );
  }
}
