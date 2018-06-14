import React from 'react';
import { noop } from 'lodash';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import { EngineSelectionWidget } from './';

storiesOf('EngineSelectionWidget', module)
  .add('Base', () => {
    const props = {
      onSave: noop,
      onCancel: noop
    };

    return <BaseStory widget={EngineSelectionWidget} widgetProps={props} />;
  })
  .add('With initial selected engines', () => {
    const props = {
      onSave: noop,
      onCancel: noop,
      initialSelectedEngineIds: ['033563f9-2a6c-47fc-bfba-40dfabcef736']
    };

    return <BaseStory widget={EngineSelectionWidget} widgetProps={props} />;
  })
  .add('With all engines selected by default (opt out)', () => {
    const props = {
      onSave: noop,
      onCancel: noop,
      allEnginesSelected: true
    };

    return <BaseStory widget={EngineSelectionWidget} widgetProps={props} />;
  })
  .add('With initial deselected engines (opt out)', () => {
    const props = {
      onSave: noop,
      onCancel: noop,
      allEnginesSelected: true,
      initialDeselectedEngineIds: ['033563f9-2a6c-47fc-bfba-40dfabcef736']
    };

    return <BaseStory widget={EngineSelectionWidget} widgetProps={props} />;
  });
