import React from 'react';

import Typography from 'material-ui/Typography';

import { createMount } from 'material-ui/test-utils';

import SearchPill from './';

let mount;
beforeAll(() => {
  mount = createMount();
});

describe('SearchPill', function() {
  it('renders labels correctly', function() {
    const label = 'hello world';

    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={label}
      />
    );

    expect(wrapper.find(Typography).text()).toEqual(label);
  });

  it('renders the background color correctly', function() {
    const wrapper = mount(<SearchPill engineCategoryIcon={'icon-transcription'} label={'label'} />);

    expect(wrapper.find('.searchPillBackgroundColor')).toHaveLength(1);
  });


  it('pills with exclude are rendered with a different color', function() {
    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
      />
    );

    expect(wrapper.find('.searchPillExcludeBackgroundColor')).toHaveLength(1);
  });


  it('selected color takes precedence over exclude color', function() {
    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
        selected
      />
    );

    expect(wrapper.find('.searchPillSelectedBackgroundColor')).toHaveLength(1);
    expect(wrapper.find('.searchPillExcludeBackgroundColor')).toHaveLength(0);
  });

  it('highlighted color takes precedence over exclude color', function() {
    const wrapper = mount(
      <SearchPill
        engineCategoryIcon={'icon-transcription'}
        label={'label'}
        exclude
        highlighted
      />
    );

    expect(wrapper.find('.searchPillHighlightedBackgroundColor')).toHaveLength(1);
    expect(wrapper.find('.searchPillExcludeBackgroundColor')).toHaveLength(0);

  });

  it('expect onClick to be called', function() {
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

    wrapper.find(SearchPill).simulate('click');
    expect(onClick).toHaveBeenCalled();
  });

  it('expect onDelete to be called and onClick to not be called', function() {
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

    wrapper.find('[data-attribute="deletePill"]').simulate('click');
    expect(onClick).not.toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });
});
