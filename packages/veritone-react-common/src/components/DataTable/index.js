import React from 'react';
import cx from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { omit, noop, range, isFunction, isNumber } from 'lodash';
import {
  Table as LibTable,
  TableBody as LibTableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import { injectInto } from 'helpers/react';
import {
  bool,
  func,
  number,
  node,
  children,
  objectOf,
  any,
  string,
  oneOfType,
  oneOf
} from 'prop-types';

import withPagination from './withPagination';
import withBasicBehavior from './withBasicBehavior';
import styles from './styles/index.scss';

/*
 * BASE TABLE
 */
class _Table extends React.Component {
  static propTypes = {
    rowGetter: func.isRequired,
    rowCount: number.isRequired,
    rowHeight: number,
    footerHeight: number,
    height: number, // exclude for auto
    width: number,
    footerElement: children,
    focusedRow: number,
    renderFocusedRowDetails: func,
    onShowCellRange: func,
    watchData: any, // eslint-disable-line
    emptyRenderer: func,
    children: children, // children should be Columns
    showHeader: bool
  };

  static defaultProps = {
    rowHeight: 75,
    footerHeight: 56,
    onShowCellRange: noop,
    emptyRenderer: noop,
    showHeader: true
  };

  componentDidMount() {
    // this.callOnShowCellRange();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.watchData !== prevProps.watchData) {
      this.callOnShowCellRange();
    }
  }

  callOnShowCellRange() {
    this.props.onShowCellRange({
      start: 0,
      end: this.props.rowCount - 1
    });
  }

  render() {
    const restProps = omit(this.props, [
      'onShowCellRange',
      'focusedRow',
      'renderFocusedRowDetails'
    ]);

    return (
      <ReactCSSTransitionGroup
        transitionEnter
        transitionLeave={false}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
        transitionName={{
          enter: styles['enter'],
          enterActive: styles['enterActive'],
          leave: styles['leave'],
          leaveActive: styles['leaveActive']
        }}
        component="div"
      >
        {isNumber(this.props.focusedRow) && this.props.rowCount > 0
          ? <SplitTableContainer
              {...restProps}
              focusedRow={this.props.focusedRow}
              renderFocusedRowDetails={this.props.renderFocusedRowDetails}
              key="split"
            />
          : <NormalTableContainer {...restProps} key="normal" />}
      </ReactCSSTransitionGroup>
    );
  }
}

/*
 * Table body when no row is focused
 */
const NormalTableContainer = ({
  rowCount,
  footerHeight,
  footerElement,
  children,
  emptyRenderer,
  showHeader,
  ...rest
}) =>
  <Paper zDepth={1}>
    <LibTable footerStyle={{ height: footerHeight }} {...rest}>
      {
        showHeader &&
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            {React.Children.map(children, c =>
              <TableHeaderColumn
                key={c.props.header}
                width={c.props.width}
                style={{
                  textAlign: c.props.align || 'left'
                }}
              >
                {c.props.header}
              </TableHeaderColumn>
            )}
          </TableRow>
        </TableHeader>
      }

      {
        rowCount === 0
        ? <LibTableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn colSpan={children.length}>
                {emptyRenderer()}
              </TableRowColumn>
            </TableRow>
          </LibTableBody>
        : <TableBody {...rest} rowRangeEnd={rowCount}>
            {children}
          </TableBody>
      }

      {footerElement}
    </LibTable>
  </Paper>;

NormalTableContainer.propTypes = {
  rowCount: number,
  footerHeight: number,
  footerElement: node,
  emptyRenderer: func,
  showHeader: bool,
  children
};

/*
 * Table body when a focus row is active
 */
class SplitTableContainer extends React.Component {
  static propTypes = {
    focusedRow: number,
    onCellClick: func,
    rowCount: number,
    rowHeight: number,
    footerHeight: number,
    footerElement: node,
    renderFocusedRowDetails: func,
    rowGetter: func,
    emptyRenderer: func,
    showHeader: bool,
    children
  };

  translateCellClick = (row, column) => {
    return this.props.onCellClick(this.props.focusedRow + 1 + row, column);
  };

  translateFocusedRowCellClick = (row, column) => {
    // fixme: this causes the row to collapse even when clicking in the expanded accordion area
    // return this.props.onCellClick(this.props.focusedRow, column);
  };

