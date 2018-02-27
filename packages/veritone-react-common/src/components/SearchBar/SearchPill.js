import React from 'react';
import Chip from 'material-ui/Chip';

import cx from 'classnames';
import { string, func } from 'prop-types';
import styles from './styles.scss';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Icon from './Icon';

const searchPillLabelClass = cx(styles['searchPillLabel']);
const selectedSearchPillLabelClass = cx(styles['selectedPillLabel']);
const selectedDeleteIcon = cx(styles['selectedDeletedIcon']);
const searchPillClass = cx(styles['searchPill'], styles['searchPill:hover']);
const deleteIconClass = cx(styles['deleteIcon']);

const getTheme = () => {
  const theme = createMuiTheme({
    root: {
      backgroundColor: 'blue',
    }
  });

  return theme;
}

const SearchPill = ({ engineIconClass, label, remove, onClick, highlighted, selected }) => {
  var searchPillClasses = cx( {[`${styles['highlighted']}`] : highlighted , [`${styles['highlighted:hover']}`] : highlighted, focus: styles['searchPill:focus']  } )
  return (
    <Chip
    avatar={<Icon iconClass={engineIconClass} color={ selected ? 'white' : 'grey '} size={'1.5em'} />}
    label={label}
    className={ selected ? cx(styles['highlighted']) : searchPillClasses }
    deleteIcon={ highlighted ? (<span style={ { paddingRight: "calc(1em + 7px)" } }></span>) : null }
    classes={{ root: searchPillClass, label: selected ? selectedSearchPillLabelClass : searchPillLabelClass, deleteIcon: deleteIconClass }}
    onDelete={ !highlighted ? remove : () => {} }
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
