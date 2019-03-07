import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import cx from 'classnames';

import SimplePDFViewer from './SimplePDFViewer';
import ViewerToolBar from './ViewerToolbar';
import styles from './styles.scss';

const highlightPattern = (text, pattern) => {
  const splitText = text.split(pattern);

  if (splitText.length <= 1) {
    return text;
  }
  const matches = text.match(pattern);
  return splitText.reduce(
    (arr, element, index) =>
      matches[index]
        ? [...arr, element, <mark>{matches[index]}</mark>]
        : [...arr, element],
    []
  );
};
const makeTextRenderer = searchText => ({ str, itemIndex }) =>
  highlightPattern(str, searchText);
class PDFViewer extends PureComponent {
  static propTypes = {
    file: string.isRequired,
    className: string
  };
  state = {
    currentPageIndex: null,
    numPages: null,
    listRef: React.createRef(),
    userScale: 1,
    pdf: null,
    searchText: null
  };

  handleUserScale = userScale => {
    this.setState({ userScale });
  };

  handleItemsRendered = ({ currentPageIndex, numPages }) => {
    if (currentPageIndex !== this.state.currentPageIndex) {
      this.setState({ currentPageIndex, numPages });
    }
  };

  handleDocumentLoad = pdf => {
    this.setState({ pdf });
  };

  //TODOJB optimize: min 2 or 3 characters
  handleSearchTextChange = searchText => {
    const customTextRenderer = makeTextRenderer(searchText);
    this.setState({ searchText, customTextRenderer });
  };

  render() {
    const {
      currentPageIndex,
      numPages,
      listRef,
      userScale,
      searchText,
      customTextRenderer
    } = this.state;
    return (
      <div className={cx(styles.pdfViewer, this.props.className)}>
        <ViewerToolBar
          currentPageIndex={currentPageIndex}
          numPages={numPages}
          listRef={listRef}
          onUserScale={this.handleUserScale}
          userScale={userScale}
          searchText={searchText}
          onSearchTextChange={this.handleSearchTextChange}
        />
        <div className={styles.pdfViewerContainer}>
          <SimplePDFViewer
            file={this.props.file}
            onItemsRendered={this.handleItemsRendered}
            onDocumentLoad={this.handleDocumentLoad}
            listRef={listRef}
            userScale={userScale}
            customTextRenderer={customTextRenderer}
          />
        </div>
      </div>
    );
  }
}
export { PDFViewer, SimplePDFViewer };
