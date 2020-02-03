import React, { Component } from 'react';
import { shape, string, arrayOf, number, func } from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import FilterCenterFocus from '@material-ui/icons/FilterCenterFocus';
import Delete from '@material-ui/icons/Delete';

import styles from './styles.scss';

const formatNumber = numberInput => Math.round(numberInput * 100) / 100;

export const getAreaOfInterest = (areaOfInterest = {}) => {
  const basePoint1 = get(areaOfInterest, 'boundingPoly[0]', { x: 0, y: 0 });
  const basePoint2 = get(areaOfInterest, 'boundingPoly[2]', { x: 1, y: 1 });
  return `(X ${formatNumber(basePoint1.x)}, Y ${formatNumber(
    basePoint1.y
  )}) | (X ${formatNumber(basePoint2.x)}, Y ${formatNumber(basePoint2.y)})`;
};

export default class index extends Component {
  static propTypes = {
    areaOfInterest: shape({
      id: string,
      boundingPoly: arrayOf(
        shape({
          x: number,
          y: number,
        })
      ),
    }).isRequired,
    onEditAoI: func.isRequired,
    onRemoveAoI: func.isRequired,
  };

  get AreaOfInterest() {
    const { areaOfInterest = {} } = this.props;
    const basePoint1 = get(areaOfInterest, 'boundingPoly[0]', { x: 0, y: 0 });
    const basePoint2 = get(areaOfInterest, 'boundingPoly[2]', { x: 1, y: 1 });
    return `(X ${formatNumber(basePoint1.x)}, Y ${formatNumber(
      basePoint1.y
    )}) | (X ${formatNumber(basePoint2.x)}, Y ${formatNumber(basePoint2.y)})`;
  }

  render() {
    const { onEditAoI, onRemoveAoI } = this.props;
    return (
      <div className={cx(styles.rectangle)}>
        <div className={cx(styles['flex-center'])}>
          <FilterCenterFocus />
          <div className={cx(styles.coordinate)}>{this.AreaOfInterest}</div>
        </div>
        <div className={cx(styles['edit-coordinate'])}>
          <IconButton
            className={cx(styles['aoi-icon-button'])}
            onClick={onEditAoI}
          >
            <Edit />
          </IconButton>
          <IconButton
            className={cx(styles['aoi-icon-button'])}
            onClick={onRemoveAoI}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    );
  }
}
