import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  arrayOf,
  bool,
  number,
  shape,
  string,
  func,
  objectOf,
  oneOf
} from 'prop-types';
import { includes } from 'lodash';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import styles from './styles.scss';
import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';

@connect(
  (state, { engineId, categoryId }) => ({
    engine: engineOutputExportModule.getEngineById(state, engineId),
    categoryFormatOptions: engineOutputExportModule.categoryFormatOptions(
      state,
      categoryId
    )
  }),
  {
    selectFileType: engineOutputExportModule.selectFileType
  },
  null,
  { withRef: true }
)
export default class EngineConfigItem extends Component {
  static propTypes = {
    engineId: string,
    categoryId: string.isRequired,
    formats: arrayOf(
      shape({
        extension: string.isRequired,
        options: shape({
          maxCharacterPerLine: number,
          newLineOnPunctuation: bool,
          linesPerScreen: number
        })
      })
    ).isRequired,
    engine: shape({
      id: string,
      name: string.isRequired,
      signedLogoPath: string
    }),
    selectFileType: func,
    categoryFormatOptions: objectOf(oneOf(['enabled', 'disabled'])).isRequired
  };

  render() {
    const {
      engineId,
      categoryId,
      formats,
      selectFileType,
      engine,
      categoryFormatOptions
    } = this.props;

    const selectedFileExtensions = formats.map(
      format => format.extension
    );
    return (
      <ListItem className={styles.engineListItem}>
        { engine && <img className={styles.engineLogo} src={engine.signedLogoPath} /> }
        <ListItemText primary={engine ? engine.name : "All Engines"} inset={!engine} />
        <Select
          multiple
          value={selectedFileExtensions}
          // eslint-disable-next-line
          onChange={evt =>
            selectFileType(evt.target.value, categoryId, engineId, !engine)
          }
          inputProps={{
            name: engineId,
            id: `engine-select-${engineId}`
          }}
          // eslint-disable-next-line
          renderValue={value => `.${value.join(', .')}`}
          input={
            <Input
              classes={{
                root: styles.engineConfigInput
              }}
            />
          }
        >
          {Object.keys(categoryFormatOptions).map(
            key =>
              categoryFormatOptions[key] === 'enabled' ? (
                <MenuItem key={`format-${engineId}-${key}`} value={key}>
                  <Checkbox
                    color="primary"
                    checked={includes(selectedFileExtensions, key)}
                  />
                  <ListItemText primary={`.${key}`} />
                </MenuItem>
              ) : null
          )}
        </Select>
      </ListItem>
    );
  }
}
