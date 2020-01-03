import React, { Component } from 'react';
import { shape, string, arrayOf, number, func, any } from 'prop-types';
import { get } from 'lodash';
import cx from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import FilterCenterFocus from '@material-ui/icons/FilterCenterFocus';
import Delete from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

const formatNumber = (number) => Math.round(number * 100) / 100;

export const getAreaOfInterest = (areaOfInterest = {}) => {
  const basePoint1 = get(areaOfInterest, 'boundingPoly[0]', { x: 0, y: 0 });
  const basePoint2 = get(areaOfInterest, 'boundingPoly[2]', { x: 1, y: 1 });
  return `(X ${formatNumber(basePoint1.x)}, Y ${formatNumber(basePoint1.y)}) | (X ${formatNumber(basePoint2.x)}, Y ${formatNumber(basePoint2.y)})`
};

class AreaInterest extends Component {
  static propTypes = {
    areaOfInterest: shape({
      id: string,
      boundingPoly: arrayOf(shape({
        x: number,
        y: number
      }))
    }).isRequired,
    onEditAoI: func.isRequired,
    onRemoveAoI: func.isRequired,
    classes: shape({ any }),
  }

  get AreaOfInterest() {
    const { areaOfInterest = {} } = this.props;
    const basePoint1 = get(areaOfInterest, 'boundingPoly[0]', { x: 0, y: 0 });
    const basePoint2 = get(areaOfInterest, 'boundingPoly[2]', { x: 1, y: 1 });
    return `(X ${formatNumber(basePoint1.x)}, Y ${formatNumber(basePoint1.y)}) | (X ${formatNumber(basePoint2.x)}, Y ${formatNumber(basePoint2.y)})`
  }

  render() {
    const { onEditAoI, onRemoveAoI, classes } = this.props;

    return (
      <div className={cx(classes['rectangle'])}>
        <div className={cx(classes['flexCenter'])}>
          <FilterCenterFocus />
          <div
            className={cx(classes['coordinate'])}
            data-test="coordinate"
          >
            {this.AreaOfInterest}
          </div>
        </div>
        <div className={cx(classes['editCoordinate'])}>
          <IconButton
            className={cx(classes['aoiIconButton'])}
            onClick={onEditAoI}
          >
            <Edit />
          </IconButton>
          <IconButton
            className={cx(classes['aoiIconButton'])}
            onClick={onRemoveAoI}
          >
            <Delete />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AreaInterest);
