import React from 'react';
import cx from 'classnames';
import { CSSTransitionGroup } from 'react-transition-group'
import { omit, noop, range, isFunction, isNumber } from 'lodash';
import MuiTable, {
  TableBody as MuiTableBody,
  TableFooter,
  TableHead as MuiTableHead,
  TableRow,
  TableCell
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import { injectInto } from 'helpers/react';
import {
  bool,
  func,
  number,
  node,
  objectOf,
  any,
  string,
  oneOfType,
  oneOf,
  arrayOf
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
    rowRange: arrayOf(number),
    rowHeight: number,
    width: number,
    footerElement: node,
    focusedRow: number,
    renderFocusedRowDetails: func,
    onShowCellRange: func,
    emptyRenderer: func,
    children: node, // children should be Columns
    showHeader: bool
  };

  static defaultProps = {
    rowHeight: 75,
    onShowCellRange: noop,
    emptyRenderer: noop,
    showHeader: true
  };

  render() {
    const restProps = omit(this.props, [
      'onShowCellRange',
      'focusedRow',
      'renderFocusedRowDetails'
    ]);

    return (
      <CSSTransitionGroup
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
        <Paper elevation={1} className={styles.table}>
          {isNumber(this.props.focusedRow) && this.props.rowCount > 0
            ? <SplitTableContainer
                {...restProps}
                focusedRow={this.props.focusedRow}
                renderFocusedRowDetails={this.props.renderFocusedRowDetails}
                key="split"
              />
            : <NormalTableContainer {...restProps} key="normal" />}
        </Paper>
      </CSSTransitionGroup>
    );
  }
}

/*
 * Table body when no row is focused
 */

const NormalTableContainer = ({
  rowCount,
  rowRange,
  footerElement,
  children,
  emptyRenderer,
  showHeader,
  selectable,
  ...rest
}) => {
  return (
    <div className={styles['table-wrapper']}>
      <MuiTable>
        {
          showHeader &&
          <TableHead
            rowCount={rowCount}
          >
            {children}
          </TableHead>
        }
        {
          rowCount === 0
          ? <MuiTableBody>
              <TableRow>
                <TableCell colSpan={children.length}>
                  {emptyRenderer()}
                </TableCell>
              </TableRow>
            </MuiTableBody>
          : <TableBody 
              {...rest}
              rowRangeStart={(rowRange && rowRange[0])}
              rowRangeEnd={(rowRange && rowRange[1]) || rowCount}
            >
              {children}
            </TableBody>
        }
        {footerElement &&
          <TableFooter>
            <TableRow>
              {footerElement}
            </TableRow>
          </TableFooter>}
      </MuiTable>
    </div>
  );
}

NormalTableContainer.propTypes = {
  rowCount: number,
  rowRange: arrayOf(number),
  footerHeight: number,
  footerElement: node,
  emptyRenderer: func,
  showHeader: bool,
  children: node,
  selectable: bool
};

/*
 * Table body when a focus row is active
 */
class SplitTableContainer extends React.Component {
  static propTypes = {
    focusedRow: number,
    onCellClick: func,
    rowCount: number,
    rowRange: arrayOf(number),
    rowHeight: number,
    footerElement: node,
    renderFocusedRowDetails: func,
    rowGetter: func,
    emptyRenderer: func,
    showHeader: bool,
    children: node
  };

  translateCellClick = (row, column) => {
    return this.props.onCellClick(row, column);
  };

  renderSplitRow = () => {
    const { focusedRow, rowGetter, children } = this.props;

    return (
      <MuiTableBody>
        <TableRow style={{ maxHeight: 48, height: this.props.rowHeight }}>
          {injectInto(children, {
            data: rowGetter(focusedRow),
            row: focusedRow,
            onCellClick: this.props.onCellClick
          })}
        </TableRow>
        <TableRow>
          <TableCell
            colSpan={children.length}
            style={{ whiteSpace: 'inherit', padding: 0 }}
          >
            {this.props.renderFocusedRowDetails(rowGetter(focusedRow))}
          </TableCell>
        </TableRow>
      </MuiTableBody>
    );
  }

