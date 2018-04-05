import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import classNames from 'classnames';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import EngineOutputHeader from '../EngineOutputHeader';
import TranscriptContent from './TranscriptContent';
import styles from './styles.scss';

export default class TranscriptEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(shape({
      startTimeMs: number,
      stopTimeMs: number,
      status: string,
      series: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        words: arrayOf(shape({
          word: string,
          confidence: number
        }))
      }))
    })),
    
    selectedEngineId: string,
    engines: arrayOf(shape({
      id: string,
      name: string
    })),
    title: string,
    
    className: string,
    headerClassName: string,
    contentClassName: string,
    mediaPlayerTime: number,

    editMode: bool,

    onClick: func,
    onScroll: func,
    onEngineChange: func,
    onExpandClicked: func,
    
    numMaxRequest: number,
    requestSizeMs: number,
    mediaLengthMs: number,
    neglectableTimeMs: number,
  };

  static defaultProps = {
    title: 'Transcription',
    editMode: false,
    numMaxRequest: 2,
    mediaPlayerTime: 0,
  };

  constructor (props) {
    super(props);

    this.state = {
      overview: false
    }
  }

  handleOnScroll = (openSlotInfo) => {
    (this.props.onScroll) && this.props.onScroll(openSlotInfo);
  }

  handleOnClick = (event, value) => {
    (this.props.onClick) && this.props.onClick(event, value);
  }

  handleViewChange = (event) => {
    (event.target.value === 'overview')  && this.setState({overview: true});
    (event.target.value === 'time')      && this.setState({overview: false});
  }

  renderEditOptions () {
    return (
      <RadioGroup
        row
        aria-label='edit_mode'
        value={this.state.overview ? 'overview' : 'time'}
        name='editMode'
        className={classNames(styles.radioButton)}
        onChange={this.handleViewChange}
      >
        <FormControlLabel
          value='time'
          className={styles.label}
          control={<Radio color='primary' />}
          label='Snippet Edit'
        />
        <FormControlLabel
          value='overview'
          className={styles.label}
          control={<Radio color='primary' />}
          label='Bulk Edit'
        />
      </RadioGroup>
    );
  }

  renderViewOptions () {
    return (
      <Select
        autoWidth
        value={this.state.overview ? 'overview' : 'time'}
        className={styles.viewDropdown}
        onChange={this.handleViewChange}
      >
        <MenuItem value='time'>Time</MenuItem>
        <MenuItem value='overview'>Overview</MenuItem>
      </Select>
    );
  }

  renderHeader () {
    let {
      title,
      engines,
      selectedEngineId,
      editMode,
      onEngineChange,
      onExpandClicked,
      headerClassName,
    } = this.props;

    return (
      <EngineOutputHeader
        title={title}
        hideTitle
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onExpandClicked={onExpandClicked}
        className={classNames(headerClassName)}
      >
        <div className={classNames(styles.controllers)}>
          {editMode? this.renderEditOptions() : this.renderViewOptions()}
        </div>
      </EngineOutputHeader>
    )
  }

  renderBody () {
    let {
      data,
      onClick,
      onScroll,
      editMode,
      numMaxRequest,
      requestSizeMs,
      mediaLengthMs,
      neglectableTimeMs,
      contentClassName
    } = this.props;

    return (
      <div className={classNames(styles.content)}>
        <TranscriptContent 
          data={data}
          editMode={editMode}
          overview={(this.state.overview)}
          numMaxRequest={numMaxRequest}
          requestSizeMs={requestSizeMs}
          mediaLengthMs={mediaLengthMs}
          neglectableTimeMs={neglectableTimeMs}
          onClick={onClick}
          onScroll={onScroll}
          className={classNames(contentClassName)}
        />
      </div>
    )
  }
/*
  
  editMode: bool,
  overview: bool,
  className: string,
  onClick: func,
  onScroll: func,

*/
  render () {
    let {
      className
    } = this.props;

    return (
      <div className={classNames(styles.transcriptOutput, className)}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    )
  }
}