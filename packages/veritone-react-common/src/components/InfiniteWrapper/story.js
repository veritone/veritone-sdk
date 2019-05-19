import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import InfiniteWrapper from './';

const itemsArray = new Array(10).fill(0).map((_, i) => i);

const ItemComponent = () => <div style={{ height: 50, marginTop: 5, background: 'lightgrey'}} />;
const LoadingComponent = () => <div>Loading..</div>

storiesOf('InfiniteWrapper', module)
  .add('Basic', () => (
    <InfiniteWrapper isLoading={boolean('isLoading', false)} loadingComponent={<LoadingComponent />} triggerPagination={action('triggerPagination')}>
      {
        itemsArray.map(item => <ItemComponent key={item} />)
      }
    </InfiniteWrapper>
  ))
