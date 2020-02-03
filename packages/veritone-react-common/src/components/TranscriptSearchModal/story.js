import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';
import { TranscriptSearchModal, TranscriptSearchForm } from './index';

storiesOf('TranscriptSearchModal', module)
  .add('withOpenDialogAndDefaultValue', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <TranscriptSearchModal
        open={boolean('Open', true)}
        modalState={object('Search condition state', { value: 'Lakers' })}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => <TranscriptSearchForm defaultValue={'lakers'} />);
