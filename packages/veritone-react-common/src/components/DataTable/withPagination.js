import React from 'react';
import { isNumber, noop, omit } from 'lodash';

import { func, number, string, objectOf, node, shape, object } from 'prop-types';
import { TablePagination } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import PaginatedTableFooter from './PaginatedTableFooter';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});


const withPagination = WrappedTable => { 
  class WrappedWithPagination extends React.Component {
    static propTypes = {
      rowGetter: func.isRequired,
      rowCount: number.isRequired,
      initialItemsPerPage: number,
      focusedRow: number,
      onCellClick: func,
      onShowCellRange: func,
      onRefreshPageData: func,
      handlePageChange: func,
      handleChangeRowsPerPage: func,
      children: node,
      page: number,
      rowsPerPage: number,
      classes: objectOf(string),
      paginationStyles: shape({
        root: object
      })
    };
    
    static defaultProps = {
      initialItemsPerPage: 10,
      onShowCellRange: noop,
      onCellClick: noop
    };
    
    rowGetter = i => {
      return this.props.rowGetter(i)
      // const requestedIndex = i + this.props.rowsPerPage * this.props.page;
      
      // return requestedIndex <= this.props.rowCount
      //   ? this.props.rowGetter(i + this.props.rowsPerPage * this.props.page)
      //   : undefined;
    }

    handlePageChange = (e, page) => {
      let lastPossiblePage = Math.ceil(this.props.rowCount / Number(this.props.rowsPerPage)) - 1;

      if (lastPossiblePage < 0) {
        lastPossiblePage = 0;
      }

      // don't show empty pages
      if (page >  lastPossiblePage) {
        return this.props.handlePageChange(e, lastPossiblePage);
      }

      return this.props.handlePageChange(e, page);
    }
    
    handleRefreshData = () => {
      const [firstItem, lastItem] = this.getDisplayedItemIndices();

      this.props.onRefreshPageData({
        start: firstItem,
        end: lastItem
      });
    }

    getDisplayedItemIndices(props = this.props) {
      const firstItem = props.page * props.rowsPerPage;
      const lastItem =
        props.page * props.rowsPerPage +
        props.rowsPerPage -
        1;

      return [firstItem, lastItem];
    }

    translateCellClick = (row) => {
      // return this.props.onCellClick(
      //   row + this.props.page * this.props.rowsPerPage
      // );
      return this.props.onCellClick(row);
    };

    translateFocusedRow() {
      // focused row is null unless the row is on this page
      const min = this.props.rowsPerPage * this.props.page;
      const max = this.props.rowsPerPage - 1 + this.props.rowsPerPage * this.props.page;

      return isNumber(this.props.focusedRow) &&
        this.props.focusedRow >= min &&
        this.props.focusedRow <= max
        // ? this.props.focusedRow -
        // this.props.page * this.props.rowsPerPage
        ? this.props.focusedRow
        : null;
    }

    renderActions = (props) => {
      const StyledPaginatedTableFooter = withStyles(
        this.props.paginationStyles || actionsStyles,
        { withTheme: true }
      )(PaginatedTableFooter);

      return (
        <StyledPaginatedTableFooter
          {...props}
          onRefreshPageData={this.props.onRefreshPageData}
        />
      )
    }
    
    render() {
      let [firstItem, lastItem] = this.getDisplayedItemIndices();

      lastItem = Math.min(lastItem, this.props.rowCount - 1);
      // calculate the number of rows to render
      // const rowCount = this.props.rowCount > 0 ? lastItem - firstItem + 1 : 0;

      const restProps = omit(this.props, [
        'rowGetter',
        'initialItemsPerPage',
        'onRefreshPageData'
      ]);

      return (
        <WrappedTable
          {...restProps}
          rowGetter={this.rowGetter}
          rowRange={[firstItem, lastItem + 1]}
          footerElement={
            <TablePagination
              colSpan={this.props.children.length}
              count={this.props.rowCount}
              rowsPerPage={this.props.rowsPerPage}
              page={this.props.page}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
              Actions={this.renderActions}
            />              
          }
          onCellClick={this.translateCellClick}
          focusedRow={this.translateFocusedRow()}
        />
      );
    }
  }

  return WrappedWithPagination;
}

export default withPagination;