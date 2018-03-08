import React, { Component } from 'react';
import { arrayOf, object, bool } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import TranscriptContent from './TranscriptContent';

import styles from './styles.scss';

class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(object),
    editModeEnabled: bool,
    classes: object
  };

  static defaultProps = {
    assets: [],
    classes: {},
    editModeEnabled: false
  }

  render() {
    let { classes, editModeEnabled } = this.props;
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
        <TranscriptContent assets={this.props.assets} editModeEnabled={editModeEnabled}/>
      </div>
    );
  }
}

export default TranscriptEngineOutput;