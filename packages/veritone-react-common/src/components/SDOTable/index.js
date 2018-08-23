import React from 'react';
import { arrayOf, object, objectOf, bool, number, func } from 'prop-types';
import { Table, PaginatedTable, Column } from 'components/DataTable';
import { map, startCase, partial, omit } from 'lodash';
import DotDotDot from 'react-dotdotdot';
import { format } from 'date-fns';

const IntegerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
});

const NumberFormatter = new Intl.NumberFormat('en-US', {});

export default class SDOTable extends React.Component {
  static propTypes = {
    data: arrayOf(object).isRequired,
    schema: objectOf(object).isRequired,
    paginate: bool,
    onCellClick: func,
    focusedRow: number,
    renderFocusedRowDetails: func
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
      case 'integer':
        formattedData = Number.isInteger(data) ? IntegerFormatter.format(data) : data;
        break;
      case 'number':
        formattedData = !Number.isNaN(data) ? NumberFormatter.format(data) : data;
      default:
        formattedData = data;
    }

    return <DotDotDot clamp={2}>{formattedData}</DotDotDot>;
  };

  buildColumnsForObjectTypeProperty = (propDetails, propKey) => {
    const allProps = {};
    this.flattenAllObjectTypeProperties(allProps, propDetails, propKey);
    return map(allProps, (nestedPropDetails, nestedProp) => (
      <Column
        dataKey={nestedProp}
        header={nestedPropDetails.title || startCase(nestedProp)}
        cellRenderer={partial(
          this.renderCell,
          partial.placeholder,
          nestedPropDetails.type
        )}
        key={nestedPropDetails.$id}
      />
    ));
  };

  flattenAllObjectTypeProperties = (allProps, propDetails, propKey) => {
    for (let nestedPropKey in propDetails.properties) {
      if (propDetails.properties[nestedPropKey].type === 'object') {
        this.flattenAllObjectTypeProperties(
          allProps,
          propDetails.properties[nestedPropKey],
          `${propKey}.${nestedPropKey}`
        );
      } else {
        allProps[`${propKey}.${nestedPropKey}`] =
          propDetails.properties[nestedPropKey];
      }
    }
  };

  render() {
    const tableProps = omit(this.props, ['data', 'schema', 'paginate']);
    const TableComponent = this.props.paginate ? PaginatedTable : Table;
    const tableColumns = map(this.props.schema, (propDetails, prop) => {
      if (propDetails.type === 'object') {
        return this.buildColumnsForObjectTypeProperty(propDetails, prop);
      }
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
        focusedRow={this.props.focusedRow}
        onCellClick={this.props.onCellClick}
      >
        {tableColumns}
      </TableComponent>
    );
  }
}