  render() {
    const {
      onCellClick,
      focusedRow,
      rowCount,
      rowRange,
      footerElement,
      children,
      rowGetter,
      showHeader,
      ...rest
    } = this.props;

    return (
      <div>
        <Paper elevation={1} className={styles['table-wrapper']}>
          <MuiTable>
            {
              showHeader &&
              <TableHead
                rowCount={rowCount}
              >
                {children}
              </TableHead>
            }
            {
              rowCount === 0
              ? <MuiTableBody>
                  <TableRow>
                    <TableCell colSpan={children.length}>
                      {this.props.emptyRenderer()}
                    </TableCell>
                  </TableRow>
                </MuiTableBody>
              : focusedRow === 0
              ? this.renderSplitRow()
              : <TableBody
                  {...rest}
                  rowRangeStart={rowRange && rowRange[0]}
                  rowRangeEnd={focusedRow}
                  rowGetter={rowGetter}
                  onCellClick={onCellClick}
                  style={{
                    display: focusedRow ? 'inherit' : 'none !important'
                  }}
                >
                  {children}
                </TableBody>
            }
          </MuiTable>
        </Paper>

        <Paper
          elevation={1}
          style={{
            marginTop: 15,
            marginBottom: 15
          }}
          className={cx(styles['focusTable'], styles['focused-row'], styles['table-wrapper'])}
          key={focusedRow}
        >
          {focusedRow > 0 
            ? <MuiTable>
                {this.renderSplitRow()}
              </MuiTable>
            : undefined}
        </Paper>

        <Paper elevation={1} className={styles['table-wrapper']}>
          <MuiTable>
            <TableBody
              rowRangeStart={this.props.focusedRow + 1}
              rowRangeEnd={(rowRange && rowRange[1]) || rowCount}
              rowGetter={rowGetter}
              onCellClick={this.translateCellClick}
            >
              {children}
            </TableBody>

            {footerElement &&
              <TableFooter>
                <TableRow>
                  {footerElement}
                </TableRow>
              </TableFooter>}
          </MuiTable>
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
  onCellClick,
  selectable,
  selectedRows,
  onSelectRow,
  ...rest
}) => {
  return (
    <MuiTableBody>
      {(isNumber(rowRangeStart)
        ? range(rowRangeStart, rowRangeEnd)
        : range(rowRangeEnd)).map((
        r
      ) =>
        <TableRow
          key={r}
          style={{ height: rowHeight }}
          hover
        >
          {injectInto(children, {
            data: rowGetter(r),
            row: r,
            onCellClick
          })}
        </TableRow>
      )}
    </MuiTableBody>
  );
};
TableBody.propTypes = {
  rowRangeStart: number,
  rowRangeEnd: number,
  rowHeight: number,
  rowGetter: func,
  children: node,
  selectable: bool,
  selectedRows: arrayOf(any),
  onCellClick: func,
  onSelectRow: func
};
TableBody.muiName = 'TableBody'; // trick MUI into thinking this is a MuiTableBody

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
  width,
  onCellClick,
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

  function handleCellClick(e) {
    return onCellClick(row, dataKey, data[dataKey]);
  }

  return (
    <TableCell
      style={{
        cursor: cursorPointer ? 'pointer' : 'initial',
        textAlign: align,
        width,
        ...style
      }}
      onClick={onCellClick && handleCellClick}
    >
      {data && renderData()}
    </TableCell>
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
  row: number,
  onCellClick: func,
  width: oneOfType([string, number])
};

const TableHead = ({
  children,
  rowCount
}) => {
  return (
    <MuiTableHead>
      <TableRow>
        {React.Children.map(children, c =>
          <TableCell
            className={styles['table-cell']}
            key={c.props.header}
            style={{
              textAlign: c.props.align || 'left',
              width: c.props.width
            }}
          >
            {c.props.header}
          </TableCell>
        )}
      </TableRow>
    </MuiTableHead>
  );
}

TableHead.propTypes = {
  rowCount: number.isRequired,
  children: node
};

// symbol that will cause a column to render its loading state if passed in from rowGetter
export const LOADING = '@@LOADING';

/*
 * Table with pagination functions
 */
export const Table = withBasicBehavior(_Table);
export const PaginatedTable = withBasicBehavior(withPagination(_Table));