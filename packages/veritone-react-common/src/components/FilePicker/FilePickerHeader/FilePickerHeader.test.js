import React from 'react';
import { mount } from 'enzyme';
import Tabs, { Tab } from 'material-ui/Tabs';
import FilePickerHeader from './';

describe('FilePickerHeader', () => {
  let wrapper, onSelectTab, onCloseModal;
  beforeEach(() => {
    onSelectTab = jest.fn();
    onCloseModal = jest.fn();
    wrapper = mount(
      <FilePickerHeader
        selectedTab="upload"
        onSelectTab={onSelectTab}
        onClose={onCloseModal}
        allowUrlUpload
      />
    );
  });

  it('should have a title of "File Picker"', () => {
    const filePickerTitle = wrapper.find('.filePickerTitle');
    expect(filePickerTitle.exists()).toEqual(true);
    expect(filePickerTitle.text() === 'File Picker');
  });

  it('should have a Tabs bar with two tabs', () => {
    const tabsBar = wrapper.find(Tabs);
    expect(tabsBar.exists);
    expect(tabsBar.find(Tab)).toHaveLength(2);
  });

  it('onSelectTab should be called when a tab is clicked', () => {
    const urlUploadTab = wrapper.find(Tab).at(1);
    urlUploadTab.simulate('click');
    expect(onSelectTab).toHaveBeenCalled();
  });

  it('should have a close "x" button', () => {
    const xButton = wrapper.find('.icon-close-exit');
    expect(xButton.exists()).toEqual(true);
  });

  it('should call onCloseModal when the close button is clicked', () => {
    const xButton = wrapper.find('.icon-close-exit');
    xButton.simulate('click');
    expect(onCloseModal).toHaveBeenCalled();
  });
});
