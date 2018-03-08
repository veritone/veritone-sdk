import React, { Component } from 'react';
import { arrayOf, object, bool, number } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import TranscriptContent from './TranscriptContent';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';

import styles from './styles.scss';

@withMuiThemeProvider
class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(object),
    editModeEnabled: bool,
    classes: object,
    tdoStartTime: number,
    tdoEndTime: number
  };

  static defaultProps = {
    assets: [],
    classes: {},
    editModeEnabled: false
  }

  render() {
    let { classes, editModeEnabled, assets, tdoStartTime, tdoEndTime } = this.props;
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
        <TranscriptContent 
          assets={assets} 
          editModeEnabled={editModeEnabled}
          tdoStartTime={tdoStartTime}
          tdoEndTime={tdoEndTime}
        />
      </div>
    );
  }
}

export default TranscriptEngineOutput;