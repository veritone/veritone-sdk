import React from 'react';
import { oneOf, arrayOf, func, bool, string } from 'prop-types';
import cx from 'classnames';
import { get, isArray } from 'lodash';

import Paper from '@material-ui/core/Paper';
import Refresh from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';

import FilePickerFooter from '../../FilePicker/FilePickerFooter';
import InfiniteWrapper from '../InfiniteWrapper';
import NullState from '../../NullState';
import MediaInfoPanel from '../MediaInfoPanel';
import itemShape from './itemShape';

import FolderListView from './FolderListView';
import FolderLoading from './FolderLoading'
import FolderGridView from './FolderGridView';
import styles from './styles.scss';

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
    onError: func
  }

  static defaultProps = {
    items: [],
    selectedItems: [],
    availablePickerTypes: []
  }

  state = {
    highlightedItems: {},
  }

  componentDidMount() {
    this.props.triggerPagination();
    document.addEventListener('keydown', this.handleArrowKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleArrowKey);
  }

  handleArrowKey = (event) => {
    const eventKeyCode = event.keyCode;
    const { lastIndex = 0, shiftIndex, highlightedItems } = this.state;
    if (this.noneHighligthedItem(highlightedItems)) {
      return;
    }
    if (eventKeyCode === 38 && lastIndex !== 0) {
      event.preventDefault();
      if (event.shiftKey) {
        const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
        const shiftHighlightIndex = Math.max(currentIndex - 1, 0);
        this.onShiftHighlight(shiftHighlightIndex);
        this.needScrollIntoView(shiftHighlightIndex);
      } else {
        const currentIndex = Math.max((lastIndex || 0) - 1, 0);
        this.onHighlight(parseInt(currentIndex, 10));
        this.needScrollIntoView(currentIndex);
      }
    }

    const { items } = this.props;
    if (eventKeyCode === 40 && lastIndex !== items.length - 1) {
      event.preventDefault();
      if (event.shiftKey) {
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
    const { index } = Object.assign({}, event.currentTarget.dataset);
    const holdingShift = event.shiftKey;
    const holdingCtrl = event.ctrlKey;
    if (!holdingShift && !holdingCtrl) {
      this.onHighlight(parseInt(index, 10));
    }
    if (holdingCtrl) {
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
    if (isArray(supportedFormats) && itemType) {
      const category = itemType.split('/')[0];
      return supportedFormats.includes(itemType) || supportedFormats.includes(`${category}/*`);
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
      toggleContentView
    } = this.props;

    const { highlightedItems } = this.state;

    if (isError) {
      return (
        <Paper>
          <div className={styles['folder-null-state-container']}>
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
    const nullstateBtnProps = hasUpload && {
      text: 'UPLOAD',
      onClick: () => toggleContentView('upload')
    };
    const nullstateText = hasUpload
      && 'Click upload button to add content';
    if (items.length === 0 && isLoaded) {
      return (
        <Paper>
          <div className={styles['folder-null-state-container']}>
            <NullState
              imgProps={{
                src: 'https://static.veritone.com/veritone-ui/no-files-folders.svg',
                alt: 'No files'
              }}
              titleText='No files here'
              btnProps={nullstateBtnProps}
              inWidgets
            >
              { nullstateText }
            </NullState>
          </div>
        </Paper>
      );
    }

    if (items.length === 0 && isLoading) {
      return (
        <Paper>
          <div className={styles['folder-null-state-container']}>
            <LoadingState />
          </div>
        </Paper>
      )
    }

    const selectedItems = items.filter(item => highlightedItems[item.id]);

    return (
      <Paper>
        <div className={styles['folder-view-container']}>
          <div className={cx(
            styles['folder-view-content'],
              {
                [`${styles['panel-open']}`]: viewType === 'list' && selectedItems.length
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
          { !!selectedItems.length && viewType === 'list' && (
            <MediaInfoPanel
              open
              playerRef={this.playerRef}
              onPlayerRefReady={this.onPlayerRefReady}
              selectedItems={selectedItems}
              width={300}
            />
          )}
        </div>
        <FilePickerFooter
          title='Open'
          onCancel={onCancel}
          disabled={this.noneHighligthedItem(highlightedItems)}
          onSubmit={this.onSubmit}
        />
      </Paper>
    )
  }
}

export default FolderViewContainer;
