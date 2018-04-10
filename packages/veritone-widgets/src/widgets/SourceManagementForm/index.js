import React from 'react';
import { arrayOf, objectOf, any, func } from 'prop-types';
import { SourceManagementForm } from 'veritone-react-common';

import widget from '../../shared/widget';

class SourceManagementFormWidget extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    sources: arrayOf(objectOf(any)).isRequired,
    source: objectOf(any),
    templateData: objectOf(any).isRequired,
    initialTemplates: objectOf(any),
    onSubmit: func.isRequired,
    onClose: func.isRequired
  };

  render() {
    return (
      <SourceManagementForm
        sourceTypes={this.props.sourceTypes}
        sources={this.props.sources}
        source={this.props.source}
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
        onSubmit={this.props.onSubmit}
        onClose={this.props.onClose}
        open
      />
    );
  }
}

export default widget(SourceManagementFormWidget);
