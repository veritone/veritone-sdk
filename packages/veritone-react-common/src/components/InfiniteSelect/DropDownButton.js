import React from 'react';
import { bool, func } from 'prop-types';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

import IconButton from '@material-ui/core/IconButton';

const DropDownButton = ({ open, close }) => {
  if (open) {
    return (
      <IconButton onClick={close}>
        <ArrowDropUp />
      </IconButton>
    )
  } else {
    return (
      <IconButton>
        <ArrowDropDown />
      </IconButton>
    )
  }
};

DropDownButton.propTypes = {
  open: bool,
  close: func
}

export default DropDownButton;
