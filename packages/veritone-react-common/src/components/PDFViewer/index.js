import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import cx from 'classnames';

import SimplePDFViewer from './SimplePDFViewer';
import ViewerToolBar from './ViewerToolbar';
import styles from './styles.scss';

class PDFViewer extends PureComponent {
  static propTypes = {
    file: string.isRequired,
    className: string
  };
  state = {
    currentPageIndex: null,
    numPages: null,
    listRef: React.createRef(),
    userScale: 1
  };

  handleUserScale = userScale => {
    this.setState({ userScale });
  };

  handleItemsRendered = ({ currentPageIndex, numPages }) => {
    if (currentPageIndex !== this.state.currentPageIndex) {
      this.setState({ currentPageIndex, numPages });
    }
  };

  render() {
    const { currentPageIndex, numPages, listRef, userScale } = this.state;
    return (
      <div className={cx(styles.pdfViewer, this.props.className)}>
        <ViewerToolBar
          currentPageIndex={currentPageIndex}
          numPages={numPages}
          listRef={listRef}
          onUserScale={this.handleUserScale}
          userScale={userScale}
        />
        <div className={styles.pdfViewerContainer}>
          <SimplePDFViewer
            file={this.props.file}
            onItemsRendered={this.handleItemsRendered}
            listRef={listRef}
            userScale={userScale}
          />
        </div>
      </div>
    );
  }
}
export { PDFViewer, SimplePDFViewer };
