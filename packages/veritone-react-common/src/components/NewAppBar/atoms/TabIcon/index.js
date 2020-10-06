import React from 'react';
import { bool, string, func, oneOfType, number } from 'prop-types';
import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import styles from './styles';

const useStyles = makeStyles(styles);

function TabIcon({
  id,
  selected = false,
  icon,
  onClickTabIcon
}) {
  const classes = useStyles();
  function handleClickTabIcon() {
    onClickTabIcon && onClickTabIcon(id);
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingX="15px"
    >
      <IconButton
        className={`${classes.iconButton} ${selected ? classes.seleted : ""}`}
        onClick={handleClickTabIcon}
      >
        <img src={icon} draggable="false" />
      </IconButton>
    </Box>
  );
}

TabIcon.propTypes = {
  id: oneOfType([string, number]),
  selected: bool,
  icon: string,
  onClickTabIcon: func
};

export default TabIcon;

