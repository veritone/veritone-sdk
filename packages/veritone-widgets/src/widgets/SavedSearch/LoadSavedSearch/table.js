import React from 'react';
import { func, element } from 'prop-types';
import cx from 'classnames';

import { ExpandableRow } from 'veritone-react-common';

import {
  CellMeasurer,
  CellMeasurerCache,
  InfiniteLoader,
  List,
  AutoSizer
} from 'react-virtualized';

import Typography from '@material-ui/core/Typography';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

export default class InfiniteScrollTable extends React.Component {
  _cache = new CellMeasurerCache({
    fixedWidth: true
  });

  clearCache = i => () => {
    this._cache.clear(i);
    if(this._list && this._list.Grid) {
      this._list.recomputeRowHeights(i);
      if(this.props.onRenderList) {
        const scrollBarSize = 0 + this._list.Grid._verticalScrollBarSize;
        this.props.onRenderList(scrollBarSize);
      }
    }
  };

  _rowRenderer = ({ index, key, style, parent }) => {
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div key={key} style={style} className={ cx([ [this.props.rowClassName], { [this.props.lastRowClassName]: index === this.props.count - 1 } ]) }>
          <ExpandableRow
            data-veritone-element={`expand_row_${key}`}
            iconOpen={<KeyboardArrowDown />}
            iconClose={<KeyboardArrowUp />}
            onToggle={this.clearCache(index)}
            summary={this.props.renderRowSummary(index)}
            details={this.props.renderRowDetails(index)}
          />
        </div>
      </CellMeasurer>
    );
  };

  getRegisterChild = registerChild => ref => {
    if(ref) {
      this._list = ref;
    }
    if(ref && ref.Grid && this.props.onRenderList) {
      const scrollBarSize = 0 + ref.Grid._verticalScrollBarSize;
      this.props.onRenderList(scrollBarSize)
    }
    return registerChild;
  };

  render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isRowLoaded={this.props.isRowLoaded}
            loadMoreRows={this.props.loadMoreRows}
            rowCount={this.props.count}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                ref={this.getRegisterChild(registerChild)}
                className={this.props.className}
                onRowsRendered={onRowsRendered}
                height={height}
                width={width}
                deferredMeasurementCache={this._cache}
                rowCount={this.props.count}
                rowHeight={this._cache.rowHeight}
                rowRenderer={this._rowRenderer}
              />
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    );
  }
}
