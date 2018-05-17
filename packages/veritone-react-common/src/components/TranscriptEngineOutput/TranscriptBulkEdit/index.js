import React, { Component } from 'react';
import { string, number, bool, func } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

export default class TranscriptBulkEdit extends Component {
  static propTypes = {
    content: string,
    startTimeMs: number,
    stopTimeMs: number,
    onChange: func,
    changeOnBlur: bool,
    className: string
  };

  static defaultProps = {
    changeOnBlur: true
  };

  state = {
    content: this.props.content
  };

  handleOnChange = event => {
    this.setState({
      content: event.target.value
    });

    !this.props.changeOnBlur && this.triggerOnChange(event.target.value);
  };

  handleOnBlur = event => {
    this.props.changeOnBlur && this.triggerOnChange(this.state.content);
  };

  triggerOnChange(newContent) {
    const { content, onChange, startTimeMs, stopTimeMs } = this.props;
    if (onChange && content !== newContent) {
      onChange({
        type: 'bulk',
        newValue: {
          value: newContent,
          startTimeMs: startTimeMs,
          stopTimeMs: stopTimeMs
        },
        originalValue: {
          value: content,
          startTimeMs: startTimeMs,
          stopTimeMs: stopTimeMs
        }
      });
    }
  }

  render() {
    const { className } = this.props;
    return (
      <div className={classNames(styles.transcriptBulkEdit, className)}>
        <textarea
          value={this.state.content}
          onBlur={this.handleOnBlur}
          onChange={this.handleOnChange}
          className={classNames(styles.inputArea)}
        />
      </div>
    );
  }
}
