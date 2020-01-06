import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import SearchPill from './';

const onClick = function () {
  console.log('Clicked on the search pill');
};
const onDelete = function () {
  console.log('Delete the pill');
};

storiesOf('SearchPill', module)
  .add('Search Pill', () => {
    const exclude = boolean('exclude');
    const selected = boolean('selected');
    const highlighted = boolean('highlighted');
    const disabled = boolean('disabled');

    return (
      <SearchPill
        selected={selected}
        exclude={exclude}
        highlighted={highlighted}
        engineCategoryIcon={'icon-transcription'}
        label={'hello'}
        onClick={onClick}
        onDelete={onDelete}
        disabled={disabled}
      />
    );
  })
  .add('without delete', () => {
    return (
      <SearchPill
        exclude={false}
        engineCategoryIcon={'icon-transcription'}
        label={'hello'}
        onClick={onClick}
      />
    );
  });
