import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import { TimeSearchModal, TimeSearchForm } from './index';

storiesOf('TimeSearchModal', module)
  .add('withOpenDialogAndDefaultValue', () => {
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <TimeSearchModal
        open={boolean('Open', true)}
        cancel={cancel}
        applyFilter={logFilter}
      />
    );
  })
  .add('withoutDialog', () => {
    const input = {
      dayPartStartTime: '01:02',
      dayPartEndTime: '03:04',
      stationBroadcastTime: false,
      selectedDays: [true, true, true, true, true, true, true],
    };
    const logFilter = value => console.log('filter value', value);
    const cancel = () => console.log('cancel pressed');
    return (
      <TimeSearchForm
        open={boolean('Open', true)}
        cancel={cancel}
        inputValue={input}
        applyFilter={logFilter}
      />
    );
  });
