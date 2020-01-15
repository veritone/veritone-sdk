import React from 'react';
import cx from 'classnames';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  string,
  bool,
  func,
  arrayOf,
  element,
  number,
  shape,
  any
} from 'prop-types';
import { withStyles } from '@material-ui/styles';

import { appBarHeight } from '../AppBar';
import styles from './styles';

export const topBarHeight = 45;
class TopBar extends React.Component {
  static propTypes = {
    appBarOffset: bool,
    elevation: number,
    leftOffset: number,
    menuButton: bool,
    backButton: bool,
    renderActionButton: func,
    actionButtonContainerWidth: number,
    selected: bool,
    rightMenu: bool,
    rightMenuItems: arrayOf(
      shape({
        label: string.isRequired,
        handler: func.isRequired
      })
    ),
    leftText: string,
    rightIconButtons: arrayOf(element),
    onRequestOpenMenu: func,
    onClickBackButton: func,
    classes: shape({ any }),
  };
  static defaultProps = {
    elevation: 2,
    leftOffset: 0,
    actionButtonContainerWidth: 245
  };

  state = {
    rightMenuOpen: false,
    rightMenuAnchorEl: null
  };

  openRightMenu = event => {
    this.setState({
      rightMenuOpen: true,
      rightMenuAnchorEl: event.currentTarget
    });
  };

  closeRightMenu = () => {
    this.setState({
      rightMenuOpen: false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper
        style={{
          top: this.props.appBarOffset ? appBarHeight : 0,
          height: topBarHeight,
          marginLeft: this.props.leftOffset,
          background: '#fafafa'
        }}
        className={cx(classes.container, {
          [classes.selected]: this.props.selected
        })}
        square
        elevation={this.props.elevation}
        data-test="container"
        data-test-selected={cx({
          selected: this.props.selected
        })}
      >
        {this.props.renderActionButton && (
          <div
            className={classes.actionButtonContainer}
            style={{ width: this.props.actionButtonContainerWidth }}
          >
            {this.props.renderActionButton()}
          </div>
        )}
        <div
          style={{ height: topBarHeight }}
          className={classes.leftButtonContainer}
        >
          {this.props.menuButton && (
            <div className={classes.highlight}>
              <IconButton
                style={{ height: '100%' }}
                onClick={this.props.onRequestOpenMenu}
                className="menuButton"
              >
                <MenuIcon />
              </IconButton>
            </div>
          )}

          {this.props.backButton && (
            <IconButton
              style={{ height: '100%' }}
              onClick={this.props.onClickBackButton}
              className="backButton"
              data-test="backButton"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </div>

        <div className={classes.rightContainer}>
          <span className={cx({ [classes.selected]: this.props.selected })}>
            {this.props.leftText}
          </span>
          <div className={classes.rightIconButtons}>
            {this.props.rightIconButtons}

            {this.props.rightMenu &&
              this.props.rightMenuItems &&
              this.props.rightMenuItems.length && [
                <IconButton
                  onClick={this.openRightMenu}
                  key="button"
                  className="rightMenuButton"
                >
                  <MoreVertIcon />
                </IconButton>,

                <Menu
                  key="menu"
                  open={this.state.rightMenuOpen}
                  onClose={this.closeRightMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  anchorEl={this.state.rightMenuAnchorEl}
                  getContentAnchorEl={null}
                >
                  {this.props.rightMenuItems.map(({ label, handler }) => (
                    <MenuItem button key={label} onClick={handler}>
                      <ListItemText primary={label} />
                    </MenuItem>
                  ))}
                </Menu>
              ]}
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(TopBar);
