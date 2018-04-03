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
import Icon from 'material-ui/Icon';
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
          {engines &&
            engines.length && (
              <Select
                value={selectedEngineId || engines[0].id}
                onChange={this.handleEngineChange}
              >
                {engines.map((e, i) => {
                  return (
                    <MenuItem key={'engine-menu-item-' - e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
        </div>
        <div className={styles.actionIconDivider} />
        <IconButton
          aria-label="Expanded View"
          className={styles.expandedViewButton}
          onClick={onExpandClicked}
        >
          <Icon className="icon-expand2" />
        </IconButton>
      </div>
    );
  }
}

export default EngineOutputHeader;
