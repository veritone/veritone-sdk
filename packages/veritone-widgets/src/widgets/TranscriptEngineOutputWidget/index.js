import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf, node } from 'prop-types';
import { isEqual } from 'lodash';

import { connect } from 'react-redux';
import { util } from 'veritone-redux-common';
import * as TranscriptRedux from '../../redux/modules/mediaDetails/transcriptWidget';
import transcriptSaga, { changeWidthDebounce } from '../../redux/modules/mediaDetails/transcriptWidget/saga';
import { AlertDialog } from 'veritone-react-common';
import { TranscriptEngineOutput, TranscriptEditMode } from 'veritone-react-common';

const saga = util.reactReduxSaga.saga;

@saga(transcriptSaga)
@connect(
  (state) => ({
    hasChanged: TranscriptRedux.hasChanged(state),
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
        series: arrayOf(
          shape({})
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
    hasChanged: bool,
    outputNullState: node
  }

  state = {
    alert: false,
    editMode: TranscriptEditMode.SNIPPET,
    props: this.props
  };

  static getDerivedStateFromProps (nextProps, prevState) {
    const prevProps = prevState.props;
    const hasNewData = !isEqual(prevProps.data, nextProps.data);
    const hasInitialData = isEqual(prevProps.currentData, nextProps.data);
    (hasNewData || !hasInitialData) && prevProps.receiveData(nextProps.data);
    return { ...prevState, props: nextProps };
  }

  componentWillUnmount() {
    this.props.clearData && this.props.clearData();
  }

  handleContentChanged = (value) => {
    this.props.change(value);
  }

  handleOnEditModeChange = (value) => {
    if (this.props.hasChanged) {
      this.setState({
        alert: true,
        pendingEditMode: value.type
      });
    } else {
      this.setState({
        alert: false,
        editMode: value.type,
      });
    }
  }

  handleAlertConfirm = (value) => {
    if (value === 'cancel') {
      this.setState({
        alert: false,
      });
    } else {  // value = approve
      this.props.reset();
      this.setState((prevState) => {
        return {
          alert: false,
          editMode: prevState.pendingEditMode,
          pendingEditMode: undefined
        }
      });
    }
  }

  render () {
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
      onEngineChange,
      onExpandClicked,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs,
      outputNullState
    } = this.props;

    const alertDescription = 'It looks like you have been editing something. If you leave before saving, your changes will be lost.';
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
          onEngineChange={onEngineChange}
          onExpandClicked={onExpandClicked}
          mediaLengthMs={mediaLengthMs}
          neglectableTimeMs={neglectableTimeMs}
          estimatedDisplayTimeMs={estimatedDisplayTimeMs}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
          outputNullState={outputNullState}
        />
        <AlertDialog
          open = {this.state.alert}
          content = {alertDescription}
          cancelButtonLabel = {cancelButtonLabel}
          approveButtonLabel = {approveButtonLabel}
          onCancel = {this.handleAlertConfirm}
          onApprove = {this.handleAlertConfirm}
        />
      </Fragment>
    );
  }
}
