/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import PopperButon from '../PopperButton';
import BreadCrums from '../DataPicker/Breadcrumbs'

import styles from './styles.scss';

function SubAppbar({actions, pathList, onCrumbClick }) {
  return (
    <div className={cx(styles['subappbar-container'])}>
      <div className={cx(styles['button-container-react'])}>
        <PopperButon actions={actions} />
      </div>
      <div className={cx(styles['breadcrumb-container-subappbar'])}>
        <BreadCrums onCrumbClick={onCrumbClick} pathList={pathList} />
      </div>
    </div>
  )
}
SubAppbar.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    icon: PropTypes.string,
    actionClick: PropTypes.func
  })),
  pathList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })),
  onCrumbClick: PropTypes.func
}

export default SubAppbar;
