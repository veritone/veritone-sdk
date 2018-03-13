import React from 'react';
import { isNumber, noop, omit } from 'lodash';

import { shape, func, number, children } from 'prop-types';

// import withUIState from 'shared-components/withUIState';
import PaginatedTableFooter from './PaginatedTableFooter';

const withPagination = WrappedTable => {
  // @withUIState({
  //   defaultState: props => ({
  //     page: 0,
  //     perPage: props.initialItemsPerPage || 10
  //   })
  // })
  class WrappedWithPagination extends React.Component {
    static propTypes = {
      uiState: shape({
        page: number.isRequired,
        perPage: number.isRequired
      }).isRequired,
      setUIState: func.isRequired,

      rowGetter: func.isRequired,
      rowCount: number,
      initialItemsPerPage: number,
      focusedRow: number,
      onCellClick: func,
      onShowCellRange: func,
      onRefreshPageData: func,
      children
    };

    static defaultProps = {
      initialItemsPerPage: 10,
      onShowCellRange: noop,
      onCellClick: noop
    };

    componentWillUpdate(nextProps) {
      if (nextProps.rowCount < this.props.rowCount) {
        // if the dataset is a different size, flip to first page
        this.transitionToPage(0);
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.uiState.page !== prevProps.uiState.page ||
        this.props.uiState.perPage !== prevProps.uiState.perPage
      ) {
        this.callOnShowCellRange();
      }
    }

    getDisplayedItemIndices(props = this.props) {
      const firstItem = this.props.uiState.page * this.props.uiState.perPage;
      const lastItem =
        this.props.uiState.page * this.props.uiState.perPage +
        this.props.uiState.perPage -
        1;

      return [firstItem, lastItem];
    }

    rowGetter = i => {
      const requestedIndex =
        i + this.props.uiState.perPage * this.props.uiState.page;

      return requestedIndex <= this.props.rowCount
        ? this.props.rowGetter(
            i + this.props.uiState.perPage * this.props.uiState.page
          )
        : undefined;
    };

    handlePageRight = () => {
      // can't move to next page if its first item will be >rowCount
      const firstNextPage =
        (this.props.uiState.page + 1) * this.props.uiState.perPage;
      if (firstNextPage <= this.props.rowCount) {
        this.transitionToPage(this.props.uiState.page + 1);
      }
    };

    handlePageLeft = () => {
      const page =
        this.props.uiState.page > 0
          ? this.props.uiState.page - 1
          : this.props.uiState.page;

      this.transitionToPage(page);
    };

    handlePerPageChange = (e, i, v) => {
      const value = v || e.target.value; // (target.value for tests)
      let lastPossiblePage = Math.ceil(this.props.rowCount / Number(value)) - 1;

      if (lastPossiblePage < 0) {
        lastPossiblePage = 0;
      }

      // don't show empty pages
      if (this.props.uiState.page > lastPossiblePage) {
        this.transitionToPage(lastPossiblePage);
      }

      this.props.setUIState({
        perPage: Number(value)
      });
    };

    transitionToPage(n) {
      this.props.setUIState({
        page: n
      });
    }

    callOnShowCellRange = () => {
      const [firstItem, lastItem] = this.getDisplayedItemIndices();

      this.props.onShowCellRange({
        start: firstItem,
        end: lastItem
      });
    };

    handleRefreshData = () => {
      const [firstItem, lastItem] = this.getDisplayedItemIndices();

      this.props.onRefreshPageData({
        start: firstItem,
        end: lastItem
      });
    };

    translateCellClick = (row, column, ...rest) => {
      return this.props.onCellClick(
        row + this.props.uiState.page * this.props.uiState.perPage,
        column,
        ...rest
      );
    };

    translateFocusedRow() {
      // focused row is null unless the row is on this page
      const min = this.props.uiState.perPage * this.props.uiState.page;
      const max =
        this.props.uiState.perPage -
        1 +
        this.props.uiState.perPage * this.props.uiState.page;

      return isNumber(this.props.focusedRow) &&
      this.props.focusedRow >= min &&
      this.props.focusedRow <= max
        ? this.props.focusedRow -
          this.props.uiState.page * this.props.uiState.perPage
        : null;
    }

    render() {
      let [firstItem, lastItem] = this.getDisplayedItemIndices();

      lastItem = Math.min(lastItem, this.props.rowCount - 1);

      const rowCount = this.props.rowCount > 0 ? lastItem - firstItem + 1 : 0;

      const restProps = omit(this.props, [
        'uiState',
        'uiStateKey',
        'setUIState',
        'resetUIState',
        'rowGetter',
        'initialItemsPerPage',
        'onRefreshPageData'
      ]);

      return (
        <WrappedTable
          {...restProps}
          rowGetter={this.rowGetter}
          rowCount={rowCount}
          footerElement={
            <PaginatedTableFooter
              page={this.props.uiState.page}
              perPage={this.props.uiState.perPage}
              onPageLeft={this.handlePageLeft}
              onPageRight={this.handlePageRight}
              onChangePerPage={this.handlePerPageChange}
              colSpan={this.props.children.length}
              rowCount={this.props.rowCount}
              onRefreshPageData={
                this.props.onRefreshPageData
                  ? this.handleRefreshData
                  : undefined
              }
            />
          }
          onCellClick={this.translateCellClick}
          focusedRow={this.translateFocusedRow()}
          onShowCellRange={noop}
        />
      );
    }
  }

  return WrappedWithPagination;
};

export default withPagination;
