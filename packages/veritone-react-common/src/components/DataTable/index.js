import React from 'react';
import cx from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { omit, noop, range, isFunction, isNumber, get } from 'lodash';
import MuiTable from '@material-ui/core/Table';
import MuiTableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import MuiTableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

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
  arrayOf, shape
} from 'prop-types';
import { withStyles , makeStyles} from '@material-ui/styles';
import { LOADING } from './shared';
import withPagination from './withPagination';
import withBasicBehavior from './withBasicBehavior';
import styles from './styles/index';

const useStyles = makeStyles(styles);
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
    showHeader: bool,
    classes: shape({any})
  };

  static defaultProps = {
    rowHeight: 75,
    onShowCellRange: noop,
    emptyRenderer: noop,
    showHeader: true
  };

  render() {
    const { classes } = this.props;
    const restProps = omit(this.props, [
      'onShowCellRange',
      'renderFocusedRowDetails'
    ]);

    return (
      <CSSTransitionGroup
        transitionEnter
        transitionLeave={false}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
        transitionName={{
          enter: classes['enter'],
          enterActive: classes['enterActive'],
          leave: classes['leave'],
          leaveActive: classes['leaveActive']
        }}
        component="div"
      >
        {isNumber(this.props.focusedRow) &&
        this.props.rowCount > 0 &&
        this.props.renderFocusedRowDetails ? (
          <SplitTableContainer
            {...restProps}
            focusedRow={this.props.focusedRow}
            renderFocusedRowDetails={this.props.renderFocusedRowDetails}
            key="split"
          />
        ) : (
          <NormalTableContainer {...restProps} key="normal" />
        )}
      </CSSTransitionGroup>
    );
  }
}

/*
 * Table body when no row is focused
 */

const NormalTableContainer = ({
  rowCount,
  footerHeight = 56,
  footerElement,
  children,
  emptyRenderer,
  showHeader,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Paper elevation={1} className={classes['tableWrapper']}>
      <MuiTable>
        {showHeader && <TableHead rowCount={rowCount}>{children}</TableHead>}
        {rowCount === 0 ? (
          <MuiTableBody>
            <TableRow>
              <TableCell colSpan={children.length}>{emptyRenderer()}</TableCell>
            </TableRow>
          </MuiTableBody>
        ) : (
          <TableBody {...rest} rowRangeEnd={rowCount}>
            {children}
          </TableBody>
        )}
      </MuiTable>
      {footerElement && (
        <MuiTable>
          <TableFooter style={{ height: footerHeight }}>
            <TableRow>{footerElement}</TableRow>
          </TableFooter>
        </MuiTable>
      )}
    </Paper>
  );
};

NormalTableContainer.propTypes = {
  rowCount: number,
  footerHeight: number,
  footerElement: node,
  emptyRenderer: func,
  showHeader: bool,
  children: node
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
    children: node,
    classes : shape({any})
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
      showHeader,
      classes,
      ...rest
    } = this.props;

    const restProps = omit(rest, ['emptyRenderer', 'showHeader']);

    return (
      <div>
        <Paper elevation={1} className={classes['splitTableWrapper']}>
          <MuiTable className={cx(styles.table)}>
            {showHeader && (
              <TableHead rowCount={rowCount}>{children}</TableHead>
            )}
            {rowCount === 0 ? (
              <MuiTableBody>
                <TableRow>
                  <TableCell colSpan={children.length}>
                    {this.props.emptyRenderer()}
                  </TableCell>
                </TableRow>
              </MuiTableBody>
            ) : (
              <TableBody
                {...restProps}
                rowRangeEnd={focusedRow}
                rowGetter={rowGetter}
                onCellClick={onCellClick}
              >
                {children}
              </TableBody>
            )}
          </MuiTable>
        </Paper>

        <Paper
          elevation={1}
          style={{
            marginTop: 15,
            marginBottom: 15
          }}
          className={cx(
            classes['focusTable'],
            classes['focusedRow'],
            classes['splitTableWrapper']
          )}
          key={focusedRow}
        >
          <MuiTable className={cx(styles.table)}>
            <MuiTableBody>
              <TableRow style={{ maxHeight: 48, height: this.props.rowHeight }}>
                {injectInto(children, {
                  data: rowGetter(focusedRow),
                  row: focusedRow,
                  onCellClick
                })}
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={children.length}
                  style={{ whiteSpace: 'inherit', padding: 0 }}
                >
                  {renderFocusedRowDetails(rowGetter(focusedRow))}
                </TableCell>
              </TableRow>
            </MuiTableBody>
          </MuiTable>
        </Paper>

        <Paper elevation={1} className={classes['splitTableWrapper']}>
          <MuiTable className={cx(styles.table)}>
            <TableBody
              {...restProps}
              rowRangeStart={this.props.focusedRow + 1}
              rowRangeEnd={rowCount}
              rowGetter={rowGetter}
              onCellClick={onCellClick}
            >
              {children}
            </TableBody>
          </MuiTable>
          {footerElement && (
            <MuiTable>
              <TableFooter style={{ height: footerHeight }}>
                <TableRow>{footerElement}</TableRow>
              </TableFooter>
            </MuiTable>
          )}
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
  focusedRow,
  onCellClick,
  ...rest
}) => {
  return (
    <MuiTableBody>
      {(rowRangeStart
        ? range(rowRangeStart, rowRangeEnd)
        : range(rowRangeEnd)
      ).map(r => (
        <TableRow
          key={r}
          style={{ height: rowHeight }}
          hover
          selected={r == focusedRow}
        >
          {injectInto(children, {
            data: rowGetter(r),
            row: r,
            onCellClick
          })}
        </TableRow>
      ))}
    </MuiTableBody>
  );
};
TableBody.propTypes = {
  rowRangeStart: number,
  rowRangeEnd: number,
  rowHeight: number,
  rowGetter: func,
  focusedRow: number,
  children: node,
  onCellClick: func
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
  onCellClick,
  width,
  ...rest
}) => {
  const classes = useStyles();
  function renderData() {
    if (data === LOADING) {
      return 'Loading...';
    }

    return isFunction(cellRenderer)
      ? cellRenderer(get(data, dataKey), data)
      : String(get(data, dataKey) || '');
  }

  function handleCellClick(e) {
    return onCellClick(row, dataKey, e);
  }

  return (
    <TableCell
      {...omit(rest, ['transformActions'])}
      className={classes['tableCell']}
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
  dataKey: oneOfType([string, arrayOf(string)]).isRequired,
  header: string,
  cellRenderer: func,
  cursorPointer: bool,
  align: oneOf(['left', 'right', 'center']),
  style: objectOf(oneOfType([string, number])),
  row: number,
  onCellClick: func,
  width: oneOfType([string, number])
};

const TableHead = ({ children, rowCount }) => {
  const classes = useStyles();
  return (
    <MuiTableHead>
      <TableRow>
        {React.Children.map(children, c => (
          <TableCell
            className={classes['table-cell']}
            key={c.props.header}
            style={{
              textAlign: c.props.align || 'left',
              width: c.props.width
            }}
          >
            {c.props.header}
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
};

TableHead.propTypes = {
  rowCount: number.isRequired,
  children: node
};

export { LOADING };
/*
 * Table with pagination functions
 */
export const Table = withBasicBehavior(withStyles(styles)(_Table));
export const PaginatedTable = withBasicBehavior(withPagination(withStyles(styles)(_Table)));
