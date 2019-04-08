import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import EngineOutputHeader from './';

storiesOf('EngineOutputHeader', module)
  .add('Base', () => {
    let engines = [
      {
        name: 'My test engine',
        id: '1234-5678-9876',
        category: {
          categoryType: 'dummy'
        }
      },
      {
        name: 'My test engine 2',
        id: '0987-6543-1234',
        category: {
          categoryType: 'dummy'
        }
      }
    ];

    return (
      <EngineOutputHeader
        title="Test title"
        engines={engines}
        onExpandClick={action('onExpandClick')}
        onEngineChange={action('onEngineChange')}
      />
    );
  })
  .add('With child selects', () => {
    let engines = [
      {
        name: 'My test engine',
        id: '1234-5678-9876'
      },
      {
        name: 'My test engine 2',
        id: '0987-6543-1234'
      }
    ];

    return (
      <EngineOutputHeader
        title="Test title"
        engines={engines}
        onExpandClick={action('onExpandClick')}
        onEngineChange={action('onEngineChange')}
      >
        <Select value="test1">
          <MenuItem value="test1">Test 1</MenuItem>
          <MenuItem value="test2">Test 2</MenuItem>
        </Select>
      </EngineOutputHeader>
    );
  });
