import React from 'react';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import { SaveSearchWidget, LoadSavedSearchWidget } from './';

import InfiniteScrollTable from './LoadSavedSearch/table';

import ReplaceDialog from './SaveSearch/replace';

import { ExpandableRow } from 'veritone-react-common';

import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';

import { object } from '@storybook/addon-knobs';

storiesOf('SavedSearch', module).add('SaveSearch', () => {
  const cspFromSearchBar = {
    and: [
      {
        state: {
          exclude: false,
          id: '237eca2b-bbd8-4591-a5d3-91d37a458916',
          type: 'entity',
          label: 'Kobe Bryant',
          image:
            'https://prod-veritone-library.s3.amazonaws.com/2277175f-5a26-4199-bdbc-cff3311297b0/237eca2b-bbd8-4591-a5d3-91d37a458916/profile-1507911101521.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJUCF3BCNMSE5YZEQ%2F20180627%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180627T011836Z&X-Amz-Expires=900&X-Amz-Signature=743076e425839c5b456db2d13ead2b1c151371d92e7f92926e0afef17fcee26e&X-Amz-SignedHeaders=host',
          description: 'TV-News-Personality'
        },
        engineCategoryId: '6faad6b7-0837-45f9-b161-2f6bf31b7a07'
      }
    ]
  };

  const props = {
    csp: object('csp', cspFromSearchBar),
    relativeSize: 10
  };

  return (
    <div style={{ width: '850px' }}>
      <BaseStory
        widget={SaveSearchWidget}
        widgetProps={props}
        widgetInstanceMethods={{
          open: instance => instance.open()
        }}
      />
    </div>
  );
});

storiesOf('SavedSearch', module).add('LoadSavedSearch', () => {
  const props = {
    onSelectSavedSearch: csp => console.log('Load CSP', csp),
    relativeSize: 10
  };

  return (
    <div style={{ width: '950px' }}>
      <BaseStory
        widget={LoadSavedSearchWidget}
        widgetProps={props}
        widgetInstanceMethods={{
          open: instance => instance.open()
        }}
      />
    </div>
  );
});

storiesOf('SavedSearch', module).add('InfiniteScrollTable', () => {
  return (
    <div style={{ width: '500px', height: '300px' }}>
      <InfiniteScrollTable />
    </div>
  );
});

storiesOf('SavedSearch', module).add('ExpandableRow', () => {
  const onToggle = console.log('Toggle');
  return (
    <div style={{ width: '500px' }}>
      <ExpandableRow
        iconOpen={<KeyboardArrowDown />}
        iconClose={<KeyboardArrowUp />}
        onToggle={onToggle}
        summary={`Summary`}
        details={`Row details`}
      />
    </div>
  );
});

storiesOf('SavedSearch', module).add('Replace Dialog', () => {
  const onCloseModal = () => console.log('Cancel replace Search Profile');
  const onReplace = () => console.log('Confirm replace Search Profile');
  return (
    <div style={{ width: '850px' }}>
      <ReplaceDialog
        searchProfileName={'hello world'}
        onClose={onCloseModal}
        onReplace={onReplace}
      />
    </div>
  );
});
