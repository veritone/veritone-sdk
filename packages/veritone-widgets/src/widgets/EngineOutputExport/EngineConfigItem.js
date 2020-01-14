import React, { Component } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, number, shape, string, func } from 'prop-types';
import { includes, get } from 'lodash';
import cx from 'classnames';
import { modules } from 'veritone-redux-common';
const { user: userModule } = modules;

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

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
  { forwardRef: true }
)
export default class EngineConfigItem extends Component {
  static propTypes = {
    engineId: string,
    categoryId: string.isRequired,
    engine: shape({
      id: string,
      name: string.isRequired,
      signedIconPath: string
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
      <ListItem
        className={styles.engineListItem}
        data-veritone-component="engine-config-list-item"
      >
        {engine && engine.signedIconPath ? (
          <img className={styles.engineLogo} src={engine.signedIconPath} />
        ) : (
            <Icon className={cx(styles['default-engine-icon'], 'icon-engines')} />
          )}
        <ListItemText
          classes={{ primary: styles.engineNameText }}
          primary={
            engine ? (
              engine.name
            ) : (
                <span className={styles.allEnginesText}>
                  <span>All Engines</span>
                  <Tooltip
                    title="Export will include formats selected for all available engines in this category"
                    placement="bottom-start"
                  >
                    <InfoIcon className={styles.allEnginesInfoIcon} />
                  </Tooltip>
                </span>
              )
          }
          inset={!engine}
        />
        <FormControl className={styles.formControl}>
          <InputLabel htmlFor="engine-export">
            {selectedFileExtensions.length ? "" : "Select export format"}
          </InputLabel>
          <Select
            multiple
            className={styles.selectStyles}
            value={selectedFileExtensions}
            // eslint-disable-next-line
            onChange={evt =>
              selectFileType(
                evt.target.value,
                categoryId || get(engine, 'category.id'),
                engineId
              )
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
            inputProps={{
              name: 'engine-export',
              id: 'engine-export',
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              getContentAnchorEl: null,
              'data-veritone-element': 'export-format-select-menu'
            }}
            data-veritone-element="export-format-select"
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
                  data-veritone-element={`${format.format}-export-format`}
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
        </FormControl>
      </ListItem>
    );
  }
}
