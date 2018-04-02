import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import { bool, func, number, string, shape, arrayOf, any } from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { EngineCategorySelector } from 'veritone-react-common';
import { MediaInfoPanel } from 'veritone-react-common';
import { FullScreenDialog } from 'veritone-react-common';
import { OCREngineOutputView } from 'veritone-react-common';

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
    ),
    selectedEngineCategory: mediaDetailsModule.selectedEngineCategory(
      state,
      _widgetId
    ),
    selectedEngineId: mediaDetailsModule.selectedEngineId(state, _widgetId),
    editModeEnabled: mediaDetailsModule.editModeEnabled(state, _widgetId),
    infoPanelIsOpen: mediaDetailsModule.infoPanelIsOpen(state, _widgetId)
  }),
  {
    loadEngineCategoriesRequest: mediaDetailsModule.loadEngineCategoriesRequest,
    loadEngineResultsRequest: mediaDetailsModule.loadEngineResultsRequest,
    loadTdoRequest: mediaDetailsModule.loadTdoRequest,
    updateTdoRequest: mediaDetailsModule.updateTdoRequest,
    selectEngineCategory: mediaDetailsModule.selectEngineCategory,
    setEngineId: mediaDetailsModule.setEngineId,
    toggleEditMode: mediaDetailsModule.toggleEditMode,
    toggleInfoPanel: mediaDetailsModule.toggleInfoPanel
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
    }),
    selectEngineCategory: func,
    selectedEngineCategory: shape({
      id: string,
      name: string,
      iconClass: string,
      editable: bool,
      categoryType: string,
      engines: arrayOf(
        shape({
          id: string,
          name: string,
          completedDateTime: number
        })
      )
    }),
    selectedEngineId: string,
    toggleEditMode: func,
    toggleInfoPanel: func,
    editModeEnabled: bool,
    infoPanelIsOpen: bool
  };

  state = {
    selectedTabValue: 0,
    hasPendingChanges: false
  };

  componentDidMount() {
    this.props.loadEngineCategoriesRequest(
      this.props._widgetId,
      this.props.mediaId
    );
    this.props.loadTdoRequest(this.props._widgetId, this.props.mediaId);
  }

  handleRunProcess = () => {
    this.props.onRunProcess();
    // close MediaDetails dialog to focus on the run process dialog
    this.props.onClose();
  };

  handleEngineCategoryChange = selectedCategoryId => {
    const selectedCategory = this.props.engineCategories.find(
      category => category.id === selectedCategoryId
    );

    // Set the new engine category and set engine id to the first engine in the list.
    this.props.selectEngineCategory(this.props._widgetId, selectedCategory);
  };

  getSelectedCategoryMessage = () => {
    return (
      'Use the edit screen below to correct ' +
      this.props.selectedEngineCategory.name.toLowerCase() +
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
    this.props.toggleEditMode(this.props._widgetId);
  };

  onSaveEdit = () => {
    this.toggleEditMode();
  };

  onCancelEdit = () => {
    this.toggleEditMode();
  };

  toggleInfoPanel = () => {
    this.props.toggleInfoPanel(this.props._widgetId);
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
    let {
      selectedEngineCategory,
      selectedEngineId,
      engineResultsByEngineId,
      editModeEnabled,
      infoPanelIsOpen
    } = this.props;
    
    return (
      <FullScreenDialog open>
        <Paper className={styles.mediaDetailsPageContent}>
          {!editModeEnabled && (
            <div>
              <div className={styles.pageHeader}>
                <div className={styles.pageHeaderTitleLabel}>
                  {this.getMediaFileName()}
                </div>
                <div className={styles.pageHeaderActionButtons}>
                  <IconButton
                    className={styles.pageHeaderActionButton}
                    onClick={this.handleRunProcess}
                    aria-label="Run process"
                  >
                    <Icon
                      className="icon-run-process"
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  <IconButton
                    className={styles.pageHeaderActionButton}
                    onClick={this.toggleInfoPanel}
                    aria-label="Info Panel"
                  >
                    <Icon
                      className="icon-info-panel"
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  <div className={styles.pageHeaderActionButtonsSeparator} />
                  <IconButton
                    className={styles.pageCloseButton}
                    onClick={this.props.onClose}
                    aria-label="Close"
                  >
                    <Icon
                      className="icon-close-exit"
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
                  label="Media Details"
                  classes={{ root: styles.pageTabLabel }}
                  style={{
                    fontWeight: this.state.selectedTabValue === 0 ? 500 : 400
                  }}
                />
                <Tab
                  label="Content Templates"
                  classes={{ root: styles.pageTabLabel }}
                  style={{
                    fontWeight: this.state.selectedTabValue === 1 ? 500 : 400
                  }}
                />
              </Tabs>

              {selectedEngineCategory &&
                this.state.selectedTabValue === 0 && (
                  <div className={styles.engineActionHeader}>
                    <div className={styles.engineActionContainer}>
                      <div className={styles.engineCategorySelector}>
                        <EngineCategorySelector
                          engineCategories={this.props.engineCategories}
                          selectedEngineCategoryId={selectedEngineCategory.id}
                          onSelectEngineCategory={
                            this.handleEngineCategoryChange
                          }
                        />
                      </div>
                      {selectedEngineCategory.editable && (
                        <Button
                          variant="raised"
                          color="primary"
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

          {editModeEnabled &&
            this.state.selectedTabValue === 0 && (
              <div>
                <div className={styles.pageHeaderEditMode}>
                  <IconButton
                    className={styles.backButtonEditMode}
                    onClick={this.onCancelEdit}
                    aria-label="Back"
                    disableRipple
                  >
                    <Icon
                      className="icon-arrow-back"
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  <div className={styles.pageHeaderTitleLabelEditMode}>
                    Edit Mode: {selectedEngineCategory.name}
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
                        className="icon-run-process"
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

          {this.state.selectedTabValue === 0 &&
            selectedEngineId && (
              <div className={styles.mediaScreen}>
                <div className={styles.mediaView}>
                  <div className={styles.mediaPlayerView} />
                  <div className={styles.sourceLabel}>
                    Source: {this.getMediaSource()}
                  </div>
                </div>

                <div className={styles.engineCategoryView}>
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'transcript' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'face' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'object' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'logo' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'ocr' && (
                      <OCREngineOutputView
                        data={engineResultsByEngineId[selectedEngineId]}
                        className={styles.engineOuputContainer}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'fingerprint' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'translate' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'sentiment' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'geolocation' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType ===
                      'stationPlayout' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'music' && (
                      <div>{selectedEngineCategory.categoryType} component</div>
                    )}
                </div>
              </div>
            )}

          {infoPanelIsOpen && (
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
