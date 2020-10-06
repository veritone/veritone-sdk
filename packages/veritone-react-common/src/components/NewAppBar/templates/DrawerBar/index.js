import React from 'react';
import { bool, string, func, oneOfType, element, arrayOf } from 'prop-types';
import { makeStyles } from '@material-ui/styles';

import Drawer from '@material-ui/core/Drawer';
import { Box } from '@material-ui/core';
import styles from './styles';

const useStyles = makeStyles(styles);

function DrawerContainer({
  open,
  anchor = 'right',
  onClose,
  children
}) {
  const classes = useStyles();
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      ModalProps={{
        BackdropProps: {
          classes: {
            root: classes.backDropRoot
          }
        }
      }}
      classes={{
        root: classes.drawerContainer,
        paper: classes.paperContainer,
      }}
      className={classes.drawerContainer}
    >
      <Box className={classes.content}>
        {children}
      </Box>
    </Drawer>
  )
}

DrawerContainer.propTypes = {
  open: bool,
  anchor: string,
  onClose: func,
  children: oneOfType([element, arrayOf([element])])
};

export default DrawerContainer;
