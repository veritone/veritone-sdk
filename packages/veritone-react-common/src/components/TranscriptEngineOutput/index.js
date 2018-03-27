import React, { Component } from 'react';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import EngineOutputHeader from '../EngineOutputHeader';
import TranscriptContent from './TranscriptContent';

import styles from './styles.scss';

@withMuiThemeProvider
class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(
      shape({
        startTime: number,
        endTime: number,
        data: string
      })
    ),
    editModeEnabled: bool,
    className: string,
    onSnippetClicked: func,
    tdoStartTime: number,
    tdoEndTime: number,
    editMode: string,
    selectedEngineId: string,
    engines: arrayOf(
      shape({
        sourceEngineId: string,
        sourceEngineName: string
      })
    ),
    onEngineChange: func,
    onSnippetEdit: func,
    onEditModeChange: func,
    viewMode: string,
    onViewModeChange: func
  };

  static defaultProps = {
    assets: [],
    classes: {},
    editModeEnabled: false,
    viewMode: 'time'
  };

  render() {
    let {
      className,
      editModeEnabled,
      editMode,
      assets,
      onSnippetClicked,
      selectedEngineId,
      engines,
      onEngineChange,
      onSnippetEdit,
      onEditModeChange,
      viewMode,
      onViewModeChange
    } = this.props;
    return (
      <div className={classNames(styles.transcriptOutputView, className)}>
        <EngineOutputHeader title="Transcription" hideTitle={editModeEnabled}>
          <div className={styles.transcriptInputs}>
            <div>
              {editModeEnabled && (
                <RadioGroup
                  onChange={onEditModeChange}
                  aria-label="edit_mode"
                  value={editMode}
                  name="editMode"
                  row
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
                </RadioGroup>
              )}
            </div>
            <div>
              <Select
                value={viewMode}
                onChange={onViewModeChange}
                className={styles.selectWithMargin}
                autoWidth
              >
                <MenuItem value="time">Time</MenuItem>
                <MenuItem value="overview">Overview</MenuItem>
              </Select>
              <Select value={selectedEngineId || ''} onChange={onEngineChange}>
                {engines.map((e, i) => {
                  return (
                    <MenuItem key={i} value={e.sourceEngineId}>
                      {e.sourceEngineName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
        </EngineOutputHeader>
        <TranscriptContent
          assets={assets}
          onSnippetClicked={onSnippetClicked}
          onSnippetEdit={onSnippetEdit}
          editModeEnabled={editModeEnabled}
          editMode={editMode}
        />
      </div>
    );
  }
}

export default TranscriptEngineOutput;
