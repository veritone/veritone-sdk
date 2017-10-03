import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import RaisedTextField from './';

storiesOf('RaisedTextField', module)
  .add('Value only', () => <RaisedTextField value="Hello" />)
  .add('Label only', () => <RaisedTextField label="Name" />)
  .add('Action only', () => (
    <RaisedTextField action="go" onClickAction={action('clicked')} />
  ))
  .add('Edit action', () => (
    <RaisedTextField
      action="edit"
      label="Name"
      value="The President"
      onClickAction={action('clicked')}
    />
  ))
  .add('Go action', () => (
    <RaisedTextField
      action="go"
      label="Name"
      value="The President"
      onClickAction={action('clicked')}
    />
  ))
  .add('Stacked and mixed', () => (
    <div>
      <RaisedTextField label="First Name" value="Hello" />
      <RaisedTextField
        label="Name"
        value="Hello this is my really really long name"
        action="go"
        onClickAction={action('clicked')}
      />
      <RaisedTextField
        value="Hello"
        action="edit"
        onClickAction={action('clicked')}
      />
      <RaisedTextField
        label="Name And Also Where You Were Born And Your Favorite Beverage"
        value="My name is Chad Steelberg and I was born in Northridge, CA on May 8, 1971 and I really like Diet Coke"
        action="edit"
        onClickAction={action('clicked')}
      />
    </div>
  ))
  .add('With styling', () => (
    <RaisedTextField
      label="Name"
      value="Hello this is my really long overflowing name"
      action="go"
      onClickAction={action('clicked')}
      containerStyle={{ maxWidth: '300px' }}
    />
  ));
