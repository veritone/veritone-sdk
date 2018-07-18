import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
import { find, get, some, includes } from 'lodash';
import { Manager, Target, Popper } from 'react-popper';
import {
  EngineCategorySelector,
  ObjectDetectionEngineOutput,
  MediaInfoPanel,
  Image,
  MediaPlayer,
  FullScreenDialog,
  OCREngineOutputView,
  SentimentEngineOutput,
  FingerprintEngineOutput,
  LogoDetectionEngineOutput,
  ContentTemplateForm,
  GeoEngineOutput,
  TranslationEngineOutput,
  StructuredDataEngineOutput,
  EngineOutputNullState,
  withMuiThemeProvider,
  AlertDialog
} from 'veritone-react-common';
import FaceEngineOutput from '../FaceEngineOutput';
import TranscriptEngineOutputWidget from '../TranscriptEngineOutputWidget';
import { modules, util } from 'veritone-redux-common';
const {
  application: applicationModule,
  engineResults: engineResultsModule
} = modules;
import { withPropsOnChange } from 'recompose';
import { guid } from '../../shared/util';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import styles from './styles.scss';
import * as mediaDetailsModule from '../../redux/modules/mediaDetails';
import widget from '../../shared/widget';
import rootSaga from '../../redux/modules/mediaDetails/saga';

const saga = util.reactReduxSaga.saga;

const programLiveImageNullState =
  '//static.veritone.com/veritone-ui/default-nullstate.svg';

