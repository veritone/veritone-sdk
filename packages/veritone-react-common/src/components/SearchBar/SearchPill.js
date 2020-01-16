import React from 'react';
import Chip from '@material-ui/core/Chip';

import cx from 'classnames';
import { string, func, any, bool } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

import Icon from './Icon';


const useStyles = makeStyles(styles);

const SearchPill = ({ id, engineIconClass, label, remove, onClick, highlighted, selected, exclude }) => {
  const classes = useStyles();
  const searchPillLabelClass = cx(classes['searchPillLabel']);
  const selectedSearchPillLabelClass = cx(classes['selectedPillLabel']);
  const searchPillClass = cx(classes['searchPill']);
  const deleteIconClass = cx(classes['deleteIcon']);
  const searchPillClasses = cx({ [`${classes['highlighted']}`]: highlighted, [`${classes['excludePill']}`]: exclude });

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
  open: func,
  onClick: func,
  id: any,
  highlighted: bool,
  selected: bool,
  exclude: bool
};

export default SearchPill;
