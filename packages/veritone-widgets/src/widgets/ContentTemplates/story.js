import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import VeritoneApp from '../../shared/VeritoneApp';
import ContentTemplatesWidget from './';

class Story extends React.Component {

  componentDidMount() {
    this._contentTemplates = new ContentTemplatesWidget({
      elId: 'content-template-widget'
    });
  }

  componentWillUnmount() {
    this._contentTemplates.destroy();
  }

  render() {
    return (
      <div>
        <span id="content-template-widget" />
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('ContentTemplates', module).add('Base', () => {
  return <Story store={app._store} />;
});
