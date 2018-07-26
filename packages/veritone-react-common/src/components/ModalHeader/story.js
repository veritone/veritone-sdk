import React from 'react';
import { storiesOf } from '@storybook/react';
import cx from 'classnames';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import styles from './styles.scss';

import ModalHeader from './';

storiesOf('ModalHeader', module).add('Base', () => (
  <ModalHeader
    title={'Fullscreen'}
    icons={[
      <IconButton aria-label="help" key={1}>
        <Icon className={cx('icon-help2', styles.icon)} />
      </IconButton>,
      <IconButton aria-label="menu" key={2}>
        <Icon className={cx('icon-more_vert', styles.icon)} />
      </IconButton>,
      <IconButton aria-label="trash" key={3}>
        <Icon className={cx('icon-trash', styles.icon)} />
      </IconButton>,
      <span className={cx(styles.separator, styles.icon)} key={4} />,
      <IconButton aria-label="exit" key={5}>
        <Icon className={cx('icon-close-exit', styles.icon)} />
      </IconButton>
    ]}
  />
));
