import React, { PureComponent } from 'react';
import { number, string } from 'prop-types';
import cx from 'classnames';
import { get, reduce, findLast, escapeRegExp } from 'lodash';

import SimplePDFViewer from './SimplePDFViewer';
import ViewerToolBar from './ViewerToolbar';
import styles from './styles.scss';

const MIN_SEARCH_LENGTH = 3;

const highlightPattern = (text, pattern) => {
  const splitText = text.split(pattern);

  if (splitText.length <= 1) {
    return text;
  }
  const matches = text.match(pattern);
  return splitText.reduce(
    (arr, element, index) =>
      matches[index]
        ? [
            ...arr,
            element,
            <mark key={index} className={styles.highlight}>
              {matches[index]}
            </mark>
          ]
        : [...arr, element],
    []
  );
};

class PDFViewer extends PureComponent {
  static propTypes = {
    file: string.isRequired,
    className: string,
    initialPageOffset: number,
    initialSearchText: string
  };
  static defaultProps = {
    initialPageOffset: 1,
    initialSearchText: ''
  };
  state = {
    currentPageNumber: this.props.initialPageOffset,
    isSearchOpen: !!this.props.initialSearchText,
    numPages: null,
    viewerRef: React.createRef(),
    listRef: React.createRef(),
    listOuterRef: React.createRef(),
    userScale: 1,
    overrideScale: null,
    pdf: null,
    searchText: this.props.initialSearchText,
    pagesText: null,
    currentSearchMatch: null,
    totalSearchMatches: null
  };

  componentDidUpdate(prevProps, prevState) {
    //scroll back to page that was visible before scaling
    if (prevState.userScale !== this.state.userScale) {
      this.scrollToPage(prevState.currentPageNumber);
    }
  }

  makeTextRenderer = searchText => ({ str, itemIndex }) => {
    return highlightPattern(str, searchText);
  };

  handleScale = ({ userScale, overrideScale }) => {
    this.setState({ userScale, overrideScale });
    this.scrollToPage(this.state.currentPageNumber);
  };

  handleItemsRendered = ({ numPages }) => {
    const listOuterRef = get(this.state, 'listOuterRef.current');
    if (listOuterRef) {
      const pxPerPage = listOuterRef.scrollHeight / numPages;
      const centerPoint =
        listOuterRef.scrollTop + listOuterRef.clientHeight / 2;
      const currentPageNumber = Math.floor(centerPoint / pxPerPage) + 1;
      if (currentPageNumber !== this.state.currentPageNumber) {
        this.setState({ currentPageNumber, numPages });
      }
    }
  };

  handleDocumentLoad = pdf => {
    this.setState({ pdf, numPages: pdf.numPages });
    return this.fetchAllPageText({ pdf }).then(pagesText => {
      this.setState({ pagesText }, () => {
        this.handleSearchTextChange(this.state.searchText);
      });
      return pagesText;
    });
  };

  scrollToPage = desiredPageNum => {
    if (
      get(this.state.listRef, 'current.scrollToItem') &&
      isFinite(desiredPageNum)
    ) {
      let targetIndex = Math.min(desiredPageNum, this.state.numPages);
      targetIndex = Math.max(targetIndex, 0);
      this.state.listRef.current.scrollToItem(targetIndex - 1, 'center');
    }
  };

  fetchAllPageText({ pdf, index = 1, results = [] }) {
    if (index > pdf.numPages) {
      return results;
    }
    return this.getSinglePageText({ pdf, index }).then(text => {
      results.push(text);
      return this.fetchAllPageText({ pdf, index: index + 1, results });
    });
  }
  getSinglePageText({ pdf, index = 1 }) {
    return pdf
      .getPage(index)
      .then(page => {
        return page.getTextContent();
      })
      .then(content => {
        return reduce(
          content.items,
          (result, item) => {
            return result + item.str + ' ';
          },
          ''
        );
      });
  }

  searchDocument(searchText, pages) {
    if (!searchText || searchText.length < MIN_SEARCH_LENGTH) {
      return {
        totalCount: 0,
        pages: []
      };
    }
    const pattern = new RegExp(escapeRegExp(searchText), 'ig');
    return reduce(
      pages,
      (results, pageText, pageIndex) => {
        const matches = pageText.match(pattern);
        if (matches && matches.length) {
          results.pages.push({
            pageIndex: pageIndex + 1,
            startMatchIndex: results.totalCount + 1,
            matchesOnPage: matches.length
          });
          results.totalCount += matches.length;
        }
        return results;
      },
      { totalCount: 0, pages: [] }
    );
  }

