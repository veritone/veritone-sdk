import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Add from "@material-ui/icons/AddCircle";
import ArrowDown from '@material-ui/icons/ArrowDropDown';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './styles.scss';

class VuiNewButton extends React.Component {

  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      icon: PropTypes.shape(Object),
      actionClick: PropTypes.func
    }))
  }

  state = {
    open: false
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    this.setState({ open: false });
  };

  handleClickItem = ({actionClick}) => (event) => {
    actionClick();
    this.handleClose(event);
  }

  render() {
    const { open } = this.state;
    const { actions = [] } = this.props;
    return (
      <div className={cx(styles["container"])}>
        <Button
          className={cx(styles['new-button'])}
          onClick={this.handleToggle}
        >
          <Add className={cx(styles['add-icon'])} />
          <span className={cx(styles['new-text'])}>NEW</span>
          <ArrowDown className={cx(styles['arrow-icon'])} />
        </Button>
        <Popper
          className={cx(styles['popper-custom'])}
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
                width: 200,
                zIndex: 100
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    {actions.map(action => {
                      const Icon = action.icon;
                      return (
                        <MenuItem key={action.id} onClick={this.handleClickItem(action)}>
                          <ListItemIcon>
                            <Icon className={cx(styles['list-item-icon'])} />
                          </ListItemIcon>
                          <ListItemText className={cx(styles['list-item-text'])} inset>
                            <span className={cx(styles['list-item-text'])}>{action.name}</span>
                          </ListItemText>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

export default VuiNewButton;
