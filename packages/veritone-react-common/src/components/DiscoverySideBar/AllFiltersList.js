import React from 'react';
import { func, shape, arrayOf, string, number } from 'prop-types';

import styles from './styles/filtersList.scss';
import FiltersListItem from './FiltersListItem';

export default class AllFiltersList extends React.Component {
  static propTypes = {
    onClearAllFilters: func.isRequired,
    onClearFilter: func.isRequired,
    filters: arrayOf(
      shape({
        label: string.isRequired,
        number: number,
        id: string.isRequired
      })
    )
  };

  static defaultProps = {
    filters: []
  };

  handleClearAllFilters = e => {
    e.preventDefault();
    this.props.onClearAllFilters();
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <span className={styles.header}>Your Selections</span>
          <a
            className={styles.clearLink}
            onClick={this.handleClearAllFilters}
            href="#"
          >
            Clear all
          </a>
        </div>

        <div className={styles.filtersContainer}>
          {this.props.filters.map(filter => (
            <FiltersListItem
              key={filter.id}
              onClearFilter={this.props.onClearFilter}
              {...filter}
            />
          ))}
        </div>
      </div>
    );
  }
}
