import React from 'react';
import { arrayOf, object, objectOf, any, func } from 'prop-types';
import { SourceManagementOverview } from 'veritone-react-common';

import widget from '../../shared/widget';

class SourceManagementWidget extends React.Component {
  static propTypes = {
    sourceTypes: arrayOf(object).isRequired,
    sources: arrayOf(object).isRequired,
    source: objectOf(any),
    templateData: objectOf(any).isRequired,
    initialTemplates: arrayOf(any),
    onSubmit: func.isRequired,
    onSelectMenuItem: func
  };

  render() {
    return (
      <SourceManagementOverview
        sourceTypes={this.props.sourceTypes}
        sources={this.props.sources}
        source={this.props.source}
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
        onFormSubmit={this.props.onSubmit}
        onSelectMenuAction={this.props.onSelectMenuItem}
      />
    );
  }
}

export default widget(SourceManagementWidget);
