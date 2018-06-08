import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, number, text } from '@storybook/addon-knobs';

import OverlayPositioningProvider from './OverlayPositioningProvider';
import Overlay from './Overlay';

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
      <OverlayPositioningProvider
        contentHeight={contentHeight}
        contentWidth={contentWidth}
      >
        <Overlay
          onAccept={poly => console.log(poly)}
          onCancel={() => console.log('cancelled')}
          overlayBackgroundColor={overlayBackgroundColor}
          overlayBorderStyle={overlayBorderStyle}
          overlayBackgroundBlendMode={overlayBackgroundBlendMode}
          // initialBoundingBoxPosition={{
          //   x: 50,
          //   y: 50,
          //   width: 100,
          //   height: 100,
          // }}
        />
        <div
          style={{
            backgroundImage: `url(https://picsum.photos/${contentWidth}/${contentHeight})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            display: 'block',
            backgroundColor: 'lightBlue',
            height:
              matteType === 'letterbox'
                ? contentHeight + matteSize
                : contentHeight,
            width:
              matteType === 'pillarbox'
                ? contentWidth + matteSize
                : contentWidth
          }}
        />
      </OverlayPositioningProvider>
    </div>
  );
});
