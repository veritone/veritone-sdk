import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { arrayOf, shape, bool, number, string, func } from 'prop-types';
import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';
import { get, omit, isArray, isUndefined, pick, isObject } from 'lodash';
// import UserAgent from 'useragent';

import { guid } from 'helpers/guid';

import styles from './styles.scss';

export default class EditableWrapper extends Component {
  static propTypes = {
    content: shape({
      startTimeMs: number,
      stopTimeMs: number,
      sentences: string,
      fragments: arrayOf(
        shape({
          startTimeMs: number,
          stopTimeMs: number,
          value: string,
          chunkIndex: number.isRequired   // Need this for speaker edits since a dialogue can span across chunks
        })
      )
    }),
    speakerData: arrayOf(shape({
      series: arrayOf(shape({
        speakerId: string,
        startTimeMs: number,
        stopTimeMs: number
      }))
    })),
    className: string,
    contentClassName: string,
    editMode: bool,
    onClick: func,
    onChange: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number,
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
    editMode: false,
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  componentDidUpdate() {
    const { cursorPosition, clearCursorPosition } = this.props;
    if (cursorPosition) {
      const spanChildren = get(this, 'editableInput.current.htmlEl.children', []);
      const spanArray = Array.from(spanChildren);
      const targetIndex = spanArray.findIndex(span => span.getAttribute('word-guid') === cursorPosition.end.guid);
      if (targetIndex !== -1) {
        const targetSpan = spanChildren.item(targetIndex);
        setCursorPosition(targetSpan.firstChild, cursorPosition.end.offset);
        clearCursorPosition();
      }
    }
  }

  editableInput = React.createRef();

  handleContentClick = event => {
    const { content, onClick } = this.props;
    const wordGuidMap = content.wordGuidMap;
    const targetGuid = event.target.getAttribute('word-guid');

    if (wordGuidMap && onClick) {
      const targetFragment = wordGuidMap[targetGuid];
      if (targetFragment && targetFragment.serie) {
        onClick(event, targetFragment.serie);
      }
    }
  };

  handleContentKeyUp = event => {
    const { editMode, onChange, content } = this.props;
    const wordGuidMap = content.wordGuidMap;
    if (event) {
      event.stopPropagation();
      const hasCommand = hasCommandModifier(event);
      const hasControl = hasControlModifier(event);
      const contentEditableElement = event.target;
      // Parse content for changes and generate history diff
      const { hasChange, historyDiff, cursorPos } = generateTranscriptDiffHistory(contentEditableElement, wordGuidMap);
      if (event.type !== 'paste') {
        hasChange && !hasCommand && !hasControl && editMode && onChange && onChange(event, historyDiff, cursorPos);
      }
    }
  };

  handleContentKeyPress = event => {
    const { editMode, onChange, content, speakerData } = this.props;
    const hasSpeakerData = speakerData && speakerData.length;
    const wordGuidMap = content.wordGuidMap;
    if (event) {
      const contentEditableElement = event.target;
      // event.preventDefault();   // This prevents editable text from being updated
      event.stopPropagation();
      const curCursorPos = getCursorPosition();
      const noCursorSelection = curCursorPos.start && curCursorPos.end &&
        curCursorPos.start.guid === curCursorPos.end.guid &&
        curCursorPos.start.offset === curCursorPos.end.offset;
      const hasCommand = hasCommandModifier(event);
      const hasControl = hasControlModifier(event);
      const keyCode = event.keyCode;
      const targetElem = Array.from(event.target.children)
        .find(c => 
          c.getAttribute('word-guid') === curCursorPos.start.guid
        );
      const wordObj = wordGuidMap[curCursorPos.start.guid];

      if (targetElem) {
        // if (keyCode === 37) {
        //   // LEFT
        //   // Set cursor position to front of current fragment
        //   //  instead of jumping to the next fragment
        //   if (curCursorPos.start.offset === 1) {
        //     // event.preventDefault();
        //     // setCursorPosition(targetElem.firstChild, 0);
        //   }
        //   return;
        // } else if (keyCode === 39) {
        //   // RIGHT
        //   // Set cursor position to front of adjacent fragment
        //   //  instead of jumping to the 2nd index of the adjacent fragment
        //   if (curCursorPos.start.offset === targetElem.innerText.length) {

        //   }
        //   return;
        // } else if (keyCode === 38 || keyCode === 40) {
        //   // UP & DOWN
        //   return;
        // }

        if (keyCode === 8 || keyCode === 46) {
          // Handle BACKSPACE & DELETE
          if (!noCursorSelection) {
            // If there is a selection, handle deletes by setting empty strings
            event.preventDefault();
            const spanArray = Array.from(event.target.children);
            const oldCursorPosition = handleSelectedTextUpdate(spanArray, wordGuidMap);

            const { hasChange, historyDiff, cursorPos } = generateTranscriptDiffHistory(contentEditableElement, wordGuidMap, oldCursorPosition);
            hasChange, editMode && onChange && onChange(event, historyDiff, cursorPos);
            setCursorPosition(targetElem.firstChild, cursorPos.end.offset);
          } else if (wordObj.dialogueIndex === 0 && wordObj.speakerIndex && curCursorPos.end.offset === 0) {
            // Delete current speaker and add its time to the previous speaker
            const { hasChange, historyDiff, cursorPos } = generateSpeakerDiffHistory(speakerData, curCursorPos, wordGuidMap, 'BACKSPACE');
            hasChange, editMode && onChange && onChange(event, historyDiff, cursorPos);
            return;
          }
        }

        if (keyCode === 13) {
          // Handle return key
          event.preventDefault();
          if (hasSpeakerData && noCursorSelection) {
            // Split current speaker pill by current snippet end time
            const { hasChange, historyDiff, cursorPos } = generateSpeakerDiffHistory(speakerData, curCursorPos, wordGuidMap, 'ENTER');
            hasChange, editMode && onChange && onChange(event, historyDiff, cursorPos);
          }
          return;
        }

        if (hasCommand || hasControl) { // Command/Control Key
          // TODO: Implement Undo/Redo
          if (keyCode === 90) { // Z button
            if (hasShiftKey(event)) {
              // TODO: Implement Redo
            } else {
              // TODO: Implement Undo
            }
          }
          return; 
        }
      }
    }
  };

  handleContentPaste = event => {
    const { editMode, onChange, content } = this.props;
    const wordGuidMap = content.wordGuidMap;
    const oldCursor = getCursorPosition();
    
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Paste Input Sanitation: Filter for plain text only (no html)
    const rawPasteHtml = event.clipboardData.getData('text/html');
    let stringToPaste = event.clipboardData.getData('text');
    if (rawPasteHtml.includes('<') || rawPasteHtml.includes('>')) {
      stringToPaste = parseHtmlForText(rawPasteHtml);
    }

    const contentEditableElement = get(event, 'target.parentElement');
    const spanArray = contentEditableElement.children;
    const targetElem = Array.from(spanArray)
      .find(c => 
        c.getAttribute('word-guid') === oldCursor.start.guid
      );
    const oldCursorPosition = handleSelectedTextUpdate(spanArray, wordGuidMap, stringToPaste);

    const { hasChange, historyDiff, cursorPos } = generateTranscriptDiffHistory(contentEditableElement, wordGuidMap, oldCursorPosition);
    hasChange, editMode && onChange && onChange(event, historyDiff, cursorPos);
    setCursorPosition(targetElem.firstChild, cursorPos.end.offset);
  };

  handleContentDrag = event => {
    // Disable Drags
    event.preventDefault();
    event.stopPropagation();
    return event;
  };

  handleContentDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    return event;
  }

