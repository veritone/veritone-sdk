import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
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
import { find, get, some, includes, isEqual, isUndefined, isArray } from 'lodash';
import { Manager, Target, Popper } from 'react-popper';
import {
  EngineCategorySelector,
  ObjectDetectionEngineOutput,
  MediaInfoPanel,
  Image,
  MediaPlayer,
  OCREngineOutputView,
  SentimentEngineOutput,
  FingerprintEngineOutput,
  LogoDetectionEngineOutput,
  ContentTemplateForm,
  GeoEngineOutput,
  TranslationEngineOutput,
  StructuredDataEngineOutput,
  EngineOutputNullState
} from 'veritone-react-common';
import FaceEngineOutput from '../FaceEngineOutput';
import TranscriptEngineOutput from '../TranscriptEngineOutput';
import EngineOutputExport from '../EngineOutputExport';
import { ExportMenuItem } from './MoreMenuItems';
import EditHeader from './Headers/EditHeader';
import { modules, util } from 'veritone-redux-common';
const {
  application: applicationModule,
  engineResults: engineResultsModule,
  user: userModule
} = modules;
import { withPropsOnChange } from 'recompose';
import { guid } from '../../shared/util';
import cx from 'classnames';
import styles from './styles.scss';
import * as mediaDetailsModule from '../../redux/modules/mediaDetails';
import widget from '../../shared/widget';
import rootSaga from '../../redux/modules/mediaDetails/saga';

const saga = util.reactReduxSaga.saga;

const programLiveImageNullState =
  '//static.veritone.com/veritone-ui/default-nullstate.svg';

