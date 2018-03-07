import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import TranscriptContent from './TranscriptContent';

import styles from './styles.scss';

class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(object),
    classes: object
  };

  render() {
    let { classes } = this.props;
    return (
      <div className={classNames(styles.transcriptOutputView, classes.root)}>
        <div className={classNames(styles.transcriptViewHeader, classes.header)}>
          <div className={styles.headerTitle}>Transcription</div>
          <div className={styles.transcriptActions}>
            <Select value="temporal">
              <MenuItem value="temporal">Temporal</MenuItem>
            </Select>
          </div>
        </div>
        <TranscriptContent assets={this.props.assets}/>
      </div>
    );
  }
}

export default TranscriptEngineOutput;