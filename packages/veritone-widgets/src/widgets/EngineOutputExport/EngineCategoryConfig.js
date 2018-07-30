import React, { Component, Fragment } from 'react';
import { forEach, get } from 'lodash';
import { string, bool, shape, func, arrayOf, number } from 'prop-types';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ClosedCaptionIcon from '@material-ui/icons/ClosedCaption';

import EngineConfigItem from './EngineConfigItem';
import styles from './styles.scss';
import { withMuiThemeProvider } from 'veritone-react-common';

import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';
import List from '@material-ui/core/List';

@withMuiThemeProvider
@connect(
  (state, { categoryId }) => ({
    category: engineOutputExportModule.getCategoryById(state, categoryId)
  }),
  {},
  null,
  { withRef: true }
)
export default class EngineCategoryConfig extends Component {
  static propTypes = {
    category: shape({
      id: string.isRequired,
      iconClass: string.isRequired,
      name: string.isRequired
    }).isRequired,
    engineCategoryConfigs: arrayOf(
      shape({
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
      })
    ).isRequired,
    expanded: bool,
    onExpandConfigs: func
  };

  render() {
    const {
      category,
      engineCategoryConfigs,
      onExpandConfigs,
      expanded
    } = this.props;

    let hasFormatsSelected = false;
    forEach(engineCategoryConfigs, config => {
      if (get(config, 'formats.length')) {
        hasFormatsSelected = true;
      }
    });

    return (
      <Fragment>
        <ListItem>
          <ListItemIcon>
            <Icon className={category.iconClass} />
          </ListItemIcon>
          <ListItemText
            primary={`${category.name} (${engineCategoryConfigs.length})`}
          />
          <ListItemIcon classes={{ root: styles.expandIcon }}>
            <IconButton
              aria-label="Show more"
              // eslint-disable-next-line
              onClick={() => onExpandConfigs(category.id)}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </ListItemIcon>
        </ListItem>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {engineCategoryConfigs.map(config => {
              return (
                <EngineConfigItem
                  key={`engine-config-item-${config.engineId}`}
                  config={config}
                />
              );
            })}

            {hasFormatsSelected && (
              <ListItem className={styles.engineListItem}>
                <div className={styles.customizeOutputBox}>
                  <ClosedCaptionIcon className={styles.closedCaptionIcon} />
                  <span className={styles.customizeSubtitleText}>
                    Subtitle formats have been selected, adjust and display
                    settings here
                  </span>
                  <Button color="primary" className={styles.customizeButton}>
                    Customize
                  </Button>
                </div>
              </ListItem>
            )}
          </List>
        </Collapse>
      </Fragment>
    );
  }
}
