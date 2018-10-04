import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf, node } from 'prop-types';
import { get, isEqual, orderBy, pick, noop } from 'lodash';

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

const { engineResults: engineResultsModule } = modules;

const saga = util.reactReduxSaga.saga;

@saga(transcriptSaga)
@connect(
  (state, { tdo, selectedEngineId }) => ({
    hasUserEdits: TranscriptRedux.hasUserEdits(state),
    currentData: TranscriptRedux.currentData(state),
    isDisplayingUserEditedOutput: engineResultsModule.isDisplayingUserEditedOutput(
      state,
      tdo.id,
      selectedEngineId
    ),
    selectedEngineResults: engineResultsModule.engineResultsByEngineId(
      state,
      tdo.id,
      selectedEngineId
    )
  }),
  {
    //undo: TranscriptRedux.undo,           //Uncomment when needed to enable undo option
    //redo: TranscriptRedux.redo,           //Uncomment when needed to enable redo option
    change: changeWidthDebounce,
    reset: TranscriptRedux.reset,
    receiveData: TranscriptRedux.receiveData,
    fetchEngineResults: engineResultsModule.fetchEngineResults,
    clearEngineResultsByEngineId:
      engineResultsModule.clearEngineResultsByEngineId
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
    moreMenuItems: arrayOf(node)
  };

  state = {
    alert: false,
    editMode: TranscriptEditMode.SNIPPET,
    props: this.props,
    alertConfirmAction: noop
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
        alert: true,
        alertConfirmAction: () => {
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
        alert: true,
        alertConfirmAction: () => {
          this.props.onEngineChange(engineId);
        }
      });
    } else {
      this.props.onEngineChange(engineId);
    }
  };

  handleToggleEditedOutput = showUserEdited => {
    const tdo = this.props.tdo;
    this.props.clearEngineResultsByEngineId(tdo.id, this.props.selectedEngineId);
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
    this.props.reset();
    this.state.alertConfirmAction();
    this.setState({
      alert: false,
      alertConfirmAction: noop
    });
  };

  handleAlertCancel = () => {
    this.setState({
      alert: false,
      alertConfirmAction: noop
    });
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
      'moreMenuItems'
    ]);

    const alertTitle = 'Unsaved Transcript Changes';
    const alertDescription =
      'This action will reset your changes to the transcript.';
    const cancelButtonLabel = 'Cancel';
    const approveButtonLabel = 'Continue';

    return (
      <Fragment>
        <TranscriptEngineOutput
          data={this.props.currentData}
          {...transcriptEngineProps}
          onChange={this.handleContentChanged}
          editType={this.state.editMode}
          onEditTypeChange={this.handleOnEditModeChange}
          onEngineChange={this.handleEngineChange}
          showingUserEditedOutput={this.props.isDisplayingUserEditedOutput}
          onToggleUserEditedOutput={this.handleToggleEditedOutput}
        />
        <AlertDialog
          open={this.state.alert}
          title={alertTitle}
          content={alertDescription}
          cancelButtonLabel={cancelButtonLabel}
          approveButtonLabel={approveButtonLabel}
          onCancel={this.handleAlertCancel}
          onApprove={this.handleAlertConfirm}
        />
      </Fragment>
    );
  }
}
