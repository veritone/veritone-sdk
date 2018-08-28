import React from 'react';
import { func, arrayOf, bool, shape, object } from 'prop-types';
import {
  Table as TableComponent,
  PaginatedTable,
  Column,
  MenuColumn
} from 'veritone-react-common';
import { omit } from 'lodash';
import widget from '../../shared/widget';

class Table extends React.Component {
  static propTypes = {
    data: arrayOf(object).isRequired,
    columns: arrayOf(
      shape({
        transform: func,
        menu: bool,
        onSelectItem: func
      })
    ),
    paginate: bool
  };

  static defaultProps = {
    paginate: false
  };

  getRowData = i => {
    return this.props.data[i];
  };

  render() {
    const TableComp = this.props.paginate ? PaginatedTable : TableComponent;
    const tableProps = omit(this.props, ['data', 'columns', 'paginate']);
    const tableColumns = this.props.columns.map(column => {
      if (column.menu) {
        return (
          <MenuColumn
            key={column.dataKey}
            {...omit(column, ['transform', 'menu'])}
          />
        );
      }

      return (
        <Column
          {...omit(column, ['menu', 'onSelectItem', 'transform'])}
          cellRenderer={column.transform}
          key={column.dataKey}
        />
      );
    });

    return (
      <TableComp
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
        {...tableProps}
      >
        {tableColumns}
      </TableComp>
    );
  }
}

const TableWidget = widget(Table);
export { TableWidget };
