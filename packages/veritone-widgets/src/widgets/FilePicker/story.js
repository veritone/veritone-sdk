import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import FilePicker from './';

storiesOf('FilePickerWidget', module).add('Base', () => {
  const app = new VeritoneApp([
    new FilePicker({
      elId: 'file-picker-widget',
      widgetId: 'picker'
    })
  ]);

  const mountApp = app.mount.bind(app);
  const destroyApp = app.destroy.bind(app);

  return (
    <div>
      <div id="file-picker-widget"/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={mountApp}>Mount</button>
      <button onClick={destroyApp}>destroy</button>
      <br/>
      <button onClick={() => app.getWidget('picker').open()}>pick files</button>
    </div>
  );
});
