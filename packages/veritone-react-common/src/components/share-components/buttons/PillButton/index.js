import React, { Component } from 'react';
import { string, bool, func, objectOf, any } from 'prop-types';
import classNames from 'classnames';
import defaultStyles from './styles.scss';

export default class PillButton extends Component {
  static propTypes = {
    label: string,
    info: string,
    style: objectOf(any),
    gapStyle: objectOf(any),
    labelStyle: objectOf(any),
    infoStyle: objectOf(any),
    className: string,
    gapClassName: string,
    labelClassName: string,
    infoClassName: string,
    highlight: bool,
    onClick: func,
    data: objectOf(any)
  };

  handleButtonClicked = event => {
    const { onClick, data } = this.props;
    onClick && onClick(event, data);
  };

  render() {
    const {
      label,
      info,
      style,
      gapStyle,
      labelStyle,
      infoStyle,
      className,
      gapClassName,
      labelClassName,
      infoClassName,
      highlight
    } = this.props;
    const hasGap = label && label.length > 0 && info && info.length > 0;

    return (
      <div
        className={classNames(defaultStyles.pillButton, className, {
          [defaultStyles.highlight]: highlight
        })}
        style={style}
        onClick={this.handleButtonClicked}
      >
        <div
          className={classNames(defaultStyles.label, labelClassName)}
          style={labelStyle}
        >
          {label}
        </div>
        {hasGap && (
          <div
            className={classNames(defaultStyles.gap, gapClassName)}
            style={gapStyle}
          />
        )}
        <div
          className={classNames(defaultStyles.info, infoClassName)}
          style={infoStyle}
        >
          {info}
        </div>
      </div>
    );
  }
}
