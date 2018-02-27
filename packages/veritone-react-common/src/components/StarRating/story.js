import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import StarRating from './';

const starRatingRowStyle = { display: 'flex', alignItems: 'center', margin: '10px 0' };

storiesOf('StarRating', module)
  .add('Base', () => (
    <div>
      <div style={starRatingRowStyle}>
        0 Star Rating: <StarRating />
      </div>
      <div style={starRatingRowStyle}>
        1 Star Rating: <StarRating rating={1} />
      </div>
      <div style={starRatingRowStyle}>
        2 Star Rating: <StarRating rating={2} />
      </div>
      <div style={starRatingRowStyle}>
        3 Star Rating: <StarRating rating={3} />
      </div>
      <div style={starRatingRowStyle}>
        4 Star Rating: <StarRating rating={4} />
      </div>
      <div style={starRatingRowStyle}>
        5 Star Rating: <StarRating rating={5} />
      </div>
    </div>
  ))
