/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { func, arrayOf, number } from 'prop-types';
import { Range, getTrackBackground } from 'react-range';
import cx from 'classnames';
import styles from './styles.scss';

const STEP = 1;
const MIN = 0;
const MAX = 100;

export default class RangeSelect extends Component {
  static propTypes = {
    onChangeConfidenceRange: func.isRequired,
    selectedConfidenceRange: arrayOf(number),
  };

  handleValueChange = values => {
    const { onChangeConfidenceRange } = this.props;
    if (values[0] === 100 && values[1] === 100) {
      values[0] = 99;
    }
    if (values[0] === 0 && values[1] === 0) {
      values[1] = 1;
    }
    onChangeConfidenceRange(values);
  };

  renderThumb = ({ props }) => <div {...props} className={styles.renderThum} />;

  renderTrack = ({ props, children }) => (
    <div
      onMouseDown={props.onMouseDown}
      onTouchStart={props.onTouchStart}
      className={styles.renderTrack}
    >
      <div
        ref={props.ref}
        className={styles.trackLine}
        style={{
          background: getTrackBackground({
            values: this.props.selectedConfidenceRange,
            colors: ['#ccc', '#4285F4', '#ccc'],
            min: MIN,
            max: MAX,
          }),
        }}
      >
        {children}
      </div>
    </div>
  );

  render() {
    const { selectedConfidenceRange = [0, 100] } = this.props;
    return (
      <div className={styles.rangeInput}>
        <div className={cx(styles['value-min'])}>
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
        <div className={cx(styles['value-max'])}>
          {selectedConfidenceRange[1].toFixed(0)}
        </div>
      </div>
    );
  }
}
