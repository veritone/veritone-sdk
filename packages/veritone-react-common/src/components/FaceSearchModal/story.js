import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';
import { FaceSearchModal, FaceSearchForm } from './index';

storiesOf('FaceSearchModal', module)
  .add('withOpenDialogAndDefaultValue', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <FaceSearchModal
        open={boolean('Open', true)}
        modalState={object('Search condition state', { queryResults: [] })}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => (
    <FaceSearchForm
      modalState={object('Search condition state', { queryResults: [] })}
    />
  ));
