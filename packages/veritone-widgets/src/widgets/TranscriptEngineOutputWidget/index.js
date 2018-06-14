import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf, node } from 'prop-types';
import { get, isEqual, orderBy, noop } from 'lodash';

import { connect } from 'react-redux';
import { util } from 'veritone-redux-common';
import * as TranscriptRedux from '../../redux/modules/mediaDetails/transcriptWidget';
import transcriptSaga, {
  changeWidthDebounce
} from '../../redux/modules/mediaDetails/transcriptWidget/saga';
import { AlertDialog } from 'veritone-react-common';
import {
  TranscriptEngineOutput,
  TranscriptEditMode
} from 'veritone-react-common';

const saga = util.reactReduxSaga.saga;

@saga(transcriptSaga)
@connect(
  state => ({
    hasUserEdits: TranscriptRedux.hasUserEdits(state),
    currentData: TranscriptRedux.currentData(state)
  }),
  {
    //undo: TranscriptRedux.undo,           //Uncomment when needed to enable undo option
    //redo: TranscriptRedux.redo,           //Uncomment when needed to enable redo option
    change: changeWidthDebounce,
    reset: TranscriptRedux.reset,
    clearData: TranscriptRedux.clearData,
    receiveData: TranscriptRedux.receiveData
  },
  null,
  { withRef: true }
)
export default class TranscriptEngineOutputWidget extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            startTimeMs: number,
            stopTimeMs: number,
            words: arrayOf(
              shape({
                word: string,
                confidence: number
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
        status: string,
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
    onExpandClicked: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,

    //undo: func,     //Uncomment when needed to enable undo option
    //redo: func,     //Uncomment when needed to enable redo option
    reset: func.isRequired,
    change: func.isRequired,
    clearData: func.isRequired,
    receiveData: func.isRequired,
    hasUserEdits: bool,
    outputNullState: node,
    bulkEditEnabled: bool
  };

  state = {
    alert: false,
    editMode: TranscriptEditMode.SNIPPET,
    props: this.props,
    alertConfirmAction: noop
  };


  static getDerivedStateFromProps (nextProps, prevState) {
    const nextData = get(nextProps, 'data'); 
    nextData && nextData.map((chunk) => {
      chunk.series && chunk.series.map((snippet) => {
        const words = snippet.words;
        words && (snippet.words = orderBy(words, ['confidence'], ['desc']));
      });
    });

    const prevProps = prevState.props;
    !isEqual(prevProps.data, nextData) && prevProps.receiveData(nextData);
    return { ...prevState, props: nextProps };
  }

  componentWillUnmount() {
    this.props.clearData && this.props.clearData();
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
    const {
      title,
      currentData,
      engines,
      selectedEngineId,
      className,
      headerClassName,
      contentClassName,
      editMode,
      onClick,
      onScroll,
      onExpandClicked,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      outputNullState,
      bulkEditEnabled
    } = this.props;

    const alertTitle = 'Unsaved Transcript Changes';
    const alertDescription =
      'This action will reset your changes to the transcript.';
    const cancelButtonLabel = 'Cancel';
    const approveButtonLabel = 'Continue';

    return (
      <Fragment>
        <TranscriptEngineOutput
          title={title}
          data={currentData}
          engines={engines}
          selectedEngineId={selectedEngineId}
          className={className}
          headerClassName={headerClassName}
          contentClassName={contentClassName}
          editMode={editMode}
          onChange={this.handleContentChanged}
          editType={this.state.editMode}
          onEditTypeChange={this.handleOnEditModeChange}
          onClick={onClick}
          onScroll={onScroll}
          onEngineChange={this.handleEngineChange}
          onExpandClicked={onExpandClicked}
          mediaLengthMs={mediaLengthMs}
          neglectableTimeMs={neglectableTimeMs}
          estimatedDisplayTimeMs={estimatedDisplayTimeMs}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
          outputNullState={outputNullState}
          bulkEditEnabled={bulkEditEnabled}
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
