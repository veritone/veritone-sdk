import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import { bool, func, number, string, shape, arrayOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { EngineCategorySelector } from 'veritone-react-common';
import { EngineOutputHeader } from 'veritone-react-common';
import { SentimentEngineOutput } from 'veritone-react-common';
import { MediaInfoPanel } from 'veritone-react-common';
import { FullScreenDialog } from 'veritone-react-common';
import styles from './styles.scss';

import * as mediaDetailsModule from '../../redux/modules/mediaDetails';
import widget from '../../shared/widget';

@connect(
  (state, { _widgetId }) => ({
    engineCategories: mediaDetailsModule.engineCategories(state, _widgetId),
    tdo: mediaDetailsModule.tdo(state, _widgetId),
    engineResultsByEngineId: mediaDetailsModule.engineResultsByEngineId(
      state,
      _widgetId
    )
  }),
  {
    loadEngineCategoriesRequest: mediaDetailsModule.loadEngineCategoriesRequest,
    loadEngineResultsRequest: mediaDetailsModule.loadEngineResultsRequest,
    loadTdoRequest: mediaDetailsModule.loadTdoRequest,
    updateTdoRequest: mediaDetailsModule.updateTdoRequest
  },
  null,
  { withRef: true }
)
class MediaDetailsWidget extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    mediaId: number.isRequired,
    onRunProcess: func,
    onClose: func,
    loadEngineCategoriesRequest: func,
    loadEngineResultsRequest: func,
    loadTdoRequest: func,
    updateTdoRequest: func,
    success: bool,
    error: bool,
    warning: bool,
    statusMessage: string,

    engineCategories: arrayOf(
      shape({
        name: string,
        id: string,
        editable: bool,
        iconClass: string,
        engines: arrayOf(
          shape({
            id: string,
            name: string,
            completedDateTime: number
          })
        )
      })
    ),
    tdo: shape({
      id: string,
      details: shape({
        veritoneCustom: shape({
          source: string
        }),
        date: string,
        veritoneFile: shape({
          filename: string
        }),
        veritoneProgram: shape({
          programId: string,
          programName: string,
          programImage: string,
          programLiveImage: string
        }),
        tags: arrayOf(
          shape({
            value: string
          })
        )
      }),
      startDateTime: string,
      stopDateTime: string
    }),
    engineResultsByEngineId: shape({
      engineId: arrayOf(any)
    })
  };

  state = {
    selectedEngineCategory:
      this.props.engineCategories && this.props.engineCategories.length
        ? this.props.engineCategories[0]
        : null,
    selectedTabValue: 0,
    isInfoPanelOpen: false,
    isEditMode: false,
    hasPendingChanges: false,

    mediaPlayerTimeMs: 0, // propagate from the redux

    selectedEngineId: null // goes to the redux
  };

  componentDidMount() {
    this.props.loadEngineCategoriesRequest(
      this.props._widgetId,
      this.props.mediaId
    );
    this.props.loadTdoRequest(this.props._widgetId, this.props.mediaId);
  }

  componentWillReceiveProps(nextProps) {
    // preselect 1st engine category - only on the first load
    if (
      !this.state.selectedEngineCategory &&
      nextProps.engineCategories &&
      nextProps.engineCategories.length
    ) {
      const preselectedCategory = nextProps.engineCategories[0];
      this.setState({
        selectedEngineCategory: preselectedCategory
      });
      if (get(preselectedCategory, 'engines.length', 0)) {
        // load all engine results for preselected category first engine
        this.loadEngineResults(preselectedCategory.engines[0].id);
      }
    }
  }

  handleRunProcess = () => {
    this.props.onRunProcess();
    // close MediaDetails dialog to focus on the run process dialog
    this.props.onClose();
  };

  handleTabChange = (event, value) => {
    this.setState({ selectedTabValue: value });
  };

  onSelectEngineCategory = selectedCategoryId => {
    const selectedCategory = this.props.engineCategories.find(
      category => category.id === selectedCategoryId
    );
    const preselectedEngineId = selectedCategory.engines.length ? selectedCategory.engines[0].id : null;
    this.loadEngineResults(preselectedEngineId);
    this.setState({
      selectedEngineCategory: selectedCategory,
      selectedEngineId: preselectedEngineId
    });
  };

  onSelectEngine = event => {
    this.loadEngineResults(event.target.value);
    this.setState({
      selectedEngineId: event.target.value
    });
  };

  loadEngineResults = engineId => {
    if (!engineId || !this.props.tdo || !this.props.tdo.id) {
      return;
    }
    this.props.loadEngineResultsRequest(this.props._widgetId, this.props.tdo.id, engineId);
  };

  onTimeClick = newTimeMs => {
    // TODO:  this should come from redux
    this.setState({
      mediaPlayerTimeMs: newTimeMs
    });
  };

  getSelectedCategoryMessage = () => {
    return (
      'Use the edit screen below to correct ' +
      this.state.selectedEngineCategory.name.toLowerCase() +
      's.'
    );
  };

  getMediaFileName = () => {
    return get(
      this.props,
      'tdo.details.veritoneFile.filename',
      this.props.mediaId
    );
  };

  getMediaSource = () => {
    const veritoneProgram = get(this.props, 'tdo.details.veritoneProgram');
    if (!veritoneProgram) {
      return '';
    }

    if (veritoneProgram.programId === '-1') {
      return 'Private Media';
    }

    return veritoneProgram.programName;
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

  toggleInfoPanel = () => {
    this.setState({
      isInfoPanelOpen: !this.state.isInfoPanelOpen
    });
  };

  updateTdo = tdoData => {
    if (!tdoData) {
      return;
    }
    this.props.updateTdoRequest(
      this.props._widgetId,
      this.props.mediaId,
      tdoData
    );
  };

  render() {
    return (
      <FullScreenDialog open>
        <Paper className={styles.mediaDetailsPageContent}>
          {!this.state.isEditMode && (
            <div>
              <div className={styles.pageHeader}>
                <div className={styles.pageHeaderTitleLabel}>
                  {this.getMediaFileName()}
                </div>
                <div className={styles.pageHeaderActionButtons}>
                  <IconButton
                    className={styles.pageHeaderActionButton}
                    onClick={this.handleRunProcess}
                    aria-label='Run process'
                  >
                    <Icon
                      className='icon-run-process'
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  <IconButton
                    className={styles.pageHeaderActionButton}
                    onClick={this.toggleInfoPanel}
                    aria-label='Info Panel'
                  >
                    <Icon
                      className='icon-info-panel'
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  <div className={styles.pageHeaderActionButtonsSeparator} />
                  <IconButton
                    className={styles.pageCloseButton}
                    onClick={this.props.onClose}
                    aria-label='Close'
                  >
                    <Icon
                      className='icon-close-exit'
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                </div>
              </div>
              <Tabs
                value={this.state.selectedTabValue}
                onChange={this.handleTabChange}
                classes={{
                  flexContainer: styles.mediaDetailsPageTabSelector
                }}
              >
                <Tab
                  label='Media Details'
                  classes={{ root: styles.pageTabLabel }}
                  style={{
                    fontWeight: this.state.selectedTabValue === 0 ? 500 : 400
                  }}
                />
                <Tab
                  label='Content Templates'
                  classes={{ root: styles.pageTabLabel }}
                  style={{
                    fontWeight: this.state.selectedTabValue === 1 ? 500 : 400
                  }}
                />
              </Tabs>

              {this.state.selectedEngineCategory &&
                this.state.selectedTabValue === 0 && (
                  <div className={styles.engineActionHeader}>
                    <div className={styles.engineActionContainer}>
                      <div className={styles.engineCategorySelector}>
                        <EngineCategorySelector
                          engineCategories={this.props.engineCategories}
                          selectedEngineCategoryId={
                            this.state.selectedEngineCategory.id
                          }
                          onSelectEngineCategory={
                            this.onSelectEngineCategory
                          }
                        />
                      </div>
                      {this.state.selectedEngineCategory.editable && (
                        <Button
                          variant='raised'
                          color='primary'
                          className={styles.toEditModeButton}
                          onClick={this.toggleEditMode}
                        >
                          EDIT MODE
                        </Button>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {this.state.isEditMode &&
            this.state.selectedTabValue === 0 && (
              <div>
                <div className={styles.pageHeaderEditMode}>
                  <IconButton
                    className={styles.backButtonEditMode}
                    onClick={this.onCancelEdit}
                    aria-label='Back'
                    disableRipple
                  >
                    <Icon
                      className='icon-arrow-back'
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  <div className={styles.pageHeaderTitleLabelEditMode}>
                    Edit Mode: {this.state.selectedEngineCategory.name}
                  </div>
                </div>
                <div className={styles.pageSubHeaderEditMode}>
                  <div className={styles.editCategoryHelperMessage}>
                    {this.getSelectedCategoryMessage()}
                  </div>
                  <div className={styles.actionButtonsEditMode}>
                    <Button
                      className={styles.runProcessButtonEditMode}
                      onClick={this.handleRunProcess}
                    >
                      <Icon
                        className='icon-run-process'
                        classes={{ root: styles.iconClass }}
                      />
                      RUN PROCESS
                    </Button>
                    <div className={styles.actionButtonsSeparatorEditMode} />
                    <Button
                      className={styles.actionButtonEditMode}
                      onClick={this.onCancelEdit}
                    >
                      CANCEL
                    </Button>
                    <Button
                      className={styles.actionButtonEditMode}
                      disabled={!this.state.hasPendingChanges}
                      onClick={this.onSaveEdit}
                    >
                      SAVE
                    </Button>
                  </div>
                </div>
              </div>
            )}

          {this.state.selectedTabValue === 0 && (
            <div className={styles.mediaScreen}>
              <div className={styles.mediaView}>
                <div className={styles.mediaPlayerView} />
                <div className={styles.sourceLabel}>
                  Source: {this.getMediaSource()}
                </div>
              </div>

              <div className={styles.engineCategoryView}>

                {this.state.selectedEngineCategory && this.state.selectedEngineId &&

                    <EngineOutputHeader title={this.state.selectedEngineCategory.name}>
                      <Select value={this.state.selectedEngineId}
                              onChange={this.onSelectEngine}>
                        {this.state.selectedEngineCategory.engines.map(engine =>
                          <MenuItem key={engine.id} value={engine.id}>{engine.name}</MenuItem>)}
                      </Select>
                    </EngineOutputHeader>
                  }



                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'transcript' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType === 'face' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'object' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType === 'logo' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType === 'ocr' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'fingerprint' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'translate' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                    this.state.selectedEngineCategory.categoryType === 'sentiment' && this.state.selectedEngineId && (
                    <SentimentEngineOutput data={this.props.engineResultsByEngineId[this.state.selectedEngineId]}
                                           mediaPlayerTime={this.state.mediaPlayerTimeMs}
                                           onTimeClick={this.onTimeClick} />
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'geolocation' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'stationPlayout' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}
                  {this.state.selectedEngineCategory &&
                  this.state.selectedEngineCategory.categoryType ===
                  'music' && (
                    <div>
                      {this.state.selectedEngineCategory.categoryType} component
                    </div>
                  )}

              </div>
            </div>
          )}

          {this.state.isInfoPanelOpen && (
            <MediaInfoPanel
              tdo={this.props.tdo}
              engineCategories={this.props.engineCategories}
              onClose={this.toggleInfoPanel}
              onSaveMetadata={this.updateTdo}
            />
          )}

          {/* TODO: uncomment when implemented. Commented out for MVP.
          this.state.selectedTabValue === 1 && <div>Content Template</div>
          */}
        </Paper>
      </FullScreenDialog>
    );
  }
}

export default widget(MediaDetailsWidget);
