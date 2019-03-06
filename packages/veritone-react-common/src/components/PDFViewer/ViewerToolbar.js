import React, { PureComponent } from 'react';
import { number, ref, func } from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
import { get, isFinite } from 'lodash';

import styles from './styles.scss';

const SCALE_CONSTANT = 1.25;

class ViewerToolBar extends PureComponent {
  static propTypes = {
    currentPageIndex: number,
    numPages: number,
    listRef: ref,
    userScale: number,
    onUserScale: func
  };
  static defaultProps = {
    userScale: 1
  };

  pageDown = () => {
    this.scrollToPage(this.props.currentPageIndex + 1);
  };
  pageUp = () => {
    this.scrollToPage(this.props.currentPageIndex - 1);
  };
  scrollToPage = desiredPageIndex => {
    if (
      get(this.props.listRef, 'current.scrollToItem') &&
      isFinite(desiredPageIndex)
    ) {
      let targetIndex = Math.min(desiredPageIndex, this.props.numPages - 1);
      targetIndex = Math.max(targetIndex, 0);
      this.props.listRef.current.scrollToItem(targetIndex, 'center');
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
  setZoom = zoomScale => {
    if (isFinite(zoomScale) && this.props.onUserScale) {
      this.props.onUserScale(zoomScale);
    }
  };

  render() {
    const { currentPageIndex, numPages, userScale } = this.props;
    return (
      <Toolbar
        classes={{
          root: styles.toolbar
        }}
        style={{ minHeight: '48px', height: '48px' }}
      >
        <IconButton>
          <SearchIcon />
        </IconButton>
        <IconButton onClick={this.pageDown}>
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton>
          <ArrowUpwardIcon onClick={this.pageUp} />
        </IconButton>
        <Typography>
          {currentPageIndex + 1}/{numPages}
        </Typography>
        <IconButton onClick={this.zoomOut}>
          <RemoveCircleOutlineIcon />
        </IconButton>
        <IconButton onClick={this.zoomIn}>
          <AddCircleOutlineIcon />
        </IconButton>
        <Typography>Scale: {Math.round(userScale * 100)}%</Typography>
        <IconButton>
          <ZoomOutMapIcon />
        </IconButton>
      </Toolbar>
    );
  }
}

export default ViewerToolBar;
