import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func, node } from 'prop-types';
import { find, get } from 'lodash';
import cx from 'classnames';

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
    onChange: func,

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
    clearCursorPosition: func,
    hotKeyCategories: arrayOf(shape({
      label: string,
      commands: arrayOf(shape({
        label: string.isRequired,
        hotkeys: arrayOf(shape({
          platform: string,
          operator: string,
          keys: arrayOf(string).isRequired
        })).isRequired
      })).isRequired
    }))
  };

  static defaultProps = {
    title: 'Transcription',
    editMode: false,
    mediaPlayerTimeMs: 0,
    mediaPlayerTimeIntervalMs: 1000
  };

  handleUserEditChange = engine => viewType => () => {
    if (viewType == 'restoreOriginal') {
      this.props.onRestoreOriginalClick(engine)();
      return;
    }
    this.props.onToggleUserEditedOutput &&
      this.props.onToggleUserEditedOutput(engine)(viewType === 'userEdited');
  };

  handleViewChange = event => {
    this.setState({ viewType: event.target.value });
  };

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
      parsedData,
      hotKeyCategories
    } = this.props;

    let selectedEngineWithData = {
      ...find(engines, { id: selectedEngineId }),
      showingUserEditedOutput,
      engineResults: parsedData.snippetSegments
    };
    let selectedSpeakerEngineWithData = find(speakerEngines, { id: selectedSpeakerEngineId });

    if (selectedSpeakerEngineWithData && selectedCombineViewTypeId === 'speaker-view') {
      selectedSpeakerEngineWithData = {
        ...selectedSpeakerEngineWithData,
        showingUserEditedOutput: showingUserEditedSpeakerOutput,
        engineResults: parsedData.speakerSegments
      };
    }
      
    return (
      <EngineOutputHeader
        title={title}
        hideTitle={editMode}
        engines={engines}
        selectedEngineWithData={selectedEngineWithData}
        selectedEngineId={selectedEngineId}
        selectedCombineEngineWithData={selectedSpeakerEngineWithData}
        selectedCombineEngineId={selectedSpeakerEngineId}
        onEngineChange={onEngineChange}
        onCombineEngineChange={onCombineEngineChange}
        onUserEditChange={this.handleUserEditChange}
        onExpandClick={onExpandClick}
        className={headerClassName}
        showMoreMenuButton={!editMode && get(moreMenuItems, 'length')}
        moreMenuItems={moreMenuItems}
        showEditButton={showEditButton}
        onEditButtonClick={onEditButtonClick}
        disableEditButton={disableEditButton}
        disableEngineSelect={!!editMode}
        combineEngines={speakerEngines}
        combineViewTypes={combineViewTypes}
        selectedCombineViewTypeId={selectedCombineViewTypeId}
        handleCombineViewTypeChange={handleCombineViewTypeChange}
        hotKeyCategories={hotKeyCategories} />
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
      onChange,
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