  render() {
    const {
      className,
      content,
      editMode,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;

    const keyboardEventProps = {
      onClick: this.handleContentClick,
      onPaste: this.handleContentPaste,
      onDrag: this.handleContentDrag,
      onDrop: this.handleContentDrop,
      onKeyDown: this.handleContentKeyPress,
      onKeyUp: this.handleContentKeyUp,
      onChange: this.handleContentChange
    };

    const contentComponents = content.fragments.map(entry => {
      const startTime = entry.startTimeMs;
      const stopTime = entry.stopTimeMs;
      const value = entry.value || '';
      const active = !(
        stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
      );
      const fragmentKey = entry.guid
        ? entry.guid
        : `snippet-fragment-${startTime}-${stopTime}-${value.substr(0, 32)}`;

      return (
        <span
          key={fragmentKey}
          word-guid={entry.guid}
          start-time={startTime}
          stop-time={stopTime}
          chunk-index={entry.chunkIndex}
          className={classNames(styles.transcriptSnippet, className, {
            [styles.read]: !editMode,
            [styles.edit]: editMode,
            [styles.highlight]: active && !editMode
          })}
        >
          {value}
        </span>
      );
    });

    return (
      <div className={classNames(styles.transcriptSegment, className, styles.content, contentClassName)}>
        <ContentEditable
          ref={this.editableInput}
          tagName="div"
          html={ReactDOMServer.renderToString(contentComponents)}
          disabled={!editMode}
          {...keyboardEventProps}
        />
      </div>
    );
  }
}

function hasCommandModifier(e) {
  const isOSX = true; //UserAgent.isPlatform('Mac OS X');
  return e && isOSX
    ? !!e.metaKey && !e.altKey
    : isCtrlKeyCommand(e);
}

function isCtrlKeyCommand(e) {
  return !!e.ctrlKey && !e.altKey;
}

function hasShiftKey(e) {
  return e && e.shiftKey;
}

function hasControlModifier(e) {
  return  e && !!e.ctrlKey && !e.altKey;
}

// This is relative to the current element
function getCursorPosition() {
  const range = window.getSelection().getRangeAt(0);
  const start = {
    offset: range.startOffset,
    guid: range.startContainer.parentElement.getAttribute('word-guid')
  };
  const end = {
    offset: range.endOffset,
    guid: range.endContainer.parentElement.getAttribute('word-guid')
  }
  return {
    start,
    end
  };
}

function setCursorPosition(elem, offset = 0) {
  if (elem) {
    const sel = window.getSelection();
    const range = document.createRange();
    range && range.setStart && range.setStart(elem, offset);
    range.collapse(true);
    sel && sel.removeAllRanges && sel.removeAllRanges();
    sel && sel.addRange && sel.addRange(range);
  }
}

function parseHtmlForText(htmlString) {
  let cumulativeString = '';
  const utilDiv = document.createElement('div');
  utilDiv.innerHTML = htmlString;
  const spanArray = utilDiv.children;
  if (isObject(spanArray)) {
    for (let key in spanArray) {
      const elem = spanArray[key];
      const nodeName = elem.nodeName && elem.nodeName.toLowerCase();
      if (nodeName === 'span') {
        cumulativeString += ` ${elem.innerText}`;
      }
    }
  }
  return cumulativeString;
}

function generateSpeakerDiffHistory(speakerData, cursorPosition, wordGuidMap, keyType) {
  const transcriptChanges = [];
  const speakerChanges = [];
  const targetGuid = get(cursorPosition, 'start.guid');
  const wordObj = wordGuidMap && wordGuidMap[targetGuid];
  if (wordObj) {
    if (keyType === 'ENTER') {
      const serieText = get(wordObj, 'serie.value');
      const serieDuration = wordObj.serie.stopTimeMs - wordObj.serie.startTimeMs;
      const cursorOffset = get(cursorPosition, 'start.offset');
      const splitTime = Math.floor((cursorOffset / serieText.length) * serieDuration) + wordObj.serie.startTimeMs;
      const oldValue = pick(wordObj.serie, ['guid', 'startTimeMs', 'stopTimeMs', 'value']);

      transcriptChanges.push({
        index: wordObj.index,
        chunkIndex: wordObj.chunkIndex,
        action: 'UPDATE',
        oldValue,
        newValue: {
          ...oldValue,
          stopTimeMs: splitTime,
          value: serieText.slice(0, cursorOffset)
        }
      });
      transcriptChanges.push({
        index: wordObj.index + 1,
        chunkIndex: wordObj.chunkIndex,
        action: 'INSERT',
        newValue: {
          ...oldValue,
          guid: guid(),
          startTimeMs: splitTime,
          value: serieText.slice(cursorOffset, serieText.length)
        }
      });

      speakerChanges.push({
        index: wordObj.speakerIndex,
        action: 'UPDATE',
        oldValue: wordObj.speaker,
        newValue: {
          ...wordObj.speaker,
          stopTimeMs: splitTime
        }
      });
      speakerChanges.push({
        index: wordObj.speakerIndex + 1,
        action: 'INSERT',
        newValue: {
          ...wordObj.speaker,
          guid: guid(),
          startTimeMs: splitTime,
          speakerId: ''
        }
      });
    } else if (keyType === 'BACKSPACE') {
      // Can't do this operation on first speaker
      if (wordObj.speakerIndex) {
        const previousSpeaker = get(speakerData, [0, 'series', wordObj.speakerIndex - 1]);
        speakerChanges.push({
          index: wordObj.speakerIndex,
          action: 'DELETE',
          oldValue: wordObj.speaker
        });
        speakerChanges.push({
          index: wordObj.speakerIndex - 1,
          action: 'UPDATE',
          oldValue: previousSpeaker,
          newValue: {
            ...previousSpeaker,
            stopTimeMs: wordObj.speaker.stopTimeMs
          }
        });
      }
    }
  }

  speakerChanges.sort(sortByAction);
  transcriptChanges.sort(sortByAction);

  return {
    hasChange: speakerChanges.length,
    historyDiff: {
      transcriptChanges,
      speakerChanges
    },
    cursorPos: cursorPosition || getCursorPosition()
  }
}

function generateTranscriptDiffHistory(contentEditableElement, wordGuidMap, cursorPosition) {
  const speakerChanges = [];
  const transcriptChanges = [];
  const foundMap = {};
  if (wordGuidMap) {
    const spanArray = Array.from(contentEditableElement.children);
    // This pass-thru is for text updates & deletes
    if (isArray(spanArray)) {
      let latestDeleteTime;
      for (let i = spanArray.length - 1; i >= 0; i--) {
        const span = spanArray[i];
        if (span.getAttribute) {
          const spanGuid = span.getAttribute('word-guid');
          const newWord = span.innerText.trim();
          if (spanGuid && wordGuidMap[spanGuid]) {
            const chunkIndex = wordGuidMap[spanGuid].chunkIndex;
            foundMap[spanGuid] = true;
            const oldEntry = wordGuidMap[spanGuid];

            // Transcript Changes
            if (!newWord) {
              // Delete fragment and set time for adjacent fragment to append
              if (!latestDeleteTime) {
                latestDeleteTime = oldEntry.serie.stopTimeMs;
              }
              transcriptChanges.push({
                chunkIndex,
                index: oldEntry.index,
                action: 'DELETE',
                oldValue: oldEntry.serie
              });
            } else if (newWord !== oldEntry.serie.value) {
              // Text change and possibly append time
              const newValue = {
                ...oldEntry.serie,
                value: newWord
              };
              if (latestDeleteTime) {
                newValue.stopTimeMs = latestDeleteTime;
              }
              transcriptChanges.push({
                chunkIndex,
                index: oldEntry.index,
                action: 'UPDATE',
                newValue,
                oldValue: oldEntry.serie
              });
              latestDeleteTime = undefined;
            } else if (latestDeleteTime) {
              // No text change but should append additional time
              const newValue = {
                ...oldEntry.serie,
                stopTimeMs: latestDeleteTime
              };
              transcriptChanges.push({
                chunkIndex,
                index: oldEntry.index,
                action: 'UPDATE',
                newValue,
                oldValue: oldEntry.serie
              });
              latestDeleteTime = undefined;
            }
          }
        }
      }
    }
    // This pass-thru is for deletes
    const deletedMap = omit(wordGuidMap, Object.keys(foundMap));
    const deletedList = [];
    Object.keys(deletedMap).forEach(guid => {
      const deletedFrag = deletedMap[guid];
      deletedList.push(deletedFrag);
    });
    deletedList.sort((a, b) => b.index - a.index);
    deletedList.forEach(deletedFrag => {
      transcriptChanges.push({
        chunkIndex: deletedFrag.chunkIndex,
        index: deletedFrag.index,
        action: 'DELETE',
        oldValue: deletedFrag.serie
      });
    });
  }

  speakerChanges.sort(sortByAction);
  transcriptChanges.sort(sortByAction);

  let cursorPos;
  if (speakerChanges.length || transcriptChanges.length) {
    cursorPos = cursorPosition || getCursorPosition();
  }

  return {
    hasChange: speakerChanges.length || transcriptChanges.length,
    historyDiff: {
      speakerChanges,
      transcriptChanges
    },
    cursorPos
  };
}

// Sort actions to be Update, Insert, Delete
//  and for matched actions, we sort in descending index order
function sortByAction(a, b) {
  if (a.action && b.action) {
    if (a.action > b.action) {
      return -1;
    } else if (a.action > b.action) {
      return 1;
    } else if (a.action === b.action) {
      return b.index - a.index;
    }
    return 0;
  }
  return 0;
}

// spanArray will be mutated
function handleSelectedTextUpdate(spanArray, wordGuidMap, textToInsert = '') {
  const cursorPos = getCursorPosition();
  const startPos = cursorPos.start;
  const endPos = cursorPos.end;
  const cursorStartMap = wordGuidMap[cursorPos.start.guid];
  const cursorEndMap = wordGuidMap[cursorPos.end.guid];
  let startIndex = cursorStartMap.dialogueIndex;
  if (isUndefined(startIndex)) {
    startIndex = cursorStartMap.index;
  }
  const endIndex = cursorEndMap.dialogueIndex || cursorEndMap.index;
  const startSpan = spanArray[startIndex];
  const endSpan = spanArray[endIndex];

  // Update start and end text
  if (startIndex !== endIndex) {
    startSpan.innerText = startSpan.innerText.slice(0, startPos.offset) + textToInsert;
    endSpan.innerText = endSpan.innerText.slice(endPos.offset, endSpan.innerText.length + 1);

    // Check if everything was deleted, if so - retain first snippet
    if (!startSpan.innerText && !endSpan.innerText && startIndex === 0 && endIndex === spanArray.length - 1) {
      startSpan.innerText = '.';
    }
  } else {
    startSpan.innerText = startSpan.innerText.slice(0, startPos.offset) + textToInsert + endSpan.innerText.slice(endPos.offset, endSpan.innerText.length);
  }

  // Delete middle indices
  for (let i = endIndex - 1; i > startIndex; i--) {
    if (spanArray[i]) {
      spanArray[i].innerText = '';  // Delete fragment
    }
  }

  // Return old cursor position since the mutation resets it
  const newCursorPos = cursorPos;
  if (startSpan.innerText || startIndex === endIndex) {
    newCursorPos.end = newCursorPos.start;
    newCursorPos.end.offset = newCursorPos.start.offset += textToInsert.length;
  } else if (endSpan.innerText) {
    newCursorPos.start = newCursorPos.end;
    newCursorPos.start.offset = newCursorPos.end.offset += textToInsert.length;
  } else {
    if (startIndex > 0) {
      const previousSpan = spanArray[startIndex - 1];
      newCursorPos.start = newCursorPos.end = {
        guid: previousSpan.getAttribute('word-guid'),
        offset: previousSpan.innerText.length
      };
    }
  }
  return newCursorPos;
}