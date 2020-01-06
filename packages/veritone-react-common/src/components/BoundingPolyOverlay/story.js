import React from 'react';
import { findIndex } from 'lodash';
import { storiesOf } from '@storybook/react';
import { select, number, text, boolean } from '@storybook/addon-knobs';
import { Slider } from '@material-ui/core';
import faker from 'faker';

import { guid } from 'helpers/guid';
import OverlayPositioningProvider from './OverlayPositioningProvider';
import Overlay from './Overlay';

const types = ['a', 'b', 'c'];

function randomPolyBox() {
  const rand = faker.random.number;
  const options = { min: 0, max: 1, precision: 0.0001 };

  return {
    id: guid(),
    overlayObjectType: faker.random.arrayElement(types),
    boundingPoly: Array(4)
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
          id: guid(),
          overlayObjectType: faker.random.arrayElement(types)
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
            stylesByObjectType={this.props.stylesByObjectType}
            stagedBoundingBoxStyles={this.props.stagedBoundingBoxStyles}
            initialBoundingBoxPolys={this.state.boundingBoxes}
            actionMenuItems={this.actionMenuItems}
            readOnly={this.props.readOnly}
            addOnly={this.props.addOnly}
            autoCommit={this.props.autoCommit}
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
  const overlayBackgroundColor = text(
    'Overlay background color',
    'rgba(255, 100, 100, 0.5)'
  );
  const overlayBorderStyle = text('Overlay border style', '1px solid #fff');
  const readOnly = boolean('Read only mode', false);
  const addOnly = boolean('Add only mode', false);
  const autoCommit = boolean('Auto commit mode', false);

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
        stagedBoundingBoxStyles={{
          backgroundColor: overlayBackgroundColor,
          border: overlayBorderStyle
        }}
        stylesByObjectType={{
          a: {
            backgroundColor: 'rgba(40, 95, 255, 0.5)'
          },
          b: {
            backgroundColor: 'rgba(80, 185, 60, 0.5)'
          },
          c: {
            backgroundColor: 'rgba(255, 140, 40, 0.5)'
          }
        }}
        readOnly={readOnly}
        addOnly={addOnly}
        autoCommit={autoCommit}
      />
    </div>
  );
});
