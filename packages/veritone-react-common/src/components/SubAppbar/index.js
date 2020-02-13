/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { makeStyles } from '@material-ui/styles';
import PopperButon from '../PopperButton';
import BreadCrums from '../DataPicker/Breadcrumbs'

import styles from './styles';

const useStyles = makeStyles(styles);

function SubAppbar({actions, pathList, onCrumbClick, loading }) {
  const classes = useStyles();

  return (
    <div className={cx(classes['subappbarContainer'])}>
      <div className={cx(classes['buttonContainerReact'])}>
        <PopperButon actions={actions} />
      </div>
      <div className={cx(classes['breadcrumbContainerSubappbar'])}>
        <BreadCrums 
          loading={loading}
          onCrumbClick={onCrumbClick}
          pathList={pathList}
          isEnableSuiteCase={false}
          defaultRootTitle="Org collections"
          isEnableBackground={false}
        />
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
  onCrumbClick: PropTypes.func,
  loading: PropTypes.bool
}

export default SubAppbar;
