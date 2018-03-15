import React, { Component } from 'react';
import { arrayOf , bool, number, shape, string, func } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

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
    onSnippetClicked: func,
    tdoStartTime: number,
    tdoEndTime: number
  };

  static defaultProps = {
    assets: [],
    classes: {},
    editModeEnabled: false
  }

  render() {
    let { classes, editModeEnabled, assets, tdoStartTime, tdoEndTime, onSnippetClicked } = this.props;
    return (
      <div className={classNames(styles.transcriptOutputView, classes.root)}>
        <div className={classNames(styles.transcriptViewHeader, classes.header)}>
          { editModeEnabled ?
              <RadioGroup
                aria-label="edit_mode"
                value="snippet"
                name="editMode"
              >
                <FormControlLabel value="snippet" control={<Radio color="primary" />} label="Snippet Edit" />
                <FormControlLabel value="bulk" control={<Radio color="primary" />} label="Bulk Edit" />
              </RadioGroup>:
              <div className={styles.headerTitle}>Transcription</div>
          }
          <div className={styles.transcriptActions}>
            <Select value="temporal">
              <MenuItem value="temporal">Temporal</MenuItem>
            </Select>
          </div>
        </div>
        <TranscriptContent 
          assets={assets}
          onSnippetClicked={onSnippetClicked}
          editModeEnabled={editModeEnabled}
        />
      </div>
    );
  }
}

export default TranscriptEngineOutput;