import React from 'react';
import { Work, AccessTime } from '@material-ui/icons';
import { storiesOf } from '@storybook/react';

import LeftNavigationPanel from './';

storiesOf('LeftNavigationPanel', module)
  .add('Full path list', () => {
    const pathList = [
      { text: 'My Files', selected: true, icon: <Work /> },
      { text: 'Recent', icon: <AccessTime /> },
      { text: 'Streams', seperated: true, icon: <div className='icon-streams' /> }
    ]
    return (
      <LeftNavigationPanel
        pathList={pathList}
      />
    );
  })
