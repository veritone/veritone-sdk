import React from 'react';
import { func, shape, arrayOf, string, number } from 'prop-types';
import { withStyles } from 'helpers/withStyles';
import styles from './styles/filtersList';
import FiltersListItem from './FiltersListItem';

const classes = withStyles(styles);
class AllFiltersList extends React.Component {
  static propTypes = {
    onClearAllFilters: func.isRequired,
    onClearFilter: func.isRequired,
    filters: arrayOf(
      shape({
        label: string.isRequired,
        number: number,
        id: string.isRequired
      })
    ),
    
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
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <span className={classes.header}>Your Selections</span>
          <a
            className={classes.clearLink}
            onClick={this.handleClearAllFilters}
            href="#"
          >
            Clear all
          </a>
        </div>

        <div className={classes.filtersContainer}>
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

export default AllFiltersList;
