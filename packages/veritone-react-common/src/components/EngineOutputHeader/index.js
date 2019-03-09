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
import cx from 'classnames';
import { isEmpty, get, isArray } from 'lodash';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import { Manager, Reference, Popper } from 'react-popper';
import MenuList from '@material-ui/core/MenuList';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DoneIcon from '@material-ui/icons/Done';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

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
    handleCombineViewTypeChange: func,
    onUserEditChange: func,
    hotKeyCategories: arrayOf(shape({
      commands: arrayOf(shape({
        label: string,
        hotkeys: arrayOf(shape({
          platform: string,
          operator: string,
          keys: arrayOf(string).isRequired
        }))
      }))
    })),
    selectedEngineWithData: shape({
      id: string,
      showingUserEditedOutput: bool,
      engineResults: arrayOf(shape({
        assetId: string.isRequired
      }))
    }),
    selectedCombineEngineWithData: shape({
      id: string,
      showingUserEditedOutput: bool,
      engineResults: arrayOf(shape({
        assetId: string.isRequired
      }))
    })
  };

  static defaultProps = {
    engines: [],
    moreMenuItems: [],
    disableEngineSelect: false
  };

  state = {
    isMoreMenuOpen: false,
    isHotKeyModalOpen: false,
    isMainMenuOpen: {},
    isSubMenuOpen: {}
  }

  menuAnchorRefs = {}

  setMenuAnchorRef = categoryType => node => {
    if (categoryType) {
      this.menuAnchorRefs[categoryType] = node;
    }
  }

  resetSubMenus = () => {
    const { isMainMenuOpen } = this.state;
    const categoryTypeKeys = Object.keys(isMainMenuOpen);
    const newIsMainMenuOpen = categoryTypeKeys.reduce((acc, catKey) => {
      acc[catKey] = false;
      return acc;
    }, {});
    const newIsSubMenuOpen = categoryTypeKeys.reduce((acc, catKey) => {
      acc[catKey] = {};
      return acc;
    }, {});
    this.setState(prevState => ({
      ...prevState,
      isMainMenuOpen: newIsMainMenuOpen,
      isSubMenuOpen: newIsSubMenuOpen
    }));
  }

  handleOpenHotKeyModal = () => {
    this.setState({ isHotKeyModalOpen: true });
  }

  handleCloseHotKeyModal = () => {
    this.setState({ isHotKeyModalOpen: false });
  }

  handleEngineChange = engine => () => {
    if (
      this.props.onEngineChange &&
      this.props.selectedEngineId !== engine.id
    ) {
      this.props.onEngineChange(engine.id);
      this.resetSubMenus();
    }
  };

  handleCombineEngineChange = engine => () => {
    if (
      this.props.onCombineEngineChange &&
      this.props.selectedCombineEngineId !== engine.id 
    ) {
      this.props.onCombineEngineChange(engine.id);
      this.resetSubMenus();
    }
  }

  handleCombineViewTypeChange = viewTypeId => () => {
    if (
      this.props.handleCombineViewTypeChange &&
      this.props.selectedCombineViewTypeId !== viewTypeId
    ) {
      this.props.handleCombineViewTypeChange(viewTypeId);
      this.resetSubMenus();
    }
  }

  handleOnUserEditChange = engineWithData => viewType => () => {
    const {
      onUserEditChange
    } = this.props;
    if (engineWithData && viewType) {
      onUserEditChange(engineWithData)(viewType)();
      this.resetSubMenus();
    }
  }

  toggleIsMoreMenuOpen = () => {
    this.setState(prevState => {
      return {
        isMoreMenuOpen: !prevState.isMoreMenuOpen
      };
    });
  };

  handleMainMenuClick = categoryType => () => {
    const { disableEngineSelect } = this.props;
    if (disableEngineSelect) {
      return;
    }
    this.setState(prevState => ({
      ...prevState,
      isMainMenuOpen: {
        ...prevState.isMainMenuOpen,
        [categoryType]: !prevState.isMainMenuOpen[categoryType]
      }
    }));
  }

  handleSubMenuClick = categoryType => menuType => () => {
    if (categoryType && menuType) {
      this.setState(prevState => ({
        ...prevState,
        isSubMenuOpen: {
          ...prevState.isSubMenuOpen,
          [categoryType]: {
            ...prevState.isSubMenuOpen[categoryType],
            [menuType]: !get(prevState.isSubMenuOpen, [categoryType, menuType], false)
          }
        }
      }));
    }
  }

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
      hotKeyCategories,
      selectedEngineWithData,
      selectedCombineEngineWithData
    } = this.props;
    const {
      isMoreMenuOpen,
      isHotKeyModalOpen,
      isMainMenuOpen,
      isSubMenuOpen
    } = this.state;
    const selectedEngine = engines.find(e => e.id === selectedEngineId);
    const selectedCombineEngine = combineEngines && combineEngines.find(e => e.id === selectedCombineEngineId);
    const engineCategory = get(engines, '[0].category');
    const combineEngineCategory = get(combineEngines, '[0].category');

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
          {isArray(combineEngines) && combineEngines.length > 0 && (
            <FormControl
              className={styles.engineFormControl}
              disabled={disableEngineSelect}
            >
              <Manager>
                <Reference>
                  {({ ref }) => (
                    <div ref={ref}>
                      <Input
                        inputRef={this.setMenuAnchorRef(combineEngineCategory.categoryType)}
                        disabled={disableEngineSelect}
                        aria-owns={isMainMenuOpen[combineEngineCategory.categoryType] ? 'menu-list-grow' : undefined}
                        className={styles.engineSelect}
                        onClick={this.handleMainMenuClick(combineEngineCategory.categoryType)}
                        data-veritone-component="engine-output-header-select"
                        value={(selectedCombineEngine && selectedCombineEngine.name) || combineEngines[0].name}
                        readOnly
                        inputProps={{ className: styles.mainMenuText }}
                        startAdornment={(
                          <Icon className={combineEngineCategory.iconClass}
                            classes={{ root: styles.categoryIcon }}
                          />
                        )}
                        endAdornment={( <ArrowDropDownIcon className={styles.dropdownIcon} /> )} />
                    </div>
                  )}
                </Reference>
                {selectedCombineEngine && isMainMenuOpen[combineEngineCategory.categoryType] && (
                  <Popper
                    className={styles.moreMenuPopperContent}
                    placement="bottom-end"
                    eventsEnabled={isMainMenuOpen[combineEngineCategory.categoryType]}
                  >
                    {({ ref, style, placement }) => (
                      <div ref={ref} style={style} data-placement={placement}>
                        <ClickAwayListener onClickAway={this.handleMainMenuClick(combineEngineCategory.categoryType)}>
                          <Grow
                            in={isMainMenuOpen[combineEngineCategory.categoryType]}
                            id="menu-list-grow"
                            style={{ transformOrigin: '0 0 0' }}
                          >
                            <Paper>
                              <MenuList role="menu" classes={{ root: styles.mainMenu }}>
                                <MenuItem
                                  button
                                  onClick={this.handleSubMenuClick(combineEngineCategory.categoryType)('engine')}
                                >
                                  <ListItemText
                                    classes={{
                                      primary: styles.selectMenuItem
                                    }}
                                    primary="Available Engines"
                                  />
                                  {get(isSubMenuOpen, [combineEngineCategory && combineEngineCategory.categoryType, 'engine'], false) ? <ExpandLess /> : <ExpandMore />}
                                </MenuItem>
                                <Collapse
                                  className={styles.engineList}
                                  in={get(isSubMenuOpen, [combineEngineCategory && combineEngineCategory.categoryType, 'engine'], false)}
                                  timeout="auto"
                                  unmountOnExit>
                                  {combineEngines.map(e => {
                                    return (
                                      <MenuItem
                                        key={`engine-menu-item-${e.id}`}
                                        value={e.id}
                                        classes={{
                                          root: styles.engine
                                        }}
                                        onClick={this.handleCombineEngineChange(e)}
                                      >
                                        {e.id === selectedCombineEngineId && (
                                          <ListItemIcon classes={{ root: styles.subMenuCheckIcon }}>
                                            <DoneIcon />
                                          </ListItemIcon>
                                        )}
                                        <ListItemText
                                          classes={{
                                            primary: cx(styles.selectMenuItem, {
                                              [styles.menuItemInset]: e.id !== selectedCombineEngineId
                                            })
                                          }} 
                                          primary={e.name}
                                          title={e.name}
                                        />
                                      </MenuItem>
                                    );
                                  })}
                                </Collapse>
                                { selectedCombineEngineWithData && selectedCombineEngineWithData.hasUserEdits && (
                                  <div>
                                    <Divider />
                                    <MenuItem
                                      button
                                      onClick={this.handleSubMenuClick(combineEngineCategory.categoryType)('version')}
                                    >
                                      <ListItemText
                                        classes={{
                                          primary: styles.selectMenuItem
                                        }} 
                                        primary="Versioning"
                                      />
                                      {get(isSubMenuOpen, [combineEngineCategory && combineEngineCategory.categoryType, 'version'], false) ? <ExpandLess /> : <ExpandMore />}
                                    </MenuItem>
                                    <Collapse
                                      in={get(isSubMenuOpen, [combineEngineCategory && combineEngineCategory.categoryType, 'version'], false)}
                                      timeout="auto"
                                      unmountOnExit>
                                      <MenuItem
                                        button
                                        onClick={this.handleOnUserEditChange(selectedCombineEngineWithData)('userEdited')}
                                      >
                                        {selectedCombineEngineWithData.showingUserEditedOutput && (
                                          <ListItemIcon classes={{ root: styles.subMenuCheckIcon }}>
                                            <DoneIcon />
                                          </ListItemIcon>
                                        )}
                                        <ListItemText
                                          classes={{
                                            primary: cx(styles.selectMenuItem, {
                                              [styles.menuItemInset]: !selectedCombineEngineWithData.showingUserEditedOutput
                                            })
                                          }} 
                                          primary="User-Edited"
                                        />
                                      </MenuItem>
                                      <MenuItem
                                        button
                                        onClick={this.handleOnUserEditChange(selectedCombineEngineWithData)('original')}
                                      >
                                        {!selectedCombineEngineWithData.showingUserEditedOutput && (
                                          <ListItemIcon classes={{ root: styles.subMenuCheckIcon }}>
                                            <DoneIcon />
                                          </ListItemIcon>
                                        )}
                                        <ListItemText
                                          classes={{
                                            primary: cx(styles.selectMenuItem, {
                                              [styles.menuItemInset]: selectedCombineEngineWithData.showingUserEditedOutput
                                            })
                                          }} 
                                          primary="Original"
                                        />
                                      </MenuItem>
                                      <MenuItem
                                        button
                                        onClick={this.handleOnUserEditChange(selectedCombineEngineWithData)('restoreOriginal')}
                                      >
                                        <ListItemText
                                          classes={{
                                            root: styles.restoreOriginalMenuItem,
                                            primary: cx(styles.selectMenuItem, styles.menuItemInset)
                                          }} 
                                          primary="Restore Original"
                                        />
                                      </MenuItem>
                                    </Collapse>
                                  </div>
                                )}
                                { isArray(combineViewTypes) && combineViewTypes.length && (
                                  combineViewTypes
                                    .filter(view => view.id !== selectedCombineViewTypeId)
                                    .map(view => {
                                      return (
                                        <div key={`combine-engine-view-container-${view.id}`}>
                                          <Divider />
                                          <MenuItem
                                            key={`combine-engine-view-item-${view.id}`}
                                            onClick={this.handleCombineViewTypeChange(view.id)}
                                            classes={{
                                              root: styles.engine
                                            }}
                                          >
                                            {view.name}
                                          </MenuItem>
                                        </div>
                                      );
                                    })
                                )}
                              </MenuList>
                            </Paper>
                          </Grow>
                        </ClickAwayListener>
                      </div>
                    )}
                  </Popper>
                )}
              </Manager>
            </FormControl>
          )}
          {!isEmpty(engines) && (
            <FormControl
              className={styles.engineFormControl}
              disabled={disableEngineSelect}
            >
              <Manager>
                <Reference>
                  {({ ref }) => (
                    <div ref={ref}>
                      <Input
                        inputRef={this.setMenuAnchorRef(engineCategory.categoryType)}
                        disabled={disableEngineSelect}
                        aria-owns={isMainMenuOpen[engineCategory.categoryType] ? 'menu-list-grow' : undefined}
                        className={styles.engineSelect}
                        onClick={this.handleMainMenuClick(engineCategory.categoryType)}
                        data-veritone-component="engine-output-header-select"
                        value={(selectedEngine && selectedEngine.name) || engines[0].name}
                        readOnly
                        inputProps={{
                          className: styles.mainMenuText
                        }}
                        startAdornment={(
                          <Icon className={engineCategory.iconClass}
                            classes={{ root: styles.categoryIcon }}
                          />
                        )}
                        endAdornment={( <ArrowDropDownIcon className={styles.dropdownIcon} /> )} />
                    </div>
                  )}
                </Reference>
                {selectedEngine && isMainMenuOpen[engineCategory.categoryType] && (
                  <Popper
                    className={styles.moreMenuPopperContent}
                    placement="bottom-end"
                    eventsEnabled={isMainMenuOpen[engineCategory.categoryType]}
                  >
                    {({ ref, style, placement }) => (
                      <div ref={ref} style={style} data-placement={placement}>
                        <ClickAwayListener onClickAway={this.handleMainMenuClick(engineCategory.categoryType)}>
                          <Grow
                            in={isMainMenuOpen[engineCategory.categoryType]}
                            id="menu-list-grow"
                            style={{ transformOrigin: '0 0 0' }}
                          >
                            <Paper>
                              <MenuList role="menu" classes={{ root: styles.mainMenu }}>
                                <MenuItem
                                  button
                                  onClick={this.handleSubMenuClick(engineCategory.categoryType)('engine')}
                                >
                                  <ListItemText
                                    classes={{
                                      primary: styles.selectMenuItem
                                    }}
                                    primary="Available Engines"
                                  />
                                  {get(isSubMenuOpen, [engineCategory && engineCategory.categoryType, 'engine'], false) ? <ExpandLess /> : <ExpandMore />}
                                </MenuItem>
                                <Collapse
                                  className={styles.engineList}
                                  in={get(isSubMenuOpen, [engineCategory && engineCategory.categoryType, 'engine'], false)}
                                  timeout="auto"
                                  unmountOnExit>
                                  {engines.map(e => {
                                    return (
                                      <MenuItem
                                        key={`engine-menu-item-${e.id}`}
                                        value={e.id}
                                        classes={{
                                          root: styles.engine
                                        }}
                                        onClick={this.handleEngineChange(e)}
                                      >
                                        {e.id === selectedEngineId && (
                                          <ListItemIcon classes={{ root: styles.subMenuCheckIcon }}>
                                            <DoneIcon />
                                          </ListItemIcon>
                                        )}
                                        <ListItemText
                                          classes={{
                                            primary: cx(styles.selectMenuItem, {
                                              [styles.menuItemInset]: e.id !== selectedEngineId
                                            })
                                          }} 
                                          primary={e.name}
                                          title={e.name}
                                        />
                                      </MenuItem>
                                    );
                                  })}
                                </Collapse>
                                { selectedEngineWithData && selectedEngineWithData.hasUserEdits && (
                                  <div>
                                    <Divider />
                                    <MenuItem
                                      button
                                      onClick={this.handleSubMenuClick(engineCategory.categoryType)('version')}
                                    >
                                      <ListItemText
                                        classes={{
                                          primary: styles.selectMenuItem
                                        }} 
                                        primary="Versioning"
                                      />
                                      {get(isSubMenuOpen, [engineCategory && engineCategory.categoryType, 'version'], false) ? <ExpandLess /> : <ExpandMore />}
                                    </MenuItem>
                                    <Collapse
                                      in={get(isSubMenuOpen, [engineCategory && engineCategory.categoryType, 'version'], false)}
                                      timeout="auto"
                                      unmountOnExit>
                                      <MenuItem
                                        button
                                        onClick={this.handleOnUserEditChange(selectedEngineWithData)('userEdited')}
                                      >
                                        {selectedEngineWithData.showingUserEditedOutput && (
                                          <ListItemIcon classes={{ root: styles.subMenuCheckIcon }}>
                                            <DoneIcon />
                                          </ListItemIcon>
                                        )}
                                        <ListItemText
                                          classes={{
                                            primary: cx(styles.selectMenuItem, {
                                              [styles.menuItemInset]: !selectedEngineWithData.showingUserEditedOutput
                                            })
                                          }} 
                                          primary="User-Edited"
                                        />
                                      </MenuItem>
                                      <MenuItem
                                        button
                                        onClick={this.handleOnUserEditChange(selectedEngineWithData)('original')}
                                      >
                                        {!selectedEngineWithData.showingUserEditedOutput && (
                                          <ListItemIcon classes={{ root: styles.subMenuCheckIcon }}>
                                            <DoneIcon />
                                          </ListItemIcon>
                                        )}
                                        <ListItemText
                                          classes={{
                                            primary: cx(styles.selectMenuItem, {
                                              [styles.menuItemInset]: selectedEngineWithData.showingUserEditedOutput
                                            })
                                          }} 
                                          primary="Original"
                                        />
                                      </MenuItem>
                                      <MenuItem
                                        button
                                        onClick={this.handleOnUserEditChange(selectedEngineWithData)('restoreOriginal')}
                                      >
                                        <ListItemText
                                          classes={{
                                            root: styles.restoreOriginalMenuItem,
                                            primary: cx(styles.selectMenuItem, styles.menuItemInset)
                                          }} 
                                          primary="Restore Original"
                                        />
                                      </MenuItem>
                                    </Collapse>
                                  </div>
                                )}
                              </MenuList>
                            </Paper>
                          </Grow>
                        </ClickAwayListener>
                      </div>
                    )}
                  </Popper>
                )}
              </Manager>
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
              <Reference>
                {({ ref }) => (
                  <div ref={ref}>
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
                  </div>
                )}
              </Reference>
              {isMoreMenuOpen &&
                moreMenuItems && (
                  <Popper
                    className={styles.moreMenuPopperContent}
                    placement="bottom-end"
                    eventsEnabled={isMoreMenuOpen}
                  >
                    {({ ref, style, placement }) => (
                      <div ref={ref} style={style} data-placement={placement}>
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
                      </div>
                    )}
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
