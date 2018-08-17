import React from 'react';
import { mount } from 'enzyme';
import ButtonWrapper from './';

const customValue = { value: 'this is a test' };
describe('Button Wrapper Component', () => {
  const handleOnClick = jest.fn();
  const buttonWrapper = mount(
    <ButtonWrapper onClick={handleOnClick} data={customValue}>
      <div>Button Label</div>
    </ButtonWrapper>
  );

  const buttonBody = buttonWrapper.find('div');

  it('Missing Button Body', () => {
    expect(buttonBody).toHaveLength(1);
  });

  it('Missing Button Content', () => {
    expect(buttonBody.text()).toEqual('Button Label');
  });

  it('missing click custom data', () => {
    buttonBody.simulate('click');
    expect(handleOnClick).toHaveBeenCalledWith(expect.any(Object), customValue);
  });
});
