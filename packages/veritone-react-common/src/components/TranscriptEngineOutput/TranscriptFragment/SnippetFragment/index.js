import React, { Component } from 'react';
import { string, number, func, bool } from 'prop-types';

import classNames from 'classnames';
import ContentEditable from 'react-contenteditable';

import styles from './styles.scss';

export default class SnippetFragment extends Component {
  static propTypes = {
    value: string,
    active: bool,
    startTimeMs: number,
    stopTimeMs: number,
    editMode: bool,
    onClick: func,
    onChange: func,
    className: string,
    changeOnBlur: bool
  };

  static defaultProps = {
    active: false,
    editMode: false,
    changeOnBlur: true
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
    const {
      value,
      startTimeMs,
      stopTimeMs,
      editMode,
      onChange,
      changeOnBlur
    } = this.props;

    if (editMode && onChange && !changeOnBlur) {
      const data = {
        newValue: event.target.value,
        originalValue: value,
        startTimeMs: startTimeMs,
        stopTimeMs: stopTimeMs
      };
      onChange(event, data);
    }
  };

  handleSnippetFocusOut = event => {
    const {
      value,
      startTimeMs,
      stopTimeMs,
      editMode,
      onChange,
      changeOnBlur
    } = this.props;
    const newVal = event.target.textContent;
    if (editMode && onChange && changeOnBlur && newVal !== value) {
      const data = {
        newValue: event.target.value,
        originalValue: value,
        startTimeMs: startTimeMs,
        stopTimeMs: stopTimeMs
      };
      onChange(event, data);
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
      />
    );
  }
}
