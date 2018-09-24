import React from 'react';
import { func, shape, string, number, objectOf, any } from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import { noop, pick } from 'lodash';

import Wizard from '../../../shared/Wizard';
import popoverDialogWizardContainer from '../../../shared/Wizard/PopoverDialogWizardContainer';
import wizardConfig from './wizard-config';

import ClusterDetails from './form/details';
import ClusterNodes from './form/nodes';
import ClusterProcessing from './form/processing';

import widget from '../../../shared/widget';

class ClusterWizard extends React.Component {
  static propTypes = {
    onClose: func.isRequired,
    headerProps: shape({
      title: string,
      backgroundColor: string,
      color: string,
      height: number,
    }),
    footerStyles: objectOf(any)
  };

  static defaultProps = {
    onClose: noop
  };

  state = {
    currentStep: 0,
    // dialogIsOpen: true
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

    switch (this.state.currentStep) {
      case 0:
        view = (
          <ClusterDetails
            fields={wizardConfig.model.fields}
            metrics={['logging', 'usageData', 'health']}
          />
        );
        break;
      case 1:
        view = <ClusterNodes fields={wizardConfig.model.fields} />;
        break;
      case 2:
        view = <ClusterProcessing fields={wizardConfig.model.fields} />;
        break;
      default:
        break;
    }

    return view;
  };

  handleCloseDialog = () => {
    // this.setState({
    //   dialogIsOpen: false
    // }, () => {
    // });
    this.props.onClose();
  };

  handleSubmit = formValues => {
    console.log('formValues:', formValues);
    return this.props
      .createDataSchema({ ...values, schema })
      .then(result => {
        // validation and server errors
        const errors = get(result, 'payload.errors');

        if (result.error || errors) {
          if (!errors || isEmpty(errors)) {
            return Promise.reject(
              new SubmissionError({
                _error:
                  "Failed to submit, but we can't tell why. Is your internet down?"
              })
            );
          }

          return Promise.reject(
            new SubmissionError({
              ...mapValues(errors, ({ message }) => {
                return message;
              })
            })
          );
        }

        return result;
      })
      .then(this.handleSubmissionSuccess)
      // .catch(this.handleSubmissionFailure);
  };

  handleSubmissionSuccess = ({ payload: { data } }) => {
  };

  render() {
    return (
      // <Dialog
      //   fullScreen
      //   open={this.state.dialogIsOpen}
      //   onClose={this.props.onClose}
      //   onExited={this.props.onClose}
      // >
        <Wizard
          formName={wizardConfig.formName}
          config={wizardConfig}
          currentPageNode={this.currentView()}
          currentStep={this.state.currentStep}
          onTransitionToStep={this.handleTransitionToStep}
          onClose={this.handleCloseDialog}
          onSubmit={this.handleSubmit}
        >
          {/* {popoverDialogWizardContainer({ title: 'aiWARE On-Premise Cluster' })} */}
          {popoverDialogWizardContainer(pick(this.props, ['headerProps', 'footerStyles']))}
        </Wizard>
      // </Dialog>
    );
  }
}


const ClusterWizardWidget = widget(ClusterWizard);
export { ClusterWizard as default, ClusterWizardWidget };
