import React from 'react';
import {
  noop,
  startCase,
  camelCase,
  omit,
  partial,
  without,
  intersection
} from 'lodash';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Divider from 'material-ui/Divider';
import { func, arrayOf, string, objectOf, any } from 'prop-types';
import { Column } from './';

export default class StaticMenuColumn extends React.Component {
  static propTypes = {
    onSelectItem: func,
    actions: arrayOf(string),
    protectedActions: arrayOf(string),
    transformLabel: func,
    style: objectOf(any),
    dataKey: string
  };

  static defaultProps = {
    onSelectItem: noop,
    actions: [],
    protectedActions: [],
    transformLabel: l => l,
    dataKey: ''
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

  renderMenuCell = (...rest) => {
    const { actions } = this.props;

    return (
      actions.length > 0 && (
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
            {this.sortActions(actions).map(
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
          'transformLabel'
        )}
        style={{ paddingRight: 0, ...this.props.style }}
      />
    );
  }
}
