import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import { templateData, initialTemplates } from './sample-data';
import TemplateList from './TemplateList';
import TemplateForms from './TemplateForms';
import FormCard from './FormCard';
import ContentTemplateForm from './ContentTemplateForm';

describe('Content Templates', () => {
  const handleSubmit = jest.fn();

  it('should render initial templates if supplied', () => {
    const wrapper = mount(
      <ContentTemplateForm
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={handleSubmit}
      />
    );

    const iconButtons = wrapper.find(TemplateList).find(IconButton);
    const formCardContainer = wrapper.find(TemplateForms).find(FormCard);

    expect(iconButtons).toHaveLength(2);
    expect(formCardContainer).toHaveLength(1);
  });
  it('should not render initial templates if supplied', () => {
    const wrapper = mount(
      <ContentTemplateForm
        templateData={templateData}
        onSubmit={handleSubmit}
      />
    );

    const iconButtons = wrapper.find(TemplateList).find(IconButton);
    const formCardContainer = wrapper.find(TemplateForms).find(FormCard);

    expect(iconButtons).toHaveLength(2);
    expect(formCardContainer).toHaveLength(0);
  });
  it('should add template', () => {
    const wrapper = mount(
      <ContentTemplateForm
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={handleSubmit}
      />
    );

    let formCardContainer = wrapper.find(TemplateForms).find(FormCard);

    expect(formCardContainer).toHaveLength(1);

    wrapper
      .find(TemplateList)
      .find('.icon-zoom-in')
      .first()
      .simulate('click');

    formCardContainer = wrapper.find(TemplateForms).find(FormCard);
    expect(formCardContainer).toHaveLength(2);
  });
  it('should remove template', () => {
    const wrapper = mount(
      <ContentTemplateForm
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={handleSubmit}
      />
    );

    let formCardContainer = wrapper.find(TemplateForms).find(FormCard);
    expect(formCardContainer).toHaveLength(1);

    wrapper
      .find(TemplateList)
      .find('.icon-trash')
      .first()
      .simulate('click');

    formCardContainer = wrapper.find(TemplateForms).find(FormCard);
    expect(formCardContainer).toHaveLength(0);
  });
  it('should submit form', () => {
    const wrapper = mount(
      <ContentTemplateForm
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={handleSubmit}
      />
    );

    wrapper.find('button[type="submit"]').simulate('submit');
    expect(handleSubmit.mock.calls.length).toBe(1);
  });
  it('should update template details', () => {
    const testFn = jest.fn();
    const wrapper = mount(
      <ContentTemplateForm
        templateData={templateData}
        initialTemplates={initialTemplates}
        onSubmit={testFn}
      />
    );

    const firstTemplate = Object.keys(templateData)[0];
    const firstTemplateDefProp = Object.keys(
      templateData[firstTemplate].definition.properties
    )[0];
    const templateDataField = `${firstTemplateDefProp}-${
      templateData[firstTemplate].id
    }`;
    const inputVal = 'Hello';

    const formField = wrapper.find(`#${templateDataField}`).last();

    formField.simulate('change', { target: { value: inputVal } });
    expect(
      wrapper
        .find(`#${templateDataField}`)
        .last()
        .props().value
    ).toEqual(inputVal);

    wrapper.find('button[type="submit"]').simulate('submit');
    expect(testFn.mock.calls[0][0]).toHaveProperty(
      `contentTemplates.${
        templateData[firstTemplate].id
      }.data.${firstTemplateDefProp}`,
      inputVal
    );
  });
  it('should only allow valid row size for text input fields', () => {
    const maxRows = [[-1, 15], [0, 15], [5, 5], [1.5, 1], [-1.5, 15]];

    maxRows.forEach(rowSize => {
      const wrapper = mount(
        <ContentTemplateForm
          templateData={templateData}
          initialTemplates={initialTemplates}
          onSubmit={handleSubmit}
          textInputMaxRows={rowSize[0]}
        />
      );

      const firstTemplate = Object.keys(templateData)[0];
      const firstTemplateDefProp = Object.keys(
        templateData[firstTemplate].definition.properties
      )[0];
      const templateDataField = `${firstTemplateDefProp}-${
        templateData[firstTemplate].id
      }`;

      const formField = wrapper.find(`#${templateDataField}`).first();
      expect(formField.prop('rowsMax')).toEqual(rowSize[1]);
    });
  });
});
