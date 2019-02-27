import React, { PureComponent } from 'react';
import { number, string } from 'prop-types';
import { Document, Page, setOptions } from 'react-pdf';
import { FixedSizeList } from 'react-window';
import styles from './styles.scss';

setOptions({
  workerSrc: '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.305/pdf.worker.js'
});

class PDFViewer extends PureComponent {
  static propTypes = {
    file: string,
    height: number,
    width: number
  };
  state = {
    numPages: null,
    originalPageDimensions: null
  };

  onDocumentLoad = pdf => {
    this.setState({ numPages: pdf.numPages });
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

  render() {
    const { numPages, originalPageDimensions } = this.state;
    const { file, height, width } = this.props;
    const scale = originalPageDimensions
      ? (width - 20) / originalPageDimensions.width
      : null;
    const itemHeight = originalPageDimensions
      ? originalPageDimensions.height * scale
      : null;
    return (
      <Document file={file} onLoadSuccess={this.onDocumentLoad}>
        {originalPageDimensions && (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={numPages}
            itemSize={itemHeight}
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
        )}
      </Document>
    );
  }
}
export default PDFViewer;
