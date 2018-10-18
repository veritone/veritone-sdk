import React from 'react';
import { omit } from 'lodash';
import { mount } from 'enzyme';
import { reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import LibraryForm, { validate } from './index';

const testValues = {
  libraryName: 'Test Library Name',
  libraryTypeId: 'test-library-id',
  description: 'Test description'
};

const longDescription =
  'Test description with over 240 characters that we want to see if it' +
  'throws an error 1234 1234 1234 1234 1234 1234 1234 1234 1234 1234 1324 1234' +
  'asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf' +
  'qwerty qwerty qwerty qwer';

describe('validate', () => {
  it('should validate that libraryName is not empty', () => {
    expect(validate(omit(testValues, ['libraryName']))).toEqual({
      libraryName: 'Required'
    });
  });

  it('should validate that libraryTypeId is not empty', () => {
    expect(validate(omit(testValues, ['libraryTypeId']))).toEqual({
      libraryTypeId: 'Required'
    });
  });

  it('should validate that description is less than or equal to 240 characters', () => {
    expect(
      validate({
        ...testValues,
        description: longDescription
      })
    ).toEqual({ description: 'Must be 240 characters or less' });
  });
});

describe('LibraryForm', () => {
  let store, libraryFormComponent;
  const libraryTypes = [
    {
      id: 'test-123',
      name: 'testLibraryType'
    },
    {
      id: 'test-abc',
      name: 'testLibraryType2'
    }
  ];
  beforeEach(() => {
    store = createStore(combineReducers({ form: formReducer }));
  });

  afterEach(() => {
    libraryFormComponent.unmount();
  });

  it('shows custom library name label', () => {
    const testLabelInChinese = '测试标签';
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          libraryNameLabel={testLabelInChinese}
        />
      </Provider>
    );

    expect(
      libraryFormComponent
        .find('[data-veritone-element="library-name-input"]')
        .find('label')
        .text()
    ).toEqual(testLabelInChinese);
  });

  it('shows custom library type label', () => {
    const testLabelInRussian = 'Тестовая этикетка';
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          libraryTypesLabel={testLabelInRussian}
        />
      </Provider>
    );

    expect(
      libraryFormComponent
        .find('[data-veritone-element="library-type"]')
        .find('label')
        .text()
    ).toEqual(testLabelInRussian);
  });

  it('shows custom library description label', () => {
    const testLabelInIcelandic = 'Prófmerki';
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          descriptionLabel={testLabelInIcelandic}
        />
      </Provider>
    );

    expect(
      libraryFormComponent
        .find('[data-veritone-element="library-description-input"]')
        .find('label')
        .text()
    ).toEqual(testLabelInIcelandic);
  });

  it('has disabled create button if libraryName is empty', () => {
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          initialValues={omit(testValues, ['libraryName'])}
        />
      </Provider>
    );
    expect(
      libraryFormComponent
        .find('[data-veritone-element="create-button"]')
        .first()
        .html()
        .includes('disabled=""')
    ).toEqual(true);
  });

  it('has disabled create button if libraryTypeId is empty', () => {
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          initialValues={omit(testValues, ['libraryTypeId'])}
        />
      </Provider>
    );
    expect(
      libraryFormComponent
        .find('[data-veritone-element="create-button"]')
        .first()
        .html()
        .includes('disabled=""')
    ).toEqual(true);
  });

  it('has disabled create button if description is greater than 240 characters', () => {
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          initialValues={{ ...testValues, description: longDescription }}
        />
      </Provider>
    );
    expect(
      libraryFormComponent
        .find('[data-veritone-element="create-button"]')
        .first()
        .html()
        .includes('disabled=""')
    ).toEqual(true);
  });

  it('should call onSubmit when valid form is submitted', () => {
    const handler = jest.fn();
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          initialValues={testValues}
          onSubmit={handler}
        />
      </Provider>
    );
    const libraryForm = libraryFormComponent.find('form');
    libraryForm.simulate('submit');
    expect(handler).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const handler = jest.fn();
    libraryFormComponent = mount(
      <Provider store={store}>
        <LibraryForm
          libraryTypes={libraryTypes}
          initialValues={testValues}
          onCancel={handler}
        />
      </Provider>
    );
    const libraryForm = libraryFormComponent
      .find('[data-veritone-element="cancel-button"]')
      .first();
    libraryForm.simulate('click');
    expect(handler).toHaveBeenCalled();
  });
});
