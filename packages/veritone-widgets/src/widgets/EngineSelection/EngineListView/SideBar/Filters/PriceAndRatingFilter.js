import React from 'react';
import { func, objectOf, any } from 'prop-types';
import { capitalize } from 'lodash';
import TextField from 'material-ui/TextField';
import Radio from 'material-ui/Radio';
import { StarRating } from 'veritone-react-common';
import { blue } from 'material-ui/colors';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

import styles from '../styles.scss';

class PriceAndRatingFilter extends React.Component {
  static props = {
    filters: objectOf(any).isRequired,
    filterBy: func.isRequired
  };

  handleChange = event => {
    const range = [0, 1, 2, 3, 4, 5];
    this.props.filterBy({
      type: 'rating',
      value: range.slice(event.target.value)
    });
  };

  renderRatingSection = () => (
    <div className={styles.filterContainer}>
      <div className={styles.title}>Rating</div>
      {[4, 3, 2, 1].map(rating => (
        <div className={styles.inlineFilter} key={rating}>
          <Radio
            classes={{ default: styles.radio }}
            checked={this.props.filters.rating[0] === rating}
            onChange={this.handleChange}
            value={rating}
            aria-label={rating}
          />
          <StarRating rating={rating} />
          & Up
        </div>
      ))}
    </div>
  );

  renderPriceSection = () => (
    <div className={styles.filterContainer}>
      <div className={styles.title}>Price (per media hour)</div>
      <div style={{ padding: '10px 0' }}>
        <Range
          min={0}
          max={20}
          allowCross={false}
          step={0.05}
          defaultValue={[0, 20]}
          trackStyle={[
            {
              backgroundColor: blue[500]
            }
          ]}
          handleStyle={[
            {
              borderColor: blue[500],
              backgroundColor: blue[500]
            }
          ]}
          tipFormatter={value => `$ ${value.toFixed(2)}`}
        />
      </div>
    </div>
  );

  render() {
    return (
      <div>
        {this.renderPriceSection()}
        {this.renderRatingSection()}
      </div>
    );
  }
}

export default {
  label: 'Price & Rating',
  id: 'priceAndRating',
  component: PriceAndRatingFilter
};
