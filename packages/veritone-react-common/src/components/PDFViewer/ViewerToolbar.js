import React, { PureComponent } from 'react';
import { bool, string, number, func, shape, object } from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import { get, isFinite } from 'lodash';
import screenfull from 'screenfull';

import styles from './styles.scss';

const SCALE_CONSTANT = 1.25;

class ViewerToolBar extends PureComponent {
  static propTypes = {
    currentPageNumber: number,
    numPages: number,
    userScale: number,
    onScale: func,
    onSearchTextChange: func,
    searchText: string,
    viewerRef: shape({ current: object }),
    isSearchOpen: bool,
    currentSearchMatch: number,
    totalSearchMatches: number,
    onPrevSearchMatch: func,
    onNextSearchMatch: func,
    onScrollToPage: func,
    onToggleSearchBar: func
  };
  static defaultProps = {
    userScale: 1,
    searchText: '',
    currentSearchMatch: null,
    totalSearchMatches: null,
    currentPageNumber: 1,
    isSearchOpen: false
  };

  state = {
    pageNumberInput: ''
  };

  componentWillUnmount() {
    if (screenfull.enabled) {
      screenfull.off();
    }
  }

  pageDown = () => {
    if (this.props.onScrollToPage) {
      this.props.onScrollToPage(this.props.currentPageNumber + 1);
    }
  };

  pageUp = () => {
    if (this.props.onScrollToPage) {
      this.props.onScrollToPage(this.props.currentPageNumber - 1);
    }
  };

  zoomIn = () => {
    const newScale = this.props.userScale * SCALE_CONSTANT;
    this.setZoom(newScale);
  };
  zoomOut = () => {
    const newScale = this.props.userScale / SCALE_CONSTANT;
    this.setZoom(newScale);
  };
  setZoom = userScale => {
    if (isFinite(userScale) && this.props.onScale) {
      this.props.onScale({ userScale, overrideScale: null });
    }
  };

  fitWidth = () => {
    this.setZoom(1);
  };

  toggleFullScreen = () => {
    if (screenfull.enabled && get(this.props.viewerRef, 'current')) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request(this.props.viewerRef.current);
      }
    }
  };

  handleSearchTextChange = e => {
    if (this.props.onSearchTextChange) {
      this.props.onSearchTextChange(e.target.value);
    }
  };

  handlePageChange = ev => {
    if (ev.key === 'Enter') {
      const requestedPage = ev.target.value;
      if (requestedPage >= 1 && requestedPage <= this.props.numPages) {
        if (this.props.onScrollToPage) {
          this.props.onScrollToPage(requestedPage);
        }
        this.setState({ pageNumberInput: '' });
      }
    }
  };

  handlePageInput = e => {
    this.setState({ pageNumberInput: e.target.value });
  };

  handlePageInputBlur = () => {
    this.setState({ pageNumberInput: '' });
  };

  toggleSearchBar = () => {
    if (this.props.onToggleSearchBar) {
      this.props.onToggleSearchBar();
    }
  };

  handlePrevSearchMatch = () => {
    if (this.props.onPrevSearchMatch) {
      this.props.onPrevSearchMatch();
    }
  };

  handleNextSearchMatch = () => {
    if (this.props.onNextSearchMatch) {
      this.props.onNextSearchMatch();
    }
  };

  handleSearchKeyDown = ev => {
    if (ev.key === 'Enter') {
      if (ev.shiftKey) {
        this.handlePrevSearchMatch();
      } else {
        this.handleNextSearchMatch();
      }
    } else if (ev.key === 'Escape') {
      this.toggleSearchBar();
    }
  };

  render() {
    const {
      currentPageNumber,
      numPages,
      searchText,
      currentSearchMatch,
      totalSearchMatches,
      isSearchOpen
    } = this.props;
    const { pageNumberInput } = this.state;
    const buttonStyle = {
      height: '36px',
      width: '36px'
    };
    return (
      <div>
        <Toolbar
          classes={{
            root: styles.toolbar
          }}
          style={{ minHeight: '48px', height: '48px' }}
        >
          <Tooltip title="Find in Document">
            <IconButton style={buttonStyle} onClick={this.toggleSearchBar}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Page Down">
            <IconButton style={buttonStyle} onClick={this.pageDown}>
              <ArrowDownwardIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Page Up">
            <IconButton style={buttonStyle}>
              <ArrowUpwardIcon onClick={this.pageUp} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Go to Page">
            <Input
              classes={{
                root: styles.pageNumberInputRoot,
                input: styles.pageNumberInput
              }}
              style={{ fontSize: '16px' }}
              placeholder={String(currentPageNumber)}
              value={pageNumberInput}
              onChange={this.handlePageInput}
              onKeyPress={this.handlePageChange}
              onBlur={this.handlePageInputBlur}
              disableUnderline
            />
          </Tooltip>
          <Typography style={{ fontSize: '16px', paddingRight: '16px' }}>
            / {numPages}
          </Typography>
          <Tooltip title="Fit to Width">
            <IconButton style={buttonStyle} onClick={this.fitWidth}>
              <FullscreenIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton style={buttonStyle} onClick={this.zoomOut}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom In">
            <IconButton style={buttonStyle} onClick={this.zoomIn}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fullscreen">
            <IconButton style={buttonStyle}>
              <ZoomOutMapIcon onClick={this.toggleFullScreen} />
            </IconButton>
          </Tooltip>
        </Toolbar>
        {isSearchOpen && (
          <Toolbar
            classes={{
              root: styles.toolbar
            }}
            style={{ minHeight: '48px', height: '48px' }}
          >
            <Input
              value={searchText}
              className={styles.searchInput}
              onChange={this.handleSearchTextChange}
              onKeyDown={this.handleSearchKeyDown}
              autoFocus
            />
            {totalSearchMatches ? (
              <Typography>
                {currentSearchMatch} of {totalSearchMatches}
              </Typography>
            ) : null}
            <Tooltip title="Previous">
              <div>
                <IconButton
                  style={buttonStyle}
                  onClick={this.handlePrevSearchMatch}
                  disabled={!totalSearchMatches}
                >
                  <ExpandLessIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Next">
              <div>
                <IconButton
                  style={buttonStyle}
                  onClick={this.handleNextSearchMatch}
                  disabled={!totalSearchMatches}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton style={buttonStyle} onClick={this.toggleSearchBar}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        )}
      </div>
    );
  }
}

export default ViewerToolBar;
