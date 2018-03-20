import React, { Component } from 'react';
import { func, shape, number } from 'prop-types';
import { isFunction } from 'lodash';

import { msToReadableString } from '../../../helpers/time';

class ObjectOccurrenceInterval extends Component {
  static propTypes = {
    onOccurrenceClick: func,
    occurrence: shape({
      startTimeMs: number.isRequired,
      endTimeMs: number.isRequired
    }).isRequired
  };

  handleOccurrenceClick = (evt) => {
    if (isFunction(this.props.onOccurrenceClick)) {
      this.props.onOccurrenceClick(this.props.occurrence);
    }
  }

  render() {
    let { occurrence, className } = this.props;
    return (
      <div 
        onClick={this.handleOccurrenceClick} 
        className={className}
      >
        {msToReadableString(occurrence.startTimeMs)} - {msToReadableString(occurrence.endTimeMs)}
      </div>
    )
  }
}

export default ObjectOccurrenceInterval;