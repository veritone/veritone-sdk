import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import DatasetAdder, { DatasetAdderWidget } from './index';

storiesOf('Dataset Adder', module)
  .add('Base', () => {
    const props = {
      label: 'this is a test',
      tdoIds: ['1111', '2222']
    };

    return (
    <BaseStory 
      widget={DatasetAdderWidget} 
      widgetProps={props}
      componentProps={props}
      componentClass={DatasetAdder}
    />);
  });
