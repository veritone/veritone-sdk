import React, { Component } from 'react';
import { string, number, func } from 'prop-types';

class ObjectCountPill extends Component {
  static propTypes = {
    label: string,
    count: number,
    className: string,
    onClick: func
  }

  handleClick = (evt) => {
    this.props.onClick(this.props.label, evt);
  }

  render() {
    let { label, count, className } = this.props;
    return <div className={className} onClick={this.handleClick}>
      <span>{label}</span><a>({count})</a>
    </div>
  }
}

export default ObjectCountPill;