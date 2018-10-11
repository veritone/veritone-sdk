import React, { Fragment } from 'react';
import { number, string, func, bool } from 'prop-types';
import cx from 'classnames';

import styles from './styles.scss';

const lowerButton = 'lowerButton';
const upperButton = 'upperButton';

export default class RangeSlider extends React.Component {
  static propTypes = {
    min: number,
    max: number,
    dual: bool,
    value: number,
    lowerValue: number,
    upperValue: number,
    showValues: bool,
    prefix: string,
    suffix: string,
    numDecimalDigits: number,
    onRelease: func,
    onSliderChange: func
  };

  static defaultProps = {
    min: 0,
    max: 100,
    dual: false,
    value: 50,
    lowerValue: 0,
    upperValue: 100,
    numDecimalDigits: 0,
    prefix: '',
    suffix: '',
    showValues: false
  };

  state = {
    labelWidth: '3ch',
    lowerRatio: 0,
    upperRatio: 1,
    value: 50,
    lowerValue: 0,
    upperValue: 100,
    initialLowerButtonVal: 0,
    initialUpperButtonVal: 1
  };

  static getDerivedStateFromProps(props, state) {
    const {
      min,
      max,
      dual,
      value,
      lowerValue,
      upperValue,
      numDecimalDigits,
      prefix,
      suffix,
      showValues
    } = props;

    // Check for props changed
    const prevProps = state.prevProps;
    if (
      prevProps &&
      min === prevProps.min &&
      max === prevProps.max &&
      value === prevProps.value &&
      lowerValue === prevProps.lowerValue &&
      upperValue === prevProps.upperValue &&
      prefix === prevProps.prefix &&
      suffix === prevProps.suffix &&
      showValues === prevProps.showValues &&
      numDecimalDigits === prevProps.numDecimalDigits
    ) {
      return null;
    }

    const newState = { ...state };
    newState.prevProps = props;

    // Validate props
    if (min >= max) {
      throw new Error('max has to be greater than min');
    } else if (lowerValue > upperValue) {
      throw new Error('lower value cannot be greater than upper value');
    }

    if (dual) {
      // calculate lower ratio
      if (lowerValue < min) {
        newState.lowerRatio = 0;
        console.warn('lower value is lesser than min');
      } else if (lowerValue > max) {
        newState.lowerRatio = 1;
        console.warn('lower value is greater than max');
      } else {
        newState.lowerRatio = (lowerValue - min) / (max - min);
      }

      // calculate upper ratio
      if (upperValue < min) {
        newState.upperRatio = 0;
        console.warn('upper value is lesser than min');
      } else if (upperValue > max) {
        newState.upperRatio = 1;
        console.warn('upper value is greater than max');
      } else {
        newState.upperRatio = (upperValue - min) / (max - min);
      }
    } else {
      newState.lowerRatio = 0;
      if (value < min) {
        newState.upperRatio = 0;
        console.warn('initial value is lesser than min');
      } else if (value > max) {
        newState.upperRatio = 1;
        console.warn('initial value is greater than max');
      } else {
        newState.upperRatio = (value - min) / (max - min);
      }
    }

    // calculate label width
    let labelWidth = 0;
    if (showValues) {
      labelWidth =
        Math.round(max).toString().length + prefix.length + suffix.length;
      numDecimalDigits > 0 && (labelWidth = labelWidth + numDecimalDigits + 1); //
    }

    // set new initial lower & upper button vals
    newState.labelWidth = labelWidth + 'ch';
    newState.lowerValue = dual ? lowerValue : min;
    newState.upperValue = dual ? upperValue : value;
    newState.initialLowerButtonVal = newState.lowerRatio;
    newState.initialUpperButtonVal = newState.upperRatio;

    return newState;
  }

  handleMouseDown = event => {
    document.onmousemove = this.handleMouseMove;
    document.onmouseup = this.handleMouseUp;

    const trackBoundingBox = this.track.current.getBoundingClientRect();
    const initialMousePos = event.clientX - trackBoundingBox.left;
    this.setState({
      initialPos: initialMousePos,
      selectedButton: event.target.value
    });
  };

  handleMouseMove = event => {
    const {
      initialPos,
      selectedButton,
      initialLowerButtonVal,
      initialUpperButtonVal
    } = this.state;

    const { max, min, dual, onSliderChange } = this.props;

    //Calculate mouse travel distance
    const trackBoundingBox = this.track.current.getBoundingClientRect();
    const currentMousePos = event.clientX - trackBoundingBox.left;
    const travelDistance = currentMousePos - initialPos;
    const travelRatio = travelDistance / trackBoundingBox.width;

    //Calculate new upper & lower ratios
    let newLowerRatio =
      initialLowerButtonVal === undefined ? 0 : initialLowerButtonVal;
    let newUpperRatio =
      initialUpperButtonVal === undefined ? 1 : initialUpperButtonVal;
    if (selectedButton === lowerButton) {
      newLowerRatio = newLowerRatio + travelRatio;
      newLowerRatio > newUpperRatio && (newUpperRatio = newLowerRatio);
    } else if (selectedButton === upperButton) {
      newUpperRatio = newUpperRatio + travelRatio;
      newLowerRatio > newUpperRatio && (newLowerRatio = newUpperRatio);
    }

    //Stop upper & lower ratio from going out of bounds
    newLowerRatio < 0 && (newLowerRatio = 0);
    newLowerRatio > 1 && (newLowerRatio = 1);
    newUpperRatio < 0 && (newUpperRatio = 0);
    newUpperRatio > 1 && (newUpperRatio = 1);

    const maxRange = max - min;
    const lowerValue = newLowerRatio * maxRange + min;
    const upperValue = newUpperRatio * maxRange + min;

    //Update upper & lower ratios
    this.setState({
      lowerValue: lowerValue,
      upperValue: upperValue,
      lowerRatio: newLowerRatio,
      upperRatio: newUpperRatio
    });

    //Slider change callback
    if (onSliderChange) {
      const newValues = dual
        ? {
            lowerValue: lowerValue,
            upperValue: upperValue,
            lowerRatio: newLowerRatio,
            upperRatio: newUpperRatio
          }
        : {
            value: upperValue,
            ratio: newUpperRatio
          };

      onSliderChange(newValues);
    }
  };

