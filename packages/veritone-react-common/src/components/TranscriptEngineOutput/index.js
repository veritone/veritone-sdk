import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';

import TranscriptContent from './TranscriptContent';

import styles from './styles.scss';

class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(object)
  };
  render() {
    return (
      <div className={styles.transcriptOutputView}>
        <div className={styles.transcriptViewHeader}>
          <div className={styles.headerTitle}>Transcription</div>
        </div>
        <TranscriptContent assets={this.props.assets}/>
      </div>
    );
  }
}

export default TranscriptEngineOutput;