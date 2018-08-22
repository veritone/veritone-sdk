import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import Lightbox from './';

const dummyData = { value: 'this is a test' };
storiesOf('Share Components', module).add('Lightbox', () => {
  return (
    <Lightbox
      fullscreen
      data={dummyData}
      open={boolean('open', true)}
      onClose={action('on close')}
      onBackdropClick={action('back drop clicked')}
      onCloseButtonClick={action('close button clicked')}
    >
      <img src="https://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg" />
    </Lightbox>
  );
});
