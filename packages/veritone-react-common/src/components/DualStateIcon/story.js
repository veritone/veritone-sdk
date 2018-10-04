import React from 'react';
import { storiesOf } from '@storybook/react';
import styles from './story-styles.scss';
import DualStateIcon from './';

storiesOf('DualStateIcon', module).add('Base', () => (
  <DualStateIcon
    caption="Click Me"
    activeClass={styles.activeClass}
    inActiveClass={styles.inActiveClass}
  >
    <span className="icon-circlecheck" />
  </DualStateIcon>
));
