import React from 'react';
import { storiesOf } from '@storybook/react';
import { DndProvider } from "react-dnd";
import { action } from '@storybook/addon-actions';
import HTML5Backend from "react-dnd-html5-backend";
import FormConfiguration from './';

storiesOf('FormBuilder/FormConfiguration', module)
  .add('textInput', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="textInput"
        onChange={action('text input')}
        name="firstName"
        label="Your first name"
        instruction="Input your first name"
      />
    </DndProvider>
  ))
  .add('paragraph', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="paragraph"
        onChange={action('update paragraph')}
        name="biography"
        label="Your biography"
        instruction="Write your biography"
      />
    </DndProvider>
  ))
  .add('radio', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="radio"
        onChange={action('update radio')}
        items={[
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
        ]}
        name="grade"
        label="Your grade"
        instruction="Select your grade"
      />
    </DndProvider>
  ))
  .add('checkBox', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="checkBox"
        onChange={action('update checkBox')}
        items={[
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
        ]}
        name="favourite"
        label="Your Favourites"
        instruction="Check your favourites"
      />
    </DndProvider>
  ))
  .add('dateTime', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="dateTime"
        onChange={action('update dateTime')}
        name="dateOfBirth"
        label="Your birthday"
        instruction="Input your birthday"
        dateFormat="dd-MM-yyyy"
      />
    </DndProvider>
  ))
  .add('rating', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="rating"
        onChange={action('update rating')}
      />
    </DndProvider>
  ))
  .add('select', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="select"
        onChange={action('update select')}
        items={[
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
        ]}
      />
    </DndProvider>
  ))
  .add('switch', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="switch"
        onChange={action('update switch')}
      />
    </DndProvider>
  ))
  .add('number', () => (
    <DndProvider backend={HTML5Backend}>
      <FormConfiguration
        type="number"
        onChange={action('update number')}
      />
    </DndProvider>
  ))


