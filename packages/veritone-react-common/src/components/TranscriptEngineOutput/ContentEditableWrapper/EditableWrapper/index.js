import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { arrayOf, shape, bool, number, string, func } from 'prop-types';
import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';
import { get, includes, omit } from 'lodash';

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
      const hasCommand = hasCommandModifier(event);
      const hasControl = hasControlModifier(event);
      const keyCode = event.keyCode;
      if (keyCode === 91) { // Command Key
        return;
      }
      if (editMode && onChange) {
        // Parse content for changes and generate history diff
        const newContent = get(event, 'target.innerHTML');
        const historyDiff = generateDiffHistory(newContent, wordGuidMap)

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
    const cursorPos = getCursorPosition();
    const startGuid = get(cursorPos, 'start.guid');
    const endGuid = get(cursorPos, 'end.guid');

    // TODO: If the cursor is replacing selected text, update/combine fragments
    //  then inject the paste content - finally generate history diff

    const historyDiff = {};

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
          className={classNames(styles.transcriptSnippet, className, {
            [styles.read]: !editMode,
            [styles.edit]: editMode,
            [styles.highlight]: active
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
  return (true || isOSX)
    ? !!e.metaKey && !e.altKey
    : true; //KeyBindingUtil.isCtrlKeyCommand(e);
}

function hasControlModifier(e) {
  return !!e.ctrlKey && !e.altKey;
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

function generateDiffHistory(htmlString, wordGuidMap) {
  const speakerChanges = [];
  const transcriptChanges = [];
  const foundMap = {};
  if (wordGuidMap) {
    const utilDiv = document.createElement('div');
    utilDiv.innerHTML = htmlString;
    const spanArray = utilDiv.children;
    // This pass-thru is for text updates
    if (typeof spanArray === 'object') {
      for (let key in spanArray) {
        const span = spanArray[key];
        if (span.getAttribute) {
          const spanGuid = span.getAttribute('word-guid');
          const newWord = span.innerText;
          if (spanGuid && wordGuidMap[spanGuid]) {
            foundMap[spanGuid] = true;
            const oldEntry = wordGuidMap[spanGuid];
            if (newWord !== oldEntry.serie.value) {
              transcriptChanges.push({
                index: oldEntry.index,
                action: 'UPDATE',
                newValue: {
                  ...oldEntry.serie,
                  value: newWord
                },
                oldValue: oldEntry.serie
              })
            }
          }
        } else {
          const what = key;
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