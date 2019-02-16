import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf, node } from 'prop-types';
import { get, isEqual, pick } from 'lodash';

import { connect } from 'react-redux';
import { modules, util } from 'veritone-redux-common';
import * as TranscriptRedux from '../../redux/modules/mediaDetails/transcriptWidget';
import transcriptSaga, {
  changeWidthDebounce
} from '../../redux/modules/mediaDetails/transcriptWidget/saga';
import {
  AlertDialog,
  TranscriptEngineOutput,
  EngineOutputNullState,
  hasCommandModifier,
  hasControlModifier,
  hasShiftKey
} from 'veritone-react-common';

import Button from '@material-ui/core/Button/Button';
import styles from '../MediaDetails/styles.scss';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const { engineResults: engineResultsModule } = modules;

const saga = util.reactReduxSaga.saga;

@saga(transcriptSaga)
@connect(
  (state, { tdo, selectedEngineId, selectedCombineEngineId }) => ({
    hasUserEdits: TranscriptRedux.hasUserEdits(state),
    parsedData: TranscriptRedux.parsedData(state),
    editableParsedData: TranscriptRedux.editableParsedData(state),
    currentData: TranscriptRedux.currentData(state),
    editableData: TranscriptRedux.editableData(state),
    editableSpeakerData: TranscriptRedux.editableSpeakerData(state),
    cursorPosition: TranscriptRedux.cursorPosition(state),
    isDisplayingUserEditedOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      tdo.id,
      selectedEngineId
    ),
    isDisplayingUserEditedSpeakerOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      tdo.id,
      selectedCombineEngineId
    ),
    selectedEngineResults: engineResultsModule.engineResultsByEngineId(
      state,
      tdo.id,
      selectedEngineId
    ),
    showTranscriptBulkEditSnack: TranscriptRedux.getShowTranscriptBulkEditSnack(
      state
    ),
    error: TranscriptRedux.getError(state),
    savingTranscript: TranscriptRedux.getSavingTranscriptEdits(state),
    savingSpeaker: TranscriptRedux.getSavingSpeakerEdits(state),
    editModeEnabled: TranscriptRedux.getEditModeEnabled(state),
    showConfirmationDialog: TranscriptRedux.showConfirmationDialog(state),
    confirmationType: TranscriptRedux.getConfirmationType(state),
    combineCategory: TranscriptRedux.combineCategory(state),
    isFetchingEngineResults: engineResultsModule.isFetchingEngineResults(state)
  }),
  {
    undo: TranscriptRedux.undo,
    redo: TranscriptRedux.redo,
    change: changeWidthDebounce,
    reset: TranscriptRedux.reset,
    clearCursorPosition: TranscriptRedux.clearCursorPosition,
    receiveData: TranscriptRedux.receiveData,
    receiveSpeakerData: TranscriptRedux.receiveSpeakerData,
    fetchEngineResults: engineResultsModule.fetchEngineResults,
    clearEngineResultsByEngineId:
      engineResultsModule.clearEngineResultsByEngineId,
    onEditButtonClick: TranscriptRedux.editTranscriptButtonClick,
    saveTranscriptEdit: TranscriptRedux.saveTranscriptEdit,
    setShowTranscriptBulkEditSnackState:
      TranscriptRedux.setShowTranscriptBulkEditSnackState,
    closeErrorSnackbar: TranscriptRedux.closeErrorSnackbar,
    toggleEditMode: TranscriptRedux.toggleEditMode,
    openConfirmationDialog: TranscriptRedux.openConfirmationDialog,
    closeConfirmationDialog: TranscriptRedux.closeConfirmationDialog
  },
  null,
  { withRef: true }
)
export default class TranscriptEngineOutputContainer extends Component {
  static propTypes = {
    tdo: shape({
      id: string,
      startDateTime: string,
      stopDateTime: string
    }).isRequired,
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
    isFetchingEngineResults: bool,
    parsedData: shape({
      lazyLoading: bool,
      snippetSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            guid: string.isRequired,
            words: arrayOf(
              shape({
                word: string.isRequired,
                confidence: number
              })
            )
          })
        )
      })),
      speakerSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            guid: string.isRequired,
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            speakerId: string.isRequired,
            fragments: arrayOf(shape({
              startTimeMs: number.isRequired,
              stopTimeMs: number.isRequired,
              guid: string.isRequired,
              words: arrayOf(
                shape({
                  word: string.isRequired,
                  confidence: number
                })
              )
            }))
          })
        )
      }))
    }),
    editableParsedData: shape({
      lazyLoading: bool,
      snippetSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            guid: string.isRequired,
            words: arrayOf(
              shape({
                word: string.isRequired,
                confidence: number
              })
            )
          })
        )
      })),
      speakerSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            guid: string.isRequired,
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            speakerId: string.isRequired,
            fragments: arrayOf(shape({
              startTimeMs: number.isRequired,
              stopTimeMs: number.isRequired,
              guid: string.isRequired,
              words: arrayOf(
                shape({
                  word: string.isRequired,
                  confidence: number
                })
              )
            }))
          })
        )
      }))
    }),
    currentData: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(shape({}))
      })
    ),
    speakerData: arrayOf(
      shape({
        sourceEngineId: string.isRequired,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            speakerId: string.isRequired
          })
        )
      })
    ),
    editableData: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(shape({}))
      })
    ),
    editableSpeakerData: arrayOf(
      shape({
        sourceEngineId: string.isRequired,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            speakerId: string.isRequired
          })
        )
      })
    ),

    selectedEngineId: string,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    combineEngines: shape({
      speaker: arrayOf(
        shape({
          id: string,
          name: string
        })
      )
    }),
    combineViewTypes: arrayOf(
      shape({
        name: string.isRequired,
        id: string.isRequired
      })
    ),
    combineCategory: string,
    selectedCombineEngineId: string,
    selectedCombineViewTypeId: string,
    setSelectedCombineViewTypeId: func,
    title: string,

    className: string,
    headerClassName: string,
    contentClassName: string,

    editMode: bool,

    onClick: func,
    onScroll: func,
    onEngineChange: func,
    onCombineEngineChange: func,
    onExpandClick: func,
    onRestoreOriginalClick: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,

    undo: func,
    redo: func,
    reset: func.isRequired,
    change: func.isRequired,
    receiveData: func.isRequired,
    hasUserEdits: bool,
    outputNullState: node,
    bulkEditEnabled: bool,

    fetchEngineResults: func,
    isDisplayingUserEditedOutput: bool,
    isDisplayingUserEditedSpeakerOutput: bool,
    clearEngineResultsByEngineId: func,
    moreMenuItems: arrayOf(node),
    showEditButton: bool,
    onEditButtonClick: func,
    disableEditButton: bool,
    saveTranscriptEdit: func,
    setShowTranscriptBulkEditSnackState: func,
    showTranscriptBulkEditSnack: bool,
    error: string,
    closeErrorSnackbar: func,
    savingTranscript: bool,
    savingSpeaker: bool,
    toggleEditMode: func,
    editModeEnabled: bool,
    showConfirmationDialog: bool,
    openConfirmationDialog: func,
    closeConfirmationDialog: func,
    confirmationType: string,
    togglePlayback: func
  };

  state = {
    confirmEditType: null,
    props: this.props
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextData = get(nextProps, 'selectedEngineResults');
    const nextSpeakerData = get(nextProps, 'speakerData');
    const prevProps = prevState.props;

    !isEqual(prevProps.selectedEngineResults, nextData) &&
      prevProps.receiveData(nextData);

    !isEqual(prevProps.speakerData, nextSpeakerData) &&
      prevProps.receiveSpeakerData(nextSpeakerData);

    return { ...prevState, props: nextProps };
  }

  componentDidMount() {
    const {
      editModeEnabled
    } = this.props;
    if (editModeEnabled) {
      this.setHotKeyListeners();
    }
  }

  componentDidUpdate() {
    const {
      editModeEnabled
    } = this.props;

    if (editModeEnabled) {
      this.setHotKeyListeners();
    } else {
      this.unsetHotKeyListeners();
    }
  }

  componentWillUnmount() {
    const {
      editModeEnabled,
      toggleEditMode
    } = this.props;

    if (editModeEnabled) {
      toggleEditMode();
    }
    this.unsetHotKeyListeners();
  }

  hotKeyCategories = [{
    commands: [{
      label: 'Play/Pause',
      hotkeys: [{
        keys: ['TAB']
      }],
      triggerFunc: event => {
        return get(event, 'keyCode') === 9;
      },
      eventFunc: event => {
        const { togglePlayback } = this.props;
        event.preventDefault();
        event.stopPropagation();
        togglePlayback && togglePlayback();
      }
    }, {
      label: 'Undo',
      hotkeys: [{
        platform: 'Mac',
        operator: '+',
        keys: ['cmd', 'Z']
      }, {
        platform: 'Win|Lin',
        operator: '+',
        keys: ['ctrl', 'Z']
      }],
      triggerFunc: event => {
        const hasCommand = hasCommandModifier(event);
        const hasControl = hasControlModifier(event);
        const hasShift = hasShiftKey(event);
        return (hasCommand || hasControl) && !hasShift && get(event, 'keyCode') === 90;
      },
      eventFunc: event => {
        const { undo } = this.props;
        event.stopPropagation();
        undo && undo();
      }
    }, {
      label: 'Redo',
      hotkeys: [{
        platform: 'Mac',
        operator: '+',
        keys: ['cmd', 'shift', 'Z']
      }, {
        platform: 'Win',
        operator: '+',
        keys: ['ctrl', 'Y']
      }, {
        platform: 'Lin',
        operator: '+',
        keys: ['ctrl', 'shift', 'Z']
      }],
      triggerFunc: event => {
        const hasCommand = hasCommandModifier(event);
        const hasControl = hasControlModifier(event);
        const hasShift = hasShiftKey(event);
        const keyCode = get(event, 'keyCode');
        if (hasCommand || hasControl) {
          if (keyCode === 90 && hasShift) { // MAC/LINUX
            return true;
          } else if (keyCode === 89) {  // WINDOWS
            return true;
          }
        }
      },
      eventFunc: event => {
        const { redo } = this.props;
        event.stopPropagation();
        redo && redo();
      }
    }, {
      label: 'Save Edits',
      hotkeys: [{
        platform: 'Mac',
        operator: '+',
        keys: ['cmd', 'S']
      }, {
        platform: 'Win|Lin',
        operator: '+',
        keys: ['ctrl', 'S']
      }],
      triggerFunc: event => {
        const hasCommand = hasCommandModifier(event);
        const hasControl = hasControlModifier(event);
        return (hasCommand || hasControl) && get(event, 'keyCode') === 83;
      },
      eventFunc: event => {
        const {
          hasUserEdits,
          savingTranscript,
          savingSpeaker
        } = this.props;
        event.preventDefault();
        event.stopPropagation();
        if (!hasUserEdits || savingTranscript || savingSpeaker) {
          return;
        }
        this.onSaveEdits();
      }
    }, {
      label: 'Exit Edit Mode',
      hotkeys: [{
        keys: ['esc']
      }],
      triggerFunc: event => {
        return get(event, 'keyCode') === 27;
      },
      eventFunc: event => {
        event.preventDefault();
        event.stopPropagation();
        this.checkEditState();
      }
    }]
  }, {
    commands: [{
      label: 'Skip Words',
      hotkeys: [{
        platform: 'Mac',
        operator: '+',
        keys: ['option/alt', '←|→']
      }, {
        platform: 'Win|Lin',
        operator: '+',
        keys: ['ctrl', '←|→']
      }]
    }, {
      label: 'Highlight Next/Previous Word',
      hotkeys: [{
        platform: 'Mac',
        operator: '+',
        keys: ['shift', 'option/alt', '←|→']
      }, {
        platform: 'Win|Lin',
        operator: '+',
        keys: ['shift', 'ctrl', '←|→']
      }]
    // }, {
    //   label: 'Go to top of results',
    //   hotkeys: [{
    //     platform: 'Mac',
    //     operator: '+',
    //     keys: ['cmd', '↑']
    //   }, {
    //     platform: 'Win|Lin',
    //     operator: '+',
    //     keys: ['ctrl', '↑']
    //   }]
    // }, {
    //   label: 'Go to bottom of results',
    //   hotkeys: [{
    //     platform: 'Mac',
    //     operator: '+',
    //     keys: ['cmd', '↓']
    //   }, {
    //     platform: 'Win|Lin',
    //     operator: '+',
    //     keys: ['ctrl', '↓']
    //   }]
    }]
  }];

  handleContentChanged = (event, historyDiff, cursorPosition) => {
    this.props.change(historyDiff, cursorPosition);
  };

  handleOnEditTypeChange = value => {
    if (this.props.editModeEnabled && this.props.hasUserEdits) {
      this.setState(
        {
          confirmEditType: value.type
        },
        () => {
          this.props.openConfirmationDialog('cancelEdits');
        }
      );
    } else {
      this.setState({
        editType: value.type
      });
    }
  };

  handleToggleEditedOutput = engine => showUserEdited => {
    const tdo = this.props.tdo;
    this.props.clearEngineResultsByEngineId(
      tdo.id,
      engine.id
    );
    this.props.fetchEngineResults({
      engineId: engine.id,
      tdo: tdo,
      startOffsetMs: 0,
      stopOffsetMs:
        Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
      ignoreUserEdited: !showUserEdited
    });
  };

  onSaveEdits = () => {
    const { tdo, selectedEngineId, selectedCombineEngineId, fetchEngineResults } = this.props;
    this.props.saveTranscriptEdit(tdo.id, selectedEngineId, selectedCombineEngineId).then(savePromises => {
      // Fetch saved transcript/speaker data
      const refreshPromises = [];
      const transcriptResponse = savePromises.transcript;
      const speakerResponse = savePromises.speaker;
      if (transcriptResponse) {
        refreshPromises.push(
          fetchEngineResults({
            engineId: selectedEngineId,
            tdo: tdo,
            startOffsetMs: 0,
            stopOffsetMs:
              Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
            ignoreUserEdited: false
          })
        );
      }
      if (speakerResponse) {
        refreshPromises.push(
          fetchEngineResults({
            engineId: selectedCombineEngineId,
            tdo: tdo,
            startOffsetMs: 0,
            stopOffsetMs:
              Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
            ignoreUserEdited: false
          })
        );
      }
      Promise.all(refreshPromises).finally(() => {
        this.props.toggleEditMode();  
      })
      return refreshPromises;
    });
  };

  handleDialogCancel = () => {
    const {
      closeConfirmationDialog,
      reset,
      confirmationType,
      toggleEditMode
    } = this.props;

    if (confirmationType === 'saveEdits') {
      reset();
      toggleEditMode();
    }
    closeConfirmationDialog();
  };

  checkEditState = () => {
    if (this.props.editModeEnabled && this.props.hasUserEdits) {
      this.props.openConfirmationDialog('saveEdits');
    } else {
      this.props.toggleEditMode();
    }
  };

  handleDialogConfirm = () => {
    const { closeConfirmationDialog, reset, confirmationType } = this.props;

    if (confirmationType === 'saveEdits') {
      this.onSaveEdits();
    } else if (confirmationType === 'cancelEdits') {
      this.setState(prevState => ({
        editType: prevState.confirmEditType,
        confirmEditType: null
      }));
      reset();
    }
    closeConfirmationDialog();
  };

  closeTranscriptBulkEditSnack = () => {
    this.props.setShowTranscriptBulkEditSnackState(false);
  };

  determineSpeakerNullstate = () => {
    const {
      selectedCombineEngineId,
      speakerData,
      selectedCombineViewTypeId,
      combineCategory,
      combineEngines,
      outputNullState,
      isFetchingEngineResults
    } = this.props;
    const speakerEngines = get(combineEngines, combineCategory, []);
    const combineEngineTask = speakerEngines
      .find(engine => engine.id === selectedCombineEngineId);

    if (combineEngineTask && selectedCombineViewTypeId == 'speaker-view') {
      let combineStatus = combineEngineTask.status;
      if (isFetchingEngineResults) {
        combineStatus = 'fetching';
      } else if (!speakerData && combineStatus === 'complete') {
        combineStatus = 'no_data';
      } else if (speakerData && combineStatus === 'complete') {
        return outputNullState;
      }
      return outputNullState || (
        <EngineOutputNullState
          engineStatus={combineStatus}
          engineName={combineEngineTask.name}
        />
      );
    }
    return outputNullState;
  };

  setHotKeyListeners = () => {
    window.addEventListener('keydown', this.hoyKeyEvents);
  }

  unsetHotKeyListeners = () => {
    window.removeEventListener('keydown', this.hoyKeyEvents);
  }

  hoyKeyEvents = event => {
    this.hotKeyCategories.forEach(category => {
      category.commands.forEach(command => {
        command.triggerFunc
          && command.triggerFunc(event)
          && command.eventFunc
          && command.eventFunc(event);
      });
    });
  }

  render() {
    const transcriptEngineProps = pick(this.props, [
      'title',
      'engines',
      'selectedEngineId',
      'className',
      'headerClassName',
      'contentClassName',
      'editMode',
      'cursorPosition',
      'onClick',
      'onScroll',
      'onExpandClick',
      'onRestoreOriginalClick',
      'mediaLengthMs',
      'neglectableTimeMs',
      'estimatedDisplayTimeMs',
      'mediaPlayerTimeMs',
      'mediaPlayerTimeIntervalMs',
      'moreMenuItems',
      'disableEditButton',
      'onEngineChange',
      'onCombineEngineChange',
      'combineViewTypes',
      'selectedCombineViewTypeId',
      'clearCursorPosition',
      'togglePlayback'
    ]);

    const bulkEditEnabled = this.props.selectedCombineViewTypeId === 'speaker-view' ?
      false : this.props.bulkEditEnabled;

    const outputNullState = this.determineSpeakerNullstate();

    const alertTitle = 'Unsaved Changes';
    let alertDescription =
      'This action will reset your changes to the transcript.';
    let cancelButtonLabel = 'Cancel';
    let approveButtonLabel = 'Continue';

    if (this.props.confirmationType === 'saveEdits') {
      alertDescription = 'Would you like to save the changes?';
      cancelButtonLabel = 'Discard';
      approveButtonLabel = 'Save';
    }

    const speakerEngines = get(this.props, ['combineEngines', this.props.combineCategory], []);

    const activeData = this.props.editModeEnabled ?
      this.props.editableParsedData :
      this.props.parsedData;

    return (
      <Fragment>
        <TranscriptEngineOutput
          parsedData={activeData}
          {...transcriptEngineProps}
          bulkEditEnabled={bulkEditEnabled}
          editMode={this.props.editModeEnabled}
          onChange={this.handleContentChanged}
          editType={this.state.editType}
          showEditButton={
            this.props.showEditButton && !this.props.editModeEnabled
          }
          onEditButtonClick={this.props.toggleEditMode}
          onEditTypeChange={this.handleOnEditTypeChange}
          showingUserEditedOutput={this.props.isDisplayingUserEditedOutput}
          showingUserEditedSpeakerOutput={this.props.isDisplayingUserEditedSpeakerOutput}
          onToggleUserEditedOutput={this.handleToggleEditedOutput}
          speakerEngines={speakerEngines}
          selectedSpeakerEngineId={this.props.selectedCombineEngineId}
          handleCombineViewTypeChange={this.props.setSelectedCombineViewTypeId}
          outputNullState={outputNullState}
          hotKeyCategories={this.hotKeyCategories}
        />
        {this.props.editModeEnabled && (
          <div className={styles.actionButtonsEditMode}>
            <Button
              className={styles.actionButtonEditMode}
              onClick={this.checkEditState}
              disabled={this.props.savingTranscript || this.props.savingSpeaker}
            >
              CANCEL
            </Button>
            <Button
              className={styles.actionButtonEditMode}
              onClick={this.onSaveEdits}
              disabled={!this.props.hasUserEdits || this.props.savingTranscript || this.props.savingSpeaker}
              variant="contained"
              color="primary"
            >
              SAVE
            </Button>
          </div>
        )}
        <AlertDialog
          open={this.props.showConfirmationDialog}
          titleLabel={alertTitle}
          content={alertDescription}
          cancelButtonLabel={cancelButtonLabel}
          approveButtonLabel={approveButtonLabel}
          onCancel={this.handleDialogCancel}
          onApprove={this.handleDialogConfirm}
        />
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
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!!this.props.error}
          autoHideDuration={5000}
          onClose={this.props.closeErrorSnackbar}
        >
          <SnackbarContent
            className={styles.errorSnackbar}
            message={
              <span className={styles.snackbarMessageText}>
                {this.props.error}
              </span>
            }
          />
        </Snackbar>
      </Fragment>
    );
  }
}
