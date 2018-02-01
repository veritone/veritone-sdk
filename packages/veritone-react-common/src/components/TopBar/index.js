import React from 'react';
import cx from 'classnames';
import Paper from 'material-ui/es/Paper';
import Menu, { MenuItem } from 'material-ui/es/Menu';
import { ListItemText } from 'material-ui/es/List';
import IconButton from 'material-ui/es/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import {
  string,
  bool,
  func,
  arrayOf,
  element,
  number,
  shape
} from 'prop-types';

import { appBarHeight } from '../AppBar';
import styles from './styles.scss';

export const topBarHeight = 45;
export default class TopBar extends React.Component {
  static propTypes = {
    appBarOffset: bool,
    elevation: number,
    leftOffset: number,
    menuButton: bool,
    backButton: bool,
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
    onClickBackButton: func
  };
  static defaultProps = {
    elevation: 2,
    leftOffset: 0
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
    return (
      <Paper
        style={{
          top: this.props.appBarOffset ? appBarHeight : 0,
          height: topBarHeight,
          marginLeft: this.props.leftOffset,
          background: '#fafafa'
        }}
        className={cx(styles.container, {
          [styles.selected]: this.props.selected
        })}
        square
        elevation={this.props.elevation}
      >
        <div
          style={{ height: topBarHeight }}
          className={styles.leftButtonContainer}
        >
          {this.props.menuButton && (
            <div className={styles.highlight}>
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
            >
              <ArrowBackIcon />
            </IconButton>
          )}
        </div>

        <div className={styles.rightContainer}>
          <span className={cx({ [styles.selected]: this.props.selected })}>
            {this.props.leftText}
          </span>
          <div className={styles.rightIconButtons}>
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
                  onRequestClose={this.closeRightMenu}
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
