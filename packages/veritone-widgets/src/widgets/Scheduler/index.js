import React from 'react';
import { Scheduler as LibScheduler } from 'veritone-react-common';
import widget from '../../shared/widget';

class Scheduler extends React.Component {
  static propTypes = {};

  componentDidMount() {}
 
  render() {
    return <LibScheduler {...this.props} />
  }
}

export default widget(Scheduler);