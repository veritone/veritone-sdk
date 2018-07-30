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
  (state, { config: { engineId, categoryId } }) => ({
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
    config: shape({
      engineId: string.isRequired,
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
      )
    }).isRequired,
    engine: shape({
      id: string,
      name: string.isRequired,
      signedLogoPath: string
    }).isRequired,
    selectFileType: func,
    categoryFormatOptions: objectOf(oneOf(['enabled', 'disabled'])).isRequired
  };

  render() {
    const {
      config,
      selectFileType,
      engine,
      categoryFormatOptions
    } = this.props;

    const selectedFileExtensions = config.formats.map(
      format => format.extension
    );
    return (
      <ListItem className={styles.engineListItem}>
        <img className={styles.engineLogo} src={engine.signedLogoPath} />
        <ListItemText primary={engine.name} />
        <Select
          multiple
          value={selectedFileExtensions}
          // eslint-disable-next-line
          onChange={evt =>
            selectFileType(evt.target.value, config.categoryId, config.engineId)
          }
          inputProps={{
            name: config.engineId,
            id: `engine-select-${config.engineId}`
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
                <MenuItem key={`format-${config.engineId}-${key}`} value={key}>
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
