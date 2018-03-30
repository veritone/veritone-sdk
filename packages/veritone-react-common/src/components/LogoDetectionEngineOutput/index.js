import React, { Component } from 'react';
import { arrayOf, number, string, func, shape } from 'prop-types';
import classNames from 'classnames';
import {sortBy} from 'lodash';
import PillButton from '../Parts/Buttons/PillButton';
import { msToReadableString } from '../../helpers/time';
import styles from './styles.scss';

export default class LogoDetectionEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        logo: shape({
          label: string,
          confidence: number
        })
      })
    ), // series data
    mediaPlayerTime: number,
    className: string,
    itemClassName: string,
    itemLabelClassName: string,
    itemInfoClassName: string,
    onItemSelected: func,
    onScroll: func
  };

  static defaultProps = {
    data: [],
    mediaPlayerTime: 0
  };

  handleItemSelected = (event, item) => {
    this.props.onItemSelected && this.props.onItemSelected(item);
  };

  handleScrolled = (event) => {
    if (this.props.onScroll) {
      this.scrollCheck && clearTimeout(this.scrollCheck);
      this.scrollCheck = setTimeout(this.onScrollComplete, 500, event.target);
    }
  }

  onScrollComplete (scrollElement) {
    if (this.props.onScroll) {
      let scrollInfo = {
        scrollTop: scrollElement.scrollTop,
        scrollHeight: scrollElement.scrollHeight,
        clientHeight: scrollElement.clientHeight,
        scrollRatio: scrollElement.scrollTop / (scrollElement.scrollHeight - scrollElement.clientHeight)
      };

      this.props.onScroll(scrollInfo);
    }
  }

  renderItems() {
    let {
      data,
      mediaPlayerTime,
      itemClassName,
      itemInfoClassName,
      itemLabelClassName
    } = this.props;

    let items = [];
    if (data && data.length > 0) {
      // Sort detected logos by there start time and end time
      data = sortBy(data, 'startTimeMs', 'stopTimeMs');

      // Draw detected logos in the series
      data.map((itemInfo, index) => {
        if (itemInfo.logo) {
          //Look for detected logo
          let startTime = msToReadableString(itemInfo.startTimeMs);
          let endTime = msToReadableString(itemInfo.stopTimeMs);
          let logoItem = (
            <PillButton
              value={index}
              label={itemInfo.logo.label}
              info={startTime + ' - ' + endTime}
              className={classNames(styles.item, itemClassName)}
              labelClassName={classNames(styles.label, itemLabelClassName)}
              infoClassName={itemInfoClassName}
              key={'logo-' + itemInfo.logo.label + index}
              onClick={this.handleItemSelected}
              data={itemInfo}
              highlight={itemInfo.startTimeMs <= mediaPlayerTime}
            />
          );
          items.push(logoItem);
        }
      });
    }
    return items;
  }

  render() {
    return (
      <div className={classNames(styles.logoDetection, this.props.className)} onScroll={this.handleScrolled}>
        <div className={styles.scrolableContent}>
          {this.renderItems()}
        </div>
      </div>
    );
  }
}
