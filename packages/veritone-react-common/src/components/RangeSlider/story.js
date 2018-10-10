import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import RangeSlider from './';

storiesOf('RangeSlider', module)
  .add('Single', () => {
    return (
      <RangeSlider
        showValues
        value={number('initial value', 50)}
        suffix={text('suffix', '%')}
        onRelease={
          boolean('release callback', true) ? action('released') : undefined
        }
        onSliderChange={
          boolean('slider change callback', false)
            ? action('slider changed')
            : undefined
        }
      />
    );
  })
  .add('Dual', () => {
    return (
      <RangeSlider
        dual
        onRelease={
          boolean('release callback', true) ? action('released') : undefined
        }
        onSliderChange={
          boolean('slider change callback', false)
            ? action('slider changed')
            : undefined
        }
      />
    );
  })
  .add('prefix - suffix', () => {
    return (
      <RangeSlider
        dual
        showValues
        prefix={text('prefix', '$')}
        suffix={text('suffix', '%')}
        onRelease={
          boolean('release callback', true) ? action('released') : undefined
        }
        onSliderChange={
          boolean('slider change callback', false)
            ? action('slider changed')
            : undefined
        }
      />
    );
  })
  .add('Dual with initial values', () => {
    return (
      <RangeSlider
        dual
        min={number('min', 10)}
        max={number('max', 200)}
        lowerValue={number('lower value', 20)}
        upperValue={number('upper value', 60)}
        numDecimalDigits={number('num decimal digits', 0)}
        showValues={boolean('show values', true)}
        onRelease={
          boolean('release callback', true) ? action('released') : undefined
        }
        onSliderChange={
          boolean('slider change callback', false)
            ? action('slider changed')
            : undefined
        }
      />
    );
  });
