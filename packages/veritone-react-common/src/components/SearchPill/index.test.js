import React from 'react';

import Chip from '@material-ui/core/Chip';

import { createMount } from '@material-ui/core/test-utils';

import SearchPill from './';

let mount;
beforeAll(() => {
  mount = createMount();
});

describe('SearchPill', function () {
  it('renders labels correctly', function () {
    const label = 'hello world';

    const wrapper = mount(
      <SearchPill engineCategoryIcon={'icon-transcription'} label={label} />
    );

    expect(wrapper.find(Chip).text()).toEqual(label);
  });

  it('renders the background color correctly', function () {
    const wrapper = mount(
      <SearchPill engineCategoryIcon={'icon-transcription'} label={'label'} />
    );

    expect(wrapper.find('div[data-test="searchPillBackgroundColor"]')).toHaveLength(1);
  });

  it('renders excluded pills with a different color', function () {
    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
      />
    );

    expect(wrapper.find('div[data-test="searchPillExcludeBackgroundColor"]')).toHaveLength(1);
  });

  it('renders pills with the selected color over the excluded color', function () {
    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
        selected
      />
    );

    expect(wrapper.find('div[data-test="searchPillSelectedBackgroundColor"]')).toHaveLength(1);
    expect(wrapper.find('div[data-test="searchPillExcludeBackgroundColor"]')).toHaveLength(0);
  });

  it('displays highlighted backgroundColor precedence over excluded backgroundColor', function () {
    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
        highlighted
      />
    );

    expect(wrapper.find('div[data-test="searchPillHighlightedBackgroundColor"]')).toHaveLength(
      1
    );
    expect(wrapper.find('div[data-test="searchPillExcludeBackgroundColor"]')).toHaveLength(0);
  });

  it('expects onClick to be called', function () {
    const onClick = jest.fn();
    let wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
        highlighted
        onClick={onClick}
      />
    );

    wrapper.find(SearchPill).simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('expects onDelete to be called and onClick to not be called', function () {
    const onClick = jest.fn();
    const onDelete = jest.fn();
    let wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
        highlighted
        onClick={onClick}
        onDelete={onDelete}
      />
    );

    wrapper.find('svg.MuiChip-deleteIcon').simulate('click');
    expect(onClick).not.toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });
});