  handleMouseUp = () => {
    //Stop listening to mouse events
    document.onmouseup = undefined;
    document.onmousemove = undefined;

    //Update state
    this.setState(prevState => {
      return {
        initialPos: undefined,
        selectedButton: undefined,
        initialLowerButtonVal: prevState.lowerRatio,
        initialUpperButtonVal: prevState.upperRatio
      };
    });

    //Handle mouse up callback
    const { dual, onRelease } = this.props;
    if (onRelease) {
      const { lowerRatio, upperRatio, lowerValue, upperValue } = this.state;

      const newValues = dual
        ? {
            lowerRatio: lowerRatio,
            upperRatio: upperRatio,
            lowerValue: lowerValue,
            upperValue: upperValue
          }
        : {
            value: upperValue,
            ratio: upperRatio
          };

      onRelease(newValues);
    }
  };

  handleMouseClick = event => {
    const { min, max, dual, onSliderChange, onRelease } = this.props;
    const { lowerRatio, upperRatio } = this.state;

    // Calculate new lower & upper ratios
    const trackBoundingBox = this.track.current.getBoundingClientRect();
    const selectedRatio =
      (event.clientX - trackBoundingBox.left) / trackBoundingBox.width;

    const newLowerRatio =
      selectedRatio < lowerRatio ? selectedRatio : lowerRatio;
    const newUpperRatio =
      !dual || selectedRatio > upperRatio ? selectedRatio : upperRatio;

    const maxRange = max - min;
    const lowerValue = newLowerRatio * maxRange + min;
    const upperValue = newUpperRatio * maxRange + min;

    // Update lower & upper ratios
    this.setState({
      lowerValue: lowerValue,
      upperValue: upperValue,
      lowerRatio: newLowerRatio,
      upperRatio: newUpperRatio,
      initialLowerButtonVal: newLowerRatio,
      initialUpperButtonVal: newUpperRatio
    });

    // Trigger callback functions
    const newValues = dual
      ? {
          lowerValue: lowerValue,
          upperValue: upperValue,
          lowerRatio: newLowerRatio,
          upperRatio: newUpperRatio
        }
      : {
          value: upperValue,
          ratio: newUpperRatio
        };

    onSliderChange && onSliderChange(newValues);
    onRelease && onRelease(newValues);
  };

  render() {
    const { dual, prefix, suffix, numDecimalDigits, showValues } = this.props;
    const {
      lowerValue,
      upperValue,
      lowerRatio,
      upperRatio,
      labelWidth
    } = this.state;

    const lowerPercentage = 100 * lowerRatio;
    const upperPercentage = 100 * upperRatio;
    const selectedRange = upperPercentage - lowerPercentage + '%';

    this.track = this.track || React.createRef();
    return (
      <div className={cx(styles.rangeSlider)}>
        {showValues &&
          dual && (
            <div className={cx(styles.label)} style={{ width: labelWidth }}>
              {prefix + lowerValue.toFixed(numDecimalDigits) + suffix}
            </div>
          )}
        <div className={cx(styles.slider)}>
          <div
            ref={this.track}
            className={cx(styles.track, styles.background)}
          />
          <div
            className={cx(styles.track, styles.highlight)}
            style={{ left: lowerPercentage + '%', width: selectedRange }}
          />
          <div
            className={cx(styles.backArea, styles.hitArea)}
            onClick={this.handleMouseClick}
          />
          {dual && (
            <Fragment>
              <div
                className={cx(styles.backArea)}
                style={{ left: lowerPercentage + '%', width: selectedRange }}
              />
              <button
                className={cx(styles.thumb)}
                onMouseDown={this.handleMouseDown}
                style={{ left: lowerPercentage + '%' }}
                value={lowerButton}
              />
            </Fragment>
          )}
          <button
            className={cx(styles.thumb)}
            onMouseDown={this.handleMouseDown}
            style={{ left: upperPercentage + '%' }}
            value={upperButton}
          />
        </div>
        {showValues && (
          <div className={cx(styles.label)} style={{ width: labelWidth }}>
            {prefix + upperValue.toFixed(numDecimalDigits) + suffix}
          </div>
        )}
      </div>
    );
  }
}
