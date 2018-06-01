import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, number } from '@storybook/addon-knobs';

import OverlayPositioningProvider from './OverlayPositioningProvider';
import Overlay from './Overlay';

storiesOf('BoundingPolyOverlay', module).add('hover button', () => {
  const options = {
    letterbox: 'Letterbox',
    pillarbox: 'Pillarbox'
  };

  const matteType = select('Matte type', options, 'pillarbox');

  const contentWidth = number('content width', 320);
  const contentHeight = number('content height', 240);
  const matteSize = number('matte size', 100);

  return (
    <div>
      <p>
        Matte type: {options[matteType]} ({matteSize}px)
      </p>
      <OverlayPositioningProvider
        contentHeight={contentHeight}
        contentWidth={contentWidth}
      >
        <Overlay />
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
