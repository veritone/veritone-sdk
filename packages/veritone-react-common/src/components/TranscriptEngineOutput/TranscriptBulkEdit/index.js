import React, {Component} from 'react';
import { string, func } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

export default class TranscriptBulkEdit extends Component {
  static propTypes = {
    content: string,
    className: string,
    onChange: func
  };

  setTextArea = target => {
    if (target) {
      target.value = this.props.content;
      this.inputArea = target;
    }
  };

  render () {
    let { className } = this.props;
    return (
      <div className={classNames(styles.transcriptBulkEdit, className)}>
        <textarea ref={this.setTextArea} className={classNames(styles.inputArea)} />
      </div>
    );
  }
}