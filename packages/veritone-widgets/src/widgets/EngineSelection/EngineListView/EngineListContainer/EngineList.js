import React from 'react';
import { noop } from 'lodash';
import { bool, arrayOf, string, func } from 'prop-types';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
import EngineSelectionRow from './EngineSelectionRow/';

// see https://github.com/bvaughn/react-virtualized/blob/master/docs/creatingAnInfiniteLoadingList.md
export default class EngineList extends React.Component {
  static propTypes = {
    id: string.isRequired,
    hasNextPage: bool.isRequired,
    isNextPageLoading: bool.isRequired,
    list: arrayOf(string).isRequired,
    loadNextPage: func,
    onViewDetail: func.isRequired
  };

  handleLoadMoreRows = () => {
    if (this.props.isNextPageLoading) {
      return noop;
    }

    return this.props.loadNextPage;
  };

  isRowLoaded = ({ index }) =>
    !this.props.hasNextPage || index < this.props.list.length;

  rowRenderer = ({ index, key, style }) => {
    let content;

    if (!this.isRowLoaded({ index })) {
      content = 'Loading...';
    } else {
      content = (
        <EngineSelectionRow
          id={this.props.id}
          engineId={this.props.list[index]}
          onViewDetail={this.props.onViewDetail}
        />
      );
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  render() {
    const rowCount = this.props.hasNextPage
      ? this.props.list.length + 1
      : this.props.list.length;

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.handleLoadMoreRows}
        rowCount={rowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) => (
              <List
                ref={registerChild}
                style={{ outline: 0, padding: '0 20px' }}
                height={height}
                onRowsRendered={onRowsRendered}
                rowCount={rowCount}
                rowHeight={177}
                rowRenderer={this.rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}
