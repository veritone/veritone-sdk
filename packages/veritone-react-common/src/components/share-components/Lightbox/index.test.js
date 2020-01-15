import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import Lightbox from './';

const customValue = { value: 'this is a test' };
describe('Lightbox Component', () => {
  const handleOnClose = jest.fn();
  const handleOnBackdropClick = jest.fn();
  const handleOnCloseButtonClick = jest.fn();
  const lightbox = mount(
    <Lightbox
      data={customValue}
      onClose={handleOnClose}
      onBackdropClick={handleOnBackdropClick}
      onCloseButtonClick={handleOnCloseButtonClick}
    >
      <div className="lightboxContent">Lightbox Content</div>
    </Lightbox>
  );

  const closeButton = lightbox.find(IconButton);
  const background = lightbox.find('[data-test="background"]');
  const content = lightbox.find('div.lightboxContent');

  it("Lightbox is hidden when it shouldn't be", () => {
    expect(lightbox.find('div[data-test="open"]')).toHaveLength(1);
    expect(lightbox.find('div[data-test="hidden"]')).toHaveLength(0);
  });

  it('Missing Lighbox Close Button', () => {
    expect(closeButton).toHaveLength(1);
  });

  it("Close Button clicking doesn't work", () => {
    closeButton.simulate('click');
    expect(handleOnCloseButtonClick).toHaveBeenCalledWith(
      expect.any(Object),
      customValue
    );
  });

  it('Missing Lighbox Background', () => {
    expect(background).toHaveLength(1);
  });

  it("Back ground clicking doesn't work", () => {
    background.simulate('click');
    expect(handleOnBackdropClick).toHaveBeenCalledWith(
      expect.any(Object),
      customValue
    );
  });

  it('Missing Lightbox Content Element', () => {
    expect(content).toHaveLength(1);
  });

  it('Missing Lightbox Content', () => {
    expect(content.text()).toEqual('Lightbox Content');
  });

  const customLightbox = mount(
    <Lightbox closeButton={false}>
      <div className="lightboxContent">Lightbox Content</div>
    </Lightbox>
  );

  it('Close Button is not disabled', () => {
    expect(customLightbox.find('IconButton')).toHaveLength(0);
  });
});
