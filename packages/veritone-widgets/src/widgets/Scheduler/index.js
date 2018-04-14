import React from 'react';
import { func } from 'prop-types';
import { noop } from 'lodash';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { Scheduler as LibScheduler } from 'veritone-react-common';

import widget from '../../shared/widget';

@connect(null, { submit }, null, { withRef: true })
class Scheduler extends React.Component {
  static propTypes = {
    submit: func.isRequired
  };

  state = {
    submitCallback: noop
  };

  prepareResultData = LibScheduler.prepareResultData;

  submit = (submitCallback = noop) => {
    this.setState(
      {
        submitCallback
      },
      () => this.props.submit('scheduler')
    );
  };

  render() {
    return (
      <LibScheduler {...this.props} onSubmit={this.state.submitCallback} />
    );
  }
}

export default widget(Scheduler);
