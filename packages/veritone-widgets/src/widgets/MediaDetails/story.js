import React from 'react';
import { storiesOf } from '@storybook/react';
import BaseStory from '../../shared/BaseStory';
import MediaDetailsPage from './';

storiesOf('MediaDetailsPage', module).add('Base', () => {
  const props = {
    mediaId: 360471470,
    onClose: function() {
      console.log('Widget for Media Details onClose clicked.');
    }
  };
  return <BaseStory widget={MediaDetailsPage} widgetProps={props} />;
});
