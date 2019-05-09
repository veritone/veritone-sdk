import React from 'react';
import InfiniteDirectoryList from 'components/InfiniteDirectoryList';

const addingItems = [
  { id: '1', type: 'Folder', date: 'Mar 29, 2019 3:34 PM', name: 'A folder' },
  { id: '2', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'An audio.mp3' },
  { id: '3', type: 'video/mp4', date: 'Mar 29, 2019 3:34 PM', name: 'Game of thrones.mp4' },
  { id: '4', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'City of stars.mp3' },
  { id: '5', type: 'doc', date: 'Mar 29, 2019 3:34 PM', name: 'maps.xml' },
  { id: '6', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'An audio.mp3' },
  { id: '7', type: 'video/mp4', date: 'Mar 29, 2019 3:34 PM', name: 'Game of thrones.mp4' },
  { id: '8', type: 'audio/mp3', date: 'Mar 29, 2019 3:34 PM', name: 'City of stars.mp3' },
  { id: '9', type: 'doc', date: 'Mar 29, 2019 3:34 PM', name: 'maps.xml' },
  { id: '10', type: 'doc', date: 'Mar 29, 2019 3:34 PM', name: 'maps.xml' },
]

export default class Home extends React.Component {
  static propTypes = {};

  state = {
    items: [],
    finishedLoading: false,
  }

  count = 0

  onMount = () => {
    setTimeout(() => {
      this.setState(({ items }) => ({
        items: [
          ...items,
          ...addingItems
        ],
      }));
      this.count += 1;
    })
  }

  onLoadMore = () => {
    setTimeout(() => {
      this.count += 1;
      this.setState(({ items }) => ({
        items: [
          ...items,
          ...addingItems.map((item, index) => ({
            ...item,
            id: `${this.count * 10 + index}`
          }))
        ],
        finishedLoading: this.count === 5,
      }));
    }, 3000)
  }

  onHighlightItem = (event) => {
    const id = event.currentTarget.dataset.id;
    this.setState(({ items }) => ({
      items: items.map(item => {
        if (item.id !== id) {
          return {
            ...item,
            selected: false
          }
        }
        return {
          ...item,
          selected: !item.selected
        }
      })
    }))
  }

  onSelectItem = (event) => {
    console.log(event.currentTarget.dataset);
  }

  render() {
    const { items, finishedLoading } = this.state;
    return (
      <InfiniteDirectoryList
        files={items}
        headers={['Name', 'Date', 'Type']}
        onMount={this.onMount}
        loadMore={this.onLoadMore}
        onHighlightItem={this.onHighlightItem}
        onSelectItem={this.onSelectItem}
        finishedLoading={finishedLoading}
      />
    );
  }
}
