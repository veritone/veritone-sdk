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
    customTextRenderer: func,
    initialPageOffset: number,
    listRef: shape({ current: object }),
    listOuterRef: shape({ current: object }),
    searchText: string
  };
  static defaultProps = {
    userScale: 1,
    overrideScale: null,
    initialPageOffset: 1,
    searchText: ''
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
            customTextRenderer,
            listRef,
            listOuterRef,
            overrideScale,
            initialPageOffset,
            searchText
          } = this.props;
          const scale =
            overrideScale ||
            (originalPageDimensions
              ? (userScale * width - (SCROLLBAR_MARGIN + PAGE_MARGIN)) /
                originalPageDimensions.width
              : null);
          const itemHeight = originalPageDimensions
            ? originalPageDimensions.height * scale + PAGE_MARGIN
            : null;
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
                  itemData={{ scale, customTextRenderer, searchText }}
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
    index: number,
    style: shape(),
    data: shape({
      scale: number,
      searchText: string,
      customTextRenderer: func
    })
  };

  shouldComponentUpdate = shouldComponentUpdate.bind(this);

  render() {
    const { index, style, data } = this.props;
    const { scale, customTextRenderer, searchText } = data;
    const key = customTextRenderer
      ? `custom_${searchText}`
      : `default_${index}`;
    return (
      <div style={style} className={styles.pageContainer} key={`page_${index}`}>
        <Page
          key={key}
          className={styles.pdfPage}
          pageNumber={index + 1}
          scale={scale}
          renderAnnotationLayer={false}
          customTextRenderer={customTextRenderer}
          loading=""
        />
      </div>
    );
  }
}
export default SimplePDFViewer;
