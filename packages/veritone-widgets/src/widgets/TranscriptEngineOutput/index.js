import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf, node } from 'prop-types';
import { get, isEqual, orderBy, pick, noop, isEmpty } from 'lodash';

import { connect } from 'react-redux';
import { modules, util } from 'veritone-redux-common';
import * as TranscriptRedux from '../../redux/modules/mediaDetails/transcriptWidget';
import transcriptSaga, {
  changeWidthDebounce
} from '../../redux/modules/mediaDetails/transcriptWidget/saga';
import {
  AlertDialog,
  TranscriptEngineOutput,
  TranscriptEditMode
} from 'veritone-react-common';
import Button from '@material-ui/core/Button/Button';
import styles from '../MediaDetails/styles.scss';
import Snackbar from '@material-ui/core/Snackbar/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const { engineResults: engineResultsModule } = modules;

const saga = util.reactReduxSaga.saga;

@saga(transcriptSaga)
@connect(
  (state, { selectedEngineId }) => ({
    hasUserEdits: TranscriptRedux.hasUserEdits(state),
    currentData: TranscriptRedux.currentData(state),
    isDisplayingUserEditedOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      selectedEngineId
    ),
    selectedEngineResults: engineResultsModule.engineResultsByEngineId(
      state,
      selectedEngineId
    ),
    showTranscriptBulkEditSnack: TranscriptRedux.getShowTranscriptBulkEditSnack(
      state
    ),
    error: TranscriptRedux.getError(state),
    savingTranscript: TranscriptRedux.getSavingTranscriptEdits(state),
    editModeEnabled: TranscriptRedux.getEditModeEnabled(state)
  }),
  {
    //undo: TranscriptRedux.undo,           //Uncomment when needed to enable undo option
    //redo: TranscriptRedux.redo,           //Uncomment when needed to enable redo option
    change: changeWidthDebounce,
    reset: TranscriptRedux.reset,
    receiveData: TranscriptRedux.receiveData,
    fetchEngineResults: engineResultsModule.fetchEngineResults,
    clearEngineResultsByEngineId:
      engineResultsModule.clearEngineResultsByEngineId,
    onEditButtonClick: TranscriptRedux.editTranscriptButtonClick,
    saveTranscriptEdit: TranscriptRedux.saveTranscriptEdit,
    setShowTranscriptBulkEditSnackState:
      TranscriptRedux.setShowTranscriptBulkEditSnackState,
    closeErrorSnackbar: TranscriptRedux.closeErrorSnackbar,
    toggleEditMode: TranscriptRedux.toggleEditMode
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
    currentData: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(shape({}))
      })
    ),

    selectedEngineId: string,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    title: string,

    className: string,
    headerClassName: string,
    contentClassName: string,

    editMode: bool,

    onClick: func,
    onScroll: func,
    onEngineChange: func,
    onExpandClick: func,
    onRestoreOriginalClick: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,

    //undo: func,     //Uncomment when needed to enable undo option
    //redo: func,     //Uncomment when needed to enable redo option
    reset: func.isRequired,
    change: func.isRequired,
    receiveData: func.isRequired,
    hasUserEdits: bool,
    outputNullState: node,
    bulkEditEnabled: bool,

    fetchEngineResults: func,
    isDisplayingUserEditedOutput: bool,
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
    toggleEditMode: func,
    editModeEnabled: bool
  };

  state = {
    alert: false,
    editMode: TranscriptEditMode.SNIPPET,
    props: this.props,
    alertConfirmAction: noop,
    alertCancelAction: noop
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextData = get(nextProps, 'selectedEngineResults');
    nextData &&
      nextData.map(chunk => {
        chunk.series &&
          chunk.series.map(snippet => {
            const words = snippet.words;
            words && (snippet.words = orderBy(words, ['confidence'], ['desc']));
          });
      });

    const prevProps = prevState.props;
    !isEqual(prevProps.selectedEngineResults, nextData) &&
      prevProps.receiveData(nextData);
    return { ...prevState, props: nextProps };
  }

  handleContentChanged = value => {
    this.props.change(value);
  };

  handleOnEditModeChange = value => {
    if (this.props.editMode && this.props.hasUserEdits) {
      this.setState({
        alert: {
          title: 'Unsaved Transcript Changes',
          description: 'This action will reset your changes to the transcript.',
          cancelButtonLabel: 'Cancel',
          approveButtonLabel: 'Continue'
        },
        alertConfirmAction: () => {
          this.props.reset();
          this.setState({ editMode: value.type });
        }
      });
    } else {
      this.setState({
        alert: false,
        editMode: value.type
      });
    }
  };

  handleEngineChange = engineId => {
    if (this.props.editMode && this.props.hasUserEdits) {
      this.setState({
        alert: {
          title: 'Unsaved Transcript Changes',
          description: 'This action will reset your changes to the transcript.',
          cancelButtonLabel: 'Cancel',
          approveButtonLabel: 'Continue'
        },
        alertConfirmAction: () => {
          this.props.reset();
          this.props.onEngineChange(engineId);
        }
      });
    } else {
      this.props.onEngineChange(engineId);
    }
  };

  handleToggleEditedOutput = showUserEdited => {
    const tdo = this.props.tdo;
    this.props.clearEngineResultsByEngineId(this.props.selectedEngineId);
    this.props.fetchEngineResults({
      engineId: this.props.selectedEngineId,
      tdo: tdo,
      startOffsetMs: 0,
      stopOffsetMs:
        Date.parse(tdo.stopDateTime) - Date.parse(tdo.startDateTime),
      ignoreUserEdited: !showUserEdited
    });
  };

  handleAlertConfirm = () => {
    this.state.alertConfirmAction();
    this.setState({
      alert: false,
      alertConfirmAction: noop,
      alertCancelAction: noop
    });
  };

  handleAlertCancel = () => {
    this.state.alertCancelAction();
    this.setState({
      alert: false,
      alertConfirmAction: noop,
      alertCancelAction: noop
    });
  };

  onSaveEdits = () => {
    this.setState({
      alert: false,
      alertConfirmAction: noop,
      alertCancelAction: noop
    });
    this.props.saveTranscriptEdit(
      get(this.props, 'tdo.id'),
      get(this.props, 'selectedEngineId')
    );
  };

  checkEditState = () => {
    if (this.props.hasUserEdits) {
      this.setState({
        alert: {
          title: 'Save Changes?',
          description: 'Would you like to save the changes?',
          cancelButtonLabel: 'Discard',
          approveButtonLabel: 'Save'
        },
        alertCancelAction: () => {
          this.props.toggleEditMode();
        },
        alertConfirmAction: () => {
          this.onSaveEdits();
        }
      });
    } else {
      this.props.toggleEditMode();
    }
  };

  closeTranscriptBulkEditSnack = () => {
    this.props.setShowTranscriptBulkEditSnackState(false);
  };

  render() {
    const transcriptEngineProps = pick(this.props, [
      'title',
      'engines',
      'selectedEngineId',
      'className',
      'headerClassName',
      'contentClassName',
      'editMode',
      'onClick',
      'onScroll',
      'onExpandClick',
      'onRestoreOriginalClick',
      'mediaLengthMs',
      'neglectableTimeMs',
      'estimatedDisplayTimeMs',
      'mediaPlayerTimeMs',
      'mediaPlayerTimeIntervalMs',
      'outputNullState',
      'bulkEditEnabled',
      'moreMenuItems',
      'disableEditButton'
    ]);
    const { alert } = this.state;

    return (
      <Fragment>
        <TranscriptEngineOutput
          data={this.props.currentData}
          {...transcriptEngineProps}
          editMode={this.props.editModeEnabled}
          onChange={this.handleContentChanged}
          editType={this.state.editMode}
          showEditButton={this.props.showEditButton && !this.props.editModeEnabled}
          onEditButtonClick={this.props.toggleEditMode}
          onEditTypeChange={this.handleOnEditModeChange}
          onEngineChange={this.handleEngineChange}
          showingUserEditedOutput={this.props.isDisplayingUserEditedOutput}
          onToggleUserEditedOutput={this.handleToggleEditedOutput}
        />
        {this.props.editModeEnabled && (
          <div className={styles.actionButtonsEditMode}>
            <Button
              className={styles.actionButtonEditMode}
              onClick={this.checkEditState}
              disabled={this.props.savingTranscript}
            >
              CANCEL
            </Button>
            <Button
              className={styles.actionButtonEditMode}
              onClick={this.onSaveEdits}
              disabled={!this.props.hasUserEdits || this.props.savingTranscript}
              variant="contained"
              color="primary"
            >
              SAVE
            </Button>
          </div>
        )}
        <AlertDialog
          open={alert && !isEmpty(alert)}
          title={alert.title}
          content={alert.description}
          cancelButtonLabel={alert.cancelButtonLabel}
          approveButtonLabel={alert.approveButtonLabel}
          onCancel={this.handleAlertCancel}
          onApprove={this.handleAlertConfirm}
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
