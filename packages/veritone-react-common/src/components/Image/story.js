import React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from '@storybook/addon-knobs';

import Image from './';

storiesOf('Image', module)
  .add('Base', () => <Image src="http://placekitten.com/g/400/300" />)
  .add('Custom width and height', () => {
    const height = number('Height', 75);
    const width = number('Width', 100);

    return (
      <div>
        Width: {width}
        Height: {height}
        <hr />
        <Image
          src="http://placekitten.com/g/400/300"
          width={width}
          height={height}
        />
        <Image
          src="http://placekitten.com/g/400/300"
          label="Change"
          width={width}
          height={height}
        />
      </div>
    );
  })
  .add('Label', () => (
    <div>
      <Image src="http://placekitten.com/g/400/300" label="Change" />
      <Image src="http://placekitten.com/g/400/300" label="Hi Mom" />
      <Image
        src="http://placekitten.com/g/400/300"
        label="Change Image"
        width={300}
        height={200}
      />
    </div>
  ))
  .add('Cover and Contain', () => (
    <div>
      <Image
        src="http://placekitten.com/g/400/300"
        label="Cover"
        width={300}
        height={200}
        type="cover"
      />
      <Image
        src="http://placekitten.com/g/400/300"
        label="Change Image"
        width={300}
        height={200}
        type="contain"
      />
    </div>
  ));
