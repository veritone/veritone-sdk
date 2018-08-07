import React from 'react';
import { findIndex } from 'lodash';
import { storiesOf } from '@storybook/react';
import { select, number, text, boolean } from '@storybook/addon-knobs';
import Slider from '@material-ui/lab/Slider';
import faker from 'faker';

import { guid } from 'helpers/guid';
import OverlayPositioningProvider from './OverlayPositioningProvider';
import Overlay from './Overlay';

function randomPolyBox() {
  const rand = faker.random.number;
  const options = { min: 0, max: 1, precision: 0.0001 };

  return {
    id: guid(),
    object: Array(4)
      .fill()
      .map(() => ({
        x: rand(options),
        y: rand(options)
      }))
  };
}

const frames = Array(10)
  .fill()
  .map(() => [randomPolyBox(), randomPolyBox()]);

class Story extends React.Component {
  /* eslint-disable react/prop-types */

  state = {
    boundingBoxes: frames[0],
    frame: 0
  };

  actionMenuItems = [
    {
      label: 'Do action 1',
      onClick: id => console.log('Action 1 performed on box', id)
    },
    {
      label: 'Do action 2',
      onClick: id => console.log('Action 2 performed on box', id)
    }
  ];

  handleAddBoundingBox = newBox => {
    console.log('Added box', newBox);

    this.setState(state => ({
      boundingBoxes: [
        ...state.boundingBoxes,
        {
          ...newBox,
          id: guid()
        }
      ]
    }));
  };

  handleDeleteBoundingBox = deletedId => {
    console.log('Deleted box with ID', deletedId);

    this.setState(state => ({
      boundingBoxes: state.boundingBoxes.filter(({ id }) => id !== deletedId)
    }));
  };

  handleChangeBoundingBox = changedBox => {
    console.log('Changed box', changedBox);

    this.setState(state => {
      const affectedIndex = findIndex(state.boundingBoxes, {
        id: changedBox.id
      });

      let newState = {
        boundingBoxes: [...state.boundingBoxes]
      };

      newState.boundingBoxes[affectedIndex] = changedBox;

      return {
        boundingBoxes: newState.boundingBoxes
      };
    });
  };

  handleChangeFrame = (e, frame) => {
    this.setState({ frame, boundingBoxes: frames[frame] });
  };

  render() {
    return (
      <div>
        <Slider
          value={this.state.frame}
          min={0}
          max={9}
          step={1}
          onChange={this.handleChangeFrame}
        />
        <OverlayPositioningProvider
          contentHeight={this.props.contentHeight}
          contentWidth={this.props.contentWidth}
          fixedWidth
        >
          <Overlay
            onAddBoundingBox={this.handleAddBoundingBox}
            onDeleteBoundingBox={this.handleDeleteBoundingBox}
            onChangeBoundingBox={this.handleChangeBoundingBox}
            overlayBackgroundColor={this.props.overlayBackgroundColor}
            overlayBorderStyle={this.props.overlayBorderStyle}
            overlayBackgroundBlendMode={this.props.overlayBackgroundBlendMode}
            initialBoundingBoxPolys={this.state.boundingBoxes}
            actionMenuItems={this.actionMenuItems}
            readOnly={this.props.readOnly}
            key={this.state.frame}
          />
          <div
            style={{
              backgroundImage: `url(https://picsum.photos/${
                this.props.contentWidth
              }/${this.props.contentHeight})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
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
  const readOnly = boolean('Read only mode', false);

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
        readOnly={readOnly}
      />
    </div>
  );
});