@withMuiThemeProvider
@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@saga(rootSaga)
@connect(
  (state, { id }) => ({
    engineCategories: mediaDetailsModule.getEngineCategories(state, id),
    tdo: mediaDetailsModule.getTdo(state, id),
    isLoadingTdo: mediaDetailsModule.isLoadingTdo(state, id),
    isFetchingEngineResults: engineResultsModule.isFetchingEngineResults(state),
    selectedEngineResults: engineResultsModule.engineResultsByEngineId(
      state,
      mediaDetailsModule.getSelectedEngineId(state, id)
    ),
    selectedEngineCategory: mediaDetailsModule.getSelectedEngineCategory(
      state,
      id
    ),
    selectedEngineId: mediaDetailsModule.getSelectedEngineId(state, id),
    contentTemplates: mediaDetailsModule.getContentTemplates(state, id),
    tdoContentTemplates: mediaDetailsModule.getTdoContentTemplates(state, id),
    isEditModeEnabled: mediaDetailsModule.isEditModeEnabled(state, id),
    isInfoPanelOpen: mediaDetailsModule.isInfoPanelOpen(state, id),
    isExpandedMode: mediaDetailsModule.isExpandedModeEnabled(state, id),
    entities: mediaDetailsModule.getEntities(state, id),
    schemasById: mediaDetailsModule.getSchemasById(state, id),
    currentMediaPlayerTime: state.player.currentTime,
    widgetError: mediaDetailsModule.getWidgetError(state, id),
    isSaveEnabled: mediaDetailsModule.isSaveEnabled(state),
    contextMenuExtensions: applicationModule.getContextMenuExtensions(state),
    alertDialogConfig: mediaDetailsModule.getAlertDialogConfig(state, id),
    isDisplayingUserEditedOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      mediaDetailsModule.getSelectedEngineId(state, id)
    ),
    isEditButtonDisabled: mediaDetailsModule.isEditButtonDisabled(state, id),
    showTranscriptBulkEditSnack: mediaDetailsModule.showTranscriptBulkEditSnack(state, id)
  }),
  {
    initializeWidget: mediaDetailsModule.initializeWidget,
    updateTdoRequest: mediaDetailsModule.updateTdoRequest,
    selectEngineCategory: mediaDetailsModule.selectEngineCategory,
    setEngineId: mediaDetailsModule.setEngineId,
    toggleEditMode: mediaDetailsModule.toggleEditMode,
    toggleInfoPanel: mediaDetailsModule.toggleInfoPanel,
    loadContentTemplates: mediaDetailsModule.loadContentTemplates,
    updateTdoContentTemplates: mediaDetailsModule.updateTdoContentTemplates,
    toggleExpandedMode: mediaDetailsModule.toggleExpandedMode,
    saveAssetData: mediaDetailsModule.saveAssetData,
    openConfirmModal: mediaDetailsModule.openConfirmModal,
    closeConfirmModal: mediaDetailsModule.closeConfirmModal,
    discardUnsavedChanges: mediaDetailsModule.discardUnsavedChanges,
    setEditButtonState: mediaDetailsModule.setEditButtonState,
    setShowTranscriptBulkEditSnackState: mediaDetailsModule.setShowTranscriptBulkEditSnackState
  },
  null,
  { withRef: true }
)
class MediaDetailsWidget extends React.Component {
  static propTypes = {
    id: string.isRequired,
    initializeWidget: func,
    mediaId: number.isRequired,
    kvp: shape({
      features: objectOf(any),
      applicationIds: arrayOf(string)
    }),
    onRunProcess: func,
    onClose: func,
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
    isFetchingEngineResults: bool,
    selectedEngineResults: arrayOf(
      shape({
        sourceEngineId: string.isRequired,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            words: arrayOf(
              shape({
                word: string.isRequired,
                confidence: number.isRequired
              })
            ),
            object: shape({
              label: string,
              type: string,
              uri: string,
              entityId: string,
              libraryId: string,
              confidence: number,
              text: string
            }),
            boundingPoly: arrayOf(
              shape({
                x: number,
                y: number
              })
            )
          })
        )
      })
    ),
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
    entities: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired,
        description: string,
        profileImageUrl: string,
        jsondata: objectOf(string),
        libraryId: string,
        library: shape({
          id: string.isRequired,
          name: string.isRequired,
          description: string,
          coverImageUrl: string
        })
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
    saveAssetData: func,
    widgetError: string,
    isSaveEnabled: bool,
    alertDialogConfig: shape({
      show: bool,
      title: string,
      description: string,
      cancelButtonLabel: string,
      confirmButtonLabel: string,
      nextAction: func
    }),
    openConfirmModal: func,
    closeConfirmModal: func,
    discardUnsavedChanges: func,
    isDisplayingUserEditedOutput: bool,
    setEditButtonState: func,
    isEditButtonDisabled: bool,
    setShowTranscriptBulkEditSnackState: func,
    showTranscriptBulkEditSnack: bool
  };

  static contextTypes = {
    store: object.isRequired // eslint-disable-line
  };

  static defaultProps = {
    entities: [],
    schemasById: {}
  };

  state = {
    isMenuOpen: false,
    selectedTabValue: 'mediaDetails'
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillMount() {
    this.props.initializeWidget(this.props.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.selectedEngineId !== this.props.selectedEngineId) {
      this.handleDisableEditBtn(false);
    }
  }

  handleDisableEditBtn = boolVal => {
    this.props.setEditButtonState(this.props.id, boolVal);
  };

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
    return this.canEditMedia();
  };

  canEditMedia = () => {
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
    if (tdoApplicationId && applicationIds.includes(tdoApplicationId)) {
      return true;
    }
    return false;
  };

  toggleEditMode = () => {
    this.props.toggleEditMode(this.props.id, this.props.selectedEngineCategory);
  };

  toggleExpandedMode = () => {
    this.props.toggleExpandedMode(this.props.id);
  };

  onSaveEdit = () => {
    this.props.saveAssetData(this.props.id, {
      selectedEngineId: this.props.selectedEngineId,
      selectedEngineCategory: this.props.selectedEngineCategory
    });
    this.props.closeConfirmModal(this.props.id);
  };

  onCancelEdit = () => {
    if (this.props.isExpandedMode) {
      this.toggleExpandedMode();
    }
    if (this.props.isEditModeEnabled) {
      this.toggleEditMode();
    }
  };

  checkSaveState = () => {
    if (this.props.isSaveEnabled) {
      this.props.openConfirmModal(this.onSaveEdit, this.props.id);
    } else {
      this.onCancelEdit();
    }
  };

  handleCancelSaveDialog = () => {
    this.props.discardUnsavedChanges();
    this.props.closeConfirmModal(this.props.id);
    this.onCancelEdit();
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
    this.props.updateTdoRequest(this.props.id, this.props.mediaId, tdoData);
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

  buildEngineNullStateComponent = () => {
    const selectedEngineId = this.props.selectedEngineId;
    const engines = get(this.props.selectedEngineCategory, 'engines');
    const selectedEngine = find(engines, {
      id: selectedEngineId
    });
    let engineStatus = get(selectedEngine, 'status');
    const engineName = get(selectedEngine, 'name');
    const engineMode = get(selectedEngine, 'mode');
    const selectedEngineResults = this.props.selectedEngineResults;
    const isFetchingEngineResults = this.props.isFetchingEngineResults;
    const hasEngineResults =
      get(selectedEngineResults, 'length') &&
      some(selectedEngineResults, engineResult =>
        get(engineResult, 'series.length')
      );
    const isRealTimeEngine =
      engineMode &&
      (engineMode.toLowerCase() === 'stream' ||
        engineMode.toLowerCase() === 'chunk');
    if (isFetchingEngineResults) {
      // show fetching nullstate if fetching engine results
      engineStatus = 'fetching';
    } else if (!hasEngineResults && engineStatus === 'complete') {
      // show no data only for completed engine w/no results
      engineStatus = 'no_data';
    } else if (hasEngineResults && engineStatus === 'complete') {
      // nullstate not needed
      return;
    } else if (
      hasEngineResults &&
      isRealTimeEngine &&
      (engineStatus === 'running' || engineStatus === 'failed')
    ) {
      // nullstate not needed for RealTime running or failed engine if there are results available
      return;
    }
    return (
      <EngineOutputNullState
        engineStatus={engineStatus}
        engineName={engineName}
        onRunProcess={this.handleRunProcess}
      />
    );
  };

  toggleIsMenuOpen = () => {
    this.setState(prevState => {
      return {
        isMenuOpen: !{ ...prevState }.isMenuOpen
      };
    });
  };

  setMenuTarget = node => {
    this.target1 = node;
  };

  onMenuClose = event => {
    if (event && this.target1.contains(event.target)) {
      return;
    }
    this.setState({ isMenuOpen: false });
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

  isDownloadMediaEnabled = () => {
    return (
      get(this.props.tdo, 'primaryAsset.signedUri.length') &&
      get(this.props.kvp, 'features.downloadMedia') === 'enabled'
    );
  };

  downloadFile = () => {
    const element = document.createElement('a');
    element.href = get(this.props.tdo, 'primaryAsset.signedUri', '');
    element.download = get(this.props, 'tdo.details.veritoneFile.filename');
    element.target = '_blank';
    element.click();
  };

  handleContextMenuClick = cme => {
    window.open(cme.url.replace('${tdoId}', this.props.tdo.id), '_blank');
  };

  showEditButton = () => {
    if (!this.isEditableEngineResults()) {
      return false;
    }
    const editableCategoryTypes = ['face', 'transcript'];
    const selectedEngine = find(this.props.selectedEngineCategory.engines, { id: this.props.selectedEngineId });
    if (includes(editableCategoryTypes, this.props.selectedEngineCategory.categoryType) &&
      get(selectedEngine, 'hasUserEdits') &&
      !this.props.isDisplayingUserEditedOutput) {
      return false;
    }
    return true;
  };

  closeTranscriptBulkEditSnack = () => {
    this.props.setShowTranscriptBulkEditSnackState(this.props.id, false);
  };

  renderTranscriptBulkEditSnack = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.props.showTranscriptBulkEditSnack}
        autoHideDuration={5000}
        onClose={this.closeTranscriptBulkEditSnack}
        message={
          <span className={styles.snackbarMessageText}>
            {`Bulk edit transcript will run in the background and may take some time to finish.`}
          </span>
        }
      />
    );
  };

  render() {
    let {
      engineCategories,
      selectedEngineCategory,
      selectedEngineId,
      selectedEngineResults,
      isInfoPanelOpen,
      isExpandedMode,
      currentMediaPlayerTime,
      isEditModeEnabled,
      entities,
      contentTemplates,
      tdo,
      isLoadingTdo,
      tdoContentTemplates,
      schemasById,
      googleMapsApiKey,
      widgetError,
      isSaveEnabled,
      alertDialogConfig
    } = this.props;

    const { isMenuOpen } = this.state;

    const isImage = /^image\/.*/.test(
      get(tdo, 'details.veritoneFile.mimetype')
    );
    const mediaPlayerTimeInMs = Math.floor(currentMediaPlayerTime * 1000);

    return (
      <FullScreenDialog open className={styles.mdpFullScreenDialog}>
        {alertDialogConfig && (
          <AlertDialog
            open={alertDialogConfig.show}
            title={alertDialogConfig.title}
            content={alertDialogConfig.description}
            cancelButtonLabel={alertDialogConfig.cancelButtonLabel}
            approveButtonLabel={alertDialogConfig.confirmButtonLabel}
            onCancel={this.handleCancelSaveDialog}
            onApprove={alertDialogConfig.nextAction}
          />
        )}
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
                    PopperProps={{
                      style: {
                        pointerEvents: 'none',
                        marginTop: '5px',
                        top: '-10px'
                      }
                    }}
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
                {get(this.props, 'tdo.id') &&
                  get(
                    this.props,
                    'tdo.details.veritoneFile.filename.length',
                    0
                  ) <= 64 && (
                    <div className={styles.pageHeaderTitleLabel}>
                      {get(
                        this.props,
                        'tdo.details.veritoneFile.filename',
                        'No Filename'
                      )}
                    </div>
                  )}
                {!get(this.props, 'tdo.id') && (
                  <div className={styles.pageHeaderTitleLabel}>
                    {!isLoadingTdo && 'No Filename'}
                  </div>
                )}
                <div className={styles.pageHeaderActionButtons}>
                  {get(this.props, 'tdo.id') && (
                    <Tooltip
                      id="tooltip-run-process"
                      title="Run Process"
                      PopperProps={{
                        style: {
                          pointerEvents: 'none',
                          marginTop: '5px',
                          top: '-20px'
                        }
                      }}
                    >
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
                    </Tooltip>
                  )}
                  {get(this.props, 'tdo.details', null) && (
                    <Tooltip
                      id="tooltip-show-metadata"
                      title="Show Metadata"
                      PopperProps={{
                        style: {
                          pointerEvents: 'none',
                          marginTop: '5px',
                          top: '-20px'
                        }
                      }}
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
                    </Tooltip>
                  )}
                  {(get(this.props, 'tdo.id') ||
                    get(this.props, 'contextMenuExtensions.tdos.length')) && (
                    <Manager>
                      <Target>
                        <div ref={this.setMenuTarget}>
                          <Tooltip
                            id="tooltip-show-overflow-menu"
                            title="Show more options"
                            PopperProps={{
                              style: {
                                pointerEvents: 'none',
                                marginTop: '5px',
                                top: '-20px'
                              }
                            }}
                          >
                            <IconButton
                              className={styles.pageHeaderActionButton}
                              aria-label="More"
                              aria-haspopup="true"
                              aria-owns={isMenuOpen ? 'menu-list-grow' : null}
                              onClick={this.toggleIsMenuOpen}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Target>
                      {isMenuOpen && (
                        <Popper
                          className={styles.popperContent}
                          placement="bottom-end"
                          eventsEnabled={isMenuOpen}
                        >
                          <ClickAwayListener onClickAway={this.onMenuClose}>
                            <Grow
                              in={isMenuOpen}
                              id="menu-list-grow"
                              style={{ transformOrigin: '0 0 0' }}
                            >
                              <Paper>
                                <MenuList role="menu">
                                  {this.isDownloadMediaEnabled() && (
                                    <MenuItem
                                      classes={{
                                        root: styles.headerMenuItem
                                      }}
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
                                          classes={{
                                            root: styles.headerMenuItem
                                          }}
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
                      )}
                    </Manager>
                  )}
                  {(get(this.props, 'tdo.id') ||
                    get(this.props, 'tdo.details', null) ||
                    this.isDownloadMediaEnabled() ||
                    get(this.props, 'contextMenuExtensions.tdos.length')) && (
                    <div className={styles.pageHeaderActionButtonsSeparator} />
                  )}
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

              {isLoadingTdo && (
                <div className={styles.tdoLoadingProgress}>
                  <CircularProgress size={80} color="primary" thickness={1} />
                </div>
              )}
              {!isLoadingTdo &&
                !get(this.props, 'tdo.id') && (
                  <div className={styles.widgetErrorContainer}>
                    <div className={styles.widgetError}>
                      <img
                        className={styles.errorImage}
                        src="//static.veritone.com/veritone-ui/warning-icon-lg.svg"
                      />
                      <div className={styles.errorMessage}>{widgetError}</div>
                    </div>
                  </div>
                )}

              {get(this.props, 'tdo.id') && (
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
                        this.state.selectedTabValue === 'mediaDetails'
                          ? 500
                          : 400
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
              )}
              {selectedEngineCategory &&
                this.state.selectedTabValue === 'mediaDetails' && (
                  <div className={styles.engineActionHeader}>
                    <div className={styles.engineCategorySelector}>
                      <EngineCategorySelector
                        engineCategories={this.props.engineCategories}
                        selectedEngineCategoryId={selectedEngineCategory.id}
                        onSelectEngineCategory={this.handleEngineCategoryChange}
                      />
                    </div>
                    {this.showEditButton() && (
                      <Button
                        variant="raised"
                        color="primary"
                        className={styles.toEditModeButton}
                        onClick={this.toggleEditMode}
                        disabled={this.props.isEditButtonDisabled}
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
                    onClick={this.checkSaveState}
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
                    {isEditModeEnabled && (
                      <Button
                        className={styles.actionButtonEditMode}
                        onClick={this.checkSaveState}
                      >
                        CANCEL
                      </Button>
                    )}
                    {isEditModeEnabled && (
                      <Button
                        className={styles.actionButtonEditMode}
                        disabled={!isSaveEnabled}
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
              {get(tdo, 'id') &&
                !(
                  get(selectedEngineCategory, 'categoryType') ===
                    'correlation' && isExpandedMode
                ) && (
                  <div className={styles.mediaView}>
                    {isImage ? (
                      <Image
                        src={this.getPrimaryAssetUri()}
                        width="450px"
                        height="250px"
                        type="contain"
                      />
                    ) : (
                      <MediaPlayer
                        fluid={false}
                        width={450}
                        height={250}
                        store={this.context.store}
                        playerRef={this.mediaPlayerRef}
                        src={this.getPrimaryAssetUri()}
                        streams={get(this.props, 'tdo.streams')}
                        poster={tdo.thumbnailUrl || programLiveImageNullState}
                      />
                    )}
                    {this.getMediaSource() && (
                      <div className={styles.sourceLabel}>
                        Source: {this.getMediaSource()}
                      </div>
                    )}
                  </div>
                )}
              {selectedEngineId && (
                <div className={styles.engineCategoryView}>
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'transcript' && (
                      <TranscriptEngineOutputWidget
                        tdo={tdo}
                        editMode={isEditModeEnabled}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onClick={this.handleUpdateMediaPlayerTime}
                        neglectableTimeMs={100}
                        outputNullState={this.buildEngineNullStateComponent()}
                        bulkEditEnabled={
                          get(this.props.kvp, 'features.bulkEditTranscript') ===
                          'enabled'
                        }
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'face' && (
                      <FaceEngineOutput
                        tdo={tdo}
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        editMode={isEditModeEnabled}
                        disableEdit={this.handleDisableEditBtn}
                        onFaceOccurrenceClicked={
                          this.handleUpdateMediaPlayerTime
                        }
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'object' && (
                      <ObjectDetectionEngineOutput
                        data={selectedEngineResults}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                        onObjectOccurrenceClick={
                          this.handleUpdateMediaPlayerTime
                        }
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'logo' && (
                      <LogoDetectionEngineOutput
                        data={selectedEngineResults}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onEntrySelected={this.handleUpdateMediaPlayerTime}
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'ocr' && (
                      <OCREngineOutputView
                        data={selectedEngineResults}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onOcrClicked={this.handleUpdateMediaPlayerTime}
                        currentMediaPlayerTime={mediaPlayerTimeInMs}
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'fingerprint' && (
                      <FingerprintEngineOutput
                        data={selectedEngineResults}
                        entities={entities}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'translate' && (
                      <TranslationEngineOutput
                        contents={selectedEngineResults}
                        onClick={this.handleUpdateMediaPlayerTime}
                        onRerunProcess={this.handleRunProcess}
                        className={styles.engineOuputContainer}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'sentiment' && (
                      <SentimentEngineOutput
                        data={selectedEngineResults}
                        className={cx(
                          styles.engineOuputContainer,
                          styles.sentimentChartViewRoot
                        )}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        onClick={this.handleUpdateMediaPlayerTime}
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'geolocation' && (
                      <GeoEngineOutput
                        data={selectedEngineResults}
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
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
                    )}
                  {selectedEngineCategory &&
                    selectedEngineCategory.categoryType === 'correlation' && (
                      <StructuredDataEngineOutput
                        data={selectedEngineResults}
                        schemasById={schemasById}
                        engines={selectedEngineCategory.engines}
                        selectedEngineId={selectedEngineId}
                        onEngineChange={this.handleSelectEngine}
                        onExpandClick={this.toggleExpandedMode}
                        isExpandedMode={isExpandedMode}
                        outputNullState={this.buildEngineNullStateComponent()}
                      />
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
              onClose={this.toggleInfoPanel}
              onSaveMetadata={this.updateTdo}
              canEditMedia={this.canEditMedia}
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

          {this.renderTranscriptBulkEditSnack()}
        </Paper>
      </FullScreenDialog>
    );
  }
}

export default widget(MediaDetailsWidget);
