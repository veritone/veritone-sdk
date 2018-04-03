import React from 'react';
import { arrayOf, object, objectOf, bool } from 'prop-types';
import {
  Table,
  PaginatedTable,
  Column,
} from 'components/DataTable';
import { map, startCase, partial } from 'lodash';
import DotDotDot from 'react-dotdotdot'

export default class SDOTable extends React.Component {
  static propTypes = {
    data: arrayOf(object).isRequired,
    schema: objectOf(object).isRequired,
    paginate: bool
  };

  static defaultProps = {
    paginate: false
  }

  

  getRowData = (i) => {
    return this.props.data[i];
  };

  renderCell = (data, dataType) => {
    return (
      <DotDotDot clamp={2}>
        {data}
      </DotDotDot>
    )
  }

  render() {
    const TableComp = this.props.paginate ? PaginatedTable : Table;
    const tableColumns = map(this.props.schema, (propDetails, prop) => {
      return (
        <Column
          dataKey={prop}
          header={propDetails.title || startCase(prop)}
          cellRenderer={partial(this.renderCell, partial.placeholder, propDetails.type)}
          key={propDetails.$id}
        />
      )
    });
            
    return (
      <TableComp
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
      >
        {tableColumns}
      </TableComp>
    );
  }
}
