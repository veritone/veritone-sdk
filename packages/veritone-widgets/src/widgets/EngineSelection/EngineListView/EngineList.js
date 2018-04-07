import React from 'react';
import { bool, arrayOf, string, func, number, objectOf, any } from 'prop-types';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
import EngineSelectionRow from './EngineSelectionRow/';

// see https://github.com/bvaughn/react-virtualized/blob/master/docs/creatingAnInfiniteLoadingList.md
function EngineList({
  hasNextPage,
  isNextPageLoading,
  list = [],
  loadNextPage,
  onViewDetail
}) {
  const rowCount = hasNextPage ? list.length + 1 : list.length;
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  const rowRenderer = ({ index, key, style }) => {
    let content;

    if (!isRowLoaded({ index })) {
      content = 'Loading...';
    } else {
      content = (
        <EngineSelectionRow
          engineId={list[index]}
          onViewDetail={onViewDetail}
        />
      );
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded} // eslint-disable-line
      loadMoreRows={loadMoreRows}
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
              rowRenderer={rowRenderer} // eslint-disable-line
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
}

EngineList.propTypes = {
  hasNextPage: bool.isRequired,
  isNextPageLoading: bool.isRequired,
  list: arrayOf(string).isRequired,
  loadNextPage: func,
  onViewDetail: func.isRequired,
  index: number,
  key: number,
  style: objectOf(any)
};

export default EngineList;
