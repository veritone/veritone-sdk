import React from 'react';
import { func, string, number, arrayOf, bool, shape, object } from 'prop-types';
import {
  Table,
  PaginatedTable,
  Column,
  MenuColumn
} from 'veritone-react-common';
import { omit } from 'lodash';
import widget from '../../shared/widget';

class TableWidget extends React.Component {
  static propTypes = {
    data: arrayOf(object).isRequired,
    columns: arrayOf(
      shape({
        dataKey: string.isRequired,
        header: string,
        transform: func,
        menu: bool,
        onSelectItem: func,
        cursorPointer: bool,
        align: string,
        width: number
      })
    ),
    paginate: bool,
    initialItemsPerPage: number,
    onCellClick: func,
    focusedRow: number,
    renderFocusedRowDetails: func,
    onShowCellRange: func,
    onRefreshPageData: func,
    emptyMessage: string
  };

  getRowData = i => {
    return this.props.data[i];
  };

  render() {
    const TableComp = this.props.paginate ? PaginatedTable : Table;
    const tableProps = omit(this.props, ['data', 'columns', 'paginate']);
    const tableColumns = this.props.columns.map((column, idx) => {
      if (column.menu) {
        return (
          <MenuColumn key={idx} {...omit(column, ['transform', 'menu'])} />
        );
      }

      return (
        <Column
          {...omit(column, ['menu', 'onSelectItem', 'transform'])}
          cellRenderer={column.transform}
          key={idx}
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

export default widget(TableWidget);
