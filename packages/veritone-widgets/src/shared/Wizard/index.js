import React from 'react';
import { connect } from 'react-redux';
import {
  submit,
  destroy,
  isValid,
  isDirty,
  getFormSubmitErrors,
  SubmissionError
} from 'redux-form';
import { omitBy, isEmpty, isUndefined, findIndex, partial } from 'lodash';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import StepIcon from '@material-ui/core/StepIcon';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';

import styles from './styles/index.scss';
import {
  objectOf,
  string,
  node,
  func,
  bool,
  shape,
  arrayOf,
  array,
  any,
  number
} from 'prop-types';
import { requireFields, flattenObject } from './helpers';

export const wizardConfigShape = shape({
  model: shape({
    fields: objectOf(string).isRequired,
    requiredFields: arrayOf(string).isRequired,
    initialValues: objectOf(any).isRequired,
    validate: func.isRequired
  }).isRequired,
  steps: arrayOf(
    shape({
      label: string.isRequired,
      fields: array.isRequired
    })
  ).isRequired
});

export class Wizard extends React.Component {
  static propTypes = {
    formName: string.isRequired,
    config: wizardConfigShape.isRequired,
    currentPageNode: node.isRequired,
    children: func.isRequired,
    onClose: func.isRequired,
    isLoading: bool,
    onSubmit: func.isRequired,
    currentStep: number.isRequired,
    onTransitionToStep: func.isRequired,
    // injected props:
    isValid: bool.isRequired,
    isDirty: bool.isRequired,
    submitErrors: objectOf(string),
    submit: func.isRequired,
    destroy: func.isRequired
  };
  static defaultProps = {
    submitErrors: {}
  };

  state = {
    confirmingLeave: false
  };

  validateWizard = (values, allValues) => {
    return omitBy(
      {
        ...this.props.config.model.validate(values),
        ...requireFields(this.props.config.model.requiredFields)(values)
      },
      isUndefined
    );
  };

  handleSubmit = values => {
    const currentStepIndex = this.getCurrentStepIndex();

    if (currentStepIndex === this.props.config.steps.length - 1) {
      return Promise.resolve(this.validateWizard(values))
        .then(localValidationErrors => {
          const nestedValidationErrors = Object.values(
            flattenObject(localValidationErrors)
          ).filter(e => e);

          if (
            !isEmpty(localValidationErrors) &&
            !isEmpty(nestedValidationErrors)
          ) {
            // this.props.showNotification(
            //   'Validation failed; please go back and fix the marked fields before trying again.'
            // );

            return Promise.reject(new SubmissionError(localValidationErrors));
          }

          return values;
        })
        .then(values => {
          return this.props.onSubmit(values);
        })
        .then(this.handleSubmissionSuccess)
        .catch(this.handleSubmissionFailure);
    }

    return this.transitionToStep(this.getCurrentStepIndex() + 1);
  };

  handleSubmissionSuccess = vals => {
    this.props.destroy(this.props.formName);
  };

  handleSubmissionFailure = error => {
    if (error.name !== 'SubmissionError') {
      console.warn(
        'Submission failure errors should be an instance of redux-form/SubmissionError.',
        error
      );
    }

    // let redux-form catch/display the errors
    throw error;
  };

  submitForm = () => {
    this.props.submit(this.props.formName);
  };

  transitionToStep = step => {
    this.props.onTransitionToStep(step);
  };

  handleWizardExit = () => {
    this.props.destroy(this.props.formName);
    this.props.onClose(); // todo: what is this?
  };

  confirmLeave = () => {
    if (!this.props.isDirty) {
      return this.handleWizardExit();
    }

    this.setState({
      confirmingLeave: true
    });
  };

  cancelLeaving = () => {
    this.setState({
      confirmingLeave: false
    });
  };

  getCurrentStepIndex = () => {
    return this.props.currentStep;
  };

  getCurrentStep = () => {
    return this.props.config.steps[this.getCurrentStepIndex()];
  };

  getStepsWithErrors(errors) {
    return Object.keys(omitBy(flattenObject(errors), isUndefined)).map(
      errorField => {
        const page = findIndex(this.props.config.steps, step => {
          return step.fields.includes(errorField);
        });

        return page;
      }
    );
  }

  renderStepper = () => {
    const currentStepIndex = this.getCurrentStepIndex();
    const stepsWithSubmitErrors = this.getStepsWithErrors(
      this.props.submitErrors
    );

    return (
      <Stepper style={{ width: '50%' }} activeStep={currentStepIndex}>
        {this.props.config.steps.map((step, stepIdx) => {
          const buttonProps = {};
          const labelProps = {};

          if (step.optional) {
            buttonProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (stepsWithSubmitErrors.includes(stepIdx)) {
            labelProps.error = true;
            buttonProps.icon = <StepIcon icon={<ErrorIcon />} error />;
          }

          return (
            <Step
              active={stepIdx === currentStepIndex}
              completed={stepIdx < currentStepIndex}
              disabled={stepIdx > currentStepIndex}
              key={step.label}
              className={styles['step']}
            >
              <StepButton
                onClick={partial(this.transitionToStep, stepIdx)}
                {...buttonProps}
              >
                <StepLabel {...labelProps}>{step.label}</StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    );
  };

  renderButtons = ({ className } = {}) => {
    const currentStepIndex = this.getCurrentStepIndex();
    const currentStep = this.getCurrentStep();

    if (!currentStep) {
      return null;
    }

    return (
      !currentStep.hideButtons && (
        <span>
          <Button
            variant="flat"
            className={className}
            onClick={partial(this.transitionToStep, currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
          >
            Back
          </Button>
          <Button variant="flat" className={className}>
            Save & Continue Later
          </Button>
          <Button
            variant="raised"
            type="submit"
            color="primary"
            className={className}
            onClick={this.submitForm}
            disabled={!this.props.isValid || this.props.isLoading}
          >
            {this.props.isLoading ? (
              <CircularProgress size={35} />
            ) : currentStepIndex === this.props.config.steps.length - 1 ? (
              currentStep.buttonText || 'Submit'
            ) : (
              'Next'
            )}
          </Button>
        </span>
      )
    );
  };

  renderConfirmationDialog = () => (
    <Dialog
      open={this.state.confirmingLeave}
      aria-labelledby="conf-dialog-title"
    >
      <DialogTitle id="conf-dialog-title">
        Are you sure you want to exit?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You will lose any unsaved changes.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="flat"
          color="primary"
          onClick={this.cancelLeaving}
          key="stay"
        >
          Stay
        </Button>,
        <Button
          variant="flat"
          color="primary"
          onClick={this.handleWizardExit}
          key="leave"
        >
          Leave anyway
        </Button>
      </DialogActions>
    </Dialog>
  );

  render() {
    const currentPage = React.cloneElement(this.props.currentPageNode, {
      onSubmit: this.handleSubmit,
      validate: this.validateWizard,
      initialValues: this.props.config.model.initialValues,
      fields: this.props.config.model.fields
    });

    return this.props.children({
      currentPage: currentPage,
      renderStepper: this.renderStepper,
      renderButtons: this.renderButtons,
      requestClose: this.confirmLeave,
      renderConfirmationDialog: this.renderConfirmationDialog
    });
  }
}

export default connect(
  (state, ownProps) => ({
    isValid: isValid(ownProps.formName)(state),
    isDirty: isDirty(ownProps.formName)(state),
    submitErrors: getFormSubmitErrors(ownProps.formName)(state)
  }),
  {
    submit,
    destroy
  }
)(Wizard);
