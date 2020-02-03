import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';

import { LogoSearchModal, LogoSearchForm } from './index';

storiesOf('LogoSearchModal', module)
  .add('withOpenDialogAndDefaultValue', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <LogoSearchModal
        open={boolean('Open', true)}
        modalState={object('Search condition state', { queryResults: [] })}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => (
    <LogoSearchForm
      modalState={object('Search condition state', { queryResults: [] })}
    />
  ));
