import React, { Component } from 'react';
import { string, number, func, bool } from 'prop-types';

import classNames from 'classnames'
import ContentEditable from 'react-contenteditable';

import styles from './styles.scss';

export default class SnippetFragment extends Component {
  static propTypes = {
    value: string,
    startTimeMs: number,
    stopTimeMs: number,
    editMode: bool,
    onClick: func,
    onChange: func,
    className: string,
  };

  static defaultProps = {
    editMode: false
  };

  handleSnippetClick = (event) => {
    let {
      value,
      startTimeMs,
      stopTimeMs,
      editMode,
      onClick
    } = this.props;

    if (!editMode && onClick) {
      let data = {
        value: value,
        startTimeMs: startTimeMs,
        stopTimeMs: stopTimeMs
      }
      onClick(event, data);
    }
  }

  handleSnippetChange = (event) => {
    let {
      value,
      startTimeMs,
      stopTimeMs,
      editMode,
      onChange
    } = this.props;

    if (editMode && onChange) {
      let data = {
        newValue: event.target.value,
        originalValue: value,
        startTimeMs: startTimeMs,
        stopTimeMs: stopTimeMs
      }
      onChange(event, data);
    }
  }


  render () {
    let {
      value,
      editMode,
      className
    } = this.props;

    return (
      <ContentEditable 
        tagName='span'
        html={value}
        disabled={!editMode}
        onClick={this.handleSnippetClick}
        onChange={this.handleSnippetChange}
        className={classNames(styles.transcriptSnippet, className, {[styles.read]: !editMode, [styles.edit]: editMode})}
      />
    );
  }

}