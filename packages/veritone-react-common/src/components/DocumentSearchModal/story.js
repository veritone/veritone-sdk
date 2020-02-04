import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';
import { DocumentSearchModal, DocumentSearchForm } from './index';

storiesOf('DocumentSearchModal', module)
  .add('withOpenDialogAndDefaultValue', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <DocumentSearchModal
        open={boolean('Open', true)}
        modalState={object('Search condition state', { value: 'Lakers' })}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => <DocumentSearchForm defaultValue={'lakers'} />);
