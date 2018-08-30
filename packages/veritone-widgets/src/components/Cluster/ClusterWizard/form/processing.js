import React from 'react';
import { reduxForm } from 'redux-form';

import EngineList from '../../../../widgets/EngineSelection/EngineListView';
import wizardConfig from '../wizard-config';

@reduxForm({
  form: wizardConfig.formName,
  validate: wizardConfig.validate,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})
export default class ClusterProcessing extends React.Component {
  render() {
    return <EngineList id={'abc-123'} />;
  }
}