  render() {
    const {
      onCellClick,
      focusedRow,
      renderFocusedRowDetails,
      rowCount,
      footerHeight,
      footerElement,
      children,
      rowGetter,
      ...rest
    } = this.props;

    const restProps = omit(rest, ['emptyRenderer', 'showHeader']);

    return (
      <div>
        <Paper zDepth={1}>
          <LibTable {...restProps} onCellClick={onCellClick}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                {React.Children.map(children, c =>
                  <TableHeaderColumn
                    key={c.props.header}
                    width={c.props.width}
                    style={{
                      textAlign: c.props.align || 'left'
                    }}
                  >
                    {c.props.header}
                  </TableHeaderColumn>
                )}
              </TableRow>
            </TableHeader>

            {rowCount === 0
              ? <LibTableBody displayRowCheckbox={false}>
                  <TableRow>
                    <TableRowColumn colSpan={children.length}>
                      {this.props.emptyRenderer()}
                    </TableRowColumn>
                  </TableRow>
                </LibTableBody>
              : <TableBody
                  {...restProps}
                  rowRangeEnd={this.props.focusedRow}
                  rowGetter={rowGetter}
                >
                  {children}
                </TableBody>}
          </LibTable>
        </Paper>

        <Paper
          zDepth={1}
          style={{
            marginTop: 15,
            marginBottom: 15
          }}
          className={cx(styles['focusTable'], styles['focused-row'])}
          key={focusedRow}
        >
          <LibTable
            {...restProps}
            onCellClick={this.translateFocusedRowCellClick}
            selectable={false}
          >
            <LibTableBody displayRowCheckbox={false} style={{ maxHeight: 48 }}>
              <TableRow style={{ height: this.props.rowHeight }}>
                {injectInto(children, {
                  data: rowGetter(this.props.focusedRow),
                  row: this.props.focusedRow
                })}
              </TableRow>
              <TableRow>
                <TableRowColumn
                  colSpan={children.length}
                  style={{ whiteSpace: 'inherit', padding: 0 }}
                >
                  {renderFocusedRowDetails(rowGetter(this.props.focusedRow))}
                </TableRowColumn>
              </TableRow>
            </LibTableBody>
          </LibTable>
        </Paper>

        <Paper zDepth={1}>
          <LibTable
            footerStyle={{ height: footerHeight }}
            {...restProps}
            onCellClick={this.translateCellClick}
          >
            <TableBody
              {...restProps}
              rowRangeStart={
                this.props.focusedRow + 1
                // this.state.collapseFocusedRow
                //   ? this.props.focusedRow
                //   : this.props.focusedRow + 1
              }
              rowRangeEnd={rowCount}
              rowGetter={rowGetter}
            >
              {children}
            </TableBody>

            {footerElement}
          </LibTable>
        </Paper>
      </div>
    );
  }
}

/*
 * Common body between tables
 */
const TableBody = ({
  children,
  rowRangeStart,
  rowRangeEnd,
  rowGetter,
  rowHeight,
  ...rest
}) => {
  return (
    <LibTableBody displayRowCheckbox={false} showRowHover {...rest}>
      {(rowRangeStart
        ? range(rowRangeStart, rowRangeEnd)
        : range(rowRangeEnd)).map((
        r // rowGetter(r) &&
      ) =>
        <TableRow style={{ height: rowHeight }} key={r}>
          {injectInto(children, {
            data: rowGetter(r),
            row: r
          })}
        </TableRow>
      )}
    </LibTableBody>
  );
};
TableBody.propTypes = {
  rowRangeStart: number,
  rowRangeEnd: number,
  rowHeight: number,
  rowGetter: func,
  children
};
TableBody.muiName = 'TableBody'; // trick MUI into thinking this is a LibTableBody

/*
 * To be used as children of the base table
 */
export const Column = ({
  data,
  dataKey,
  header,
  cellRenderer,
  cursorPointer = true,
  align = 'left',
  style,
  row,
  ...rest
}) => {
  function renderData() {
    if (data === LOADING) {
      return 'Loading...';
    }

    return isFunction(cellRenderer)
      ? cellRenderer(data[dataKey], data)
      : String(data[dataKey] || '');
  }

  return (
    <TableRowColumn
      {...rest}
      style={{
        cursor: cursorPointer ? 'pointer' : 'initial',
        textAlign: align,
        ...style
      }}
    >
      {data && renderData()}
    </TableRowColumn>
  );
};

Column.propTypes = {
  data: oneOfType([objectOf(any), string]),
  dataKey: string.isRequired,
  header: string,
  cellRenderer: func,
  cursorPointer: bool,
  align: oneOf(['left', 'right', 'center']),
  style: objectOf(oneOfType([string, number])),
  row: number
};

// symbol that will cause a column to render its loading state if passed in from rowGetter
export const LOADING = '@@LOADING';

/*
 * Table with pagination functions
 */
export const Table = withBasicBehavior(_Table);
export const PaginatedTable = withBasicBehavior(withPagination(_Table));

// todo: sorting
