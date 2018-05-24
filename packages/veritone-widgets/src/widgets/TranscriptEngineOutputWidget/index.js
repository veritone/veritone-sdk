import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf } from 'prop-types';
import { isEqual } from 'lodash';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import { connect } from 'react-redux';
import { util } from 'veritone-redux-common';
import * as TranscriptRedux from '../../redux/modules/mediaDetails/transcriptWidget';
import transcriptSaga, { changeWidthDebounce } from '../../redux/modules/mediaDetails/transcriptWidget/saga';
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
    hasChanged: bool
  }

  state = {
    alert: false,
    editMode: TranscriptEditMode.SNIPPET
  };

  // use this when we update to react ^16.3.0
  /*
  static getDerivedStateFromProps (nextProps, prevState) {
    const hasNewData = !isEqual(this.props.data, nextProps.data);
    const hasInitialData = isEqual(this.props.currentData, nextProps.data);
    (hasNewData || !hasInitialData) && this.receiveData(nextProps.data);
  }
  */

  // Use the above function when we update to a later version of react
  componentWillReceiveProps (nextProps) {
    const hasNewData = !isEqual(this.props.data, nextProps.data);
    const missingInitialData = !this.props.currentData || this.props.currentData.length === 0;

    (hasNewData || missingInitialData) && this.props.receiveData(nextProps.data);
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

  handleAlertConfirm = (event) => {
    switch (event.currentTarget.value) {
      case 'cancel':
      this.setState({
        alert: false,
      });
      break;

      case 'continue':
      this.props.reset();
      this.setState((prevState) => {
        return {
          alert: false,
          editMode: prevState.pendingEditMode,
          pendingEditMode: undefined
        }
      });
      break;
    }
  }

  renderPopup () {
    const alertTitle = 'Alert title goes here';
    const alertDescription = 'Alert Description Goes Here';
    return (
      <Dialog
          open={this.state.alert}
          onClose={this.handleClose}
          aria-labelledby="alert-title"
          aria-describedby="alert-description"
        >
          <DialogTitle id="alert-title">{alertTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-description">
              {alertDescription}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAlertConfirm} color="primary" value="cancel">
              Cancel
            </Button>
            <Button onClick={this.handleAlertConfirm} color="primary" value="continue" autoFocus>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
    )
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
      mediaPlayerTimeIntervalMs
    } = this.props;

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
        />
        { this.renderPopup() }
      </Fragment>
    );
  }
}
