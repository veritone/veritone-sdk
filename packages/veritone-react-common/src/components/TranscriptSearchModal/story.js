import React from 'react';
import { storiesOf } from '@storybook/react';
import { TranscriptSearchModal } from './';
import { TranscriptSearchForm } from './';

storiesOf('TranscriptSearchModal', module).add('Base', () => {
  const logFilter = value => console.log('filter value', value);
  const cancel = () => console.log("cancel prssed");

  return (
    <TranscriptSearchModal
      open
      modalState={{ "value": 'Lakers' }}
      cancel={ cancel }
      applyFilter={logFilter}
    />
  );
}).add( 'PureComponent', () => {
  //const formValued = formValue("lakers");
  return (
    <TranscriptSearchForm
      defaultValue={"lakers"}
    />
  );
});
