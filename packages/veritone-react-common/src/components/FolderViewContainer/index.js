import React from 'react';
import { oneOf, arrayOf, func, bool } from 'prop-types';

import { CircularProgress } from '@material-ui/core';

import InfiniteWrapper from '../InfiniteWrapper';
import itemShape from './itemShape';

import FolderListView from './FolderListView';
import FolderViewFooter from './FolderViewFooter';
import styles from './styles.scss';


const genArray = (a, b) => new Array(Math.max(a, b) - Math.min(a, b) + 1)
  .fill(0).map((_, i) => i + Math.min(a, b));


// Placehoder states
const NullState = () => <div>No file or folder</div>;
const ErrorState = () => <div>Error Loading data</div>;
const LoadingState = () => <CircularProgress size={200} />;
const FolderGridView = () => <div>Folder Grid View</div>

class FolderViewContainer extends React.Component {
  static propTypes = {
    viewType: oneOf(['list', 'gird']),
    items: arrayOf(itemShape),
    onSelectItem: func,
    isLoading: bool,
    isLoaded: bool,
    isError: bool,
    triggerPagination: func,
    selectedItems: arrayOf(itemShape),
    onCancel: func,
    onSubmit: func
  }

  static defaultProps = {
    items: [],
    selectedItems: []
  }

  state = {
    highlightedItems: {}
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
    if (eventKeyCode === 38) {
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

    if (eventKeyCode === 40) {
      const { items } = this.props;
      event.preventDefault();
      if (event.shiftKey) {
        const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
        const shiftHighlightIndex = Math.min(currentIndex + 1, items.length - 1);
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
    } =  this.scrollRef.current.getViewWindow();
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
    this.setState({
      highlightedItems: {
        [itemId]: true
      },
      lastIndex: index,
      shiftIndex: index
    });
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
      }))
    }
    if (holdingShift) {
      this.onShiftHighlight(parseInt(index, 10));
    }
  }

  onSubmit = () => {
    const { highlightedItems } = this.state;
    this.props.onSubmit(Object.keys(highlightedItems)
      .filter(key => highlightedItems[key]))
  }

  scrollRef = React.createRef();

  render() {
    const {
      isLoading,
      isLoaded,
      isError,
      viewType,
      items,
      triggerPagination,
      onSelectItem,
      onCancel
    } = this.props;

    const { highlightedItems } = this.state;

    if (isError) {
      return <ErrorState />;
    }

    if (items.length === 0 && isLoaded) {
      return <NullState />;
    }

    if (items.length === 0 && isLoading) {
      return <LoadingState />
    }

    return (
      <div>
        <div className={styles['folder-view-container']}>
          <InfiniteWrapper
            isLoading={isLoading}
            triggerPagination={triggerPagination}
            ref={this.scrollRef}
          >
            {
              viewType==='list' ? (
                <FolderListView
                  items={items}
                  onHighlightItem={this.onHighlightItem}
                  onSelectItem={onSelectItem}
                  highlightedItems={highlightedItems}
                />
              ) : (
                <FolderGridView
                  items={items}
                  onHighlightItem={this.onHighlightItem}
                  onSelectItem={onSelectItem}
                  highlightedItems={highlightedItems}
                />
              )
            }
          </InfiniteWrapper>
        </div>
        <FolderViewFooter
          title='Open'
          onSubmit={this.onSubmit}
          onCancel={onCancel}
          disabled={this.noneHighligthedItem(highlightedItems)}
        />
      </div>
    )
  }
}

export default FolderViewContainer;
