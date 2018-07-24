import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func, node } from 'prop-types';
import { find } from 'lodash';
import classNames from 'classnames';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import EngineOutputHeader from '../EngineOutputHeader';
import TranscriptContent, { View, Edit } from './TranscriptContent';
import styles from './styles.scss';

export default class TranscriptEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            guid: string,
            words: arrayOf(
              shape({
                word: string.isRequired,
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
        id: string.isRequired,
        name: string.isRequired
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
    onExpandClick: func,
    onRestoreOriginalClick: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,
    outputNullState: node,
    bulkEditEnabled: bool,
    showingUserEditedOutput: bool,
    onToggleUserEditedOutput: func,
    viewTypeSelectionEnabled: bool
  };

  static defaultProps = {
    title: 'Transcription',
    editMode: false,
    editType: Edit.SNIPPET,
    viewTypeSelectionEnabled: false,
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

  handleUserEditChange = evt => {
    this.props.onToggleUserEditedOutput &&
      this.props.onToggleUserEditedOutput(evt.target.value === 'userEdited');
  };

  handleViewChange = event => {
    this.setState({ viewType: event.target.value });
  };

  handleEditChange = event => {
    const onEditChangeCallback = this.props.onEditTypeChange;
    if (onEditChangeCallback) {
      onEditChangeCallback({ type: event.target.value });
    } else {
      this.setState({ editType: event.target.value });
    }
  };

  renderEditOptions() {
    const editType = this.props.onEditTypeChange
      ? this.props.editType
      : this.state.editType;
    return (
      <RadioGroup
        row
        aria-label="edit_mode"
        value={editType}
        name="editMode"
        className={classNames(styles.radioButtonGroup)}
        onChange={this.handleEditChange}
      >
        <FormControlLabel
          value={Edit.SNIPPET}
          classes={{ label: styles.radioLabel, root: styles.radioLabelRoot }}
          control={
            <Radio
              color="primary"
              disableRipple
              classes={{ root: styles.radioRoot }}
            />
          }
          label="Snippet Edit Mode"
        />
        {this.props.bulkEditEnabled && (
          <FormControlLabel
            value={Edit.BULK}
            classes={{ label: styles.radioLabel, root: styles.radioLabelRoot }}
            control={
              <Radio
                color="primary"
                disableRipple
                classes={{ root: styles.radioRoot }}
              />
            }
            label="Bulk Edit Mode"
          />
        )}
      </RadioGroup>
    );
  }

  renderResultOptions() {
    const { showingUserEditedOutput } = this.props;
    return (
      <Select
        autoWidth
        value={showingUserEditedOutput ? 'userEdited' : 'original'}
        onChange={this.handleUserEditChange}
        className={styles.outputHeaderSelect}
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
        <MenuItem
          value="userEdited"
          className={classNames(styles.selectMenuItem)}
        >
          User Edited
        </MenuItem>
        <MenuItem
          value="original"
          className={classNames(styles.selectMenuItem)}
        >
          Original
        </MenuItem>
      </Select>
    );
  }

  renderViewOptions() {
    return (
      <Select
        autoWidth
        value={this.state.viewType}
        className={styles.outputHeaderSelect}
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
        <MenuItem
          value={View.TIME}
          className={classNames(styles.selectMenuItem)}
        >
          Time
        </MenuItem>
        <MenuItem
          value={View.OVERVIEW}
          className={classNames(styles.selectMenuItem)}
        >
          Overview
        </MenuItem>
      </Select>
    );
  }

  renderHeader() {
    const {
      title,
      engines,
      selectedEngineId,
      editMode,
      onEngineChange,
      onExpandClick,
      onRestoreOriginalClick,
      headerClassName,
      viewTypeSelectionEnabled
    } = this.props;
    const selectedEngine = find(engines, { id: selectedEngineId });
    const moreMenuOptions = [
      { label: 'Restore Original', action: onRestoreOriginalClick }
    ];
    return (
      <EngineOutputHeader
        title={title}
        hideTitle={editMode}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onExpandClick={onExpandClick}
        className={classNames(headerClassName)}
        showMoreMenuButton={
          !editMode && selectedEngine && selectedEngine.hasUserEdits
        }
        moreMenuOptions={moreMenuOptions}
      >
        <div className={classNames(styles.controllers)}>
          {editMode && this.renderEditOptions()}
          {!editMode &&
            selectedEngine &&
            selectedEngine.hasUserEdits &&
            this.renderResultOptions()}
          {!editMode && viewTypeSelectionEnabled && this.renderViewOptions()}
        </div>
      </EngineOutputHeader>
    );
  }

  renderBody() {
    const {
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
      mediaPlayerTimeIntervalMs,
      outputNullState,
      selectedEngineId
    } = this.props;

    const currentEditType = onEditTypeChange ? editType : this.state.editType;

    return (
      outputNullState || (
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
            selectedEngineId={selectedEngineId}
            className={classNames(contentClassName)}
          />
        </div>
      )
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classNames(styles.transcriptOutput, className)}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
