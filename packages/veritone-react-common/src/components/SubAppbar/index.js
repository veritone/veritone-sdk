/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PopperButon from '../PopperButton';
import BreadCrums from '../DataPicker/Breadcrumbs'

import styles from './styles.scss';

function SubAppbar({
  isEnableShowButton = true,
  isEnableShowBreardCrums = true,
  actions,
  pathList,
  onCrumbClick,
  defaultValue,
  maxItems = 5
}) {
  return (
    <div className={cx(styles['subappbar-container'])}>
      {isEnableShowButton && (
        <div className={cx(styles['button-container-react'])}>
          <PopperButon actions={actions} />
        </div>
      )}
      {isEnableShowBreardCrums && (
        <div className={cx(styles['breadcrumb-container-subappbar'])}>
          <BreadCrums
            maxItems={maxItems}
            onCrumbClick={onCrumbClick}
            pathList={pathList}
            defaultValue={defaultValue}
          />
        </div>
      )}
    </div>
  )
}
SubAppbar.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    icon: PropTypes.string,
    actionClick: PropTypes.func,
  })),
  pathList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })),
  onCrumbClick: PropTypes.func,
  defaultValue: PropTypes.string,
  maxItems: PropTypes.number,
  isEnableShowButton: PropTypes.bool,
  isEnableShowBreardCrums: PropTypes.bool
}

export default SubAppbar;
