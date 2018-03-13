import React from 'react';
import { InfiniteLoader, AutoSizer, List } from 'react-virtualized';
import EngineSelectionRow from './EngineSelectionRow/';

import styles from './styles.scss';

export default function EngineList({
  /** Are there more items to load? (This information comes from the most recent API request.) */
  hasNextPage,
  /** Are we currently loading a page of items? (This may be an in-flight flag in your Redux store for example.) */
  isNextPageLoading,
  /** List of items loaded so far */
  list = [],
  /** Callback function (eg. Redux action-creator) responsible for loading the next page of items */
  loadNextPage,
  /** View detail page */
  onViewDetail
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasNextPage ? list.length + 1 : list.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  // Render a list item or a loading indicator.
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
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={registerChild}
              style={{ outline: 0 }}
              height={height}
              onRowsRendered={onRowsRendered}
              rowCount={rowCount}
              rowHeight={177}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
}
