import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { LocationSelect, stepIntro, buttonTextStep } from './';
import { guid } from '../../helpers/guid';
import OverlayPositioningProvider from '../BoundingPolyOverlay/OverlayPositioningProvider';

describe('AreaSelect', () => {
    const handleAddBoundingBox= jest.fn();
    const handleDeleteBoundingBox= jest.fn();
    const handleChangeBoundingBox= jest.fn();
    const onUpdateStep= jest.fn();
    const boundingBoxes= [{
        boundingPoly: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 }
        ],
        overlayObjectType: "c",
        id: guid()
      }];
    const onEditAoI= jest.fn();
    const onRemoveAoI= jest.fn();

    it('Should render with the default value filled in', () => {
        const step = 1;
        const testRenderer = renderer.create(
            <LocationSelect
                onEditAoI={onEditAoI}
                onRemoveAoI={onRemoveAoI}
                onUpdateStep={onUpdateStep}
                boundingBoxes={boundingBoxes}
                handleAddBoundingBox={handleAddBoundingBox}
                handleDeleteBoundingBox={handleDeleteBoundingBox}
                handleChangeBoundingBox={handleChangeBoundingBox}
                step={step}
              />
        );
        const testInstance = testRenderer.root;
        expect(testInstance.findByType(OverlayPositioningProvider).props.contentHeight).toBe(200);
        expect(testInstance.findByType(OverlayPositioningProvider).props.contentWidth).toBe(340);
    });

});