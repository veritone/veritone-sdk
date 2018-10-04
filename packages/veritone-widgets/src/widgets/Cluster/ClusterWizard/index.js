import React from 'react';
import { func, shape, string, number, objectOf, any } from 'prop-types';
import { uniqueId } from 'lodash';

import Wizard, { wizardConfigShape } from '../../../shared/Wizard';
import popoverDialogWizardContainer from '../../../shared/Wizard/PopoverDialogWizardContainer';

import ClusterDetails from './form/details';
import ClusterNodes from './form/nodes';
import ClusterProcessing from './form/processing';

import widget from '../../../shared/widget';
const widgetId = uniqueId('vtn-widget-cluster-wizard');

class ClusterWizard extends React.Component {
  static propTypes = {
    config: wizardConfigShape.isRequired,
    onClose: func.isRequired,
    onSubmit: func.isRequired,
    title: string,
    headerProps: shape({
      backgroundColor: string,
      color: string,
      height: number
    }),
    footerStyles: objectOf(any)
  };

  state = {
    currentStep: 0
  };

  handleTransitionToStep = step => {
    if (step !== this.state.currentStep) {
      this.setState({
        currentStep: step
      });
    }
  };

  currentView = () => {
    let view;
    const { config } = this.props;

    switch (this.state.currentStep) {
      case 0:
        view = (
          <ClusterDetails
            fields={config.model.fields}
            metrics={['logging', 'usageData', 'health']}
          />
        );
        break;
      case 1:
        view = <ClusterNodes fields={config.model.fields} />;
        break;
      case 2:
        view = (
          <ClusterProcessing fields={config.model.fields} widgetId={widgetId} />
        );
        break;
      default:
        break;
    }

    return view;
  };

  handleSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <Wizard
        formName={this.props.config.formName}
        config={this.props.config}
        currentPageNode={this.currentView()}
        currentStep={this.state.currentStep}
        onTransitionToStep={this.handleTransitionToStep}
        onClose={this.props.onClose}
        onSubmit={this.handleSubmit}
      >
        {popoverDialogWizardContainer({
          title: this.props.title,
          headerProps: this.props.headerProps,
          footerStyles: this.props.footerStyles
        })}
      </Wizard>
    );
  }
}

const ClusterWizardWidget = widget(ClusterWizard);
export { ClusterWizard as default, ClusterWizardWidget };
