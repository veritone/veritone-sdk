import React from 'react';
import { oneOf, arrayOf, func, bool, string, shape, any } from 'prop-types';
import cx from 'classnames';
import { get } from 'lodash';

import Paper from '@material-ui/core/Paper';
import Refresh from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import {
  hasCommandModifier
} from 'helpers/dom';

import FilePickerFooter from '../../FilePicker/FilePickerFooter';
import InfiniteWrapper from '../InfiniteWrapper';
import NullState from '../../NullState';
import MediaInfoPanel from '../MediaInfoPanel';
import itemShape from './itemShape';

import FolderListView from './FolderListView';
import FolderLoading from './FolderLoading'
import FolderGridView from './FolderGridView';
import styles from './styles';

const genArray = (a, b) => new Array(Math.max(a, b) - Math.min(a, b) + 1)
  .fill(0).map((_, i) => i + Math.min(a, b));

const LoadingState = () => (
  <FolderLoading
    message="Loading Message"
    size={100}
  />);

class FolderViewContainer extends React.Component {
  static propTypes = {
    availablePickerTypes: arrayOf(string),
    toggleContentView: func,
    supportedFormats: arrayOf(string),
    viewType: oneOf(['list', 'grid']),
    items: arrayOf(itemShape),
    onSelectItem: func,
    isLoading: bool,
    isLoaded: bool,
    isError: bool,
    triggerPagination: func,
    onCancel: func,
    onError: func,
    isFullScreen: bool,
    showMediaInfoPanel: bool,
    toggleMediaInfoPanel: func,
    multiple: bool,
    classes: shape({ any })
  }

  static defaultProps = {
    items: [],
    availablePickerTypes: [],
    supportedFormats: []
  }

  state = {
    highlightedItems: {},
  }

