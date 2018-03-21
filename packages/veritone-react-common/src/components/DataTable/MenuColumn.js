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
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';

// import styles from './styles/index.scss';
import { func, arrayOf, string, objectOf, any } from 'prop-types';

import { Column } from 'shared-components/DataTable';

export default class MenuColumn extends React.Component {
  static propTypes = {
    onSelectItem: func,
    protectedActions: arrayOf(string),
    additionalActions: arrayOf(string),
    transformLabel: func,
    style: objectOf(any)
  };

  static defaultProps = {
    onSelectItem: noop,
    protectedActions: ['delete'],
    transformLabel: l => l,
    additionalActions: []
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
    const allActions = [...actions, ...this.props.additionalActions];

    return (
      allActions.length > 0 &&
      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        useLayerForClickAway
        iconStyle={{ opacity: 0.54 }}
      >
        {this.sortActions(allActions).map(
          (s, i) =>
            s === '@@divider'
              ? <Divider key={`divider-${i}`} />
              : <MenuItem
                  primaryText={startCase(
                    camelCase(this.props.transformLabel(s))
                  )}
                  key={s}
                  onTouchTap={partial(this.props.onSelectItem, s, ...rest)}
                />
        )}
      </IconMenu>
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
          'transformLabel',
          'uiState'
        )}
        style={{ paddingRight: 0, ...this.props.style }}
      />
    );
  }
}
