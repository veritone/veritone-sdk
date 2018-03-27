import React from 'react';
import { storiesOf } from '@storybook/react';
import styles from './story.styles.scss';

import FaceDetectionOuput from './';

// TODO: Still need to implement this.
storiesOf('FaceDetectionOutput', module).add('Base', () => {
  return <FaceDetectionOuput classes={{ root: styles.outputViewRoot }} />;
});
