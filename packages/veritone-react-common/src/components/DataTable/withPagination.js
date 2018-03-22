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

    state = {
      page: 0,
      rowsPerPage: this.props.rowsPerPage || this.props.initialItemsPerPage
    }

    componentWillReceiveProps(nextProps) {
      const newState = {};

      if (nextProps.rowCount < this.props.rowCount) { // if the dataset is a different size, flip to first page
        newState.page = 0;
      }

      if (nextProps.rowsPerPage !== this.props.rowsPerPage) {
        newState.rowsPerPage = nextProps.rowsPerPage;
      }

      return this.setState(newState);
    }
    
    rowGetter = i => {
      return this.props.rowGetter(i)
    }

    handlePageChange = (e, page) => {
      let lastPossiblePage = Math.ceil(this.props.rowCount / this.state.rowsPerPage) - 1;

      if (lastPossiblePage < 0) {
        lastPossiblePage = 0;
      }

      // don't show empty pages
      this.setState({ 
        page: page > lastPossiblePage ? lastPossiblePage : page
      })
    }

    handleRowsPerPageChange = (e) => {
      this.setState({ rowsPerPage: Number(e.target.value) })      
    }
    
    handleRefreshData = () => {
      const [firstItem, lastItem] = this.getDisplayedItemIndices();

      this.props.onRefreshPageData({
        start: firstItem,
        end: lastItem
      });
    }

    getDisplayedItemIndices = () => {
      const firstItem = this.state.page * this.state.rowsPerPage;
      const lastItem =
        this.state.page * this.state.rowsPerPage +
        this.state.rowsPerPage -
        1;

      return [firstItem, lastItem];
    }

    translateCellClick = (row) => {
      return this.props.onCellClick(row);
    };

    translateFocusedRow = () => {
      // focused row is null unless the row is on this page
      const min = this.state.rowsPerPage * this.state.page;
      const max = this.state.rowsPerPage - 1 + this.state.rowsPerPage * this.state.page;

      return isNumber(this.props.focusedRow) &&
        this.props.focusedRow >= min &&
        this.props.focusedRow <= max
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
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowsPerPageChange}
              // Actions={this.renderActions}
            />              
          }
          // footerElement={
          //   <PaginatedTableFooter
          //     page={this.state.page}
          //     perPage={this.state.rowsPerPage}
          //     onChangePage={this.handlePageChange}
          //     onChangePerPage={this.handleRowsPerPageChange}
          //     colSpan={this.props.children.length}
          //     rowCount={this.props.rowCount}
          //     onRefreshPageData={
          //       this.props.onRefreshPageData
          //         ? this.handleRefreshData
          //         : undefined
          //     }
          //   />
          // }
          onCellClick={this.translateCellClick}
          focusedRow={this.translateFocusedRow()}
        />
      );
    }
  }

  return WrappedWithPagination;
}

export default withPagination;