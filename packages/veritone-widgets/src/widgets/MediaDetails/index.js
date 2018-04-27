import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tabs, { Tab } from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import {
  bool,
  func,
  number,
  string,
  shape,
  arrayOf,
  any,
  object,
  objectOf
} from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import {
  EngineCategorySelector,
  ObjectDetectionEngineOutput,
  MediaInfoPanel,
  video,
  FullScreenDialog,
  OCREngineOutputView,
  SentimentEngineOutput,
  TranscriptEngineOutput,
  FaceEngineOutput,
  FingerprintEngineOutput,
  LogoDetectionEngineOutput,
  ContentTemplateForm,
  GeoEngineOutput,
  TranslationEngineOutput,
  StructuredDataEngineOutput,
} from 'veritone-react-common';
import Tooltip from 'material-ui/Tooltip';
import cx from 'classnames';
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
    contentTemplates: mediaDetailsModule.contentTemplates(state, _widgetId),
    tdoContentTemplates: mediaDetailsModule.tdoContentTemplates(
      state,
      _widgetId
    ),
    editModeEnabled: mediaDetailsModule.editModeEnabled(state, _widgetId),
    infoPanelIsOpen: mediaDetailsModule.infoPanelIsOpen(state, _widgetId),
    expandedMode: mediaDetailsModule.expandedModeEnabled(state, _widgetId),
    libraries: mediaDetailsModule.libraries(state, _widgetId),
    entities: mediaDetailsModule.entities(state, _widgetId),
    schemaById: mediaDetailsModule.schemaById(state, _widgetId),
    currentMediaPlayerTime: state.player.currentTime
  }),
  {
    initializeWidget: mediaDetailsModule.initializeWidget,
    loadTdoRequest: mediaDetailsModule.loadTdoRequest,
    updateTdoRequest: mediaDetailsModule.updateTdoRequest,
    selectEngineCategory: mediaDetailsModule.selectEngineCategory,
    setEngineId: mediaDetailsModule.setEngineId,
    toggleEditMode: mediaDetailsModule.toggleEditMode,
    toggleInfoPanel: mediaDetailsModule.toggleInfoPanel,
    loadContentTemplates: mediaDetailsModule.loadContentTemplates,
    updateTdoContentTemplates: mediaDetailsModule.updateTdoContentTemplates,
    toggleExpandedMode: mediaDetailsModule.toggleExpandedMode
  },
  null,
  { withRef: true }
)
class MediaDetailsWidget extends React.Component {
  static propTypes = {
    _widgetId: string.isRequired,
    initializeWidget: func,
    mediaId: number.isRequired,
    kvp: shape({
      features: objectOf(any),
      applicationIds: arrayOf(string)
    }),
    onRunProcess: func,
    onClose: func,
    loadTdoRequest: func,
    updateTdoRequest: func,
    engineCategories: arrayOf(
      shape({
        name: string,
        id: string,
        editable: bool,
        iconClass: string,
        categoryType: string,
        engines: arrayOf(
          shape({
            id: string,
            name: string
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
          programLiveImage: string,
          signedProgramLiveImage: string
        }),
        tags: arrayOf(
          shape({
            value: string
          })
        )
      }),
      startDateTime: string,
      stopDateTime: string,
      security: shape({
        global: bool
      }),
      applicationId: string
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
    setEngineId: func,
    toggleEditMode: func,
    toggleInfoPanel: func,
    editModeEnabled: bool,
    infoPanelIsOpen: bool,
    expandedMode: bool,
    toggleExpandedMode: func,
    currentMediaPlayerTime: number,
    libraries: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    entities: arrayOf(
      shape({
        id: string,
        name: string,
        libraryId: string,
        profileImageUrl: string,
        jsondata: objectOf(string)
      })
    ),
    loadContentTemplates: func,
    updateTdoContentTemplates: func,
    contentTemplates: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any)
      })
    ),
    tdoContentTemplates: objectOf(
      shape({
        id: string,
        name: string.isRequired,
        status: string,
        definition: objectOf(any),
        data: objectOf(any)
      })
    ),
    schemaById: objectOf(any),
    googleMapsApiKey: string
  };

  static defaultProps = {
    libraries: [],
    entities: [],
    schemaById: {}
  };

  static contextTypes = {
    store: object.isRequired // eslint-disable-line
  };

  state = {
    selectedTabValue: 'mediaDetails',
    hasPendingChanges: false
  };

  componentWillMount() {
    this.props.initializeWidget(this.props._widgetId);
  }

  componentDidMount() {
    this.props.loadTdoRequest(this.props._widgetId, this.props.mediaId);
  }

  mediaPlayerRef = ref => {
    this.mediaPlayer = ref;
  };

  handleUpdateMediaPlayerTime = (startTime, stopTime) => {
    this.mediaPlayer.seek(startTime / 1000);
  };

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
    if (this.props.editModeEnabled) {
      return (
        'Use the edit screen below to correct ' +
        this.props.selectedEngineCategory.name.toLowerCase() +
        's.'
      );
    }
    return '';
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

  getPrimaryAssetUri = () => {
    return get(this.props, 'tdo.primaryAsset.uri');
  };

  toggleEditMode = () => {
    this.props.toggleEditMode(this.props._widgetId);
  };

  toggleExpandedMode = () => {
    this.props.toggleExpandedMode(this.props._widgetId);
  };

  onSaveEdit = () => {
    this.toggleEditMode();
  };

  onCancelEdit = () => {
    if (this.props.expandedMode) {
      this.toggleExpandedMode();
    }
    if (this.props.editModeEnabled) {
      this.toggleEditMode();
    }
  };

  toggleInfoPanel = () => {
    this.props.toggleInfoPanel(this.props._widgetId);
  };

  handleSelectEngine = engineId => {
    this.props.setEngineId(this.props._widgetId, engineId);
  };

  handleTabChange = (evt, selectedTabValue) => {
    if (selectedTabValue === 'contentTemplates') {
      this.props.loadContentTemplates(this.props._widgetId);
    }
    this.setState({ selectedTabValue });
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

  updateContentTemplates = data => {
    const contentTemplates = data.contentTemplates;
    const contentTemplatesToCreate = [];
    const contentTemplatesToDelete = [];
    // find content templates that were added or modified
    Object.keys(contentTemplates).forEach(schemaId => {
      if (
        !contentTemplates[schemaId].assetId ||
        !this.props.tdoContentTemplates[schemaId]
      ) {
        contentTemplatesToCreate.push(contentTemplates[schemaId]);
      } else {
        const originalTemplate = this.props.tdoContentTemplates[schemaId];
        const newTemplate = contentTemplates[schemaId];
        if (
          JSON.stringify(originalTemplate.data) !==
          JSON.stringify(newTemplate.data)
        ) {
          contentTemplatesToDelete.push(originalTemplate);
          contentTemplatesToCreate.push(newTemplate);
        }
      }
    });
    // find content templates that were removed
    Object.keys(this.props.tdoContentTemplates).forEach(schemaId => {
      if (!contentTemplates[schemaId]) {
        contentTemplatesToDelete.push(this.props.tdoContentTemplates[schemaId]);
      }
    });
    this.props.updateTdoContentTemplates(
      this.props._widgetId,
      contentTemplatesToDelete,
      contentTemplatesToCreate
    );
  };

  render() {
    let {
      engineCategories,
      selectedEngineCategory,
      selectedEngineId,
      engineResultsByEngineId,
      infoPanelIsOpen,
      expandedMode,
      currentMediaPlayerTime,
      editModeEnabled,
      libraries,
      entities,
      contentTemplates,
      tdo,
      tdoContentTemplates,
      schemaById,
      googleMapsApiKey
    } = this.props;

    let mediaPlayerTimeInMs = Math.floor(currentMediaPlayerTime * 1000);
    return (
      <FullScreenDialog open>
        <Paper className={styles.mediaDetailsPageContent}>
          {!expandedMode && (
            <div>
              <div className={styles.pageHeader}>
                {get(
                  this.props,
                  'tdo.details.veritoneFile.filename.length',
                  0
                ) > 120 && (
                  <Tooltip
                    id="truncated-file-name-tooltip"
                    title={get(this.props, 'tdo.details.veritoneFile.filename')}
                    placement="bottom-start"
                    enterDelay={1000}
                    leaveDelay={700}
                  >
                    <div className={styles.pageHeaderTitleLabel}>
                      {get(
                        this.props,
                        'tdo.details.veritoneFile.filename',
                        ''
                      ).substring(0, 119) + '...'}
                    </div>
                  </Tooltip>
                )}
                {get(
                  this.props,
                  'tdo.details.veritoneFile.filename.length',
                  0
                ) <= 120 && (
                  <div className={styles.pageHeaderTitleLabel}>
                    {get(this.props, 'tdo.details.veritoneFile.filename', '')}
                  </div>
                )}
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
                indicatorColor="#f9a02c"
                classes={{
                  flexContainer: styles.mediaDetailsPageTabSelector
                }}
              >
                <Tab
                  label="Media Details"
                  classes={{ root: styles.pageTabLabel }}
                  value="mediaDetails"
                  style={{
                    fontWeight:
                      this.state.selectedTabValue === 'mediaDetails' ? 500 : 400
                  }}
                />
                <Tab
                  label="Content Templates"
                  classes={{ root: styles.pageTabLabel }}
                  value="contentTemplates"
                  style={{
                    fontWeight:
                      this.state.selectedTabValue === 'contentTemplates'
                        ? 500
                        : 400
                  }}
                />
              </Tabs>

              {selectedEngineCategory &&
                this.state.selectedTabValue === 'mediaDetails' && (
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

          {expandedMode &&
            this.state.selectedTabValue === 'mediaDetails' && (
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
                  {editModeEnabled && (
                    <div className={styles.pageHeaderTitleLabelEditMode}>
                      Edit Mode: {selectedEngineCategory.name}
                    </div>
                  )}
                  {!editModeEnabled && (
                    <div className={styles.pageHeaderTitleLabelEditMode}>
                      {selectedEngineCategory.name}
                    </div>
                  )}
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
                    {editModeEnabled && (
                      <div className={styles.actionButtonsSeparatorEditMode} />
                    )}
                    {editModeEnabled && (
                      <Button
                        className={styles.actionButtonEditMode}
                        onClick={this.onCancelEdit}
                      >
                        CANCEL
                      </Button>
                    )}
                    {editModeEnabled && (
                      <Button
                        className={styles.actionButtonEditMode}
                        disabled={!this.state.hasPendingChanges}
                        onClick={this.onSaveEdit}
                      >
                        SAVE
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

          {this.state.selectedTabValue === 'mediaDetails' &&
            selectedEngineId && (
              <div className={styles.mediaScreen}>
                <div className={styles.mediaView}>
                  <video.Player
                    src={this.getPrimaryAssetUri()}
                    className={styles.videoPlayer}
                    store={this.context.store}
                    ref={this.mediaPlayerRef}
                  >
                    <video.BigPlayButton
                      className={styles.mediaPlayButton}
                      position="center"
                    />
                  </video.Player>
                  <div className={styles.sourceLabel}>
                    Source: {this.getMediaSource()}
                  </div>
                </div>

                <div className={styles.engineCategoryView}>
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'transcript' && (
                      <TranscriptEngineOutput
                        editMode={editModeEnabled}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        data={engineResultsByEngineId[selectedEngineId]}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onExpandClicked={this.toggleExpandedMode}
                        onClick={this.handleUpdateMediaPlayerTime}
                        neglectableTimeMs={100}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'face' && (
                      <FaceEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        libraries={libraries}
                        entities={entities}
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onExpandClicked={this.toggleExpandedMode}
                        onFaceOccurrenceClicked={
                          this.handleUpdateMediaPlayerTime
                        }
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'object' && (
                      <ObjectDetectionEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onExpandClicked={this.toggleExpandedMode}
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                        onObjectOccurrenceClicked={
                          this.handleUpdateMediaPlayerTime
                        }
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'logo' && (
                      <LogoDetectionEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onExpandClicked={this.toggleExpandedMode}
                        onEntrySelected={this.handleUpdateMediaPlayerTime}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'ocr' && (
                      <OCREngineOutputView
                        data={engineResultsByEngineId[selectedEngineId]}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onOcrClicked={this.handleUpdateMediaPlayerTime}
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'fingerprint' && (
                      <FingerprintEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        entities={entities}
                        libraries={libraries}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onExpandClicked={this.toggleExpandedMode}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'translate' && (
                      <TranslationEngineOutput
                        contents={engineResultsByEngineId[selectedEngineId]}
                        onClick={this.handleUpdateMediaPlayerTime}
                        //onRerunProcess={handle rerun process callback}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onExpandClicked={this.toggleExpandedMode}
                        //languages={language options}
                        //defaultLanguage={'en-US'}
                        //onLanguageChanged={handle on language change callback}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'sentiment' && (
                      <SentimentEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        className={cx(
                          styles.engineOuputContainer,
                          styles.sentimentChartViewRoot
                        )}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        onClick={this.handleUpdateMediaPlayerTime}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'geolocation' && (
                      <GeoEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        startTimeStamp={(tdo && tdo.startDateTime) ? tdo.startDateTime : null}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onExpandClicked={this.toggleExpandedMode}
                        className={styles.engineOuputContainer}
                        apiKey={googleMapsApiKey}
                        onClick={this.handleUpdateMediaPlayerTime}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType ===
                      'stationPlayout' && (
                      <div>No {selectedEngineCategory.categoryType} data</div>
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'correlation' && (
                      <StructuredDataEngineOutput
                        data={engineResultsByEngineId[selectedEngineId]}
                        schemaById={schemaById}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'music' && (
                      <div>No {selectedEngineCategory.categoryType} data</div>
                    )}
                </div>
              </div>
            )}

          {infoPanelIsOpen && (
            <MediaInfoPanel
              tdo={this.props.tdo}
              engineCategories={engineCategories}
              kvp={this.props.kvp}
              onClose={this.toggleInfoPanel}
              onSaveMetadata={this.updateTdo}
            />
          )}

          {this.state.selectedTabValue === 'contentTemplates' &&
            contentTemplates && (
              <ContentTemplateForm
                templateData={contentTemplates}
                initialTemplates={tdoContentTemplates}
                onSubmit={this.updateContentTemplates}
              />
            )}
        </Paper>
      </FullScreenDialog>
    );
  }
}

export default widget(MediaDetailsWidget);
