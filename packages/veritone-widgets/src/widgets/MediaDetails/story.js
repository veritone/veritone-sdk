import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import BaseStory from '../../shared/BaseStory';
import MediaDetailsPage from './';

storiesOf('MediaDetailsPage', module).add('Base', () => {
  const props = {
    mediaId: text('TDO ID (set before toggling to widget)', 390244252),
    onRunProcess: function() {
      alert('Fake run process');
    },
    onClose: function() {
      console.log('Widget for Media Details onClose clicked.');
    }
  };
  return <BaseStory widget={MediaDetailsPage} widgetProps={props} />;
});
