import React from 'react';
import { func, arrayOf, string, shape } from 'prop-types';
import { without } from 'lodash';
import LibCheckbox from 'material-ui/Checkbox';

import styles from '../styles.scss';

class CategoriesFilter extends React.Component {
  static props = {
    filters: shape({
      category: arrayOf(string).isRequired
    }).isRequired,
    filterBy: func.isRequired
  };

  addCategory = category => {
    this.props.filterBy({
      type: 'category',
      value: [...this.props.filters.category, category]
    });
  };

  removeCategory = category => {
    this.props.filterBy({
      type: 'category',
      value: without(this.props.filters.category, category)
    });
  };

  handleOnClick = category => {
    if (
      this.props.filters.category &&
      this.props.filters.category.includes(category)
    ) {
      this.removeCategory(category);
    } else {
      this.addCategory(category);
    }
  };

  render() {
    const categories = [
      'Object Detection',
      'Fingerprint',
      'Geolocation',
      'Translate',
      'Human',
      'Text Recognition',
      'Logo Recognition',
      'Transcription',
      'Facial Detection',
      'Audio Detection',
      'Music Detection'
    ];

    return (
      <div className={styles.filterContainer}>
        <div className={styles.title}>Categories</div>
        <div>
          {categories.map(category => (
            <div key={category}>
              <div className={styles.inlineFilter}>
                <LibCheckbox
                  classes={{ default: styles.checkbox }}
                  checked={this.props.filters.category.includes(category)}
                  onClick={() => this.handleOnClick(category)}
                />
                {category}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default {
  label: 'Categories',
  id: 'categories',
  component: CategoriesFilter
};
