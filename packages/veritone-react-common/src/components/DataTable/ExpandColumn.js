import React from 'react';
import { omit } from 'lodash';

import IconButton from 'material-ui/IconButton';

import { PropTypes } from 'helpers/react';
import { func, objectOf, any, number, string, bool, oneOfType } from 'prop-types';

import { Column } from './';

export default class ExpandColumn extends React.Component {
  static propTypes = {
    style: objectOf(any),
    expandAction: func.isRequired,
    row: number,
    columnNumber: number,
    dataKey: string,
    data: oneOfType([objectOf(any), string]),
    show: oneOfType([func, bool]).isRequired,
    activeRow: string
  };

  static defaultProps = {};

  handleClick = () => {
    const { row, columnNumber, dataKey, data } = this.props;

    this.props.expandAction(row, columnNumber, data[dataKey], data);
  };

  renderExpandCell = () => {
    return this.showHandler()
      ? <IconButton
          onClick={this.handleClick}
          iconClassName={`icon-expand_${this.props.data[this.props.dataKey] ===
          this.props.activeRow
            ? 'less'
            : 'more'}`}
        />
      : undefined;
  };

  showHandler = () => {
    const { row, columnNumber, dataKey, data } = this.props;
    return this.props.show(row, columnNumber, data[dataKey], data);
  };

  render() {
    return (
      <Column
        cursorPointer={false}
        width={50}
        align="right"
        cellRenderer={this.renderExpandCell}
        {...omit(this.props, ['expandAction', 'activeRow', 'show'])}
      />
    );
  }
}
