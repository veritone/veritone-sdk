/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { shape, func, string } from 'prop-types';
import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';
import Icon from './Icon';

import styles from './styles.scss';

import supportedEngineCategoryType from './index';

const EngineCategoryButton = ({
  engineCategory,
  addPill,
  backgroundColor,
  color,
}) => {
  const engineCategoryIconClasses = cx(styles.engineCategoryPill);
  const tooltipClasses = cx(styles.searchPillTooltip);

  const onAddPill = () => addPill(engineCategory.id);

  return (
    <Tooltip
      title={engineCategory.tooltip}
      placement="bottom"
      key={engineCategory.id}
      className={cx(tooltipClasses)}
    >
      <div
        className={cx(engineCategoryIconClasses)}
        onClick={onAddPill}
        style={{ backgroundColor }}
      >
        <Icon iconClass={engineCategory.iconClass} color={color} />
      </div>
    </Tooltip>
  );
};
EngineCategoryButton.propTypes = {
  engineCategory: shape(supportedEngineCategoryType),
  addPill: func,
  color: string,
  backgroundColor: string,
};

export default EngineCategoryButton;
