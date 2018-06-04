import React from 'react';
// import {} from 'prop-types';
import Rnd from 'react-rnd';

import { OverlayPositioningContext } from './OverlayPositioningProvider';

export default class Overlay extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  state = {
    width: 200,
    height: 200,
    x: 10,
    y: 10
  };
  handleResize = (e, direction, ref, delta, position) => {
    this.setState({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      ...position
    });
  };

  handleDragStop = (e, d) => {
    this.setState({ x: d.x, y: d.y });
  };

  render() {
    // todo: base position/size on percentages of parent.
    const cornerHandleStyles = {
      height: 10,
      width: 10,
      border: '1px solid #fff'
    };

    return (
      <OverlayPositioningContext.Consumer>
        {({ top, left, height, width }) => (
          <div
            style={{
              position: 'absolute',
              top,
              left,
              height,
              width
              // border: '3px dotted red'
            }}
          >
            <Rnd
              style={{
                border: '1px solid #fff',
                mixBlendMode: 'difference'
              }}
              resizeHandleStyles={{
                topLeft: { ...cornerHandleStyles, left: -5, top: -5 },
                topRight: { ...cornerHandleStyles, right: -5, top: -5 },
                bottomLeft: { ...cornerHandleStyles, left: -5, bottom: -5 },
                bottomRight: { ...cornerHandleStyles, right: -5, bottom: -5 }
              }}
              size={{ width: this.state.width, height: this.state.height }}
              position={{ x: this.state.x, y: this.state.y }}
              bounds="parent"
              onDragStop={this.handleDragStop}
              onResize={this.handleResize}
            />
          </div>
        )}
      </OverlayPositioningContext.Consumer>
    );
  }
}
