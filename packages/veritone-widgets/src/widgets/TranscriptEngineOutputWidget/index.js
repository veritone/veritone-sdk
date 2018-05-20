import React, { Component, Fragment } from 'react';
import { number, bool, string, func, shape, arrayOf } from 'prop-types';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

import { connect } from 'react-redux';
import * as transcriptStore from '../../redux/modules/mediaDetails/transcriptWidget';

import { TranscriptEngineOutput, TranscriptEditMode } from 'veritone-react-common';
import widget from '../../shared/widget';

@connect(
  (state) => ({
    hasChanged: transcriptStore.hasChanged(state),
    currentData: transcriptStore.currentData(state)
  }),
  {
    undo: transcriptStore.undo,
    redo: transcriptStore.redo,
    reset: transcriptStore.reset,
    change: transcriptStore.change,
    clearData: transcriptStore.clearData,
    receiveData: transcriptStore.receiveData
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

    undo: func,
    redo: func,
    reset: func,
    change: func,
    clearData: func,
    receiveData: func,
    hasChanged: bool
  }

  state = {
    alert: false,
    editMode: TranscriptEditMode.SNIPPET
  };

  // use this when we update to react ^16.3.0
  /*
  static getDerivedStateFromProps (nextProps, prevState) {
    this.receiveData(nextProps);
  }
  */

  // Use the above function when we update to a later version of react
  componentWillReceiveProps (nextProps) {
    this.props.receiveData(nextProps.data);
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
