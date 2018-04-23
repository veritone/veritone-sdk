import React, { Component } from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

export default class TranscriptBulkEdit extends Component {
  static propTypes = {
    content: string,
    className: string
  };

  scaleToFit = () => {
    if (this.inputArea) {
      this.inputArea.style.height = this.inputArea.scrollHeight + 'px';
    }
  };

  setTextArea = target => {
    if (target) {
      target.value = this.props.content;
      this.inputArea = target;
      this.scaleToFit();
    }
  };

  render() {
    let { className } = this.props;
    return (
      <div className={classNames(styles.transcriptBulkEdit, className)}>
        <textarea
          ref={this.setTextArea}
          className={classNames(styles.inputArea)}
        />
      </div>
    );
  }
}
