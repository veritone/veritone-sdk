/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
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
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

function VuiNewButton({ actions }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [usePopper, setUsePopper] = React.useState(false);
  const handleClick = event => {
    if (usePopper) {
      setAnchorEl(event.currentTarget);
    }
    else {
      actions[0] && actions[0].actionClick()
    }
  };
  const handleClose = event => {
    setAnchorEl(null);
  }
  const handleClickItem = ({ actionClick }) => (event) => {
    actionClick();
    handleClose(event);
  }
  React.useEffect(() => {
    if (actions.length > 1) {
      setUsePopper(true);
    }
    return () => {
      setUsePopper(false);
    };
  }, [actions]);
  const openPopper = Boolean(anchorEl);
  const id = openPopper ? 'simple-popover' : undefined;
  return (
    <div className={classes["container"]}>
      <Button
        aria-describedby={id}
        className={classes['newButton']}
        onClick={handleClick}
      >
        <Add className={classes['addIcon']} />
        <span className={classes['newText']}>NEW</span>
        {usePopper && <ArrowDown className={classes['arrowIcon']} />}
      </Button>
      {usePopper && (<Popper
        id={id}
        open={openPopper}
        anchorEl={anchorEl}
        className={classes['popperCustom']}
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
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {actions.map(action => {
                    const icon = action.icon;
                    return (
                      <MenuItem key={action.id} onClick={handleClickItem(action)}>
                        <ListItemIcon>
                          <span
                            className={cx([icon, classes['listItemIcon']])}
                          />
                        </ListItemIcon>
                        <ListItemText
                          className={classes['listItemText']}
                          inset
                        >
                          <span className={classes['listItemText']}>
                            {action.name}
                          </span>
                        </ListItemText>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>)}
    </div>
  );
}

VuiNewButton.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    icon: PropTypes.string,
    actionClick: PropTypes.func
  }))
}

export default VuiNewButton;