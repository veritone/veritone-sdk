import React from 'react';
// import {} from 'prop-types';

import { OverlayPositioningContext } from './OverlayPositioningProvider';

export default class Overlay extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  render() {
    return (
      <OverlayPositioningContext.Consumer>
        {({ top, left, height, width }) => (
          <div style={{ position: 'absolute', top, left, height, width, border: '3px dotted red' }} />
        )}
      </OverlayPositioningContext.Consumer>
    );
  }
}
