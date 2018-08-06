import React from 'react';
import { arrayOf, object, objectOf, bool } from 'prop-types';
import { Table, PaginatedTable, Column } from 'components/DataTable';
import { map, startCase, partial, omit } from 'lodash';
import DotDotDot from 'react-dotdotdot';
import { format } from 'date-fns';

export default class SDOTable extends React.Component {
  static propTypes = {
    data: arrayOf(object).isRequired,
    schema: objectOf(object).isRequired,
    paginate: bool
  };

  static defaultProps = {
    paginate: false
  };

  getRowData = i => {
    return this.props.data[i];
  };

  renderCell = (data, dataType) => {
    let formattedData;

    switch (dataType) {
      case 'dateTime':
        formattedData = format(data, 'M/D/YYYY h:mm A');
        break;
      case 'geoPoint':
        formattedData = `[${data}]`;
        break;
      default:
        formattedData = data;
    }

    return <DotDotDot clamp={2}>{formattedData}</DotDotDot>;
  };

  render() {
    const tableProps = omit(this.props, ['data', 'schema', 'paginate']);

    const TableComponent = this.props.paginate ? PaginatedTable : Table;
    const tableColumns = map(this.props.schema, (propDetails, prop) => {
      return (
        <Column
          dataKey={prop}
          header={propDetails.title || startCase(prop)}
          cellRenderer={partial(
            this.renderCell,
            partial.placeholder,
            propDetails.type
          )}
          key={propDetails.$id}
        />
      );
    });

    return (
      <TableComponent
        {...tableProps}
        rowGetter={this.getRowData}
        rowCount={this.props.data.length}
      >
        {tableColumns}
      </TableComponent>
    );
  }
}
