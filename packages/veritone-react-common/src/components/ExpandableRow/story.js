import React from 'react';
import { storiesOf } from '@storybook/react';

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ExpandableRow from './';

storiesOf('ExpandableRow', module).add('Base', () => {
  const onToggle = console.log("Toggled expandable row");
  return (
    <div
      style={{ width: '600px', display: 'flex', justifyContent: 'flex-end' }}
    >
      <ExpandableRow
        iconOpen={<KeyboardArrowDown />}
        iconClose={<KeyboardArrowUp />}
        onToggle={ onToggle }
        summary={"This is a row"}
        details={"This is moe infomation"}
      />
    </div>
  );
});