  componentDidMount() {
    this.props.triggerPagination();
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (event) => {
    const eventKeyCode = event.keyCode;
    const { lastIndex = 0, shiftIndex, highlightedItems } = this.state;
    const { items, multiple } = this.props;
    if (eventKeyCode === 38 && eventKeyCode === 40 && items.length && this.noneHighligthedItem(highlightedItems)) {
      this.onHighlight(0);
      return;
    }
    // Up
    if (eventKeyCode === 38 && lastIndex > 0) {
      event.preventDefault();
      if (event.shiftKey && multiple) {
        const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
        const shiftHighlightIndex = Math.max(currentIndex - 1, 0);
        this.onShiftHighlight(shiftHighlightIndex);
        this.needScrollIntoView(shiftHighlightIndex);
      } else {
        const currentIndex = Math.max((lastIndex || 0) - 1, 0);
        this.onHighlight(parseInt(currentIndex, 10));
        this.needScrollIntoView(currentIndex);
      }
      return;
    }

    // Down
    if (eventKeyCode === 40 && lastIndex < items.length - 1) {
      event.preventDefault();
      if (event.shiftKey && multiple) {
        const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
        const shiftHighlightIndex = Math.min(
          currentIndex + 1,
          items.length - 1
        );
        this.onShiftHighlight(shiftHighlightIndex);
        this.needScrollIntoView(shiftHighlightIndex);
      } else {
        const currentIndex = Math.min((lastIndex || 0) + 1, items.length - 1);
        this.onHighlight(currentIndex);
        this.needScrollIntoView(currentIndex);
      }
      return;
    }

    // Enter/Return
    if (eventKeyCode === 13) {
      this.onSubmit();
    }
  }

  needScrollIntoView = (itemIndex) => {
    const { items } = this.props;
    const itemId = items[itemIndex].id;
    const itemEl = document.getElementById(itemId);
    const itemElBounding = itemEl.getBoundingClientRect();

    const {
      top: topView,
      bottom: bottomView
    } = this.scrollRef.current.getViewWindow();
    if (itemElBounding.top < topView) {
      itemEl.scrollIntoView();
    }
    if (itemElBounding.bottom > bottomView) {
      itemEl.scrollIntoView({ block: 'end' });
    }
  }

  onShiftHighlight = (index) => {
    const { items } = this.props;
    this.setState(({ lastIndex, highlightedItems }) =>
      this.noneHighligthedItem(highlightedItems) ? ({
        lastIndex: index,
        highlightedItems: {
          [items[index].id]: true
        },
        shiftIndex: index
      }) : ({
        shiftIndex: index,
        highlightedItems: {
          ...genArray(lastIndex, index)
            .map(itemIndex => items[itemIndex].id)
            .reduce((highlighting, itemId) => ({
              ...highlighting,
              [itemId]: true
            }), {}),
        },
      }))
  }

  onHighlight = (index) => {
    const itemId = this.props.items[index].id
    this.setState(({ highlightedItems }) => ({
      highlightedItems: {
        [itemId]: !highlightedItems[itemId]
      },
      lastIndex: index,
      shiftIndex: index
    }), this.reloadPlayer);
  }

  noneHighligthedItem = (highlightedItems) =>
    Object.keys(highlightedItems)
      .filter(key => highlightedItems[key]).length === 0;

  onHighlightItem = (event) => {
    const { multiple } = this.props;
    const index = event.currentTarget.getAttribute('data-index');
    const holdingShift = event.shiftKey;
    const holdingCtrl = event.ctrlKey;
    const holdingCmd = hasCommandModifier(event);
    if (
      !multiple || (
        !holdingShift && !holdingCtrl && !holdingCmd
      )
    ) {
      this.onHighlight(parseInt(index, 10));
    }
    if (holdingCtrl || holdingCmd) {
      const itemId = this.props.items[index].id
      this.setState(({ highlightedItems }) => ({
        highlightedItems: {
          ...highlightedItems,
          [itemId]: !highlightedItems[itemId]
        },
        shiftIndex: parseInt(index, 10)
      }), this.reloadPlayer)
    }
    if (holdingShift) {
      this.onShiftHighlight(parseInt(index, 10));
    }
  }

  onSubmit = () => {
    const { items, onSelectItem, onError } = this.props;
    const { highlightedItems } = this.state;
    const selectedItems = items
      .filter(i => highlightedItems[i.id]);
    // Validate selected tdos are accepted content types
    const hasInvalidItem = selectedItems
      .filter(i => i.type === 'tdo')
      .find(i => !this.isAcceptedType(i));
    if (hasInvalidItem) {
      return onError && onError();
    }
    const selectedNodes = selectedItems
      .map(i => ({ id: i.id, type: i.type }));
    onSelectItem && onSelectItem(selectedNodes);
  }

  reloadPlayer = () => {
    if (this.mediaPlayer
      && this.playerRef
      && this.playerRef.current
    ) {
      this.mediaPlayer.load();
    }
  }

  onPlayerRefReady = ref => {
    this.mediaPlayer = ref;
  }

  isAcceptedType = item => {
    const { supportedFormats } = this.props;
    const itemType = get(item, 'primaryAsset.contentType');
    if (supportedFormats.length) {
      if (itemType) {
        const category = itemType.split('/')[0];
        return supportedFormats.includes(itemType) || supportedFormats.includes(`${category}/*`);
      }
    } else {
      return true;
    }
    return false;
  }

  // Used for double clicks (1 item)
  handleOnSelectItem = (selectedNodes = []) => {
    const { onSelectItem, items, onError } = this.props;
    if (selectedNodes.length) {
      const item = items.find(i => i.id === selectedNodes[0].id);
      if (
        item.type === 'tdo'
        && this.isAcceptedType(item)
        || item.type === 'folder'
      ) {
        onSelectItem(selectedNodes);
      } else {
        onError && onError();
      }
    }
  };

  scrollRef = React.createRef();
  playerRef = React.createRef();

  render() {
    const {
      isLoading,
      isLoaded,
      isError,
      viewType,
      items,
      triggerPagination,
      onCancel,
      availablePickerTypes,
      toggleContentView,
      isFullScreen,
      showMediaInfoPanel,
      toggleMediaInfoPanel,
      classes
    } = this.props;

    const { highlightedItems } = this.state;

    if (isError) {
      return (
        <Paper>
          <div className={classes['folderNullStateContainer']}>
            <div>Error Loading data</div>
            <span>{isError}</span>
            <IconButton onClick={triggerPagination}>
              <Refresh />
            </IconButton>
          </div>
        </Paper>
      );
    }

    const hasUpload = availablePickerTypes.includes('upload');
    const nullstateBtnProps = hasUpload
      ? { text: 'UPLOAD', onClick: () => toggleContentView('upload') }
      : undefined;
    const nullstateText = hasUpload
      && 'Click upload button to add content';
    if (items.length === 0 && isLoaded) {
      return (
        <div className={classes['folderNullStateContainer']}>
          <NullState
            imgProps={{
              src: 'https://static.veritone.com/veritone-ui/no-files-folders.svg',
              alt: 'No files'
            }}
            titleText='No files here'
            btnProps={nullstateBtnProps}
            inWidgets
          >
            {nullstateText}
          </NullState>
        </div>
      );
    }

    if (items.length === 0 && isLoading) {
      return (
        <div className={classes['folderNullStateContainer']}>
          <LoadingState />
        </div>
      )
    }

    const selectedItems = items.filter(item => highlightedItems[item.id]);
    const mediaPanelEnabled = showMediaInfoPanel && !!selectedItems.length && viewType === 'list';

    return (
      <Paper className={classes['folderPaper']}>
        <div className={classes['folderViewContainer']}>
          <div className={cx(
            classes['folderViewContent'],
            {
              [`${classes['panelOpen']}`]: mediaPanelEnabled
            }
          )}>
            <InfiniteWrapper
              isLoading={isLoading}
              triggerPagination={triggerPagination}
              ref={this.scrollRef}
            >
              {
                viewType === 'list' ?
                  (
                    <FolderListView
                      items={items}
                      onHighlightItem={this.onHighlightItem}
                      onSelectItem={this.handleOnSelectItem}
                      highlightedItems={highlightedItems}
                      isAcceptedType={this.isAcceptedType}
                    />
                  ) : (
                    <FolderGridView
                      items={items}
                      onHighlightItem={this.onHighlightItem}
                      onSelectItem={this.handleOnSelectItem}
                      highlightedItems={highlightedItems}
                      isAcceptedType={this.isAcceptedType}
                    />
                  )
              }
            </InfiniteWrapper>
          </div>
          {mediaPanelEnabled && (
            <MediaInfoPanel
              open={mediaPanelEnabled}
              playerRef={this.playerRef}
              onPlayerRefReady={this.onPlayerRefReady}
              selectedItems={selectedItems}
              toggleMediaInfoPanel={toggleMediaInfoPanel}
              width={300}
            />
          )}
        </div>
        <FilePickerFooter
          title='Open'
          onCancel={onCancel}
          disabled={this.noneHighligthedItem(highlightedItems)}
          onSubmit={this.onSubmit}
          hasIntercom={isFullScreen}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(FolderViewContainer);
