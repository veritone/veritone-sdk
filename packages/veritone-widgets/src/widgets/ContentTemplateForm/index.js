import React from 'react';
import { objectOf, arrayOf, any, func } from 'prop-types';
import { ContentTemplateForm } from 'veritone-react-common';

import widget from '../../shared/widget';

class ContentTemplateFormWidget extends React.Component {
  static propTypes = {
    templateData: objectOf(any).isRequired,
    initialTemplates: arrayOf(any),
    onSubmit: func.isRequired
  };

  render() {
    return (
      <ContentTemplateForm
        templateData={this.props.templateData}
        initialTemplates={this.props.initialTemplates}
        onSubmit={this.props.onSubmit}
      />
    );
  }
}

export default widget(ContentTemplateFormWidget);
