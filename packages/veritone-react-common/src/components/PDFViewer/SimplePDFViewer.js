import React, { Component, PureComponent } from 'react';
import { string, number, func, shape, object } from 'prop-types';
import { Document, Page, setOptions } from 'react-pdf';
import { FixedSizeList, shouldComponentUpdate } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './styles.scss';

setOptions({
  workerSrc: '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.305/pdf.worker.js'
});
const SCROLLBAR_MARGIN = 20;
const PAGE_MARGIN = 10;

class SimplePDFViewer extends PureComponent {
  static propTypes = {
    file: string.isRequired,
    onItemsRendered: func,
    userScale: number,
    overrideScale: number,
    onDocumentLoad: func,
    makeTextRenderer: func,
    initialPageOffset: number,
    listRef: shape({ current: object }),
    listOuterRef: shape({ current: object }),
    searchText: string,
    currentSearchMatch: number,
    currentSearchPage: number
  };
  static defaultProps = {
    userScale: 1,
    overrideScale: null,
    initialPageOffset: 1,
    searchText: '',
    currentSearchMatch: null
  };
  state = {
    currentPageIndex: null,
    numPages: null,
    originalPageDimensions: null,
    pdf: null
  };

  onDocumentLoad = pdf => {
    this.setState({ numPages: pdf.numPages, pdf });
    pdf.getPage(1).then(this.handlePageDimensions);
    if (this.props.onDocumentLoad) {
      this.props.onDocumentLoad(pdf);
    }
  };

  handlePageDimensions = page => {
    const scale = 1;
    const viewport = page.getViewport(scale);
    if (viewport) {
      const originalPageDimensions = {
        height: viewport.height,
        width: viewport.width
      };
      this.setState({
        originalPageDimensions
      });
    }
    return page;
  };

  onItemsRendered = ({
    overscanStartIndex,
    overscanStopIndex,
    visibleStartIndex,
    visibleStopIndex
  }) => {
    if (this.props.onItemsRendered) {
      this.props.onItemsRendered({
        currentPageIndex: visibleStopIndex,
        numPages: this.state.numPages
      });
    }
  };

  render() {
    return (
      <AutoSizer>
        {({ width, height }) => {
          const { numPages, originalPageDimensions } = this.state;
          const {
            file,
            userScale,
            makeTextRenderer,
            listRef,
            listOuterRef,
            overrideScale,
            initialPageOffset,
            searchText,
            currentSearchMatch,
            currentSearchPage
          } = this.props;
          const scale =
            overrideScale ||
            (originalPageDimensions
              ? (userScale * width - (SCROLLBAR_MARGIN + PAGE_MARGIN)) /
                originalPageDimensions.width
              : 1);
          const itemHeight = originalPageDimensions
            ? originalPageDimensions.height * scale + PAGE_MARGIN
            : 0;
          return (
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoad}
              loading=""
            >
              {originalPageDimensions && (
                <FixedSizeList
                  ref={listRef}
                  outerRef={listOuterRef}
                  height={height}
                  width={width}
                  itemCount={numPages}
                  itemSize={itemHeight}
                  itemData={{
                    scale,
                    makeTextRenderer,
                    searchText,
                    currentSearchMatch,
                    currentSearchPage
                  }}
                  onItemsRendered={this.onItemsRendered}
                  initialScrollOffset={(initialPageOffset - 1) * itemHeight}
                >
                  {PageRow}
                </FixedSizeList>
              )}
            </Document>
          );
        }}
      </AutoSizer>
    );
  }
}

class PageRow extends Component {
  static propTypes = {
    index: number.isRequired,
    style: shape().isRequired,
    data: shape({
      scale: number,
      searchText: string,
      currentSearchMatch: number,
      customTextRenderer: func,
      currentSearchPage: number
    }).isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    const { index, style, data } = this.props;
    const {
      scale,
      makeTextRenderer,
      searchText,
      currentSearchMatch,
      currentSearchPage
    } = data;
    const pageNumber = index + 1;
    const customTextRenderer =
      searchText && searchText.length > 2 && makeTextRenderer
        ? makeTextRenderer(pageNumber)
        : null;
    let key = '';
    if (customTextRenderer) {
      if (pageNumber === currentSearchPage) {
        key = `${searchText}_${currentSearchMatch}`;
      } else {
        key = `${searchText}`;
      }
    } else {
      key = `${pageNumber}`;
    }
    return (
      <div
        style={style}
        className={styles.pageContainer}
        key={`page_${pageNumber}`}
      >
        <Page
          key={key}
          className={styles.pdfPage}
          pageNumber={pageNumber}
          scale={scale}
          renderAnnotations={false}
          customTextRenderer={customTextRenderer}
          loading=""
        />
      </div>
    );
  }
}
export default SimplePDFViewer;
