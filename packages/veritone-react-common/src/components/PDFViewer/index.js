import React, { PureComponent } from 'react';
import { number, string } from 'prop-types';
import cx from 'classnames';
import {
  get,
  reduce,
  findLast,
  escapeRegExp,
  map,
  join,
  filter,
  forEach
} from 'lodash';

import SimplePDFViewer from './SimplePDFViewer';
import ViewerToolBar from './ViewerToolbar';
import styles from './styles.scss';

const MIN_SEARCH_LENGTH = 3;

const highlightPattern = (text, highlights) => {
  if (!text || !get(highlights, 'length')) {
    return text;
  }
  const slicePoints = [
    {
      start: 0,
      end: highlights[0].start,
      highlight: false,
      special: false
    }
  ];
  forEach(highlights, (highlight, index) => {
    const nextHighlight = highlights[index + 1];
    const plainSliceEnd = nextHighlight ? nextHighlight.start : text.length;
    slicePoints.push({
      start: highlight.start,
      end: highlight.end,
      highlight: true,
      special: highlight.special
    });
    slicePoints.push({
      start: highlight.end,
      end: plainSliceEnd,
      highlight: false,
      special: false
    });
  });

  const filteredSlices = filter(slicePoints, slice => {
    return slice.start !== slice.end;
  });

  return map(filteredSlices, ({ start, end, highlight, special }, index) => {
    const sliceText = text.slice(start, end);
    if (highlight) {
      return (
        <mark
          key={index}
          className={special ? styles.specialHighlight : styles.highlight}
        >
          {sliceText}
        </mark>
      );
    } else {
      return sliceText;
    }
  });
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
    searchMatches: []
  };

  componentDidUpdate(prevProps, prevState) {
    //scroll back to page that was visible before scaling
    if (prevState.userScale !== this.state.userScale) {
      this.scrollToPage(prevState.currentPageNumber);
    }
  }

  makeTextRenderer = pageNumber => props => {
    const { str, itemIndex } = props;
    if (this.state.searchMatches.length) {
      const currentSearchMatchIndex = this.state.currentSearchMatch - 1;
      const highlights = reduce(
        this.state.searchMatches,
        (highlightResults, match, matchIndex) => {
          if (match.pageNumber !== pageNumber) {
            return highlightResults;
          }
          const pageText = this.state.pagesText[pageNumber - 1];
          const segmentData = get(pageText, ['segments', itemIndex]);
          const segmentPageEndOffset =
            segmentData.pageStartOffset + segmentData.segmentLength;
          if (
            segmentData.pageStartOffset < match.matchEndOffset &&
            match.matchStartOffset < segmentPageEndOffset
          ) {
            const highlight = {
              start: Math.max(
                match.matchStartOffset - segmentData.pageStartOffset,
                0
              ),
              end: Math.min(
                match.matchEndOffset - segmentData.pageStartOffset,
                str.length
              ),
              special: matchIndex === currentSearchMatchIndex
            };
            highlightResults.push(highlight);
          }
          return highlightResults;
        },
        []
      );
      return highlightPattern(str, highlights);
    }
    return str;
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
    this.setState({
      pdf,
      numPages: pdf.numPages
    });
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
        const items = get(content, 'items', []);
        const pageText = join(map(items, 'str'), '');
        let runningOffset = 0;
        const segments = map(items, (item, index, arr) => {
          const segment = {
            segmentIndex: index,
            segmentLength: get(item, 'str.length', 0),
            pageStartOffset: runningOffset
          };
          runningOffset += segment.segmentLength;
          return segment;
        });
        return {
          pageText,
          segments
        };
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
      (results, page, pageIndex) => {
        const pageText = page.pageText;
        let match;
        while ((match = pattern.exec(pageText)) !== null) {
          results.push({
            pageNumber: pageIndex + 1,
            matchStartOffset: match.index,
            matchEndOffset: match.index + match[0].length
          });
        }
        return results;
      },
      []
    );
  }

  handlePrevSearchMatch = () => {
    if (this.state.searchMatches.length > 0) {
      this.setState(prevState => {
        // loop around at end of matches
        const newMatchIndex =
          prevState.currentSearchMatch <= 1
            ? prevState.searchMatches.length
            : prevState.currentSearchMatch - 1;
        const match = get(prevState.searchMatches, newMatchIndex - 1);
        const pageForSearchMatch = get(match, 'pageNumber');
        if (pageForSearchMatch !== prevState.currentPageNumber) {
          this.scrollToPage(pageForSearchMatch);
        }
        return {
          currentSearchMatch: newMatchIndex
        };
      });
    }
  };

  //TODOJB consolidate with handlePrevSearchMatch
  handleNextSearchMatch = () => {
    if (this.state.searchMatches.length > 0) {
      this.setState(prevState => {
        // loop around at end of matches
        const newMatchIndex =
          prevState.currentSearchMatch >= prevState.searchMatches.length
            ? 1
            : prevState.currentSearchMatch + 1;
        const match = get(prevState.searchMatches, newMatchIndex - 1);
        const pageForSearchMatch = get(match, 'pageNumber');
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
    this.setState({ searchText });
    const searchMatches = this.searchDocument(searchText, this.state.pagesText);
    // console.log('searchMatches', searchMatches);
    if (searchMatches.length > 0) {
      this.setState({
        currentSearchMatch: 1,
        searchMatches
      });
    } else {
      this.setState({ currentSearchMatch: null, searchMatches: [] });
    }
  };

  toggleSearchBar = () => {
    if (this.state.isSearchOpen) {
      this.handleSearchTextChange('');
    }
    this.setState(prevState => ({ isSearchOpen: !prevState.isSearchOpen }));
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
      currentSearchMatch,
      searchMatches,
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
          totalSearchMatches={searchMatches.length}
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
            makeTextRenderer={this.makeTextRenderer}
            initialPageOffset={this.props.initialPageOffset}
            searchText={searchText}
            currentSearchMatch={currentSearchMatch}
            currentSearchPage={get(searchMatches, [
              currentSearchMatch - 1,
              'pageNumber'
            ])}
          />
        </div>
      </div>
    );
  }
}
export { PDFViewer, SimplePDFViewer };
