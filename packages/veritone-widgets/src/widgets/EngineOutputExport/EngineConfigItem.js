import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { includes } from 'lodash';
import { modules } from 'veritone-redux-common';
const { user: userModule } = modules;

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
    category: engineOutputExportModule.getCategoryById(state, categoryId),
    exportClosedCaptionsEnabled: userModule.hasFeature(
      state,
      'exportClosedCaptions'
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
    engine: shape({
      id: string,
      name: string.isRequired,
      signedLogoPath: string
    }),
    category: shape({
      exportFormats: arrayOf(
        shape({
          label: string,
          format: string.isRequired,
          types: arrayOf(string)
        })
      ).isRequired
    }).isRequired,
    formats: arrayOf(
      shape({
        extension: string.isRequired,
        options: shape({
          linesPerScreen: number,
          maxLinesPerCaptionLine: number,
          newLineOnPunctuation: bool
        })
      })
    ).isRequired,
    selectFileType: func,
    exportClosedCaptionsEnabled: bool
  };

  render() {
    const {
      engine,
      engineId,
      categoryId,
      category,
      formats,
      selectFileType,
      exportClosedCaptionsEnabled
    } = this.props;

    const selectedFileExtensions = formats.map(format => format.extension);

    return (
      <ListItem className={styles.engineListItem}>
        {engine && (
          <img className={styles.engineLogo} src={engine.signedLogoPath} />
        )}
        <ListItemText
          primary={engine ? engine.name : 'All Engines'}
          inset={!engine}
        />
        <Select
          multiple
          value={selectedFileExtensions}
          // eslint-disable-next-line
          onChange={evt =>
            selectFileType(evt.target.value, categoryId, engineId, !engine)
          }
          // eslint-disable-next-line
          renderValue={value => `.${value.join(', .')}`}
          input={
            <Input
              classes={{
                root: styles.engineConfigInput
              }}
            />
          }
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            },
            getContentAnchorEl: null
          }}
        >
          {category.exportFormats.map(format => {
            if (
              includes(format.types, 'subtitle') &&
              !exportClosedCaptionsEnabled
            ) {
              return null;
            }

            return (
              <MenuItem
                key={`format-${engineId}-${format.format}`}
                value={format.format}
                classes={{
                  selected: styles.exportFormatSelected
                }}
              >
                <Checkbox
                  color="primary"
                  checked={includes(selectedFileExtensions, format.format)}
                />
                <ListItemText primary={`.${format.format} (${format.label})`} />
              </MenuItem>
            );
          })}
        </Select>
      </ListItem>
    );
  }
}
