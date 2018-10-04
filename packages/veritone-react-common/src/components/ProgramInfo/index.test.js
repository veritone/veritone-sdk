import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { combineReducers, createStore } from 'redux';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/ModeEdit';
import { generateAffiliateById } from './Affiliates/test-helpers';
import Affiliates from './Affiliates';
import ProgramInfo from './index';

describe('Program Info', () => {
  const TEST_PROGRAM = {
    programImage: '',
    programLiveImage:
      'https://www.veritone.com/wp-content/uploads/2017/05/veritoneregistered16.png',
    description: 'This is a test program data with description',
    website: 'www.veritone.com',
    format: 'live',
    language: 'en',
    isNational: true,
    affiliateById: generateAffiliateById(10, true)
  };

  const TEST_PROGRAM_FORMATS = ['live', 'recorded'];

  const store = createStore(
    combineReducers({
      form: formReducer
    })
  );

  it('should render program info', () => {
    const onSubmit = jest.fn();
    const loadNextAffiliates = jest.fn();
    const onUploadImage = jest.fn();
    const onRemoveImage = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ProgramInfo
          showAffiliates
          canBulkAddAffiliates
          program={TEST_PROGRAM}
          programFormats={TEST_PROGRAM_FORMATS}
          loadNextAffiliates={loadNextAffiliates}
          onSubmit={onSubmit}
          onUploadImage={onUploadImage}
          onRemoveImage={onRemoveImage}
        />
      </Provider>
    );

    const programLiveImageSection = wrapper.find('.programLiveImageSection');
    expect(
      programLiveImageSection.find('.programInfoFieldHeader').text()
    ).toEqual('Program Live Image');
    expect(
      programLiveImageSection.find('.programInfoFieldDescription').text()
    ).toEqual('Recommended image size: 500x350 .jpg or .png');
    expect(programLiveImageSection.find('img').props().src).toEqual(
      TEST_PROGRAM.programLiveImage
    );
    const liveImageOverlay = programLiveImageSection.find('.imageOverlay');
    expect(liveImageOverlay.find(DeleteIcon)).toHaveLength(1);
    expect(liveImageOverlay.find(EditIcon)).toHaveLength(1);
    liveImageOverlay.find(DeleteIcon).simulate('click');
    expect(onRemoveImage.mock.calls.length).toBe(1);
    liveImageOverlay.find(EditIcon).simulate('click');
    expect(onUploadImage.mock.calls.length).toBe(1);

    const programImageSection = wrapper.find('.programImageSection');
    expect(programImageSection.find('.programInfoFieldHeader').text()).toEqual(
      'Program Image'
    );
    expect(
      programImageSection.find('.programInfoFieldDescription').text()
    ).toEqual('Recommended image size: 250x250 .jpg or .png');
    expect(programImageSection.find('.programImageNullState')).toHaveLength(1);
    programImageSection.find('.programImageNullState').simulate('click');
    expect(onUploadImage.mock.calls.length).toBe(2);

    const descriptionSection = wrapper.find('.programInfoSection').at(1);
    expect(
      descriptionSection
        .find('.programInfoInputField')
        .find('label')
        .text()
    ).toEqual('Description');
    expect(
      descriptionSection
        .find('.programInfoInputField')
        .find('textarea')
        .last()
        .instance().value
    ).toEqual(TEST_PROGRAM.description);
    expect(
      descriptionSection
        .find('.programInfoInputField')
        .find('textarea')
        .last()
        .instance().disabled
    ).toEqual(false);

    const websiteSection = wrapper.find('.programInfoSection').at(2);
    expect(
      websiteSection
        .find('.programInfoInputField')
        .find('label')
        .text()
    ).toEqual('Program Website (Optional)');
    expect(
      websiteSection
        .find('.programInfoInputField')
        .find('input')
        .instance().value
    ).toEqual(TEST_PROGRAM.website);
    expect(
      websiteSection
        .find('.programInfoInputField')
        .find('input')
        .instance().disabled
    ).toEqual(false);

    const formatsSection = wrapper.find('.programInfoSection').at(3);
    expect(formatsSection.find('label').text()).toEqual('Program Format');
    expect(formatsSection.find('input').instance().value).toEqual(
      TEST_PROGRAM.format
    );
    expect(formatsSection.find('Select').props().disabled).toBeUndefined();

    const isNationalSection = wrapper.find('.programInfoSection').at(4);
    expect(isNationalSection.find('label').text()).toEqual('Is National');
    expect(
      isNationalSection
        .find({ type: 'checkbox' })
        .at(0)
        .props().checked
    ).toEqual(true);

    expect(wrapper.find(Affiliates)).toHaveLength(1);
  });

  it('should render program info in readonly mode', () => {
    const onSubmit = jest.fn();
    const loadNextAffiliates = jest.fn();
    const onUploadImage = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ProgramInfo
          readOnly
          showAffiliates
          canBulkAddAffiliates
          program={TEST_PROGRAM}
          programFormats={TEST_PROGRAM_FORMATS}
          loadNextAffiliates={loadNextAffiliates}
          onSubmit={onSubmit}
          onUploadImage={onUploadImage}
        />
      </Provider>
    );

    const programLiveImageSection = wrapper.find('.programLiveImageSection');
    expect(
      programLiveImageSection.find('.programInfoFieldHeader').text()
    ).toEqual('Program Live Image');
    expect(
      programLiveImageSection.find('.programInfoFieldDescription').text()
    ).toEqual('Recommended image size: 500x350 .jpg or .png');
    expect(programLiveImageSection.find('.imageOverlay')).toHaveLength(0);

    const programImageSection = wrapper.find('.programImageSection');
    expect(programImageSection.find('.programInfoFieldHeader').text()).toEqual(
      'Program Image'
    );
    expect(
      programImageSection.find('.programInfoFieldDescription').text()
    ).toEqual('Recommended image size: 250x250 .jpg or .png');
    expect(programImageSection.find('.programImageNullState')).toHaveLength(1);
    programImageSection.find('.programImageNullState').simulate('click');
    expect(onUploadImage.mock.calls.length).toBe(0);

    const descriptionSection = wrapper.find('.programInfoSection').at(1);
    expect(
      descriptionSection
        .find('.programInfoInputField')
        .find('label')
        .text()
    ).toEqual('Description');
    expect(
      descriptionSection
        .find('.programInfoInputField')
        .find('textarea')
        .last()
        .instance().value
    ).toEqual(TEST_PROGRAM.description);
    expect(
      descriptionSection
        .find('.programInfoInputField')
        .find('textarea')
        .last()
        .instance().disabled
    ).toEqual(true);

    const websiteSection = wrapper.find('.programInfoSection').at(2);
    expect(
      websiteSection
        .find('.programInfoInputField')
        .find('label')
        .text()
    ).toEqual('Program Website (Optional)');
    expect(
      websiteSection
        .find('.programInfoInputField')
        .find('input')
        .instance().value
    ).toEqual(TEST_PROGRAM.website);
    expect(
      websiteSection
        .find('.programInfoInputField')
        .find('input')
        .instance().disabled
    ).toEqual(true);

    const formatsSection = wrapper.find('.programInfoSection').at(3);
    expect(formatsSection.find('label').text()).toEqual('Program Format');
    expect(formatsSection.find('input').instance().value).toEqual(
      TEST_PROGRAM.format
    );
    expect(formatsSection.find('Select').props().disabled).toEqual(true);

    const isNationalSection = wrapper.find('.programInfoSection').at(4);
    expect(isNationalSection.find('label').text()).toEqual('Is National');
    expect(
      isNationalSection
        .find({ type: 'checkbox' })
        .at(0)
        .props().checked
    ).toEqual(true);

    expect(wrapper.find(Affiliates)).toHaveLength(1);
  });

  it('should not render affiliates section', () => {
    const onSubmit = jest.fn();
    const loadNextAffiliates = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <ProgramInfo
          program={TEST_PROGRAM}
          programFormats={TEST_PROGRAM_FORMATS}
          loadNextAffiliates={loadNextAffiliates}
          onSubmit={onSubmit}
        />
      </Provider>
    );
    expect(wrapper.find(Affiliates)).toHaveLength(0);
  });
});
