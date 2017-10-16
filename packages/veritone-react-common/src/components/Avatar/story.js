import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { number } from '@storybook/addon-knobs';

import Avatar from './';

storiesOf('Avatar', module)
  .add('Base', () => <Avatar src="http://placekitten.com/g/400/300" />)
  .add('Custom size', () => {
    const size = number('Size', 75);

    return (
      <div>
        Size: {size}
        <hr />
        <Avatar src="http://placekitten.com/g/400/300" size={size} />
        <Avatar
          src="http://placekitten.com/g/400/300"
          label="Change"
          size={size}
        />
      </div>
    );
  })
  .add('Label', () => (
    <div>
      <Avatar src="http://placekitten.com/g/400/300" label="Change" />
      <Avatar src="http://placekitten.com/g/400/300" label="Hi Mom" />
      <Avatar
        src="http://placekitten.com/g/400/300"
        label="Change Avatar"
        size={200}
      />
    </div>
  ))
  .add('Weird image sizes', () => (
    <div>
      <Avatar
        src="http://placekitten.com/g/400/800"
        label="Change Avatar"
        size={400}
      />
      <Avatar src="http://placekitten.com/g/800/400" size={300} />
      <Avatar
        src="http://placekitten.com/g/800/400"
        label="Change Avatar"
        size={200}
      />
      <Avatar
        src="http://placekitten.com/g/400/800"
        label="Change"
        size={100}
      />
    </div>
  ))
  .add('Click actions', () => (
    <Avatar
      src="http://placekitten.com/g/400/800"
      label="Change Avatar"
      size={400}
      onClick={action('clicked avatar')}
    />
  ));
