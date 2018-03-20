import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import FaceDetectionOuput from './';


// TODO: Still need to implement this.
storiesOf('FaceDetectionOutput', module)
  .add('Base', () => {
    return (
      <FaceDetectionOuput
        classes={{ root: styles.outputViewRoot }}
      />
    )
  });