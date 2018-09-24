import React from 'react';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';

import IconButton from '@material-ui/core/IconButton';

const DropDownButton = ({open, close}) => {
  if(open) {
    return (
      <IconButton onClick={ close }>
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

export default DropDownButton;
