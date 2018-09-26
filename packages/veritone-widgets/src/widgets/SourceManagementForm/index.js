import React from 'react';
import { arrayOf, object, objectOf, any, func, shape, string } from 'prop-types';
import { connect } from 'react-redux';
import { SourceManagementForm } from 'veritone-react-common';
import { modules } from 'veritone-redux-common';
const { config: configModule } = modules;

import widget from '../../shared/widget';

@connect(
  state => ({
    appConfig: configModule.getConfig(state)
  }),
  {},
  null,
  { withRef: true }
)
class SourceManagementFormWidget extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(object).isRequired,
    templateData: objectOf(any).isRequired,
    source: objectOf(any),
    initialTemplates: arrayOf(any),
    onSubmit: func.isRequired,
    onClose: func,
    getFieldOptions: func.isRequired,
    appConfig: shape({
      boxClientId: string,
      dropboxClientId: string,
      googleDriveClientId: string
    })
  };

  render() {
    return <SourceManagementForm {...this.props} />;
  }
}

export default widget(SourceManagementFormWidget);
