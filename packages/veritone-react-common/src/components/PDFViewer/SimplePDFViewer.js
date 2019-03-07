import React, { PureComponent } from 'react';
import { string, number, func, ref } from 'prop-types';
import { Document, Page, setOptions } from 'react-pdf';
import { FixedSizeList } from 'react-window';
import ContainerDimensions from 'react-container-dimensions';
import styles from './styles.scss';

setOptions({
  workerSrc: '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.305/pdf.worker.js'
});

class SimplePDFViewer extends PureComponent {
  static propTypes = {
    file: string.isRequired,
    onItemsRendered: func,
    listRef: ref,
    userScale: number,
    onDocumentLoad: func,
    customTextRenderer: func
  };
  static defaultProps = {
    userScale: 1
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
      // note: when multiple pages are visible, it is not as clear which one should be the "current" page
      // we could figure out which page is in the center of the screen if we get scrollbar percentage
      this.props.onItemsRendered({
        currentPageIndex: visibleStopIndex,
        numPages: this.state.numPages
      });
    }
  };

  render() {
    return (
      <ContainerDimensions>
        {({ width, height }) => {
          const { numPages, originalPageDimensions } = this.state;
          const { file, listRef, userScale, customTextRenderer } = this.props;
          const scale = originalPageDimensions
            ? (userScale * width - 20) / originalPageDimensions.width
            : null;
          const itemHeight = originalPageDimensions
            ? originalPageDimensions.height * scale
            : null;
          return (
            <Document file={file} onLoadSuccess={this.onDocumentLoad}>
              {originalPageDimensions && (
                <div>
                  <FixedSizeList
                    ref={listRef}
                    height={height}
                    width={width}
                    itemCount={numPages}
                    itemSize={itemHeight}
                    onItemsRendered={this.onItemsRendered}
                  >
                    {({ style, index }) => (
                      <div style={style} key={`page_${index}`}>
                        <Page
                          className={styles.pdfPage}
                          pageIndex={index}
                          scale={scale}
                          renderAnnotationLayer={false}
                          customTextRenderer={customTextRenderer}
                        />
                      </div>
                    )}
                  </FixedSizeList>
                </div>
              )}
            </Document>
          );
        }}
      </ContainerDimensions>
    );
  }
}
export default SimplePDFViewer;
