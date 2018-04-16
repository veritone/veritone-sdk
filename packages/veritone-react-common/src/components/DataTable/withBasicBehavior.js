import React from 'react';
import { omit } from 'lodash';

import { arrayOf, oneOfType, string, number, func } from 'prop-types';

import { LOADING } from './shared';

const withBasicBehavior = WrappedTable => {
  class WrappedWithBasicBehavior extends React.Component {
    static propTypes = {
      loadingIndices: arrayOf(oneOfType([string, number])),
      failedLoadingIndices: arrayOf(oneOfType([string, number])),
      loadingMessage: string,
      emptyMessage: string,
      emptyFailureMessage: string,
      rowGetter: func.isRequired
    };

    static defaultProps = {
      loadingIndices: [],
      failedLoadingIndices: [],
      loadingMessage: 'Loading...',
      emptyMessage: 'Nothing to see here!',
      emptyFailureMessage: 'Table items failed to load.'
    };

    getRowData = (i, ...rest) => {
      const rowData = this.props.rowGetter(i, ...rest);

      return this.props.loadingIndices.includes(i) && !rowData
        ? LOADING
        : rowData;
    };

    renderEmptyTable = () => (
      <div>
        {this.props.failedLoadingIndices.length
          ? this.props.emptyFailureMessage
          : this.props.loadingIndices.length
            ? this.props.loadingMessage
            : this.props.emptyMessage}
      </div>
    );

    render() {
      const restProps = omit(this.props, [
        'loadingIndices',
        'failedLoadingIndices',
        'loadingMessage',
        'emptyMessage',
        'emptyFailureMessage',
        'rowGetter'
      ]);

      return (
        <WrappedTable
          emptyRenderer={this.renderEmptyTable}
          {...restProps}
          rowGetter={this.getRowData}
        />
      );
    }
  }

  return WrappedWithBasicBehavior;
};

export default withBasicBehavior;
