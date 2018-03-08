import React from 'react';
import { object, func } from 'prop-types';

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

export default {
  adapter: SDOAdapter,
  config: {
    adapterId: 'react-adapter',
    enableSchedule: true,
    enableProcess: true,
    enableCustomize: {
      setFolder: true,
      setContentTemplate: false,
      setTags: false
    }
  }
}