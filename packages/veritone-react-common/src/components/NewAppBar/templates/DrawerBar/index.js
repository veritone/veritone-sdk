/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles';

import Drawer from '@material-ui/core/Drawer';
import { Box } from '@material-ui/core';
import styles from './styles'
const useStyles = makeStyles(styles);

function DrawerContainer({
  open,
  anchor = 'right',
  onClose,
  tabList,
  tabComponent
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
        Content
      </Box>
    </Drawer>
  )
}

DrawerContainer.propTypes = {
}

export default DrawerContainer;
