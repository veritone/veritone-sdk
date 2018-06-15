import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, number, text } from '@storybook/addon-knobs';

import OverlayPositioningProvider from './OverlayPositioningProvider';
import Overlay from './Overlay';

class Story extends React.Component {
  /* eslint-disable react/prop-types */

  state = {
    boundingBoxes: [
      {
        x: 50,
        y: 50,
        width: 100,
        height: 100
      },
      {
        x: 100,
        y: 25,
        width: 50,
        height: 50
      }
    ]
  };

  handleAddBoundingBox = boundingBoxes => {
    this.setState({ boundingBoxes });
  };

  render() {
    return (
      <div>
        <OverlayPositioningProvider
          contentHeight={this.props.contentHeight}
          contentWidth={this.props.contentWidth}
        >
          <Overlay
            onBoundingBoxChange={this.handleAddBoundingBox}
            overlayBackgroundColor={this.props.overlayBackgroundColor}
            overlayBorderStyle={this.props.overlayBorderStyle}
            overlayBackgroundBlendMode={this.props.overlayBackgroundBlendMode}
            initialBoundingBoxPositions={this.state.boundingBoxes}
            key={JSON.stringify(this.state.boundingBoxes)}
          />
          <div
            style={{
              backgroundImage: `url(https://picsum.photos/${
                this.props.contentWidth
              }/${this.props.contentHeight})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              display: 'block',
              backgroundColor: 'lightBlue',
              height:
                this.props.matteType === 'letterbox'
                  ? this.props.contentHeight + this.props.matteSize
                  : this.props.contentHeight,
              width:
                this.props.matteType === 'pillarbox'
                  ? this.props.contentWidth + this.props.matteSize
                  : this.props.contentWidth
            }}
          />
        </OverlayPositioningProvider>
      </div>
    );
  }
}

storiesOf('BoundingPolyOverlay', module).add('Base', () => {
  /* eslint-disable react/jsx-no-bind */
  const options = {
    letterbox: 'Letterbox',
    pillarbox: 'Pillarbox'
  };

  const matteType = select('Matte type', options, 'pillarbox');

  const contentWidth = number('content width', 320);
  const contentHeight = number('content height', 240);
  const matteSize = number('matte size', 100);
  const overlayBackgroundColor = text('Overlay background color', '#FF6464');
  const overlayBorderStyle = text('Overlay border style', '1px solid #fff');
  const overlayBackgroundBlendMode = text(
    'Overlay background blend mode',
    'hard-light'
  );

  return (
    <div>
      <p>
        Matte type: {options[matteType]} ({matteSize}px)
      </p>
      <Story
        contentHeight={contentHeight}
        contentWidth={contentWidth}
        matteType={matteType}
        matteSize={matteSize}
        overlayBackgroundColor={overlayBackgroundColor}
        overlayBorderStyle={overlayBorderStyle}
        overlayBackgroundBlendMode={overlayBackgroundBlendMode}
      />
    </div>
  );
});
