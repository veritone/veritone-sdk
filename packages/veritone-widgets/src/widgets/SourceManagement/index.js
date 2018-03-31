import React from 'react';
import { arrayOf, object, objectOf, any } from 'prop-types';
import { SourceManagement } from 'veritone-react-common';


import widget from '../../shared/widget';

class SourceManagementWidget extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(object).isRequired,
    sources: arrayOf(object).isRequired,
    templateData: objectOf(any).isRequired,
    initialTemplates: objectOf(any)
  };

  render() {
    return (
      <SourceManagement
        sourceTypes={this.props.sourceTypes}
        sources={this.props.sources}
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
      />
    )
  }
}

export default widget(SourceManagementWidget);
