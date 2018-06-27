import React from 'react';
import { objectOf, any, func } from 'prop-types';
import { ContentTemplateForm } from 'veritone-react-common';

import widget from '../../shared/widget';

class ContentTemplateFormWidget extends React.Component {
  static propTypes = {
    templateData: objectOf(any).isRequired,
    initialTemplates: objectOf(any),
    handleUpdateContentTemplates: func.isRequired
  };

  render() {
    return (
      <ContentTemplateForm
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
        onSubmit={this.props.handleUpdateContentTemplates}
      />
    );
  }
}

export default widget(ContentTemplateFormWidget);
