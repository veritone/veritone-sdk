import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../../shared/VeritoneApp';
import DynamicAdapterObj from './';
const DynamicAdapter = DynamicAdapterObj.widget;

class Story extends React.Component {

  componentDidMount() {
    this._adapter = new DynamicAdapter({
      elId: 'dynamic-adapter-widget'
    });
  }

  componentWillUnmount() {
    this._adapter.destroy();
  }

  render() {
    return (
      <div>
        <span id="dynamic-adapter-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('DynamicAdapter', module).add('Base', () => {
  return <Story store={app._store} />;
});
