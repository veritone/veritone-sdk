import React, { Component, cloneElement } from 'react';
import {
  string,
  bool,
  arrayOf,
  node,
  oneOfType,
  shape,
  func
} from 'prop-types';
import { isEmpty, get, isArray } from 'lodash';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import { Manager, Target, Popper } from 'react-popper';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';

import HotKeyModal from '../HotKeyModal';

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
    combineEngines: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    selectedEngineId: string,
    selectedCombineEngineId: string,
    onEngineChange: func,
    onCombineEngineChange: func,
    onExpandClick: func,
    children: oneOfType([arrayOf(node), node]),
    moreMenuItems: arrayOf(node),
    showEditButton: bool,
    onEditButtonClick: func,
    disableEditButton: bool,
    disableEngineSelect: bool,
    combineViewTypes: arrayOf(
      shape({
        name: string,
        id: string
      })
    ),
    selectedCombineViewTypeId: string,
    handleCombineViewTypeChange: func
  };

  static defaultProps = {
    engines: [],
    moreMenuItems: [],
    disableEngineSelect: false
  };

  state = {
    isMoreMenuOpen: false,
    isHotKeyModalOpen: false
  }

  handleOpenHotKeyModal = () => {
    this.setState({ isHotKeyModalOpen: true });
  }

  handleCloseHotKeyModal = () => {
    this.setState({ isHotKeyModalOpen: false });
  }

  handleEngineChange = evt => {
    if (
      this.props.onEngineChange &&
      this.props.selectedEngineId !== evt.target.value
    ) {
      this.props.onEngineChange(evt.target.value);
    }
  };

  handleCombineEngineChange = evt => {
    if (
      this.props.onCombineEngineChange &&
      this.props.selectedCombineEngineId !== evt.target.value 
    ) {
      this.props.onCombineEngineChange(evt.target.value);
    }
  }

  handleCombineViewTypeChange = evt => {
    if (
      this.props.handleCombineViewTypeChange &&
      this.props.selectedCombineViewTypeId !== evt.target.value
    ) {
      this.props.handleCombineViewTypeChange(evt.target.value);
    }
  }

  toggleIsMoreMenuOpen = () => {
    this.setState(prevState => {
      return {
        isMoreMenuOpen: !prevState.isMoreMenuOpen
      };
    });
  };

  render() {
    const {
      children,
      moreMenuItems,
      title,
      hideTitle,
      hideExpandButton,
      engines,
      combineEngines,
      selectedEngineId,
      selectedCombineEngineId,
      onExpandClick,
      showEditButton,
      onEditButtonClick,
      disableEditButton,
      disableEngineSelect,
      combineViewTypes,
      selectedCombineViewTypeId,
      hotKeyCategories
    } = this.props;
    const { isMoreMenuOpen, isHotKeyModalOpen } = this.state;

    const updatedMoreMenuItems = moreMenuItems.map(item => {
      return cloneElement(item, {
        onCloseMoreMenu: this.toggleIsMoreMenuOpen
      });
    });

    return (
      <div 
        className={styles.engineOutputHeader}
        data-veritone-component="engine-output-header"        
        >
        {!hideTitle && <div className={styles.headerTitle}>{title}</div>}
        <div 
          className={styles.headerActions}
          data-veritone-component="engine-header-actions"
          >
          {children}
          {isArray(combineViewTypes) && combineViewTypes.length > 1 && (
            <FormControl
              className={styles.engineFormControl}
              disabled={disableEngineSelect}
            >
              <Select
                autoWidth
                value={selectedCombineViewTypeId || combineViewTypes[0].id}
                className={styles.engineSelect}
                onChange={this.handleCombineViewTypeChange}
                MenuProps={{
                  anchorOrigin: {
                    horizontal: 'center',
                    vertical: 'bottom'
                  },
                  transformOrigin: {
                    horizontal: 'center',
                    vertical: 'top'
                  },
                  getContentAnchorEl: null
                }}
                data-veritone-component="header-combines-view-select"
              >
                {combineViewTypes.map(e => {
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
            </FormControl>
          )}
          {!isEmpty(engines) && (
            <FormControl
              className={styles.engineFormControl}
              disabled={disableEngineSelect}
            >
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
                    horizontal: 'center',
                    vertical: 'top'
                  },
                  getContentAnchorEl: null
                }}
                data-veritone-component="engine-output-header-select"
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
            </FormControl>
          )}
          {isArray(combineEngines) && combineEngines.length > 1 && (
            <FormControl
              className={styles.engineFormControl}
              disabled={disableEngineSelect}
            >
              <Select
                autoWidth
                value={selectedCombineEngineId || combineEngines[0].id}
                className={styles.engineSelect}
                onChange={this.handleCombineEngineChange}
                MenuProps={{
                  anchorOrigin: {
                    horizontal: 'center',
                    vertical: 'bottom'
                  },
                  transformOrigin: {
                    horizontal: 'center',
                    vertical: 'top'
                  },
                  getContentAnchorEl: null
                }}
                data-veritone-component="engine-combines-select"
              >
                {combineEngines.map(e => {
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
            </FormControl>
          )}
          {showEditButton && (
            <IconButton
              aria-label="Edit Mode"
              onClick={onEditButtonClick}
              classes={{
                root: styles.actionIconButton
              }}
              disabled={disableEditButton}
              data-veritone-component="engine-output-content"          
            >
              <Icon className="icon-mode_edit2" />
            </IconButton>
          )}
          {hideTitle && hotKeyCategories && (
            <Tooltip
              title="Show Hot Keys"
              placement="top-end">
              <IconButton
                aria-label="Hot Key Shortcuts"
                onClick={this.handleOpenHotKeyModal}
                classes={{
                  root: styles.actionIconButton
                }}
              >
                <KeyboardIcon />
              </IconButton>
            </Tooltip>
          )}
          {!!get(moreMenuItems, 'length') && (
            <Manager>
              <Target>
                <div ref={this.setMenuTarget}>
                  <IconButton
                    aria-label="More"
                    aria-haspopup="true"
                    aria-owns={isMoreMenuOpen ? 'menu-list-grow' : null}
                    onClick={this.toggleIsMoreMenuOpen}
                    classes={{
                      root: styles.actionIconButton
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </Target>
              {isMoreMenuOpen &&
                moreMenuItems && (
                  <Popper
                    className={styles.moreMenuPopperContent}
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
                            {updatedMoreMenuItems}
                          </MenuList>
                        </Paper>
                      </Grow>
                    </ClickAwayListener>
                  </Popper>
                )}
            </Manager>
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
        {hotKeyCategories && (
          <HotKeyModal
            onClose={this.handleCloseHotKeyModal}
            open={isHotKeyModalOpen}
            hotKeyCategories={hotKeyCategories} />
        )}
      </div>
    );
  }
}

export default EngineOutputHeader;
