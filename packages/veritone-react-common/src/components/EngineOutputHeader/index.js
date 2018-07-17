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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import { Manager, Target, Popper } from 'react-popper';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';

import styles from './styles.scss';

class EngineOutputHeader extends Component {
  static propTypes = {
    title: string,
    hideTitle: bool,
    hideExpandButton: bool,
    showMoreMenuButton: bool,
    engines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    selectedEngineId: string,
    onEngineChange: func,
    onExpandClick: func,
    children: oneOfType([arrayOf(node), node]),
    moreMenuOptions: arrayOf(shape({
      label: string.isRequired,
      action: func.isRequired
    }))
  };

  static defaultProps = {
    engines: []
  };

  state = {
    isMoreMenuOpen: false
  };

  handleEngineChange = evt => {
    if (
      this.props.onEngineChange &&
      this.props.selectedEngineId !== evt.target.value
    ) {
      this.props.onEngineChange(evt.target.value);
    }
  };

  toggleIsMoreMenuOpen = () => {
    this.setState(prevState => {
      return {
        isMoreMenuOpen: !{ ...prevState }.isMoreMenuOpen
      };
    });
  };

  onMoreMenuItemClick = (evt) => {
    this.toggleIsMoreMenuOpen();
    this.props.moreMenuOptions[evt.target.value].action();
  };

  renderMoreMenu = () => {
    const {
      moreMenuOptions
    } = this.props;
    const {
      isMoreMenuOpen
    } = this.state;
    return (
      <Manager>
        <Target>
          <div ref={this.setMenuTarget}>
              <IconButton
                aria-label="More"
                aria-haspopup="true"
                aria-owns={isMoreMenuOpen ? 'menu-list-grow' : null}
                onClick={this.toggleIsMoreMenuOpen}
                classes={{
                  root: styles.moreMenuButton
                }}
              >
                <MoreVertIcon />
              </IconButton>
          </div>
        </Target>
        {isMoreMenuOpen && moreMenuOptions && (
          <Popper
            placement="bottom-end"
            eventsEnabled={isMoreMenuOpen}
          >
            <ClickAwayListener onClickAway={this.toggleIsMoreMenuOpen}>
              <Grow
                in={isMoreMenuOpen}
                id="menu-list-grow"
                style={{ transformOrigin: '0 0 0' }}
              >
                <Paper>
                  <MenuList role="menu">
                    {moreMenuOptions.map(option => {
                      return (
                        <MenuItem
                          key={`more-menu-item-${option.label}`}
                          classes={{ root: styles.moreMenuItem }}
                          onClick={this.onMoreMenuItemClick}
                        >
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        )}
      </Manager>
    );
  };

  render() {
    const {
      children,
      moreMenuOptions,
      title,
      hideTitle,
      hideExpandButton,
      showMoreMenuButton,
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
          {showMoreMenuButton && moreMenuOptions && this.renderMoreMenu()}
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
