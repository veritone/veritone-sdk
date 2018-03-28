import React from 'react';
import { storiesOf } from '@storybook/react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import styles from './styles.scss';

import ModalHeader from './';

storiesOf('ModalHeader', module)
  .add('Base', () => (
    <ModalHeader
      title={'Fullscreen'}
      icons={[
        <IconButton className={styles.helpIcon} aria-label='help' key={1}>
          <Icon className='icon-help2' />
        </IconButton>,
        <IconButton className={styles.menuIcon} aria-label='menu' key={2}>
          <Icon className='icon-more_vert' />
        </IconButton>,
        <IconButton className={styles.trashIcon} aria-label='trash' key={3}>
          <Icon className='icon-trash' />
        </IconButton>,
        <span className={styles.separator} key={4} />,
        <IconButton className={styles.exitIcon} aria-label='exit' key={5}>
          <Icon className='icon-close-exit' />
        </IconButton>
      ]}
    />
  ))