import React from 'react';
import {
  noop,
  startCase,
  camelCase,
  omit,
  without,
  intersection,
  difference
} from 'lodash';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';
import { func, arrayOf, string, objectOf, any } from 'prop-types';
import { Column } from './';

export default class MenuColumn extends React.Component {
  static propTypes = {
    actions: arrayOf(string),
    onSelectItem: func,
    protectedActions: arrayOf(string),
    additionalActions: arrayOf(string),
    excludeActions: arrayOf(string),
    transformLabel: func,
    transformActions: func,
    style: objectOf(any),
    dataKey: string
  };

  static defaultProps = {
    onSelectItem: noop,
    protectedActions: ['delete'],
    transformLabel: l => l,
    transformActions: a => a,
    additionalActions: [],
    excludeActions: [],
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

  renderMenuCell = (actions = [], data, ...rest) => {
    const self = this;
    const allActions =
      this.props.transformActions(this.props.actions, data) ||
      difference(
        [
          ...this.props.transformActions(actions, data),
          ...this.props.additionalActions
        ],
        this.props.excludeActions
      );

      function handleClickMenuItem(event){
        event.persist();
        const action = event.target.getAttribute('data-action');
        if(action){
          self.handleClick(action, data, ...rest);
        }
      }

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
                    onClick={handleClickMenuItem}
                    data-action={s}
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
          'actions',
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
