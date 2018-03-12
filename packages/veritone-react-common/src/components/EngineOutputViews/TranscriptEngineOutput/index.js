import React, { Component } from 'react';
import { arrayOf , bool, number, shape, string } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import withMuiThemeProvider from '../../../helpers/withMuiThemeProvider';
import TranscriptContent from './TranscriptContent';

import styles from './styles.scss';

@withMuiThemeProvider
class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(shape({
      startTime: number,
      endTime: number,
      data: string
    })),
    editModeEnabled: bool,
    classes: shape({
      root: string,
      header: string
    }),
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