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
    userScale: number
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
        currentPageIndex: visibleStartIndex,
        numPages: this.state.numPages
      });
    }
  };

  render() {
    return (
      <ContainerDimensions>
        {({ width, height }) => {
          const { numPages, originalPageDimensions } = this.state;
          const { file, listRef, userScale } = this.props;
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
