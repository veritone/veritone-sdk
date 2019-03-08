import React, { PureComponent } from 'react';
import { string, number, func, shape, object } from 'prop-types';
import { Document, Page, setOptions } from 'react-pdf';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './styles.scss';

setOptions({
  workerSrc: '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.305/pdf.worker.js'
});

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
    listOuterRef: shape({ current: object })
  };
  static defaultProps = {
    userScale: 1,
    overrideScale: null,
    initialPageOffset: 1
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
            initialPageOffset
          } = this.props;
          const scale =
            overrideScale ||
            (originalPageDimensions
              ? (userScale * width - 20) / originalPageDimensions.width
              : null);
          const itemHeight = originalPageDimensions
            ? originalPageDimensions.height * scale
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
                  onItemsRendered={this.onItemsRendered}
                  initialScrollOffset={(initialPageOffset - 1) * itemHeight}
                >
                  {({ style, index }) => (
                    <div style={style} key={`page_${index}`}>
                      <Page
                        className={styles.pdfPage}
                        pageIndex={index}
                        scale={scale}
                        renderAnnotationLayer={false}
                        customTextRenderer={customTextRenderer}
                        loading=""
                      />
                    </div>
                  )}
                </FixedSizeList>
              )}
            </Document>
          );
        }}
      </AutoSizer>
    );
  }
}
export default SimplePDFViewer;
