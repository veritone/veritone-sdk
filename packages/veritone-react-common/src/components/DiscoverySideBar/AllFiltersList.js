import React from 'react';
import CloseIcon from 'material-ui-icons/Close';
import IconButton from 'material-ui/IconButton';
import { func, shape, arrayOf, string, number } from 'prop-types';

import styles from './styles/allFiltersList.scss';

export default class AllFiltersList extends React.Component {
  static propTypes = {
    onClearAllFilters: func,
    onClearItem: func,
    filters: arrayOf(
      shape({
        label: string.isRequired,
        number: number.isRequired,
        id: string.isRequired
      })
    )
  };
  static defaultProps = {
    filters: [
      {
        label: 'test 1',
        number: 5,
        id: '1'
      },
      {
        label: 'test 2',
        number: 1,
        id: '2'
      }
    ]
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <span className={styles.header}>Your Selections</span>
          <a
            className={styles.clearLink}
            onClick={this.props.onClearAllFilters}
            href="#"
          >
            Clear all
          </a>
        </div>

        <div className={styles.filtersContainer}>
          {this.props.filters.map(({ label, number, id }) => (
            <div className={styles.filterItem} key={id}>
              <IconButton
                classes={{ root: styles.clearButton }}
                onClick={this.props.onClearItem}
              >
                <CloseIcon />
              </IconButton>
              <a
                href="#"
                className={styles.filterItemLink}
                onClick={this.props.onClearItem}
              >
                {label} ({number})
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
