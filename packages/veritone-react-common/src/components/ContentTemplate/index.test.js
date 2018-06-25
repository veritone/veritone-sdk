import React from 'react';
import { mount } from 'enzyme';
import {
  templateData,
  initialTemplates
} from 'components/SourceManagement/sample-data';
import IconButton from '@material-ui/core/IconButton';
import TemplateList from './ContentTemplates/TemplateList';
import TemplateForms from './ContentTemplates/TemplateForms';
import FormCard from './ContentTemplates/FormCard';
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

    const formCard = wrapper.find(TemplateForms).find(FormCard);
    const formCardId = formCard.prop('id');
    const inputVal = 'Hello';

    const formField = formCard.find('input[type="text"]').at(0);
    const formFieldName = formField.prop('id').split('-')[0];

    formField.simulate('change', { target: { value: inputVal } });
    wrapper.find('button[type="submit"]').simulate('submit');

    expect(testFn.mock.calls[0][0]).toHaveProperty(
      `contentTemplates.${formCardId}.data.${formFieldName}`,
      inputVal
    );
  });
});
