import React, { Component } from 'react';
import {
  string,
  bool,
  arrayOf,
  node,
  oneOfType,
  shape,
  func
} from 'prop-types';
import { isEmpty } from 'lodash';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import styles from './styles.scss';

class EngineOutputHeader extends Component {
  static propTypes = {
    title: string,
    hideTitle: bool,
    hideExpandButton: bool,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    selectedEngineId: string,
    onEngineChange: func,
    onExpandClick: func,
    children: oneOfType([arrayOf(node), node])
  };

  static defaultProps = {
    engines: []
  };

  handleEngineChange = evt => {
    if (this.props.onEngineChange) {
      this.props.onEngineChange(evt.target.value);
    }
  };

  render() {
    const {
      children,
      title,
      hideTitle,
      hideExpandButton,
      engines,
      selectedEngineId,
      onExpandClick
    } = this.props;
    return (
      <div className={styles.engineOutputHeader}>
        {!hideTitle && <div className={styles.headerTitle}>{title}</div>}
        <div className={styles.headerActions}>
          {children}
          {!isEmpty(engines) && (
            <Select
              autoWidth
              value={selectedEngineId || engines[0].id}
              className={styles.engineSelect}
              onChange={this.handleEngineChange}
              MenuProps={{
                anchorOrigin: {
                  horizontal: 'center',
                  vertical: 'bottom'
                },
                transformOrigin: {
                  horizontal: 'center'
                },
                getContentAnchorEl: null
              }}
            >
              {engines.map(e => {
                return (
                  <MenuItem
                    key={`engine-menu-item-${e.id}`}
                    value={e.id}
                    classes={{
                      root: styles.engine
                    }}
                  >
                    {e.name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </div>
        {onExpandClick &&
          !hideExpandButton && <div className={styles.actionIconDivider} />}
        {onExpandClick &&
          !hideExpandButton && (
            <IconButton aria-label="Expanded View" onClick={onExpandClick}>
              <Icon className="icon-max-view" />
            </IconButton>
          )}
      </div>
    );
  }
}

export default EngineOutputHeader;
