import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';
import { TagSearchModal, TagSearchForm } from './index';

storiesOf('TagSearchModal', module)
  .add('withOpenDialogAndDefaultValue', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <TagSearchModal
        open={boolean('Open', true)}
        modalState={object('Search condition state', { queryResults: [] })}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => (
    <TagSearchForm
      modalState={object('Search condition state', { queryResults: [] })}
    />
  ));
