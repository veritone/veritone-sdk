import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';

import { SentimentSearchModal, SentimentSearchForm } from './index';

storiesOf('SentimentSearchModal', module)
  .add('withOpenDialog', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <SentimentSearchModal
        open={boolean('Open', true)}
        modalState={object('Search condition state', { value: 'Positive' })}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => <SentimentSearchForm />);
