import React from 'react';
import Chip from '@material-ui/core/Chip';
import cx from 'classnames';
import { string, func, any } from 'prop-types';

import styles from './styles.scss';
import Icon from './Icon';

const searchPillLabelClass = cx(styles.searchPillLabel);
const selectedSearchPillLabelClass = cx(styles.selectedPillLabel);
const searchPillClass = cx(styles.searchPill, styles['searchPill:hover']);
const deleteIconClass = cx(styles.deleteIcon);

const SearchPill = ({
  id,
  engineIconClass,
  label,
  remove,
  onClick,
  highlighted,
  selected,
  exclude,
}) => {
  const searchPillClasses =
    cx({
      [`${styles.highlighted}`]: highlighted,
      [`${styles['highlighted:hover']}`]: highlighted,
      [`${styles.excludePill}`]: exclude,
      focus: styles['searchPill:focus'],
    }) || cx(styles.searchPill);
  return (
    <Chip
      data-searchparameterid={id}
      avatar={
        <Icon
          iconClass={engineIconClass}
          color={selected ? 'white' : 'grey '}
          size={'1.5em'}
        />
      }
      label={label}
      className={selected ? cx(styles.highlighted) : searchPillClasses}
      deleteIcon={
        highlighted ? (
          <span style={{ paddingRight: 'calc(1em + 7px)' }}></span>
        ) : null
      }
      classes={{
        root: searchPillClass,
        label: selected ? selectedSearchPillLabelClass : searchPillLabelClass,
        deleteIcon: deleteIconClass,
      }}
      onDelete={!highlighted ? remove : () => {}}
      onClick={onClick}
    />
  );
};
SearchPill.propTypes = {
  engineIconClass: string.isRequired,
  label: string.isRequired,
  remove: func,
  open: func,
  id: any,
  onClick: func,
  highlighted: any,
  selected: any,
  exclude: any,
};

export default SearchPill;
