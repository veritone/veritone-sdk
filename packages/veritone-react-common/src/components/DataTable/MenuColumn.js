import React from 'react';
import {
  noop,
  startCase,
  camelCase,
  omit,
  partial,
  without,
  intersection,
  difference
} from 'lodash';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Divider from 'material-ui/Divider';
import { func, arrayOf, string, objectOf, any } from 'prop-types';
import { Column } from './';

export default class MenuColumn extends React.Component {
  static propTypes = {
    onSelectItem: func,
    protectedActions: arrayOf(string),
    additionalActions: arrayOf(string),
    excludeActions: arrayOf(string),
    transformLabel: func,
    style: objectOf(any)
  };

  static defaultProps = {
    onSelectItem: noop,
    protectedActions: ['delete'],
    transformLabel: l => l,
    additionalActions: [],
    excludeActions: []
  };

  state = {
    open: false,
    anchorEl: null
  };

  openMenu = event => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  closeMenu = () => {
    this.setState({
      open: false
    });
  };

  handleClick = (action, ...rest) => {
    this.setState({ open: false }, () => {
      this.props.onSelectItem(action, ...rest);
    });
  };

  sortActions(actions) {
    const protectedActions = intersection(actions, this.props.protectedActions);
    const unprotectedActions = without(actions, ...protectedActions);

    return [
      ...unprotectedActions,
      unprotectedActions.length >= 1 &&
        protectedActions.length >= 1 &&
        '@@divider',
      ...protectedActions
    ].filter(a => !!a);
  }

  renderMenuCell = (actions = [], ...rest) => {
    const allActions = difference(
      [...actions, ...this.props.additionalActions],
      this.props.excludeActions
    );

    return (
      allActions.length > 0 && (
        <div>
          <IconButton
            aria-label="Actions"
            aria-owns={this.state.anchorEl ? 'actions-menu' : null}
            aria-haspopup="true"
            onClick={this.openMenu}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="actions-menu"
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            open={this.state.open}
            onClose={this.closeMenu}
          >
            {this.sortActions(allActions).map(
              (s, i) =>
                s === '@@divider' ? (
                  <Divider key="divider" />
                ) : (
                  <MenuItem
                    key={s}
                    onClick={partial(this.handleClick, s, ...rest)}
                  >
                    {startCase(camelCase(this.props.transformLabel(s)))}
                  </MenuItem>
                )
            )}
          </Menu>
        </div>
      )
    );
  };

  render() {
    return (
      <Column
        cursorPointer={false}
        width={50}
        align="right"
        cellRenderer={this.renderMenuCell}
        {...omit(
          this.props,
          'onSelectItem',
          'protectedActions',
          'additionalActions',
          'excludeActions',
          'transformLabel'
        )}
        style={{ paddingRight: 0, ...this.props.style }}
      />
    );
  }
}
