import React from 'react';
import { storiesOf } from '@storybook/react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop } from 'lodash';
import formItems, { PreviewWrapper } from './';


const sampleForm = [
  {
    name: "textInput-1234",
    type: "textInput",
    instruction: "Input the text value",
    error: 'Field is required',
    required: true
  },
  {
    name: "paragraph-2345",
    type: "paragraph",
    value: "<div>hello world</div>",
    instruction: "Input biography",
    error: ''
  },
  {
    name: "checkBox-3456",
    type: "checkBox",
    items: [
      {
        value: "option 1",
        id: "1"
      },
      {
        value: "option 2",
        id: "2"
      },
      {
        value: "option 3",
        id: "3"
      }
    ],
    instruction: "Select your favourites",
    error: 'Error'
  },
  {
    name: "dateTime",
    type: "dateTime",
  },
  {
    name: 'rating-123',
    type: 'rating'
  },
  {
    name: 'radio',
    type: 'radio',
    items: [
      {
        value: "option 1",
        id: "1"
      },
      {
        value: "option 2",
        id: "2"
      },
      {
        value: "option 3",
        id: "3"
      }
    ],
    instruction: "Select your education",
  },
  {
    name: 'select',
    type: 'select',
    items: [
      {
        value: "option 1",
        id: "1"
      },
      {
        value: "option 2",
        id: "2"
      },
      {
        value: "option 3",
        id: "3"
      }
    ],
    value: 'option 1',
    instruction: 'Select you gender'
  }
];

storiesOf('FormBuilder', module)
  .add('Preview', () => (
    <DndProvider backend={HTML5Backend}>
      {sampleForm.map((block, index) => {
        const BlockItem = formItems[block.type];
        return (
          <PreviewWrapper
            index={index}
            selected={0 === index}
            key={block.name}
            addBlock={noop}
            swapBlock={noop}
            updateBlock={noop}
            removeBlock={noop}
            selectBlock={noop}
          >
            <BlockItem {...block} />
          </PreviewWrapper>
        );
      })}
    </DndProvider>
  ))
