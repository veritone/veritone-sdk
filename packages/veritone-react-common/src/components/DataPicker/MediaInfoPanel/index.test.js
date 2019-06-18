import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import Typography from '@material-ui/core/Typography';

import MediaPlayer from '../../MediaPlayer';
import MediaInfoPanel from './';
import { tdo, folderItem, imageItem } from './story';

describe('MediaInfoPanel', () => {
  it('Renders video TDO properly w/ close button', () => {
    const wrapper = mount(
      <MediaInfoPanel
        open
        selectedItems={[tdo]}
        width={450}
        toggleMediaInfoPanel={noop}
      />
    );
    expect(wrapper.find('[data-veritone-element="close-button"]').length).toBe(1);
    expect(wrapper.find(MediaPlayer).length).toBe(1);
    const tdoElem = wrapper.find(Typography);
    expect(tdoElem.length).toBe(1);
    expect(tdoElem.text()).toBe(tdo.name);

  });
});