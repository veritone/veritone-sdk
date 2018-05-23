import React from 'react';
import { mount } from 'enzyme';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import FilePickerFooter from './';

describe('FilePickerFooter', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<FilePickerFooter />);
  });

  it('should have an "Upload" button and a "Cancel" button', () => {
    const buttons = wrapper.find(Button);
    let buttonTexts = ['Upload', 'Cancel'];
    buttons.forEach(button => {
      expect(_.includes(buttonTexts, button.text())).toEqual(true);
    });
  });
});