@withPropsOnChange([], ({ id }) => ({
  id: id || guid()
}))
@saga(rootSaga)
@connect(
  (state, { id, mediaId }) => ({
    engineCategories: mediaDetailsModule.getEngineCategories(state, id),
    tdo: mediaDetailsModule.getTdo(state, id),
    isLoadingTdo: mediaDetailsModule.isLoadingTdo(state, id),
    isFetchingEngineResults: engineResultsModule.isFetchingEngineResults(state),
    selectedEngineResults: engineResultsModule.engineResultsByEngineId(
      state,
      mediaId,
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
    entities: mediaDetailsModule.getEntities(state),
    isFetchingEntities: mediaDetailsModule.isFetchingEntities(state),
    schemasById: mediaDetailsModule.getSchemasById(state),
    currentMediaPlayerTime: mediaDetailsModule.currentMediaPlayerTime(
      state,
      id
    ),
    widgetError: mediaDetailsModule.getWidgetError(state, id),
    contextMenuExtensions: applicationModule.getContextMenuExtensions(state),
    alertDialogConfig: mediaDetailsModule.getAlertDialogConfig(state, id),
    isDisplayingUserEditedOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      mediaId,
      mediaDetailsModule.getSelectedEngineId(state, id)
    ),
    isEditButtonDisabled: mediaDetailsModule.isEditButtonDisabled(state, id),
    showTranscriptBulkEditSnack: mediaDetailsModule.showTranscriptBulkEditSnack(
      state,
      id
    ),
    isRestoringOriginalEngineResult: mediaDetailsModule.isRestoringOriginalEngineResult(
      state,
      id
    ),
    categoryCombinationMapper: mediaDetailsModule.categoryCombinationMapper(state, id),
    categoryExportFormats: mediaDetailsModule.categoryExportFormats(state, id),
    betaFlagEnabled: userModule.hasFeature(state, 'beta'),
    exportClosedCaptionsEnabled: userModule.hasFeature(
      state,
      'exportClosedCaptions'
    ),
    bulkEditEnabled: userModule.hasFeature(state, 'bulkEditTranscript'),
    publicMediaDownloadEnabled: userModule.hasFeature(
      state,
      'downloadPublicMedia'
    ),
    downloadMediaEnabled: userModule.hasFeature(state, 'downloadMedia')
  }),
  {
    initializeWidget: mediaDetailsModule.initializeWidget,
    updateTdoRequest: mediaDetailsModule.updateTdoRequest,
    selectEngineCategory: mediaDetailsModule.selectEngineCategory,
    setEngineId: mediaDetailsModule.setEngineId,
    toggleInfoPanel: mediaDetailsModule.toggleInfoPanel,
    loadContentTemplates: mediaDetailsModule.loadContentTemplates,
    updateTdoContentTemplates: mediaDetailsModule.updateTdoContentTemplates,
    toggleExpandedMode: mediaDetailsModule.toggleExpandedMode,
    openConfirmModal: mediaDetailsModule.openConfirmModal,
    closeConfirmModal: mediaDetailsModule.closeConfirmModal,
    setEditButtonState: mediaDetailsModule.setEditButtonState,
    updateMediaPlayerState: mediaDetailsModule.updateMediaPlayerState,
    restoreOriginalEngineResults:
      mediaDetailsModule.restoreOriginalEngineResults,
    createQuickExport: mediaDetailsModule.createQuickExport,
    cancelEdit: mediaDetailsModule.cancelEdit
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
    // property to configure experimental autorefresh in saga
    // eslint-disable-next-line react/no-unused-prop-types
    refreshIntervalMs: number,
    onRunProcess: func,
    onClose: func,
    className: string,
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
    isFetchingEntities: bool,
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
    tdoContentTemplates: arrayOf(
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
    widgetError: string,
    alertDialogConfig: shape({
      show: bool,
      title: string,
      description: string,
      cancelButtonLabel: string,
      confirmButtonLabel: string,
      confirmAction: func,
      cancelAction: func
    }),
    openConfirmModal: func,
    closeConfirmModal: func,
    isDisplayingUserEditedOutput: bool,
    setEditButtonState: func,
    isEditButtonDisabled: bool,
    showTranscriptBulkEditSnack: bool,
    updateMediaPlayerState: func,
    restoreOriginalEngineResults: func,
    isRestoringOriginalEngineResult: bool,
    categoryExportFormats: arrayOf(
      shape({
        format: string.isRequired,
        label: string.isRequired,
        types: arrayOf(string).isRequired
      })
    ),
    categoryCombinationMapper: arrayOf(
      shape({
        combineType: string,
        withType: string
      })
    ),
    createQuickExport: func.isRequired,
    onExport: func,
    exportClosedCaptionsEnabled: bool,
    bulkEditEnabled: bool,
    publicMediaDownloadEnabled: bool,
    downloadMediaEnabled: bool,
    cancelEdit: func
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
    selectedTabValue: 'mediaDetails',
    engineOutputExportOpen: false
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

  handleMediaPlayerStateChange(state) {
    this.props.updateMediaPlayerState(this.props.id, state);
  }

  handleDisableEditBtn = boolVal => {
    this.props.setEditButtonState(this.props.id, boolVal);
  };

  mediaPlayerRef = ref => {
    this.mediaPlayer = ref;
    if (this.mediaPlayer) {
      this.mediaPlayer.subscribeToStateChange(
        this.handleMediaPlayerStateChange.bind(this)
      );
    }
  };

  handleUpdateMediaPlayerTime = startTime => {
    this.mediaPlayer.seek(startTime / 1000);
    if (this.mediaPlayer.getState().player.paused) {
      // play/pause to refresh frame
      this.mediaPlayer.play();
      this.mediaPlayer.pause();
    }
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

  toggleExpandedMode = () => {
    this.props.toggleExpandedMode(this.props.id);
  };

  onSaveEdit = () => {
    this.props.closeConfirmModal(this.props.id);
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
    contentTemplates.forEach(contentTemplate => {
      if (
        !contentTemplates.assetId ||
        !this.props.tdoContentTemplates.some(tdoContentTemplate =>
          isEqual(tdoContentTemplate, contentTemplate)
        )
      ) {
        contentTemplatesToCreate.push(contentTemplate);
      }
    });
    // find content templates that were removed
    this.props.tdoContentTemplates.forEach(tdoContentTemplate => {
      if (
        !contentTemplates.some(contentTemplate =>
          isEqual(tdoContentTemplate, contentTemplate)
        )
      ) {
        contentTemplatesToDelete.push(tdoContentTemplate);
      }
    });
    this.props.updateTdoContentTemplates(
      this.props.id,
      contentTemplatesToDelete,
      contentTemplatesToCreate
    );
  };

  hasSelectedEngineResults = () => {
    const selectedEngineResults = this.props.selectedEngineResults;
    return (
      get(selectedEngineResults, 'length') &&
      some(selectedEngineResults, engineResult =>
        get(engineResult, 'series.length')
      )
    );
  };

  isSelectedEngineCompleted = () => {
    const selectedEngineId = this.props.selectedEngineId;
    const engines = get(this.props.selectedEngineCategory, 'engines');
    const selectedEngine = find(engines, {
      id: selectedEngineId
    });
    return get(selectedEngine, 'status') === 'complete';
  };

  buildEngineNullStateComponent = () => {
    const selectedEngineId = this.props.selectedEngineId;
    const engines = get(this.props.selectedEngineCategory, 'engines');
    const selectedEngine = find(engines, {
      id: selectedEngineId
    });
    let engineStatus = get(selectedEngine, 'status');
    const engineName = get(selectedEngine, 'name');
    const hasEngineResults = this.hasSelectedEngineResults();
    const isRealTimeEngine = this.isRealTimeEngine(selectedEngine);
    if (
      this.props.isFetchingEngineResults ||
      this.props.isRestoringOriginalEngineResult ||
      this.props.isFetchingEntities
    ) {
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
    if (this.isOwnMedia() || this.props.publicMediaDownloadEnabled) {
      return true;
    }
    return false;
  };

  isDownloadMediaEnabled = () => {
    return (
      get(this.props.tdo, 'primaryAsset.signedUri.length') &&
      this.props.downloadMediaEnabled
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
    if (
      !this.isEditableEngineResults() ||
      !this.hasSelectedEngineResults() ||
      !this.isSelectedEngineCompleted()
    ) {
      return false;
    }
    return true;
  };

  isEditModeButtonDisabled = () => {
    return (
      this.props.isEditButtonDisabled ||
      this.isDisplayingOriginalEngineResultForUserEdit() ||
      this.isSelectedEngineRealTimeAndRunning()
    );
  };

  isDisplayingOriginalEngineResultForUserEdit = () => {
    const editableCategoryTypes = ['face', 'transcript'];
    const selectedEngine = find(this.props.selectedEngineCategory.engines, {
      id: this.props.selectedEngineId
    });
    if (
      includes(
        editableCategoryTypes,
        this.props.selectedEngineCategory.categoryType
      ) &&
      get(selectedEngine, 'hasUserEdits') &&
      !this.props.isDisplayingUserEditedOutput
    ) {
      return true;
    }
    return false;
  };

  isSelectedEngineRealTimeAndRunning() {
    const selectedEngineId = this.props.selectedEngineId;
    const engines = get(this.props.selectedEngineCategory, 'engines');
    const selectedEngine = find(engines, {
      id: selectedEngineId
    });
    const engineStatus = get(selectedEngine, 'status');
    return this.isRealTimeEngine(selectedEngine) && engineStatus === 'running';
  }

  isRealTimeEngine(engine) {
    const engineMode = get(engine, 'mode');
    return (
      engineMode &&
      (engineMode.toLowerCase() === 'stream' ||
        engineMode.toLowerCase() === 'chunk')
    );
  }

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

  onRestoreOriginalClick = () => {
    this.props.openConfirmModal(this.props.id, {
      title: 'Reset to Original',
      description:
        'Are you sure you want to reset to original version? All edited work will be lost.',
      cancelButtonLabel: 'Cancel',
      confirmButtonLabel: 'Reset',
      confirmAction: this.onRestoreOriginalConfirm,
      cancelAction: this.onRestoreOriginalCancel
    });
  };

  onRestoreOriginalConfirm = () => {
    this.props.closeConfirmModal(this.props.id);
    const {
      id,
      tdo,
      selectedEngineId,
      selectedEngineCategory,
      selectedEngineResults
    } = this.props;
    const removeAllUserEdits = true;
    this.props.restoreOriginalEngineResults(
      id,
      tdo,
      selectedEngineId,
      selectedEngineCategory.categoryType,
      selectedEngineResults,
      removeAllUserEdits
    );
  };

  onRestoreOriginalCancel = () => {
    this.props.closeConfirmModal(this.props.id);
  };

  handleExportClicked = selectedFormats => {
    const {
      tdo,
      selectedEngineId,
      selectedEngineCategory,
      createQuickExport,
      categoryCombinationMapper,
      engineCategories
    } = this.props;
    let selectedCombineEngineId, selectedCombineCategoryId;
    const hasCombineEngineOutput = find(
      categoryCombinationMapper, 
      ['withType', selectedEngineCategory.categoryType]
    );
    if (hasCombineEngineOutput) {
      const combineCategory = find(
        engineCategories,
        ['categoryType', hasCombineEngineOutput.combineType]
      );
      selectedCombineCategoryId = combineCategory.id;
      selectedCombineEngineId = get(combineCategory, 'engines[0].id');
    }
    createQuickExport(
      tdo.id,
      selectedFormats,
      selectedEngineId,
      selectedEngineCategory.id,
      selectedCombineEngineId,
      selectedCombineCategoryId
    ).then(response => {
      this.props.onExport(get(response, 'createExportRequest'), tdo);
      return get(response, 'createExportRequest');
    });
  };

  openEngineOutputExport = () => {
    this.setState({
      engineOutputExportOpen: true
    });
  };

  closeEngineOutputExport = () => {
    this.setState({
      engineOutputExportOpen: false
    });
  };

  handleExportSuccess = response => {
    this.props.onExport(response, this.props.tdo);
    this.closeEngineOutputExport();
  };

  getCombineAggregations = () => {
    const {
      engineCategories,
      categoryCombinationMapper,
      selectedEngineCategory
    } = this.props;
    // secondaryEngineCombiner will be loaded with the following format:
    // {
    //   [withType]: {
    //     [combineType]: ARRAY_OF_combineType_ENGINES
    //   }
    // }
    const secondaryEngineCombiner = {};
    const engineCategorySelectorItems = isArray(engineCategories) ? 
      engineCategories.filter(category => {
        // If the current category is to be combined with another
        // then load it's engines into the combiner using withId as the key
        const isCombineCategory = !find(categoryCombinationMapper, map => {
          const isCombineMatch = map.combineType === category.categoryType;
          if (isCombineMatch) {
            if (!secondaryEngineCombiner[map.withType]) {
              secondaryEngineCombiner[map.withType] = {};
            }
            const combineCategory = find(engineCategories, ['categoryType', map.combineType]);
            if (combineCategory) {
              secondaryEngineCombiner[map.withType][map.combineType] = combineCategory.engines;
            }
          }
          return isCombineMatch;
        });

        return isCombineCategory;
      }) : [];

    const combineEngines = selectedEngineCategory ? 
      get(secondaryEngineCombiner, selectedEngineCategory.categoryType) :
      [];
    return {
      combineEngines,
      engineCategorySelectorItems
    };
  }

  render() {
    let {
      engineCategories,
      selectedEngineCategory,
      selectedEngineId,
      selectedEngineResults,
      className,
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
      alertDialogConfig,
      categoryExportFormats,
      onExport,
      exportClosedCaptionsEnabled,
      bulkEditEnabled,
      cancelEdit
    } = this.props;

    const { isMenuOpen } = this.state;

    // Filter out any categories that should be combined with another category
    const {
      combineEngines,
      engineCategorySelectorItems
    } = this.getCombineAggregations();

    const isImage = /^image\/.*/.test(
      get(tdo, 'details.veritoneFile.mimetype')
    );
    const mediaPlayerTimeInMs = Math.floor(currentMediaPlayerTime * 1000);

    const moreMenuItems = [];
    if (onExport && categoryExportFormats.length && !isEditModeEnabled) {
      moreMenuItems.push(
        <ExportMenuItem
          key="quick-export"
          label="Quick Export"
          onExportClicked={this.handleExportClicked}
          onMoreClicked={this.openEngineOutputExport}
          categoryExportFormats={categoryExportFormats}
          exportClosedCaptionsEnabled={exportClosedCaptionsEnabled}
        />
      );
    }

    return (
      <div className={cx(styles.mediaDetailsPage, className)}>
        {alertDialogConfig && (
          <Dialog
            open={alertDialogConfig.show}
            classes={{
              paper: styles.resetOriginalDialogPaper
            }}
          >
            <div
              id="alert-dialog-title"
              className={styles.resetOriginalDialogTitle}
            >
              {alertDialogConfig.title}
              <IconButton
                classes={{ root: styles.closeResetOriginalDialogButton }}
                onClick={alertDialogConfig.cancelAction}
                aria-label="Close Reset to Original"
              >
                <Icon
                  className="icon-close-exit"
                  classes={{ root: styles.iconClass }}
                />
              </IconButton>
            </div>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                classes={{ root: styles.resetOriginalDialogDescription }}
              >
                {alertDialogConfig.description}
              </DialogContentText>
            </DialogContent>
            <DialogActions
              classes={{ root: styles.resetOriginalDialogActions }}
            >
              <Button
                classes={{ root: styles.resetOriginalDialogButton }}
                onClick={alertDialogConfig.cancelAction}
              >
                {alertDialogConfig.cancelButtonLabel}
              </Button>
              <Button
                classes={{ root: styles.resetOriginalDialogButton }}
                onClick={alertDialogConfig.confirmAction}
                variant="contained"
                color="primary"
                autoFocus
              >
                {alertDialogConfig.confirmButtonLabel}
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Paper className={styles.mediaDetailsPageContent}>
          {!isExpandedMode &&
            !isEditModeEnabled && (
              <div>
                <div className={styles.pageHeader}>
                  {get(
                    this.props,
                    'tdo.details.veritoneFile.filename.length',
                    0
                  ) > 120 && (
                    <Tooltip
                      id="truncated-file-name-tooltip"
                      title={get(
                        this.props,
                        'tdo.details.veritoneFile.filename'
                      )}
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
                        ).substring(0, 120) + '...'}
                      </div>
                    </Tooltip>
                  )}
                  {get(this.props, 'tdo.id') &&
                    get(
                      this.props,
                      'tdo.details.veritoneFile.filename.length',
                      0
                    ) <= 120 && (
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
                      <IconButton
                        className={styles.pageHeaderActionButton}
                        onClick={this.handleRunProcess}
                        aria-label="Run process"
                      >
                        <Tooltip
                          id="tooltip-run-process"
                          title="Run Process"
                          PopperProps={{
                            style: {
                              pointerEvents: 'none'
                            }
                          }}
                        >
                          <Icon
                            className="icon-enginerunning"
                            classes={{ root: styles.iconClass }}
                          />
                        </Tooltip>
                      </IconButton>
                    )}
                    {this.isDownloadMediaEnabled() && (
                      <IconButton
                        className={styles.pageHeaderActionButton}
                        onClick={this.downloadFile}
                        disabled={!this.isDownloadAllowed()}
                        aria-label="Download"
                      >
                        <Tooltip
                          id="tooltip-download"
                          title="Download"
                          PopperProps={{
                            style: {
                              pointerEvents: 'none'
                            }
                          }}
                        >
                          <Icon
                            className="icon-file_download"
                            classes={{ root: styles.iconClass }}
                          />
                        </Tooltip>
                      </IconButton>
                    )}
                    {get(this.props, 'tdo.details', null) && (
                      <IconButton
                        className={styles.pageHeaderActionButton}
                        onClick={this.toggleInfoPanel}
                        aria-label="Info Panel"
                      >
                        <Tooltip
                          id="tooltip-show-metadata"
                          title="Show Metadata"
                          PopperProps={{
                            style: {
                              pointerEvents: 'none'
                            }
                          }}
                        >
                          <Icon
                            className="icon-info-round"
                            classes={{ root: styles.iconClass }}
                          />
                        </Tooltip>
                      </IconButton>
                    )}
                    {!!get(this.props, 'contextMenuExtensions.tdos.length') && (
                      <Manager>
                        <Target>
                          <div ref={this.setMenuTarget}>
                            <IconButton
                              className={styles.pageHeaderActionButton}
                              aria-label="More"
                              aria-haspopup="true"
                              aria-owns={isMenuOpen ? 'menu-list-grow' : null}
                              onClick={this.toggleIsMenuOpen}
                            >
                              <Tooltip
                                id="tooltip-show-overflow-menu"
                                title="Show more options"
                                leaveDelay={20}
                                PopperProps={{
                                  style: {
                                    pointerEvents: 'none'
                                  }
                                }}
                              >
                                <MoreVertIcon />
                              </Tooltip>
                            </IconButton>
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
                                              this.handleContextMenuClick(
                                                tdoMenu
                                              )
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
                      <div
                        className={styles.pageHeaderActionButtonsSeparator}
                      />
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
                          engineCategories={engineCategorySelectorItems}
                          selectedEngineCategoryId={selectedEngineCategory.id}
                          onSelectEngineCategory={
                            this.handleEngineCategoryChange
                          }
                        />
                      </div>
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
                    // eslint-disable-next-line
                    onClick={() => cancelEdit(this.props.id, selectedEngineId)}
                    aria-label="Back"
                  >
                    <Icon
                      className="icon-arrow-back"
                      classes={{ root: styles.iconClass }}
                    />
                  </IconButton>
                </div>
                <div className={styles.pageSubHeaderEditMode}>
                  <div className={styles.editCategoryHelperMessage}>
                    {this.getSelectedCategoryMessage()}
                  </div>
                </div>
              </div>
            )}

          {selectedEngineCategory &&
            isEditModeEnabled && (
              <EditHeader
                engineCategoryIconClass={get(
                  selectedEngineCategory,
                  'iconClass'
                )}
                engineCategoryType={get(selectedEngineCategory, 'categoryType')}
                // eslint-disable-next-line
                onCloseButtonClick={() =>
                  cancelEdit(this.props.id, selectedEngineId)
                }
              />
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
                      <TranscriptEngineOutput
                        tdo={tdo}
                        showEditButton={this.showEditButton()}
                        disableEditButton={this.isEditModeButtonDisabled()}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
                        mediaPlayerTimeIntervalMs={500}
                        engines={selectedEngineCategory.engines}
                        combineEngines={combineEngines}
                        onEngineChange={this.handleSelectEngine}
                        selectedEngineId={selectedEngineId}
                        onClick={this.handleUpdateMediaPlayerTime}
                        neglectableTimeMs={100}
                        outputNullState={this.buildEngineNullStateComponent()}
                        bulkEditEnabled={bulkEditEnabled}
                        moreMenuItems={moreMenuItems}
                        onRestoreOriginalClick={this.onRestoreOriginalClick}
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
                        showEditButton={this.showEditButton()}
                        disableEditButton={this.isEditModeButtonDisabled()}
                        disableEdit={this.handleDisableEditBtn}
                        onFaceOccurrenceClicked={
                          this.handleUpdateMediaPlayerTime
                        }
                        outputNullState={this.buildEngineNullStateComponent()}
                        moreMenuItems={moreMenuItems}
                        onRestoreOriginalClick={this.onRestoreOriginalClick}
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
                        onSdoClick={this.handleUpdateMediaPlayerTime}
                        mediaPlayerTimeMs={mediaPlayerTimeInMs}
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
        {!isUndefined(onExport) &&
          !!tdo && (
            <EngineOutputExport
              open={this.state.engineOutputExportOpen}
              tdos={[{ tdoId: tdo.id }]}
              onExport={this.handleExportSuccess}
              onCancel={this.closeEngineOutputExport}
            />
          )}
      </div>
    );
  }
}

export default widget(MediaDetailsWidget);
