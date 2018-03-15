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
    tdoEndTime: number,
    editMode: string,
    selectedEngineId: string,
    engines: arrayOf(shape({
      sourceEngineId: string,
      sourceEngineName: string
    })),
    onEngineChange: func,
    onSnippetEdit: func
  };

  static defaultProps = {
    assets: [],
    classes: {},
    editModeEnabled: false
  }

  render() {
    let { 
      classes, 
      editModeEnabled, 
      editMode, 
      assets,
      onSnippetClicked,
      selectedEngineId,
      engines,
      onEngineChange,
      onSnippetEdit
    } = this.props;
    return (
      <div className={classNames(styles.transcriptOutputView, classes.root)}>
        <div className={classNames(styles.transcriptViewHeader, classes.header)}>
          { editModeEnabled ?
              <RadioGroup
                aria-label="edit_mode"
                value={editMode}
                name="editMode"
              >
                <FormControlLabel 
                  className={styles.editModeFormControlLabel} 
                  value="snippet" 
                  control={<Radio color="primary" />} 
                  label="Snippet Edit" 
                />
                <FormControlLabel 
                  className={styles.editModeFormControlLabel} 
                  value="bulk" 
                  control={<Radio color="primary" />} 
                  label="Bulk Edit" 
                />
              </RadioGroup>:
              <div className={styles.headerTitle}>Transcription</div>
          }
          <div className={styles.transcriptActions}>
            <Select value={selectedEngineId || ""} onChange={onEngineChange}>
              { engines.map((e, i) => {
                  return <MenuItem 
                    key={i} 
                    value={e.sourceEngineId}
                  >
                    {e.sourceEngineName}
                  </MenuItem>
                })
              }
            </Select>
          </div>
        </div>
        <TranscriptContent 
          assets={assets}
          onSnippetClicked={onSnippetClicked}
          onSnippetEdit={onSnippetEdit}
          editModeEnabled={editModeEnabled}
        />
      </div>
    );
  }
}

export default TranscriptEngineOutput;