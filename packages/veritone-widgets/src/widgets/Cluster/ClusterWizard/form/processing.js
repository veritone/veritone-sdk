import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { shape, string, func, objectOf, any } from 'prop-types';
import { noop } from 'lodash';

import { EngineSelection } from '../../../../widgets/EngineSelection';
import wizardConfig from '../wizard-config';


@reduxForm({
  form: wizardConfig.formName,
  validate: wizardConfig.validate,
  initialValues: {
    engines: []
  },
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})
export default class ClusterProcessing extends React.Component {
  static propTypes = {
    fields: shape({
      engines: string.isRequired
    }).isRequired,
    // redux-form supplied props
    change: func.isRequired
  };

  handleEngineSelectionChange = selectedEngineIds => {
    this.props.change(this.props.fields.engines, selectedEngineIds);
  };

  render() {
    return (
      <Field
        name={this.props.fields.engines}
        component={EngineSelectionField}
        _widgetId="abc-123"
        onEngineSelectionChange={this.handleEngineSelectionChange}
        hideActions
      />
    );
  }
}

const EngineSelectionField = ({ input, meta, ...rest }) => {
  return (
    <EngineSelection
      onSave={noop}
      onCancel={noop}
      initialSelectedEngineIds={input.value || []}
      {...rest}
    />
  );
};

EngineSelectionField.propTypes = {
  input: objectOf(any),
  meta: objectOf(any)
};
