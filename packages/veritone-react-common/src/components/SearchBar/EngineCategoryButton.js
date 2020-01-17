import { shape, func, string } from 'prop-types';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import cx from 'classnames';

import Icon from './Icon';
import { supportedEngineCategoryType } from './index';
import styles from './styles';

const useStyles = makeStyles(styles);

const EngineCategoryButton = ({ engineCategory, addPill, backgroundColor, color }) => {
  const classes = useStyles();
  const engineCategoryIconClasses = cx(classes['engineCategoryPill']);
  const tooltipClasses = cx(classes['searchPillTooltip']);

  const onAddPill = () => addPill(engineCategory.id);

  return (
    <Tooltip
      title={engineCategory.tooltip}
      placement="bottom"
      key={engineCategory.id}
      className={cx(tooltipClasses)}
    >
      <div className={cx(engineCategoryIconClasses)} onClick={onAddPill} style={{ backgroundColor: backgroundColor }}>
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
