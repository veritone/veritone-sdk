import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import BaseStory from '../../shared/BaseStory';
import EngineOutputExport from './index';

const tdoData = [
  {
    // This is input passed thru
    id: '400000238',
    startOffsetMs: 0,
    stopOffsetMs: 27830
  },
  {
    id: '400008571'
  }
];

class Story extends React.Component {
  render() {
    return (
      <EngineOutputExport
        tdos={tdoData}
        enableBulkExport
        onCancel={action('Cancel Export and Download')}
        onExport={action('Export')}
      />
    );
  }
}

storiesOf('EngineOutputExport', module).add('Base', () => {
  return <BaseStory componentClass={Story} />;
});
