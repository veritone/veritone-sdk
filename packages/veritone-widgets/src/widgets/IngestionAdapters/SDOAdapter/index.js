import React from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { modules } from 'veritone-redux-common';
const { user } = modules;
import widget from '../../../shared/widget';

@connect(
  state => ({
    user: user.selectUser(state)
  }),
  { withRef: true }
)
class SDOAdapter extends React.Component {
  static propTypes = {
    getConfiguration: func,
    configuration: object
  };

  componentDidMount() {
    // Required function to get configuration set by user
    if (typeof this.props.getConfiguration === 'function') {
      // Return the current configuration
      this.props.getConfiguration(() => this.state.configuration);
    } else {
      console.error('Missing required getConfiguration function');
    }
  }

  // Hydrate the adapter with the provided configuration if it is defined
  state = {
    configuration: this.props.configuration || {}
  };

  // Adapter specific functions here
 
  render() {
    return (<div>Hello</div>);
  }
}

// export default widget(SDOAdapter);
export default {
  widget: widget(SDOAdapter),
  config: {
    sourceTypeId: 'react-adapter',
    logo: 'https://static.veritone.com/veritone-ui/ingestion/quantum_no_store_small.png',
    scheduleOn: false,
    processOn: true,
    customizeOn: true
  }
}