import React from 'react';
import { mount } from 'enzyme';

import styles from './styles.scss';

import Snippet from './';

describe('Snippet', () => {
  it('initializes with text', () => {
    const snippetClicked = jest.fn();
    const wrapper = mount(
      <Snippet
        snippet={{ text: 'testsnippettext' }}
        onSnippetClick={snippetClicked}
      />
    );
    expect(wrapper.find('p').text()).toMatch(/testsnippettext/);
  });

  it('should have bodlText class when boldText prop is true', () => {
    const snippetClicked = jest.fn();
    const wrapper = mount(
      <Snippet
        snippet={{ text: 'testsnippettext' }}
        onSnippetClick={snippetClicked}
        boldText
      />
    );
    expect(wrapper.find('p').hasClass(styles.boldText)).toEqual(true);
  });

  it('should call onSnippetClicked when the snippet is clicked', () => {
    const snippetClicked = jest.fn();
    const wrapper = mount(
      <Snippet
        snippet={{ text: 'testsnippettext' }}
        onSnippetClick={snippetClicked}
      />
    );
    wrapper.find('p').simulate('click');
    expect(snippetClicked).toHaveBeenCalled();
  });
});
