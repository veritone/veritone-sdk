import React, {Component} from 'react';
import { shape, bool, number, string, func } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

export default class OverviewSegment extends Component {
  static propTypes = {
    content: shape({
      startTimeMs: number,
      stopTimeMs: number,
      value: string
    }),
    active: bool,
    className: string,
    onClick: func
  };

  handleFragmentClicked = (event) => {
    let {
      content,
      onClick
    } = this.props;

    if (onClick) {
      onClick(event, content);
    }
  }

  render () {
    let {
      content,
      active,
      className,
    } = this.props;

    return (
      <span 
        className={classNames(styles.overviewFragment, className, {[styles.highlight]: active})} 
        onClick={this.handleFragmentClicked}
      >
        {content.value}
      </span>
    );
  }
}