import React from 'react';
import { arrayOf, object, objectOf, any } from 'prop-types';
import { SourceManagementForm } from 'veritone-react-common';

import widget from '../../shared/widget';

class SourceManagementFormWidget extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(object).isRequired,
    sources: arrayOf(object).isRequired,
    source: objectOf(any),
    templateData: objectOf(any).isRequired,
    initialTemplates: objectOf(any)
  };

  render() {
    return (
      <SourceManagementForm
        sourceTypes={this.props.sourceTypes}
        sources={this.props.sources}
        source={this.props.source}
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
      />
    )
  }
}

export default widget(SourceManagementFormWidget);
