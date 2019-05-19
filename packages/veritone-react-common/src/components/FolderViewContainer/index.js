import React from 'react';
import { oneOf, arrayOf, func, bool } from 'prop-types';

import { CircularProgress } from '@material-ui/icons';

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
    viewType: oneOf('list', 'gird'),
    items: arrayOf(itemShape),
    onSelectItem: func,
    isLoading: bool,
    isLoaded: bool,
    isError: bool,
    triggerPagination: func
  }

  state = {
    highlightedItems: {}
  }

  componentDidMount() {
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
      if (event.shiftKey) {
        const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
        this.onShiftHighlight(Math.max(currentIndex - 1, 0));
      } else {
        const currentIndex = Math.max((lastIndex || 0) - 1, 0);
        this.onHighlight(parseInt(currentIndex, 10));
      }
      event.preventDefault();
    }

    if (eventKeyCode === 40) {
      const { items } = this.props;
      const currentIndex = isNaN(shiftIndex) ? lastIndex : shiftIndex;
      if (event.shiftKey) {
        this.onShiftHighlight(Math.min(currentIndex + 1, items.length - 1));
      } else {
        const currentIndex = Math.min((lastIndex || 0) + 1, items.length - 1);
        this.onHighlight(currentIndex);
      }
    }
    event.preventDefault();
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

  }

  onCancel = () => {

  }

  render() {
    const {
      isLoading,
      isLoaded,
      isError,
      viewType,
      items,
      triggerPagination,
      onSelectItem
    } = this.props;

    if (isError) {
      return <ErrorState />;
    }

    if (items.length === 0 && isLoaded) {
      return <NullState />;
    }

    if (items.length === 0 && isLoading) {
      return <LoadingState />;
    }

    return (
      <div>
        <div className={styles['folder-view-container']}>
          <InfiniteWrapper
            isLoading={isLoading}
            triggerPagination={triggerPagination}
          >
            {
              viewType==='list' ? (
                <FolderListView
                  items={items}
                  onHighlightItem={this.onHighlightItem}
                  onSelectItem={onSelectItem}
                  highlightedItems={this.state.highlightedItems}
                />
              ) : (
                <FolderGridView
                  items={items}
                  onHighlightItem={this.onHighlightItem}
                  onSelectItem={onSelectItem}
                />
              )
            }
          </InfiniteWrapper>
        </div>
        <FolderViewFooter
          title='Open'
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      </div>
    )
  }
}

export default FolderViewContainer;
