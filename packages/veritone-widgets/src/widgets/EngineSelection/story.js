import React from 'react';
import { noop } from 'lodash';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import { EngineSelectionWidget } from './';

storiesOf('EngineSelectionWidget', module).add('Base', () => {
  const props = {
    onSave: noop,
    onCancel: noop
  };

  return <BaseStory widget={EngineSelectionWidget} widgetProps={props} />;
});
