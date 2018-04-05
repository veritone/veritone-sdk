import React from 'react';
import { bool, string } from 'prop-types';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../../shared/VeritoneApp';
import SDOAdapterObj from './';
const SDOAdapter = SDOAdapterObj.widget;

class Story extends React.Component {
  static propTypes = {
    userIsAuthenticated: bool,
    fetchUserFailed: bool,
    sessionToken: string
  };

  componentDidMount() {
    this._scheduler = new SDOAdapter({
      elId: 'sdo-adapter-widget'
    });
  }

  componentWillUnmount() {
    this._scheduler.destroy();
  }

  render() {
    return (
      <div>
        <span id="sdo-adapter-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('SDOAdapter', module).add('Base', () => {
  return <Story store={app._store} />;
});
