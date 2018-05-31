import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Paper from '@material-ui/core/Paper';
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
  Image,
  MediaPlayer,
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
  StructuredDataEngineOutput
} from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { application: applicationModule } = modules;
import { withPropsOnChange } from 'recompose';
import { guid } from '../../shared/util';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import styles from './styles.scss';
import * as mediaDetailsModule from '../../redux/modules/mediaDetails';
import widget from '../../shared/widget';

@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@connect(
  (state, { id }) => ({
    engineCategories: mediaDetailsModule.getEngineCategories(state, id),
    tdo: mediaDetailsModule.getTdo(state, id),
    isLoadingTdo: mediaDetailsModule.isLoadingTdo(state, id),
    engineResultsByEngineId: mediaDetailsModule.getEngineResultsByEngineId(
      state,
      id
    ),
    selectedEngineCategory: mediaDetailsModule.getSelectedEngineCategory(
      state,
      id
    ),
    selectedEngineId: mediaDetailsModule.getSelectedEngineId(state, id),
    contentTemplates: mediaDetailsModule.getContentTemplates(state, id),
    tdoContentTemplates: mediaDetailsModule.getTdoContentTemplates(
      state,
      id
    ),
    isEditModeEnabled: mediaDetailsModule.isEditModeEnabled(state, id),
    isInfoPanelOpen: mediaDetailsModule.isInfoPanelOpen(state, id),
    isExpandedMode: mediaDetailsModule.isExpandedModeEnabled(state, id),
    libraries: mediaDetailsModule.getLibraries(state, id),
    entities: mediaDetailsModule.getEntities(state, id),
    schemasById: mediaDetailsModule.getSchemasById(state, id),
    widgetError: mediaDetailsModule.getWidgetError(state, id),
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
    toggleExpandedMode: mediaDetailsModule.toggleExpandedMode,
    fetchApplications: applicationModule.fetchApplications
  },
  null,
  { withRef: true }
)
class MediaDetailsWidget extends React.Component {
  static propTypes = {
    id: string.isRequired,
    initializeWidget: func,
    mediaId: number.isRequired,
    fetchApplications: func.isRequired,
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
    isLoadingTdo: bool,
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
    isEditModeEnabled: bool,
    isInfoPanelOpen: bool,
    isExpandedMode: bool,
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
    schemasById: objectOf(any),
    googleMapsApiKey: string,
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
    widgetError: string
  };

  static defaultProps = {
    libraries: [],
    entities: [],
    schemasById: {}
  };

  static contextTypes = {
    store: object.isRequired // eslint-disable-line
  };

  state = {
    selectedTabValue: 'mediaDetails',
    hasPendingChanges: false
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    this.props.initializeWidget(this.props.id);
  }

  componentDidMount() {
    this.props.loadTdoRequest(this.props.id, this.props.mediaId);
    this.props.fetchApplications();
  }

  mediaPlayerRef = ref => {
    this.mediaPlayer = ref;
  };

  handleUpdateMediaPlayerTime = (startTime, stopTime) => {
    this.mediaPlayer.seek(startTime / 1000);
  };

  handleRunProcess = () => {
    this.props.onRunProcess();
  };

  handleEngineCategoryChange = selectedCategoryId => {
    const selectedCategory = this.props.engineCategories.find(
      category => category.id === selectedCategoryId
    );
    // Set the new engine category and set engine id to the first engine in the list.
    this.props.selectEngineCategory(this.props.id, selectedCategory);
  };

  getSelectedCategoryMessage = () => {
    if (this.props.isEditModeEnabled) {
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
    return get(this.props, 'tdo.primaryAsset.signedUri');
  };

  isEditableEngineResults = () => {
    if (!get(this.props, 'selectedEngineCategory.editable')) {
      return false;
    }
    return !this.isMediaPublic() && this.isOwnMedia();
  };

  isMediaPublic = () => {
    if (!get(this.props, 'tdo.security.global', false)) {
      return false;
    }
    // check flag explicitly set to false
    if (get(this.props, 'tdo.isPublic') === false) {
      return false;
    }
    return true;
  };

  isOwnMedia = () => {
    if (get(this.props, 'tdo.isOwn') === true) {
      return true;
    }
    const applicationIds = get(this.props.kvp, 'applicationIds', []);
    const tdoApplicationId = get(this.props, 'tdo.applicationId');
    if (
      tdoApplicationId &&
      applicationIds.includes(tdoApplicationId)
    ) {
      return true;
    }
    return false;
  };

  toggleEditMode = () => {
    this.props.toggleEditMode(this.props.id);
  };

  toggleExpandedMode = () => {
    this.props.toggleExpandedMode(this.props.id);
  };

  onSaveEdit = () => {
    this.toggleEditMode();
  };

  onCancelEdit = () => {
    if (this.props.isExpandedMode) {
      this.toggleExpandedMode();
    }
    if (this.props.isEditModeEnabled) {
      this.toggleEditMode();
    }
  };

  toggleInfoPanel = () => {
    this.props.toggleInfoPanel(this.props.id);
  };

  handleSelectEngine = engineId => {
    this.props.setEngineId(this.props.id, engineId);
  };

  handleTabChange = (evt, selectedTabValue) => {
    if (selectedTabValue === 'contentTemplates') {
      this.props.loadContentTemplates(this.props.id);
    }
    this.setState({ selectedTabValue });
  };

  updateTdo = tdoData => {
    if (!tdoData) {
      return;
    }
    this.props.updateTdoRequest(
      this.props.id,
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
      this.props.id,
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
      isInfoPanelOpen,
      isExpandedMode,
      currentMediaPlayerTime,
      isEditModeEnabled,
      libraries,
      entities,
      contentTemplates,
      tdo,
      isLoadingTdo,
      tdoContentTemplates,
      schemasById,
      widgetError,
      googleMapsApiKey
    } = this.props;

    let isImage = /^image\/.*/.test(get(tdo, 'details.veritoneFile.mimetype'));

    let mediaPlayerTimeInMs = Math.floor(currentMediaPlayerTime * 1000);
    return (
      <FullScreenDialog open className={styles.mdpFullScreenDialog}>
        <Paper className={styles.mediaDetailsPageContent}>
          {!isExpandedMode && (
            <div>
              <div className={styles.pageHeader}>
                {get(
                  this.props,
                  'tdo.details.veritoneFile.filename.length',
                  0
                ) > 64 && (
                  <Tooltip
                    id="truncated-file-name-tooltip"
                    title={get(this.props, 'tdo.details.veritoneFile.filename')}
                    PopperProps={{ style: { pointerEvents: 'none', marginTop: '5px', top: '-10px' } }}
                  >
                    <div className={styles.pageHeaderTitleLabel}>
                      {get(
                        this.props,
                        'tdo.details.veritoneFile.filename',
                        ''
                      ).substring(0, 63) + '...'}
                    </div>
                  </Tooltip>
                )}
                {get(this.props, 'tdo.id') && get(
                  this.props,
                  'tdo.details.veritoneFile.filename.length',
                  0
                ) <= 64 && (
                  <div className={styles.pageHeaderTitleLabel}>
                    {get(this.props, 'tdo.details.veritoneFile.filename', 'No Filename')}
                  </div>
                )}
                {!get(this.props, 'tdo.id') && (
                  <div className={styles.pageHeaderTitleLabel}>{!isLoadingTdo && ('No Filename')}</div>
                )}
                <div className={styles.pageHeaderActionButtons}>
                  {get(this.props, 'tdo.id') &&
                    <Tooltip
                      id="tooltip-run-process"
                      title="Run Process"
                      PopperProps={{ style: { pointerEvents: 'none', marginTop: '5px', top: '-20px' } }}
                    >
                      <IconButton
                        className={styles.pageHeaderActionButton}
                        onClick={this.handleRunProcess}
                        aria-label="Run process"
                      >
                        <Icon
                          className="icon-run-process"
                          classes={{root: styles.iconClass}}
                        />
                      </IconButton>
                    </Tooltip>}
                  {get(this.props, 'tdo.details', null) &&
                    <Tooltip
                      id="tooltip-show-metadata"
                      title="Show Metadata"
                      PopperProps={{ style: { pointerEvents: 'none', marginTop: '5px', top: '-20px' } }}
                    >
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
                    </Tooltip>}
                  {(get(this.props, 'tdo.id') || get(this.props, 'tdo.details', null)) &&
                    <div className={styles.pageHeaderActionButtonsSeparator} />}
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

              {isLoadingTdo &&
                <div className={styles.tdoLoadingProgress}>
                  <CircularProgress
                    size={100}
                    color={'primary'}
                  />
                </div>}
              {!isLoadingTdo && !get(this.props, 'tdo.id') &&
                <div className={styles.widgetErrorContainer}>
                  <div className={styles.widgetError}>
                    <img className={styles.errorImage} src='//static.veritone.com/veritone-ui/warning-icon-lg.svg'/>
                    <div className={styles.errorMessage}>{widgetError}</div>
                  </div>
                </div>}

              {get(this.props, 'tdo.id') &&
                <Tabs
                  value={this.state.selectedTabValue}
                  onChange={this.handleTabChange}
                  classes={{
                    flexContainer: styles.mediaDetailsPageTabSelector,
                    indicator: styles.tabIndicator
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
                </Tabs>}
              {selectedEngineCategory &&
                this.state.selectedTabValue === 'mediaDetails' && (
                  <div className={styles.engineActionHeader}>
                      <div className={styles.engineCategorySelector}>
                        <EngineCategorySelector
                          engineCategories={this.props.engineCategories}
                          selectedEngineCategoryId={selectedEngineCategory.id}
                          onSelectEngineCategory={
                            this.handleEngineCategoryChange
                          }
                        />
                      </div>
                      {this.isEditableEngineResults() && (
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
                )}
            </div>
          )}

          {isExpandedMode &&
            this.state.selectedTabValue === 'mediaDetails' && (
              <div>
                <div className={styles.pageHeaderEditMode}>
                  <IconButton
                    className={styles.backButtonEditMode}
                    onClick={this.onCancelEdit}
                    aria-label="Back"
                  >
                    <Icon
                      className="icon-arrow-back"
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                  {isEditModeEnabled && (
                    <div className={styles.pageHeaderTitleLabelEditMode}>
                      Edit Mode: {selectedEngineCategory.name}
                    </div>
                  )}
                  {!isEditModeEnabled && (
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
                    {isEditModeEnabled && (
                      <div className={styles.actionButtonsSeparatorEditMode} />
                    )}
                    {isEditModeEnabled && (
                      <Button
                        className={styles.actionButtonEditMode}
                        onClick={this.onCancelEdit}
                      >
                        CANCEL
                      </Button>
                    )}
                    {isEditModeEnabled && (
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

          {this.state.selectedTabValue === 'mediaDetails' && (
            <div className={styles.mediaScreen}>
              {!isExpandedMode && get(this.props, 'tdo.id') && (
                <div className={styles.mediaView}>
                  {isImage ? (
                    <Image
                      src={this.getPrimaryAssetUri()}
                      width="100%"
                      height="100%"
                      type="contain"
                    />
                  ) : (
                    <MediaPlayer
                      store={this.context.store}
                      playerRef={this.mediaPlayerRef}
                      src={this.getPrimaryAssetUri()}
                      streams={get(this.props, 'tdo.streams')}
                    />
                  )}
                  {this.getMediaSource() &&
                    <div className={styles.sourceLabel}>
                      Source: {this.getMediaSource()}
                    </div>}
                </div>
              )}
              {selectedEngineId && (
                <div className={styles.engineCategoryView}>
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'transcript' && (
                      <TranscriptEngineOutput
                        editMode={isEditModeEnabled}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        data={engineResultsByEngineId[selectedEngineId]}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
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
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                        onObjectOccurrenceClick={
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
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'translate' && (
                      <TranslationEngineOutput
                        contents={engineResultsByEngineId[selectedEngineId]}
                        onClick={this.handleUpdateMediaPlayerTime}
                        onRerunProcess={this.handleRunProcess}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        defaultLanguage={'en-US'}
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
                        startTimeStamp={
                          tdo && tdo.startDateTime ? tdo.startDateTime : null
                        }
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
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
                        schemasById={schemasById}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onExpandClick={this.toggleExpandedMode}
                        isExpandedMode={isExpandedMode}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'music' && (
                      <div>No {selectedEngineCategory.categoryType} data</div>
                    )}
                </div>
              )}
            </div>
          )}

          {isInfoPanelOpen && (
            <MediaInfoPanel
              tdo={this.props.tdo}
              engineCategories={engineCategories}
              contextMenuExtensions={this.props.contextMenuExtensions}
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
