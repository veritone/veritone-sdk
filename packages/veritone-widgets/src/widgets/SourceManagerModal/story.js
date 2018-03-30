import React from 'react';
import { bool, string } from 'prop-types';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import SourceManagerModalWidget from './';

const elId = 'source-manager-modal-widget';

class Story extends React.Component {
  static propTypes = {
    userIsAuthenticated: bool,
    fetchUserFailed: bool,
    sessionToken: string
  };

  componentDidMount() {
    this._sourceManagerModal = new SourceManagerModalWidget({
      elId: elId
    });
  }

  componentWillUnmount() {
    this._sourceManagerModal.destroy();
  }

  render() {
    return (
      <div>
        <span id={elId} />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Source Manager Modal', module).add('Base', () => {
  return <Story store={app._store} />;
});
