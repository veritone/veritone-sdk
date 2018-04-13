import React from 'react';

import { createMount } from 'material-ui/test-utils';
import Typography from 'material-ui/Typography';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import SearchPill from './';

let mount;
beforeAll(() => {
  mount = createMount();
});

describe('SearchPill', function() {
  it('passes labels to the SearchPill', function() {
    const label = 'hello world';
    const wrapper = mount(
      <MuiThemeProvider theme={createMuiTheme()}>
        <SearchPill engineCategoryIcon={'icon-transcription'} label={label} />
      </MuiThemeProvider>
    );
    expect(wrapper.find(Typography).text()).to.equal(label);
  });
});
