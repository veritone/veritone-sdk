import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';

import EngineSelectionWidget from './';

storiesOf('EngineSelectionWidget', module).add('Base', () => {
  const app = new VeritoneApp([
    new EngineSelectionWidget({
      elId: 'engine-selection-widget'
    })
  ]);

  const mountApp = app.mount.bind(app);
  const destroyApp = app.destroy.bind(app);


  return (
    <div>
      <div id="engine-selection-widget"/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={mountApp}>Mount</button>
      <button onClick={destroyApp}>destroy</button>
    </div>
  )
});
