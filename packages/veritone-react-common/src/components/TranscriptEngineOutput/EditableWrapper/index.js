import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { arrayOf, shape, bool, number, string, func } from 'prop-types';
import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';
import {
  get,
  omit,
  isArray,
  isUndefined,
  pick,
  isObject,
  orderBy,
  debounce
} from 'lodash';

import { guid } from 'helpers/guid';
import {
  hasCommandModifier,
  hasControlModifier
} from 'helpers/dom';

import styles from './styles.scss';

export default class EditableWrapper extends Component {
  static propTypes = {
    content: shape({
      startTimeMs: number,
      stopTimeMs: number,
      sentences: string,
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
    clearCursorPosition: func,
    setIncomingChanges: func
  };

  static defaultProps = {
    editMode: false,
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return {
      cursorPosition: getCursorPosition()
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cursorPosition, clearCursorPosition } = this.props;
    const cursorPositionToBeUsed = cursorPosition || (snapshot && snapshot.cursorPosition);
    if (cursorPositionToBeUsed) {
      const spanChildren = get(this, 'editableInput.current.htmlEl.children', []);
      setCursorPosition(spanChildren, cursorPositionToBeUsed);
      if (cursorPosition) {
        clearCursorPosition();
      }
    }
  }

  editableInput = React.createRef();

  debounceTimeMs = 1000;
  savedEvent = undefined;

  triggerDebouncedOnChange = event => {
    const { setIncomingChanges } = this.props;
    event && event.persist && event.persist();
    this.savedEvent = event;
    setIncomingChanges && setIncomingChanges(true);
    this.debouncedOnChange();
  };

  debouncedOnChange = debounce(
    () => this.handleDebounceOnChange(),
    this.debounceTimeMs
  );

  handleDebounceOnChange = () => {
    const event = this.savedEvent;
    const { content, onChange, setIncomingChanges } = this.props;
    if (event && event.target) {
      const contentEditableElement = event.target;
      const wordGuidMap = content.wordGuidMap;
      const { hasChange, historyDiff, cursorPos } = generateTranscriptDiffHistory(contentEditableElement, wordGuidMap);
      onChange && hasChange && onChange(event, historyDiff, cursorPos);
      setIncomingChanges && setIncomingChanges(false);
      this.savedEvent = undefined;
    }
  }


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
    const { editMode } = this.props;
    if (event) {
      event.stopPropagation();
      const curCursorPos = getCursorPosition();
      const noCursorSelection = !hasCursorSelection(curCursorPos);
      const keyCode = event.keyCode;
      const hasCommand = hasCommandModifier(event);
      const hasControl = hasControlModifier(event);
      // Parse content for changes and generate history diff
      if (event.type !== 'paste' && keyCode !== 13 && noCursorSelection) {
        !hasCommand
          && !hasControl
          && editMode
          && this.triggerDebouncedOnChange(event);
      }
    }
  };

  handleContentKeyPress = event => {
    const {
      editMode,
      content,
      speakerData,
      onChange
    } = this.props;
    const hasSpeakerData = speakerData && speakerData.length;
    const wordGuidMap = content.wordGuidMap;
    if (event) {
      const curCursorPos = getCursorPosition();
      const noCursorSelection = !hasCursorSelection(curCursorPos);
      const keyCode = event.keyCode;

      if (
        keyCode === 38 ||  // UP
        keyCode === 40 ||  // DOWN
        keyCode === 39 ||  // RIGHT
        keyCode === 37 ||  // LEFT
        keyCode === 91 ||  // CMD
        keyCode === 17 ||  // CTRL
        keyCode === 18     // OPTION/ALT
       ) {
        event.stopPropagation();
        return;
      }
      
      const spanChildren = event.target.children;
      const spanArray = Array.from(spanChildren);
      const startElem = spanArray.find(c => 
        c.getAttribute('word-guid') === curCursorPos.start.guid
      );
      const endElem = spanArray.find(c => 
        c.getAttribute('word-guid') === curCursorPos.end.guid
      );
      const wordObj = wordGuidMap[curCursorPos.start.guid];

      if (startElem) {

        // Handle BACKSPACE & DELETE
        if (keyCode === 8 || keyCode === 46) {
          event.stopPropagation();
          if (!noCursorSelection) {
            // If there is a selection, handle deletes by setting empty strings
            event.preventDefault();
            const oldCursorPosition = handleSelectedTextUpdate(spanArray, wordGuidMap);
            setCursorPosition(spanChildren, oldCursorPosition);
            return;
          } else if (wordObj.dialogueIndex === 0 && wordObj.speakerIndex && curCursorPos.end.offset === 0) {
            // Delete current speaker and add its time to the previous speaker
            event.preventDefault(); // Don't delete any text
            const { hasChange, historyDiff, cursorPos } = generateSpeakerDiffHistory(speakerData, curCursorPos, wordGuidMap, 'BACKSPACE');
            onChange && editMode && hasChange && onChange(event, historyDiff, cursorPos);
            return;
          }
        }

        // Backspace on 1 char left
        const backspaceOneCharLeft = keyCode === 8
          && curCursorPos.end.offset === 1 
          && startElem.innerText.length === 1;
        const deleteOneCharLeft = keyCode === 46
          && curCursorPos.end.offset === 0
          && startElem.innerText.length === 1;

        if (backspaceOneCharLeft || deleteOneCharLeft) {
          event.preventDefault();
          startElem.innerText = '';
          editMode && this.triggerDebouncedOnChange(event);
          return;
        }

        if (keyCode === 13) {
          // Handle return key
          event.stopPropagation();
          event.preventDefault();
          if (hasSpeakerData && noCursorSelection) {
            // Split current speaker pill by current snippet end time
            const { hasChange, historyDiff, cursorPos } = generateSpeakerDiffHistory(speakerData, curCursorPos, wordGuidMap, 'ENTER');
            onChange && editMode && hasChange && onChange(event, historyDiff, cursorPos);
          }
          return;
        }

        // Special case where user selects everything and types (erasing all snippets)
        // Need to retain first snippet to prevent typing in non-snippet text
        const isEraseAll = curCursorPos.start.offset === 0
          && curCursorPos.end.offset >= endElem.innerText.length;
        const hasModifier = hasCommandModifier(event) || hasControlModifier(event);
        const isNotModifier = (48 <= keyCode && keyCode <= 90)
          || (96 <= keyCode && keyCode <= 111)
          || (186 <= keyCode && keyCode <= 222);
        if (!noCursorSelection && isEraseAll && isNotModifier && !hasModifier) {
          if (curCursorPos.start.guid === curCursorPos.end.guid) {
            startElem.innerText = '.';
            const newPos = {
              ...curCursorPos,
              end: { ...curCursorPos.start }
            };
            setCursorPosition(spanChildren, newPos);
            return;
          }
          const oldCursorPosition = handleSelectedTextUpdate(spanArray, wordGuidMap);
          setCursorPosition(spanChildren, oldCursorPosition);
        }
      }
    }
  };

  handleContentPaste = event => {
    const { editMode, content, onChange } = this.props;
    const wordGuidMap = content.wordGuidMap;
    
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
    const spanChildren = contentEditableElement.children;
    const oldCursorPosition = handleSelectedTextUpdate(spanChildren, wordGuidMap, stringToPaste);

    const { hasChange, historyDiff, cursorPos } = generateTranscriptDiffHistory(contentEditableElement, wordGuidMap, oldCursorPosition);
    hasChange, editMode && onChange && onChange(event, historyDiff, cursorPos);
    setCursorPosition(spanChildren, cursorPos);
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
      contentClassName
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
    const textareaToDecodeCharacters = document.createElement('textarea');
    const totalFragments = content.series.length;

    const contentComponents = content.series.map((entry, index) => {
      const startTime = entry.startTimeMs;
      const stopTime = entry.stopTimeMs;
      const words = entry.words || [];
      const orderedWords = orderBy(words, ['confidence'], ['desc']);
      const selectedWord = get(orderedWords, '[0].word');
      const fragmentKey = entry.guid
        ? entry.guid
        : `snippet-fragment-${startTime}-${stopTime}`;
      let value = '';
      if (selectedWord) {
        textareaToDecodeCharacters.innerHTML = selectedWord;
        value = textareaToDecodeCharacters.value;
        // Add spaces to valid fragments (except the last)
        value = (value && (index !== totalFragments - 1)) ? value + ' ' : value;
      }

      return (
        <span
          key={fragmentKey}
          word-guid={entry.guid}
          className={classNames(styles.transcriptSnippet, className, styles.edit)}
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

// TODO: Should refactor this to use a more reusable cursor position func
// This is relative to the current element
function getCursorPosition() {
  const selection = window.getSelection();
  if (selection && selection.rangeCount) {
    const range = selection.getRangeAt(0);
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
}

function setCursorPosition(spanChildren = [], cursorPosition = {}) {
  const spanArray = Array.from(spanChildren);
  const { start, end } = cursorPosition;
  if (start && end) {
    const startTarget = spanArray.find(c => c.getAttribute('word-guid') === start.guid);
    const endTarget = spanArray.find(c => c.getAttribute('word-guid') === end.guid);
    const startNode = startTarget && startTarget.firstChild;
    const endNode = endTarget && endTarget.firstChild;
    if (startNode && endNode) {
      const sel = window.getSelection();
      const range = document.createRange();
      const startOffset = start.offset > startNode.textContent.length
        ? startNode.textContent.length
        : start.offset;
      const endOffset = end.offset > endNode.textContent.length
        ? endNode.textContent.length
        : end.offset;
      startNode && range && range.setStart && range.setStart(startNode, startOffset);
      endNode && range && range.setEnd && range.setEnd(endNode, endOffset);
      sel && sel.removeAllRanges && sel.removeAllRanges();
      sel && sel.addRange && sel.addRange(range);

    }
  }
}

function hasCursorSelection(cursorPosition) {
  if (cursorPosition) {
    return cursorPosition.start && cursorPosition.end
      && (
        cursorPosition.start.guid !== cursorPosition.end.guid
          || cursorPosition.start.offset !== cursorPosition.end.offset
      );
  }
  return false;
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
        cumulativeString += `${elem.innerText}`;
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
      const serieText = orderBy(
        get(wordObj, 'serie.words'),
        ['confidence'],
        ['desc']
      )[0].word;
      const serieDuration = wordObj.serie.stopTimeMs - wordObj.serie.startTimeMs;
      const cursorOffset = Math.min(
        get(cursorPosition, 'start.offset', 0),
        serieText.length
      );
      const splitTime = Math.floor((cursorOffset / serieText.length) * serieDuration) + wordObj.serie.startTimeMs;
      const oldValue = pick(wordObj.serie, ['guid', 'startTimeMs', 'stopTimeMs', 'words']);

      const leftTextSplit = serieText.slice(0, cursorOffset);
      if (leftTextSplit !== serieText) {
        transcriptChanges.push({
          index: wordObj.index,
          chunkIndex: wordObj.chunkIndex,
          action: 'UPDATE',
          oldValue,
          newValue: {
            ...oldValue,
            stopTimeMs: splitTime,
            words: [{
              bestPath: true,
              confidence: 1,
              word: leftTextSplit.trim()
            }]
          },
          ...pick(wordObj, ['speakerIndex', 'speakerChunkIndex', 'dialogueIndex'])
        });
      }
      const rightTextSplit = serieText.slice(cursorOffset, serieText.length);
      if (rightTextSplit) {
        transcriptChanges.push({
          index: wordObj.index + 1,
          chunkIndex: wordObj.chunkIndex,
          action: 'INSERT',
          newValue: {
            ...oldValue,
            guid: guid(),
            startTimeMs: splitTime,
            words: [{
              bestPath: true,
              confidence: 1,
              word: rightTextSplit.trim()
            }]
          }
        });
      }

      speakerChanges.push({
        chunkIndex: wordObj.speakerChunkIndex,
        index: wordObj.speakerIndex,
        action: 'UPDATE',
        oldValue: wordObj.speaker,
        newValue: {
          ...wordObj.speaker,
          stopTimeMs: splitTime
        }
      });
      speakerChanges.push({
        chunkIndex: wordObj.speakerChunkIndex,
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
        const previousSpeaker = get(speakerData, [wordObj.speakerChunkIndex, 'series', wordObj.speakerIndex - 1]);
        speakerChanges.push({
          chunkIndex: wordObj.speakerChunkIndex,
          index: wordObj.speakerIndex,
          action: 'DELETE',
          oldValue: wordObj.speaker
        });
        speakerChanges.push({
          chunkIndex: wordObj.speakerChunkIndex,
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
            const oldValue = orderBy(
              get(oldEntry, 'serie.words'),
              ['confidence'],
              ['desc']
            )[0].word;

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
                oldValue: oldEntry.serie,
                ...pick(oldEntry, ['speakerIndex', 'speakerChunkIndex', 'dialogueIndex'])
              });
            } else if (newWord !== oldValue) {
              // Text change and possibly append time
              const newValue = {
                ...oldEntry.serie,
                words: [{
                  bestPath: true,
                  confidence: 1,
                  word: newWord
                }]
              };
              if (latestDeleteTime) {
                newValue.stopTimeMs = latestDeleteTime;
              }
              transcriptChanges.push({
                chunkIndex,
                index: oldEntry.index,
                action: 'UPDATE',
                newValue,
                oldValue: oldEntry.serie,
                ...pick(oldEntry, ['speakerIndex', 'speakerChunkIndex', 'dialogueIndex'])
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
                oldValue: oldEntry.serie,
                ...pick(oldEntry, ['speakerIndex', 'speakerChunkIndex', 'dialogueIndex'])
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
        action: 'DELETE',
        oldValue: deletedFrag.serie,
        ...pick(deletedFrag, [
          'index',
          'chunkIndex',
          'speakerIndex',
          'speakerChunkIndex',
          'dialogueIndex'
        ])
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
    } else if (a.action < b.action) {
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
  let endIndex = cursorEndMap.dialogueIndex;
  if (isUndefined(endIndex)) {
    endIndex = cursorEndMap.index;
  }
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