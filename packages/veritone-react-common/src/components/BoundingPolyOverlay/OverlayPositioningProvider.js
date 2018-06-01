import React from 'react';
import { node, number } from 'prop-types';

export const OverlayPositioningContext = React.createContext({});
export default class OverlayPositioningProvider extends React.Component {
  static propTypes = {
    contentHeight: number.isRequired,
    contentWidth: number.isRequired,
    children: node
  };
  static defaultProps = {};

  state = {
    overlayPosition: { top: 0, left: 0, height: 0, width: 0 }
  };

  measuredChildRef = null; // eslint-disable-line
  pollingInterval = null;

  componentWillUnmount() {
    clearInterval(this.pollingInterval);
  }

  calculateOverlayPosition = () => {
    // figure out what styles need to be applied to the overlay component so that
    // it aligns with the content (considering letter/pillarboxing)
    const { height, width } = this.measuredChildRef.getBoundingClientRect();

    return {
      top: (height - this.props.contentHeight) / 2,
      left: (width - this.props.contentWidth) / 2,
      height: this.props.contentHeight,
      width: this.props.contentWidth
    };
  };

  measureChild = () => {
    // calculate the actual size of the element we're going to lay on top of
    const { height, width } = this.measuredChildRef.getBoundingClientRect();

    this.setState({
      overlayPosition: this.calculateOverlayPosition({ height, width })
    });
  };

  setMeasuredChildRef = r => {
    if (!r) {
      return;
    }

    this.measuredChildRef = r;
    clearInterval(this.pollingInterval);
    // poll for changes in the measured element's size
    this.pollingInterval = setInterval(this.measureChild, 500);
  };

  render() {
    return (
      <OverlayPositioningContext.Provider value={this.state.overlayPosition}>
        <div
          style={{
            display: 'inline-block',
            position: 'relative'
          }}
          ref={this.setMeasuredChildRef}
        >
          {this.props.children}
        </div>
      </OverlayPositioningContext.Provider>
    );
  }
}
