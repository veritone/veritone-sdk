import React, { Fragment } from 'react';
import { number, node, bool, func, string, arrayOf, shape } from 'prop-types';
import Slide from '@material-ui/core/Slide';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import {} from 'lodash';

export default class OverlayToolBar extends React.PureComponent {
  static propTypes = {
    visible: bool,
    children: node,
    onMinimize: func,
    menuItems: arrayOf(
      shape({
        label: string.isRequired,
        onClick: func.isRequired
      })
    ),
    bottomOffset: number,
    focusedBoundingBoxId: string
  };

  static defaultProps = {
    menuItems: [],
    bottomOffset: 0
  };

  state = {
    menuAnchorEl: null
  };

  handleOpenMenu = event => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleCloseMenu = e => {
    const itemIndex = e.target.getAttribute('data-itemindex');

    if (itemIndex) {
      this.props.menuItems[Number(itemIndex)].onClick(
        this.props.focusedBoundingBoxId
      );
    }

    this.setState({ menuAnchorEl: null });
  };

  render() {
    return (
      <Slide in={this.props.visible} direction="up">
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'rgb(243, 243, 243, 0.87)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: 4,
            bottom: this.props.bottomOffset,
            width: '100%'
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <IconButton onClick={this.props.onMinimize}>
              <ArrowDownIcon />
            </IconButton>
          </div>

          {this.props.children}

          {!!this.props.menuItems.length && (
            <Fragment>
              <div
                style={{
                  borderRight: '1px solid rgba(0, 0, 0, 0.54)',
                  height: 25
                }}
              >
                {' '}
              </div>

              <IconButton onClick={this.handleOpenMenu}>
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={this.state.menuAnchorEl}
                open={!!this.state.menuAnchorEl}
                onClose={this.handleCloseMenu}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              >
                {this.props.menuItems.map((option, i) => (
                  <MenuItem
                    key={option.label}
                    data-itemindex={i}
                    onClick={this.handleCloseMenu}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </Fragment>
          )}
        </div>
      </Slide>
    );
  }
}
