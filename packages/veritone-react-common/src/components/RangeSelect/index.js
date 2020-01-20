import React, { Component } from 'react';
import { func, arrayOf, number, shape, any } from 'prop-types';
import { Range, getTrackBackground } from 'react-range';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';

const STEP = 1;
const MIN = 0;
const MAX = 100;

@ withStyles(styles)
export default class RangeSelect extends Component {

  static propTypes = {
    onChangeConfidenceRange: func.isRequired,
    selectedConfidenceRange: arrayOf(number),
    classes: shape({ any }),
  }

  handleValueChange = (values) => {
    const { onChangeConfidenceRange } = this.props;
    if (values[0] === 100 && values[1] === 100) {
      values[0] = 99;
    }
    if (values[0] === 0 && values[1] === 0) {
      values[1] = 1;
    }
    onChangeConfidenceRange(values)
  }

  renderThumb = ({ props, isDragged }) => (
    <div
      {...props}
      className={this.props.classes.renderThum}
    />
  )

  renderTrack = ({ props, children }) => (
    <div
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      className={this.props.classes.renderTrack}
    >
      <div
        ref={props.ref}
        className={this.props.classes.trackLine}
        style={{
          background: getTrackBackground({
            values: this.props.selectedConfidenceRange,
            colors: ['#ccc', '#4285F4', '#ccc'],
            min: MIN,
            max: MAX
          }),
        }}
      >
        {children}
      </div>
    </div>
  )

  render() {
    const { selectedConfidenceRange = [0, 100], classes } = this.props;
    return (
      <div
        className={classes.rangeInput}
      >
        <div
          className={cx(classes['valueMin'])}
          data-test="value-min"
        >
          {selectedConfidenceRange[0].toFixed(0)}
        </div>
        <Range
          values={selectedConfidenceRange}
          step={STEP}
          min={MIN}
          max={MAX}
          onChange={this.handleValueChange}
          renderThumb={this.renderThumb}
          renderTrack={this.renderTrack}
        />
        <div
          className={cx(classes['valueMax'])}
          data-test="value-max"
        >
          {selectedConfidenceRange[1].toFixed(0)}
        </div>
      </div>
    );
  }
}
export {
  RangeSelect
}

