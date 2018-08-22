import React from 'react';
import { arrayOf, object, objectOf, any, func } from 'prop-types';
import { SourceManagementForm } from 'veritone-react-common';

import widget from '../../shared/widget';

class SourceManagementFormWidget extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(object).isRequired,
    templateData: objectOf(any).isRequired,
    source: objectOf(any),
    initialTemplates: arrayOf(any),
    onSubmit: func.isRequired,
    onClose: func,
    getFieldOptions: func.isRequired
  };

  render() {
    return <SourceManagementForm {...this.props} />;
  }
}

export default widget(SourceManagementFormWidget);
