import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import DragLayer from '../DragLayer';
import Block, { blockTypes } from "./";

storiesOf('FormBuilder/FormBlocks', module)
  .add('Display all blocks', () => (
    <DndProvider backend={HTML5Backend}>
      <DragLayer />
      <div>
        {blockTypes.map(block => (
          <Block key={block.type} {...block} removeBlock={action('removeBlock')} />
        ))}
      </div>
    </DndProvider>
  ));
