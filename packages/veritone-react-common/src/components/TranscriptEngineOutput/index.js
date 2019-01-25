import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func, node } from 'prop-types';
import { find, get, startCase } from 'lodash';
import cx from 'classnames';

import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import DoneIcon from '@material-ui/icons/Done';

import EngineOutputHeader from '../EngineOutputHeader';
import SpeakerTranscriptContent from './SpeakerTranscriptContent';
import styles from './styles.scss';

export default class TranscriptEngineOutput extends Component {
  static propTypes = {
    parsedData: shape({
      lazyLoading: bool,
      snippetSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        series: arrayOf(
          shape({
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            guid: string.isRequired,
            words: arrayOf(
              shape({
                word: string.isRequired,
                confidence: number
              })
            )
          })
        )
      })),
      speakerSegments: arrayOf(shape({
        startTimeMs: number,
        stopTimeMs: number,
        status: string,
        series: arrayOf(
          shape({
            guid: string.isRequired,
            startTimeMs: number.isRequired,
            stopTimeMs: number.isRequired,
            speakerId: string.isRequired,
            fragments: arrayOf(shape({
              startTimeMs: number.isRequired,
              stopTimeMs: number.isRequired,
              guid: string.isRequired,
              words: arrayOf(
                shape({
                  word: string.isRequired,
                  confidence: number
                })
              )
            }))
          })
        )
      }))
    }),
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
    undo: func,
    redo: func,
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
    showingUserEditedOutput: bool,
    showingUserEditedSpeakerOutput: bool,
    onToggleUserEditedOutput: func,
    moreMenuItems: arrayOf(node),
    showEditButton: bool,
    onEditButtonClick: func,
    disableEditButton: bool,
    onRestoreOriginalClick: func.isRequired,
    combineViewTypes: arrayOf(
      shape({
        name: string.isRequired,
        id: string.isRequired
      })
    ),
    handleCombineViewTypeChange: func,
    selectedCombineViewTypeId: string,
    cursorPosition: shape({
      start: shape({
        guid: string,
        offset: number
      }),
      end: shape({
        guid: string,
        offset: number
      })
    }),
    clearCursorPosition: func
  };

  static defaultProps = {
    title: 'Transcription',
    editMode: false,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  handleUserEditChange = engine => evt => {
    if (evt.target.value == 'restoreOriginal') {
      this.props.onRestoreOriginalClick(engine)();
      return;
    }
    this.props.onToggleUserEditedOutput &&
      this.props.onToggleUserEditedOutput(engine)(evt.target.value === 'userEdited');
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

  renderResultOptions(engines = []) {
    return engines.filter(engine => engine.hasUserEdits).map(engine => (
      <FormControl
        key={`result-edit-type-selection-${engine.id}`}
        className={styles.outputHeaderSelectContainer}>
        <Select
          autoWidth
          className={styles.outputHeaderSelect}
          value={engine.showingUserEditedOutput ? 'userEdited' : 'original'}
          onChange={this.handleUserEditChange(engine)}
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
          renderValue={() =>
            engine.showingUserEditedOutput ? 'User-Edited' : 'Original (View Only)'
          }
        >
          <MenuItem value="userEdited">
            {engine.showingUserEditedOutput && (
              <ListItemIcon classes={{ root: styles.userEditListItemIcon }}>
                <DoneIcon />
              </ListItemIcon>
            )}
            <ListItemText
              classes={{
                primary: cx(styles.selectMenuItem, {
                  [styles.menuItemInset]: !engine.showingUserEditedOutput
                })
              }}
              primary="User-Edited"
            />
          </MenuItem>
          <MenuItem value="original">
            {!engine.showingUserEditedOutput && (
              <ListItemIcon classes={{ root: styles.userEditListItemIcon }}>
                <DoneIcon />
              </ListItemIcon>
            )}
            <ListItemText
              classes={{
                primary: cx(styles.selectMenuItem, {
                  [styles.menuItemInset]: engine.showingUserEditedOutput
                })
              }}
              primary="Original (View Only)"
            />
          </MenuItem>
          <Divider light />
          <MenuItem value="restoreOriginal">
            <ListItemText
              classes={{
                root: styles.restoreOriginalMenuItem,
                primary: cx(styles.selectMenuItem, styles.menuItemInset)
              }}
              primary="Restore Original"
            />
          </MenuItem>
        </Select>
        {
          get(engine, 'category.categoryType') && (
            <FormHelperText className={styles.outputHeaderHelperText}>
              {startCase(engine.category.categoryType)}
            </FormHelperText>
          )
        }
      </FormControl>
    ));
  }

  renderHeader() {
    const {
      title,
      engines,
      speakerEngines,
      selectedEngineId,
      selectedSpeakerEngineId,
      editMode,
      onEngineChange,
      onCombineEngineChange,
      onExpandClick,
      headerClassName,
      moreMenuItems,
      showEditButton,
      onEditButtonClick,
      disableEditButton,
      combineViewTypes,
      selectedCombineViewTypeId,
      handleCombineViewTypeChange,
      showingUserEditedOutput,
      showingUserEditedSpeakerOutput,
      parsedData
    } = this.props;
    const selectedEngine = find(engines, { id: selectedEngineId });
    const selectedSpeakerEngine = find(speakerEngines, { id: selectedSpeakerEngineId });
    const renderResultOptionParameters = [
      {
        ...selectedEngine,
        showingUserEditedOutput,
        engineResults: parsedData.snippetSegments
      }
    ]
    if (selectedSpeakerEngine && selectedCombineViewTypeId === 'speaker-view') {
      renderResultOptionParameters.push({
        ...selectedSpeakerEngine,
        showingUserEditedOutput: showingUserEditedSpeakerOutput,
        engineResults: parsedData.speakerSegments
      });
    }
      
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
          {!editMode
            && this.renderResultOptions(renderResultOptionParameters)
          }
        </div>
      </EngineOutputHeader>
    );
  }

  renderBody() {
    const {
      parsedData,
      cursorPosition,
      clearCursorPosition,
      onClick,
      onScroll,
      editMode,
      undo,
      redo,
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
    } = this.props;

    const currentEditType = onEditTypeChange ? editType : this.state.editType;

    return (
      outputNullState || (
        <div 
          className={styles.content}
          data-veritone-component="transciption-engine-output-content"          
          >
          {
            <SpeakerTranscriptContent
              parsedData={parsedData}
              editMode={editMode}
              editType={currentEditType}
              mediaPlayerTimeMs={mediaPlayerTimeMs}
              mediaPlayerTimeIntervalMs={mediaPlayerTimeIntervalMs}
              estimatedDisplayTimeMs={estimatedDisplayTimeMs}
              mediaLengthMs={mediaLengthMs}
              neglectableTimeMs={neglectableTimeMs}
              cursorPosition={cursorPosition}
              clearCursorPosition={clearCursorPosition}
              onClick={onClick}
              onScroll={onScroll}
              onChange={onChange}
              undo={undo}
              redo={redo}
              selectedEngineId={selectedEngineId}
              className={contentClassName}
              selectedCombineViewTypeId={selectedCombineViewTypeId}
            />
          }
        </div>
      )
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div
        className={cx(styles.transcriptOutput, className)}
        data-veritone-component="transciption-engine-output"
        >
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
