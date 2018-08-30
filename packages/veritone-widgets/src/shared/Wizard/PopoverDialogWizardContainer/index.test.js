import React from 'react';
import { noop } from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { model } from 'helpers/model';

import { Wizard } from 'shared-components/Wizard';
import popoverDialogWizardContainer from './';

const commonModel = model({
  fields: [],
  requiredFields: [],
  initialValues: {},
  validate: values => ({})
});

const commonConfig = {
  model: commonModel,
  steps: [
    {
      path: 'step-one',
      label: 'My Step',
      fields: []
    }
  ]
};

const commonProps = {
  formName: 'wizard-test',
  config: commonConfig,
  initialValues: {},
  baseRoutePath: '/',
  currentPageNode: <div id="page" />,
  children: noop,
  onClose: noop,
  onSubmit: noop,

  router: {
    routes: [
      {
        // currently on step 1
        path: 'step-one'
      }
    ]
  },
  isValid: true,
  isDirty: false,
  submit: noop,
  destroy: noop,
  push: noop,
  showNotification: noop
};

describe('PopoverDialogWizardContainer', function() {
  it('renders an appbar with the correct title', function() {
    const wrapper = shallow(
      <Wizard {...commonProps}>
        {popoverDialogWizardContainer({ title: 'the-title' })}
      </Wizard>
    );

    expect(wrapper.find('[title="the-title"]')).to.exist;
  });

  it('calls renderStepper, renderButtons, renderConfirmationDialog', function() {
    let calls = 0;
    const inc = () => calls++;

    shallow(
      popoverDialogWizardContainer({ title: 'the-title' })({
        renderStepper: inc,
        renderButtons: inc,
        renderConfirmationDialog: inc
      })
    );

    expect(calls).to.equal(3);
  });

  it('displays the current page', function() {
    const wrapper = shallow(
      popoverDialogWizardContainer({ title: 'the-title' })({
        currentPage: <div id="works" />,
        renderStepper: noop,
        renderButtons: noop,
        renderConfirmationDialog: noop
      })
    );

    expect(wrapper).to.have.descendants('#works');
  });
});
