import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import DatasetLibrary, { DatasetLibraryWidget } from './index';

storiesOf('DatasetLibrary', module)
  .add('Base', () => {
    const props = {
      label: 'this is a test',
      tdoIds: ['1111', '2222']
    };

    return (
    <BaseStory 
      widget={DatasetLibraryWidget} 
      widgetProps={props}
      componentProps={props}
      componentClass={DatasetLibrary}
    />);
  });
