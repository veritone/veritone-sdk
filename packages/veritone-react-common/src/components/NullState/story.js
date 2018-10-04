import React from 'react';
import { storiesOf } from '@storybook/react';
import { noop } from 'lodash';

import NullstateImage from 'images/cms-ingestion-jobs-null.svg';
import NullStateCard from './NullStateCard';

storiesOf('Null Card', module).add('Base', () => {
  return (
    <NullStateCard
      imgSrc={NullstateImage}
      imgProps={{
        alt: 'https://static.veritone.com/veritone-ui/default-nullstate.svg'
      }}
      titleText="On Premise"
      btnProps={{
        text: 'Get Started',
        onClick: noop
      }}
    >
      <p>
        Proin porta augue nec venenatis malesuada. Aenean at nulla at magna
        accumsan varius. Vivamus tempus purus at est venenatis.
      </p>
    </NullStateCard>
  );
});
