import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import IconButton from '@material-ui/core/IconButton';

import HeaderBar from './HeaderBar';
import FolderViewContainer from './FolderViewContainer';
import Breadcrumbs from './Breadcrumbs';
import LeftNavigationPanel from './LeftNavigationPanel';
import MediaInfoPanel from './MediaInfoPanel';
import UploaderViewContainer from './UploaderViewContainer';

import {
  items,
  pathList,
  percentByFiles
} from './story';

import DataPicker from './';

describe('DataPicker', () => {
  it('Renders folder view correctly', () => {
    const wrapper = mount(
      <DataPicker
        availablePickerTypes={['folder', 'upload']}
        toggleContentView={noop}
        items={items}
        currentPickerType={'folder'}
        setPickerType={noop}
        triggerPagination={noop}
        onCancel={noop}
        isLoading={false}
        isLoaded
        pathList={pathList}
        onCrumbClick={noop}
        onSearch={noop}
        onClear={noop}
        onSort={noop}
        onSelect={noop}
        onRejectFile={noop}
        onUpload={noop}
        onDeleteFile={noop}
        percentByFiles={percentByFiles}
      />
    );

    expect(wrapper.exists(LeftNavigationPanel)).toBe(true);
    expect(wrapper.exists(HeaderBar)).toBe(true);
    expect(wrapper.exists(Breadcrumbs)).toBe(true);
    expect(wrapper.exists(MediaInfoPanel)).toBe(false);
    expect(wrapper.exists(FolderViewContainer)).toBe(true);
    expect(wrapper.exists(UploaderViewContainer)).toBe(false);

    // Open button should active until after a selection
    expect(
      wrapper
        .find('[data-veritone-element="picker-footer-Open-button"]')
        .hostNodes().prop('disabled')
    ).toBe(true);

    // Toggling media panel works
    const mediaPanelToggle = wrapper.find(IconButton);
    mediaPanelToggle.simulate('click');
    
    wrapper.find('[data-veritone-element="folder-list-item"]').hostNodes().first().simulate('click');
    expect(
      wrapper
        .find('[data-veritone-element="folder-list-item"]')
        .hostNodes()
        .first()
        .find('[data-test="selected"]')
    ).toHaveLength(1);
    expect(wrapper.exists(MediaInfoPanel)).toBe(true);

    // Open button should be active now
    expect(
      wrapper
        .find('[data-veritone-element="picker-footer-Open-button"]')
        .hostNodes()
        .prop('disabled')
    ).toBe(false);
  });
});