import React from 'react';
// import { ModalHeader } from 'veritone-react-common';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
// import blueGrey from '@material-ui/core/colors/blueGrey';
// import grey from '@material-ui/core/colors/grey';
import { pick } from 'lodash';

import Wizard from '../../../shared/Wizard';
import popoverDialogWizardContainer from '../../../shared/Wizard/PopoverDialogWizardContainer';
import wizardConfig from './wizard-config';

import ClusterDetails from './form/details';
import ClusterNodes from './form/nodes';
import ClusterProcessing from './form/processing';


export default class ClusterWizard extends React.Component {
  state = {
    currentStep: 0,
    dialogIsOpen: true
  }

  handleTransitionToStep = (step) => {
    if (step !== this.state.currentStep) {
      this.setState({
        currentStep: step
      });
    }
  };

  currentView = () => {
    let view;

    switch (this.state.currentStep) {
      case 0:
        view = <ClusterDetails
          fields={wizardConfig.model.fields}
          metrics={['logging', 'usageData', 'health']}
        />;
        break;
      case 1:
        view = <ClusterNodes
          {...pick(wizardConfig.model, [
            'fields',
            'fieldValidations'
          ])}
        />;
        break;
      case 2:
        view = <ClusterProcessing fields={wizardConfig.model.fields} />;
        break;
      default:
        break;
    }

    return view;
  }

  handleCloseDialog = () => {
    this.setState({
      dialogIsOpen: false
    })
  }

  handleSubmit = (formValues) => {
    console.log('formValues:', formValues)
  }

  render() {
    return (
      <Dialog
        fullScreen
        open={this.state.dialogIsOpen}
        onClose={this.handleCloseDialog}
        icons={[
          <IconButton aria-label="help" key='icon-help2' color="inherit">
            <Icon className='icon-help2' />
          </IconButton>
        ]}
      >
        {/* <ModalHeader
          title="aiWARE On-Premise Cluster"
          backgroundColor={blueGrey[500]}
          color={grey[50]}
          closeButton
          onClose={this.handleCloseDialog}
        /> */}
        <Wizard
          formName={wizardConfig.formName}
          config={wizardConfig}
          currentPageNode={this.currentView()}
          currentStep={this.state.currentStep}
          onTransitionToStep={this.handleTransitionToStep}
          onClose={this.handleCloseDialog}
          onSubmit={this.handleSubmit}
        >
          {popoverDialogWizardContainer({ title: 'aiWARE On-Premise Cluster' })}
        </Wizard>
      </Dialog>
    )
  }
}
