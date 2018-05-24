import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import classNames from 'classnames';

import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';

import EngineOutputHeader from '../EngineOutputHeader';
import TranscriptContent, { View, Edit } from './TranscriptContent';
import styles from './styles.scss';

@withMuiThemeProvider
export default class TranscriptEngineOutput extends Component {
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
    onChange: func,
    editType: string,
    onEditTypeChange: func,

    onClick: func,
    onScroll: func,
    onEngineChange: func,
    onExpandClicked: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number
  };

  static defaultProps = {
    title: 'Transcription',
    editMode: false,
    editType: Edit.SNIPPET,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  constructor(props) {
    super(props);

    this.state = {
      viewType: View.OVERVIEW,
      editType: Edit.SNIPPET
    };
  }

  handleViewChange = event => {
    this.setState({ viewType: event.target.value });
  };

  handleEditChange = event => {
    const onEditChangeCallback = this.props.onEditTypeChange;
    if (onEditChangeCallback) {
      this.props.onEditTypeChange({type: event.target.value});
    } else {
      this.setState({ editType: event.target.value });
    }
  };

  renderEditOptions() {
    const editType = this.props.onEditTypeChange ? this.props.editType : this.state.editType;
    return (
      <RadioGroup
        row
        aria-label="edit_mode"
        value={editType}
        name="editMode"
        className={classNames(styles.radioButton)}
        onChange={this.handleEditChange}
      >
        <FormControlLabel
          value={Edit.SNIPPET}
          className={styles.label}
          control={<Radio color="primary" />}
          label="Snippet Edit"
        />
        <FormControlLabel
          value={Edit.BULK}
          className={styles.label}
          control={<Radio color="primary" />}
          label="Bulk Edit"
        />
      </RadioGroup>
    );
  }

  renderViewOptions() {
    return (
      <Select
        autoWidth
        value={this.state.viewType}
        className={styles.viewDropdown}
        onChange={this.handleViewChange}
        MenuProps={{
          anchorOrigin: {
            horizontal: 'center',
            vertical: 'bottom'
          },
          transformOrigin: {
            horizontal: 'center'
          },
          getContentAnchorEl: null
        }}
      >
        <MenuItem value={View.TIME} className={classNames(styles.view)}>
          Time
        </MenuItem>
        <MenuItem value={View.OVERVIEW} className={classNames(styles.view)}>
          Overview
        </MenuItem>
      </Select>
    );
  }

  renderHeader() {
    let {
      title,
      engines,
      selectedEngineId,
      editMode,
      onEngineChange,
      onExpandClicked,
      headerClassName
    } = this.props;

    return (
      <EngineOutputHeader
        title={title}
        hideTitle={editMode}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onExpandClicked={onExpandClicked}
        className={classNames(headerClassName)}
      >
        <div className={classNames(styles.controllers)}>
          {editMode ? this.renderEditOptions() : this.renderViewOptions()}
        </div>
      </EngineOutputHeader>
    );
  }

  renderBody() {
    let {
      data,
      onClick,
      onScroll,
      editMode,
      onChange,
      editType,
      onEditTypeChange,
      mediaLengthMs,
      neglectableTimeMs,
      estimatedDisplayTimeMs,
      contentClassName,
      mediaPlayerTimeMs,
      mediaPlayerTimeIntervalMs
    } = this.props;

    const currentEditType = onEditTypeChange ? editType : this.state.editType;

    return (
      <div className={classNames(styles.content)}>
        <TranscriptContent
          data={data}
          editMode={editMode}
          viewType={this.state.viewType}
          editType={currentEditType}
          mediaPlayerTimeMs={mediaPlayerTimeMs}
          mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
          estimatedDisplayTimeMs={estimatedDisplayTimeMs}
          mediaLengthMs={mediaLengthMs}
          neglectableTimeMs={neglectableTimeMs}
          onClick={onClick}
          onScroll={onScroll}
          onChange={onChange}
          className={classNames(contentClassName)}
        />
      </div>
    );
  }

  render() {
    let { className } = this.props;

    return (
      <div className={classNames(styles.transcriptOutput, className)}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
