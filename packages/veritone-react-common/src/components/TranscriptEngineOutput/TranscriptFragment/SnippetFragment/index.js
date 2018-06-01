import React, { Component } from 'react';
import { string, number, func, bool } from 'prop-types';

import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';

import styles from './styles.scss';

export default class SnippetFragment extends Component {
  static propTypes = {
    value: string,
    active: bool,
    startTimeMs: number.isRequired,
    stopTimeMs: number.isRequired,
    editMode: bool,
    onClick: func,
    onChange: func,
    className: string,
    changeOnBlur: bool
  };

  static defaultProps = {
    active: false,
    editMode: false,
    changeOnBlur: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { active, value, className, editMode } = nextProps;
    const newMode = editMode !== this.props.editMode;
    const newHighlight = active !== this.props.active;
    const newClass = className !== this.props.className;
    const newValue = this.currentValue && value !== this.currentValue.value;
    return newMode || newClass || newValue || newHighlight;
  }

  originalValue = {
    value: this.props.value,
    startTimeMs: this.props.startTimeMs,
    stopTimeMs: this.props.stopTimeMs
  };

  handleSnippetClick = event => {
    const { value, startTimeMs, stopTimeMs, editMode, onClick } = this.props;

    if (!editMode && onClick) {
      const data = {
        value: value,
        startTimeMs: startTimeMs,
        stopTimeMs: stopTimeMs
      };
      onClick(event, data);
    }
  };

  handleSnippetChange = event => {
    const { startTimeMs, stopTimeMs, changeOnBlur } = this.props;
    const newValue = event.target.value;
    !changeOnBlur && this.triggerOnChange(newValue, startTimeMs, stopTimeMs);
  };

  handleSnippetFocusOut = event => {
    const { startTimeMs, stopTimeMs } = this.props;
    const newVal = event.target.textContent;
    const newStartTime = startTimeMs; //These 2 are the same for now. We will have options to edit time in the future
    const newStopTime = stopTimeMs;   //These 2 are the same for now. We will have options to edit time in the future
    this.triggerOnChange(newVal, newStartTime, newStopTime, true);
  };

  triggerOnChange = (newValue, newStartTime, newStopTime, onBlur = false) => {
    const { value, startTimeMs, stopTimeMs, editMode, onChange } = this.props;

    if (
      editMode &&
      onChange &&
      (value !== newValue ||
        startTimeMs !== newStartTime ||
        stopTimeMs !== newStopTime)
    ) {
      this.currentValue = {
        value: newValue,
        startTimeMs: newStartTime,
        stopTimeMs: newStopTime
      };

      onChange({
        type: 'snippet',
        onBlur: onBlur,
        newValue: this.currentValue,
        originalValue: this.originalValue
      });
    }
  };

  render() {
    const { value, active, editMode, className } = this.props;
    return (
      <ContentEditable
        tagName="span"
        html={value}
        disabled={!editMode}
        onClick={this.handleSnippetClick}
        onBlur={this.handleSnippetFocusOut}
        onChange={this.handleSnippetChange}
        className={classNames(styles.transcriptSnippet, className, {
          [styles.read]: !editMode,
          [styles.edit]: editMode,
          [styles.highlight]: active
        })}
        ref={this.textInput}
      />
    );
  }
}
