import React from 'react';
import { storiesOf } from '@storybook/react';
import InfiniteDropdownMenu from 'components/InfiniteDropdownMenu';

const fakeStaticOptions = [{
  name: 'name0',
  id: 0
}, {
  name: 'name1',
  id: 1
}, {
  name: 'name2',
  id: 2
}];

const getFieldOptions = query => {
  console.log('Executed Query');
  return Promise.resolve(fakeStaticOptions);
};

function logData(data) {
  console.log(data);
}

function customTrigger() {
  console.log('Fired custom trigger');
}

storiesOf('InfiniteDropdownMenu', module)
  .add('Empty', () => (
    <InfiniteDropdownMenu
      label="Empty"
      items={[]}
      handleSelectionChange={logData}
    />
  ))
  .add('Static List', () => (
    <InfiniteDropdownMenu
      label="Static List"
      items={fakeStaticOptions}
      handleSelectionChange={logData}
    />
  ))
  .add('Multiple List', () => (
    <InfiniteDropdownMenu
      label="Multiple List"
      multiple
      items={fakeStaticOptions}
      value={[1, 2]}
      handleSelectionChange={logData}
    />
  ))
  .add('Dynamic List', () => (
    <InfiniteDropdownMenu
      label="Dynamic List"
      handleSelectionChange={logData}
      loadNextPage={getFieldOptions}
    />
  ))
  .add('Custom Trigger', () => (
    <InfiniteDropdownMenu
      label="Custom Trigger"
      handleSelectionChange={logData}
      customTriggers={[{
        label: 'Click Me',
        trigger: customTrigger
      }]}
    /> 
  ))
  .add('Read Only', () => (
    <InfiniteDropdownMenu
      label="Read Only List"
      items={fakeStaticOptions}
      handleSelectionChange={logData}
      readOnly
    />
  ));
