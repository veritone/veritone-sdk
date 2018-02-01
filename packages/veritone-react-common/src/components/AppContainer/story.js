import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { range } from 'lodash';
import Drawer from 'material-ui/es/Drawer';
import List from 'material-ui/es/List';

import AppBar from '../AppBar';
import AppFooter from '../AppFooter';
import styles from './story.styles.scss';
import AppContainer from '.';

storiesOf('AppContainer', module).add('Base', () => {
  const open = boolean('Sidebar Open', true);
  return (
    <Fragment>
      <AppBar />
      <Drawer type="persistent" style={{ width: 240 }} open={open}>
        <List
          style={{
            width: 240
          }}
        />
      </Drawer>
      <AppContainer
        appBarOffset
        appFooterOffset="short"
        leftOffset={open ? 240 : undefined}
        classes={{
          inner: styles.container
        }}
      >
        <div style={{ maxWidth: 960 }}>
          {range(100).map(i => (
            <span key={i}>
              {i}. This is the body content. Notice that the scrolling container
              is correct.{' '}
            </span>
          ))}
        </div>
      </AppContainer>
      <AppFooter>
        <span>&copy; Veritone, Inc. All Rights Reserved.</span>
      </AppFooter>
    </Fragment>
  );
});
