import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { arrayOf, shape, bool, number, string, func } from 'prop-types';
import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';
import { get, includes, omit, isArray } from 'lodash';

import SnippetFragment from '../../TranscriptFragment/SnippetFragment';
import { msToReadableString } from '../../../../helpers/time';

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
          value: string
        })
      )
    }),
    className: string,
    contentClassName: string,
    editMode: bool,
    onClick: func,
    onChange: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    editMode: false,
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

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

  handleContentKeyPress = event => {
    const { editMode, onChange, content } = this.props;
    const wordGuidMap = content.wordGuidMap;
    if (event) {
      // event.preventDefault();   // This prevents editable text from being updated
      event.stopPropagation();
      const cursorPos = getCursorPosition();
      const noCursorSelection = cursorPos.start && cursorPos.end &&
        cursorPos.start.guid === cursorPos.end.guid &&
        cursorPos.start.offset === cursorPos.end.offset;
      const hasCommand = hasCommandModifier(event);
      const hasControl = hasControlModifier(event);
      const keyCode = event.keyCode;
      const targetElem = Array.from(event.target.children)
        .find(c => 
          c.getAttribute('word-guid') === cursorPos.start.guid
        );

      if (keyCode === 37) {
        // LEFT
        // Set cursor position to front of current fragment
        //  instead of jumping to the next fragment
        if (cursorPos.start.offset === 1) {

        }
        return;
      } else if (keyCode === 39) {
        // RIGHT
        // Set cursor position to front of adjacent fragment
        //  instead of jumping to the 2nd index of the adjacent fragment
        if (cursorPos.start.offset === targetElem.innerText.length) {

        }
        return;
      } else if (keyCode === 38 || keyCode === 40) {
        // UP & DOWN
        return;
      }

      if (keyCode === 8 || keyCode === 46) {
        // Handle BACKSPACE & DELETE
        if (!noCursorSelection) {
          // If there is a selection, handle deletes by setting empty strings
          event.preventDefault();
          const spanArray = Array.from(event.target.children);
          handleSelectedTextUpdate(spanArray, wordGuidMap);
        }
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
      if (editMode && onChange) {
        // Parse content for changes and generate history diff
        const contentEditableElement = event.target;
        const historyDiff = generateDiffHistory(contentEditableElement, wordGuidMap)

        onChange(event, historyDiff);
      }
    }
  };

  handleContentChange = event => {
    const disabledActions = ['insertFromDrop', 'deleteByDrag'];
    const inputType = get(event, 'nativeEvent.inputType');
    if (includes(disabledActions, inputType)) {
      event.nativeEvent && event.nativeEvent.preventDefault();
      event.nativeEvent && event.nativeEvent.stopPropagation();
      // TODO: Resync editable state with unchanged content
      return;
    } else if (inputType === 'insertFromPaste') {
      // Break down into plain text
      return;
    } else if (inputType === 'blur') {
      return;
    }
    return event;
  };

  handleContentBlur = event => {
    const { startTimeMs, stopTimeMs } = this.props;
    const newVal = event.target.textContent;
    const newStartTime = startTimeMs; //These 2 are the same for now. We will have options to edit time in the future
    const newStopTime = stopTimeMs; //These 2 are the same for now. We will have options to edit time in the future
    this.triggerOnChange(newVal, newStartTime, newStopTime, true);
  };

  handleContentPaste = event => {
    const { editMode, onChange, content } = this.props;
    const wordGuidMap = content.wordGuidMap;
    
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Filter for plain text only (no html)
    const rawPasteHtml = event.clipboardData.getData('text/html');
    let stringToPaste = event.clipboardData.getData('text');
    if (rawPasteHtml.includes('<') || rawPasteHtml.includes('>')) {
      stringToPaste = parseHtmlForText(rawPasteHtml);
    }

    const contentEditableElement = get(event, 'target.parentElement');
    const spanArray = contentEditableElement.children;
    handleSelectedTextUpdate(spanArray, wordGuidMap, stringToPaste);

    const historyDiff = generateDiffHistory(contentEditableElement, wordGuidMap);

    if (editMode && onChange) {
      onChange(event, historyDiff);
    }
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
          word-guid={entry.guid}
          start-time={startTime}
          stop-time={stopTime}
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
  return e && (true || isOSX)   // TODO: Remove true
    ? !!e.metaKey && !e.altKey
    : true; //KeyBindingUtil.isCtrlKeyCommand(e);
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

function parseHtmlForText(htmlString) {
  let cumulativeString = '';
  const utilDiv = document.createElement('div');
  utilDiv.innerHTML = htmlString;
  const spanArray = utilDiv.children;
  if (typeof spanArray === 'object') {
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

function generateDiffHistory(contentEditableElement, wordGuidMap) {
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
            foundMap[spanGuid] = true;
            const oldEntry = wordGuidMap[spanGuid];
            if (!newWord) {
              // Delete fragment and set time for adjacent fragment to append
              if (!latestDeleteTime) {
                latestDeleteTime = oldEntry.serie.stopTimeMs;
              }
              transcriptChanges.push({
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
        index: deletedFrag.index,
        action: 'DELETE',
        oldValue: deletedFrag.serie
      });
    })
  }
  return {
    speakerChanges,
    transcriptChanges: transcriptChanges.reverse()
  };
}

function handleSelectedTextUpdate(spanArray, wordGuidMap, textToInsert = '') {
  const cursorPos = getCursorPosition();
  const startPos = cursorPos.start;
  const endPos = cursorPos.end;
  const startIndex = wordGuidMap[cursorPos.start.guid].index;
  const endIndex = wordGuidMap[cursorPos.end.guid].index;
  const startSpan = spanArray[startIndex];
  const endSpan = spanArray[endIndex];

  // Update start and end text
  if (startIndex !== endIndex) {
    startSpan.innerText = startSpan.innerText.slice(0, startPos.offset) + textToInsert;
    endSpan.innerText = endSpan.innerText.slice(endPos.offset, endSpan.innerText.length + 1);
  } else {
    startSpan.innerText = startSpan.innerText.slice(0, startPos.offset) + textToInsert + endSpan.innerText.slice(endPos.offset, endSpan.innerText.length);
  }

  // Delete middle indices
  for (let i = startIndex + 1; i < endIndex; i++) {
    if (spanArray[i]) {
      spanArray[i].innerText = '';  // Delete fragment
    }
  }
}