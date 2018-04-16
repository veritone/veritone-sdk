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
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import ZoomOutMap from 'material-ui-icons/ZoomOutMap';
import IconButton from 'material-ui/IconButton';

import styles from './styles.scss';

class EngineOutputHeader extends Component {
  static propTypes = {
    title: string,
    hideTitle: bool,
    engines: arrayOf(
      shape({
        id: string,
        name: string
      })
    ),
    selectedEngineId: string,
    onEngineChange: func,
    onExpandClicked: func,
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
    let {
      children,
      title,
      hideTitle,
      engines,
      selectedEngineId,
      onExpandClicked
    } = this.props;
    return (
      <div className={styles.engineOutputHeader}>
        {!hideTitle && <div className={styles.headerTitle}>{title}</div>}
        <div className={styles.headerActions}>
          {children}
          {!!engines.length && (
            <Select
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
              {engines.map((e, i) => {
                return (
                  <MenuItem
                    key={'engine-menu-item-' + e.id}
                    value={e.id}
                    className={styles.engine}
                  >
                    {e.name}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </div>
        {onExpandClicked && <div className={styles.actionIconDivider} />}
        {onExpandClicked && (
          <IconButton aria-label="Expanded View" onClick={onExpandClicked}>
            <ZoomOutMap />
          </IconButton>
        )}
      </div>
    );
  }
}

export default EngineOutputHeader;
