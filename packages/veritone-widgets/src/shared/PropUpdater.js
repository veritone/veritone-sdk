import React from 'react';
import { func, object } from 'prop-types';

export class PropUpdater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.props = props.initialProps || {};
  }

  updateProps = newProps => {
    this.setState({ props: newProps });
  };

  render() {
    return this.props.render(this.state.initialProps || this.state.props);
  }
}

PropUpdater.propTypes = {
  render: func,
  // eslint-disable-next-line react/forbid-prop-types
  initialProps: object
};
