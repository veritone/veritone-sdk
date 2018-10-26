import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func, node } from 'prop-types';
import { find, get } from 'lodash';
import cx from 'classnames';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider';
import DoneIcon from '@material-ui/icons/Done';

import EngineOutputHeader from '../EngineOutputHeader';
import TranscriptContent, { View, Edit } from './TranscriptContent';
import SpeakerTranscriptContent from './SpeakerTranscriptContent';
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
    speakerData: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired
          })
        )
      })
    ),
    selectedEngineId: string,
    selectedSpeakerEngineId: string,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    speakerEngines: arrayOf(
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
    onCombineEngineChange: func,
    onExpandClick: func,

    mediaLengthMs: number,
    neglectableTimeMs: number,
    estimatedDisplayTimeMs: number,

    mediaPlayerTimeMs: number,
    mediaPlayerTimeIntervalMs: number,
    outputNullState: node,
    bulkEditEnabled: bool,
    showingUserEditedOutput: bool,
    onToggleUserEditedOutput: func,
    viewTypeSelectionEnabled: bool,
    moreMenuItems: arrayOf(node),
    showEditButton: bool,
    onEditButtonClick: func,
    disableEditButton: bool,
    onRestoreOriginalClick: func.isRequired,
    combineViewTypes: arrayOf(
      shape({
        name: string,
        id: string
      })
    ),
    handleCombineViewTypeChange: func,
    selectedCombineViewTypeId: string
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
    if (evt.target.value == 'restoreOriginal') {
      this.props.onRestoreOriginalClick();
      return;
    }
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
        className={styles.radioButtonGroup}
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
            horizontal: 'right',
            vertical: 'bottom'
          },
          transformOrigin: {
            horizontal: 'right',
            vertical: 'top'
          },
          getContentAnchorEl: null
        }}
        // eslint-disable-next-line
        renderValue={() => showingUserEditedOutput ? 'User-Edited' : 'Original (View Only)'}
      >
        <MenuItem
          value="userEdited"
        >
          {showingUserEditedOutput && <ListItemIcon classes={{root: styles.userEditListItemIcon}}><DoneIcon /></ListItemIcon>}
          <ListItemText classes={{primary: cx(styles.selectMenuItem, {
              [styles.menuItemInset]: !showingUserEditedOutput
            })}} primary="User-Edited" />
        </MenuItem>
        <MenuItem
          value="original"
        >
          {!showingUserEditedOutput && <ListItemIcon classes={{root: styles.userEditListItemIcon}}><DoneIcon /></ListItemIcon>}
          <ListItemText classes={{primary: cx(styles.selectMenuItem, {
              [styles.menuItemInset]: showingUserEditedOutput
            })}} primary="Original (View Only)" />
        </MenuItem>
        <Divider light />
        <MenuItem
          value="restoreOriginal"
        >
          <ListItemText classes={{root: styles.restoreOriginalMenuItem, primary: cx(styles.selectMenuItem, styles.menuItemInset)}} primary="Restore Original" />
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
            horizontal: 'center',
            vertical: 'top'
          },
          getContentAnchorEl: null
        }}
      >
        <MenuItem
          value={View.TIME}
          className={styles.selectMenuItem}
        >
          Time
        </MenuItem>
        <MenuItem
          value={View.OVERVIEW}
          className={styles.selectMenuItem}
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
      onCombineEngineChange,
      onExpandClick,
      headerClassName,
      viewTypeSelectionEnabled,
      moreMenuItems,
      showEditButton,
      onEditButtonClick,
      disableEditButton,
      speakerEngines,
      selectedSpeakerEngineId,
      combineViewTypes,
      selectedCombineViewTypeId,
      handleCombineViewTypeChange
    } = this.props;
    const selectedEngine = find(engines, { id: selectedEngineId });
      
    return (
      <EngineOutputHeader
        title={title}
        hideTitle={editMode}
        engines={engines}
        selectedEngineId={selectedEngineId}
        onEngineChange={onEngineChange}
        onCombineEngineChange={onCombineEngineChange}
        onExpandClick={onExpandClick}
        className={headerClassName}
        showMoreMenuButton={!editMode && get(moreMenuItems, 'length')}
        moreMenuItems={moreMenuItems}
        showEditButton={showEditButton}
        onEditButtonClick={onEditButtonClick}
        disableEditButton={disableEditButton}
        disableEngineSelect={!!editMode}
        combineEngines={speakerEngines}
        selectedCombineEngineId={selectedSpeakerEngineId}
        combineViewTypes={combineViewTypes}
        selectedCombineViewTypeId={selectedCombineViewTypeId}
        handleCombineViewTypeChange={handleCombineViewTypeChange}
      >
        <div className={styles.controllers}>
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
      selectedEngineId,
      selectedCombineViewTypeId,
      speakerData
    } = this.props;

    const currentEditType = onEditTypeChange ? editType : this.state.editType;

    return (
      outputNullState || (
        <div className={styles.content}>
          {
            selectedCombineViewTypeId === 'speaker-view' ? 
            (
              <SpeakerTranscriptContent
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
                className={contentClassName}

                speakerData={speakerData}
              />
            ) : (
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
                className={contentClassName}
              />
            )
          }
        </div>
      )
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={cx(styles.transcriptOutput, className)}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
