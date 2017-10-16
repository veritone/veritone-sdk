import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import AppFooter from './';

storiesOf('AppFooter', module)
  .add('Empty', () => <AppFooter />)
  .add('Base (short)', () => (
    <AppFooter>
      <span>© 2017 Veritone, Inc. All Rights Reserved.</span>
      <a href="#terms">Terms of Use</a>
      <a href="#privacy">Privacy Policy</a>
    </AppFooter>
  ))
  .add('Base (tall)', () => (
    <AppFooter height="tall">
      <span>© 2017 Veritone, Inc. All Rights Reserved.</span>
      <a href="#terms">Terms of Use</a>
      <a href="#privacy">Privacy Policy</a>
    </AppFooter>
  ))
  .add('animated leftoffset', () => {
    let drawerIsOpen = boolean('Drawer Open', true);

    return (
      <AppFooter leftOffset={drawerIsOpen ? 240 : 0}>
        <span>© 2017 Veritone, Inc. All Rights Reserved.</span>
        <a href="#terms">Terms of Use</a>
        <a href="#privacy">Privacy Policy</a>
      </AppFooter>
    );
  });
