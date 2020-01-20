import React from 'react';
import Chip from '@material-ui/core/Chip';

import cx from 'classnames';
import { string, func } from 'prop-types';
import styles from './styles';

import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';

import Icon from './Icon';

const getTheme = () => {
  const theme = createMuiTheme({
    root: {
      backgroundColor: 'blue',
    }
  });

  return theme;
}

const useStyles = makeStyles(styles);

const SearchPill = ({ id, engineIconClass, label, remove, onClick, highlighted, selected, exclude }) => {
  const classes = useStyles();
  const searchPillLabelClass = cx(classes['searchPillLabel']);
  const selectedSearchPillLabelClass = cx(classes['selectedPillLabel']);
  const selectedDeleteIcon = cx(classes['selectedDeletedIcon']);
  const searchPillClass = cx(classes['searchPill']);
  const deleteIconClass = cx(classes['deleteIcon']);
  const searchPillClasses = cx({ [`${classes['highlighted']}`]: highlighted, [`${classes['excludePill']}`]: exclude});

  return (
    <Chip
      data-searchparameterid={id}
      avatar={<Icon iconClass={engineIconClass} color={selected ? 'white' : 'grey '} size={'1.5em'} />}
      label={label}
      className={selected ? cx(classes['highlighted']) : searchPillClasses}
      deleteIcon={highlighted ? (<span style={{ paddingRight: "calc(1em + 7px)" }}></span>) : null}
      classes={{ root: searchPillClass, label: selected ? selectedSearchPillLabelClass : searchPillLabelClass, deleteIcon: deleteIconClass }}
      onDelete={!highlighted ? remove : () => { }}
      onClick={onClick}
    />
  )
};
SearchPill.propTypes = {
  engineIconClass: string.isRequired,
  label: string.isRequired,
  remove: func,
  open: func
};

export default SearchPill;
