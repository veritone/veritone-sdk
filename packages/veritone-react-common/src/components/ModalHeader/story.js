import React from 'react';
import { storiesOf } from '@storybook/react';
import cx from 'classnames';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import styles from './styles';

import ModalHeader from './';

const useStyles = makeStyles(styles);

storiesOf('ModalHeader', module).add('Base', () => React.createElement(() => {
  const classes = useStyles();
  return (
    <ModalHeader
      title={'Fullscreen'}
      icons={[
        <IconButton aria-label="help" key={1}>
          <Icon className={cx('icon-help2', classes.icon)} />
        </IconButton>,
        <IconButton aria-label="menu" key={2}>
          <Icon className={cx('icon-more_vert', classes.icon)} />
        </IconButton>,
        <IconButton aria-label="trash" key={3}>
          <Icon className={cx('icon-trash', classes.icon)} />
        </IconButton>,
        <span className={cx(classes.separator, classes.icon)} key={4} />,
        <IconButton aria-label="exit" key={5}>
          <Icon className={cx('icon-close-exit', classes.icon)} />
        </IconButton>
      ]}
    />
  )
}));