  handlePrevSearchMatch = () => {
    if (this.state.totalSearchMatches > 0) {
      this.setState(prevState => {
        const newMatchIndex =
          prevState.currentSearchMatch <= 1
            ? prevState.totalSearchMatches
            : prevState.currentSearchMatch - 1;
        const pageForSearchMatch = this.getPageForSearchMatch(
          prevState.searchMatches.pages,
          newMatchIndex
        );
        if (pageForSearchMatch !== prevState.currentPageNumber) {
          this.scrollToPage(pageForSearchMatch);
        }
        return {
          currentSearchMatch: newMatchIndex
        };
      });
    }
  };

  handleNextSearchMatch = () => {
    if (this.state.totalSearchMatches > 0) {
      this.setState(prevState => {
        // loop around at end of matches
        const newMatchIndex =
          prevState.currentSearchMatch >= prevState.totalSearchMatches
            ? 1
            : prevState.currentSearchMatch + 1;
        const pageForSearchMatch = this.getPageForSearchMatch(
          prevState.searchMatches.pages,
          newMatchIndex
        );
        if (pageForSearchMatch !== prevState.currentPageNumber) {
          this.scrollToPage(pageForSearchMatch);
        }
        return {
          currentSearchMatch: newMatchIndex
        };
      });
    }
  };

  getPageForSearchMatch = (searchMatchPages, matchIndex) => {
    const match = findLast(
      searchMatchPages,
      match => matchIndex >= match.startMatchIndex
    );
    if (match) {
      return match.pageIndex;
    }
  };

  handleSearchTextChange = searchText => {
    const customTextRenderer =
      searchText && searchText.length >= MIN_SEARCH_LENGTH
        ? this.makeTextRenderer(new RegExp(escapeRegExp(searchText), 'i'))
        : null;
    this.setState({ searchText, customTextRenderer });

    const searchMatches = this.searchDocument(searchText, this.state.pagesText);
    const totalSearchMatches = searchMatches.totalCount;
    if (totalSearchMatches > 0) {
      this.setState({
        currentSearchMatch: 1,
        totalSearchMatches,
        searchMatches
      });
    } else {
      this.setState({ currentSearchMatch: null, totalSearchMatches: null });
    }
  };

  toggleSearchBar = () => {
    this.setState(prevState => {
      const isSearchOpen = !prevState.isSearchOpen;
      if (!isSearchOpen) {
        this.handleSearchTextChange('');
      }
      return { isSearchOpen };
    });
  };

  render() {
    const {
      currentPageNumber,
      numPages,
      viewerRef,
      listRef,
      listOuterRef,
      userScale,
      overrideScale,
      searchText,
      customTextRenderer,
      currentSearchMatch,
      totalSearchMatches,
      isSearchOpen
    } = this.state;
    return (
      <div
        ref={viewerRef}
        className={cx(styles.pdfViewer, this.props.className)}
      >
        <ViewerToolBar
          currentPageNumber={currentPageNumber}
          numPages={numPages}
          listRef={listRef}
          viewerRef={viewerRef}
          onScale={this.handleScale}
          userScale={userScale}
          searchText={searchText}
          onSearchTextChange={this.handleSearchTextChange}
          onPrevSearchMatch={this.handlePrevSearchMatch}
          onNextSearchMatch={this.handleNextSearchMatch}
          currentSearchMatch={currentSearchMatch}
          totalSearchMatches={totalSearchMatches}
          onScrollToPage={this.scrollToPage}
          isSearchOpen={isSearchOpen}
          onToggleSearchBar={this.toggleSearchBar}
        />
        <div className={styles.pdfViewerContainer}>
          <SimplePDFViewer
            file={this.props.file}
            onItemsRendered={this.handleItemsRendered}
            onDocumentLoad={this.handleDocumentLoad}
            listRef={listRef}
            listOuterRef={listOuterRef}
            userScale={userScale}
            overrideScale={overrideScale}
            customTextRenderer={customTextRenderer}
            initialPageOffset={this.props.initialPageOffset}
          />
        </div>
      </div>
    );
  }
}
export { PDFViewer, SimplePDFViewer };
