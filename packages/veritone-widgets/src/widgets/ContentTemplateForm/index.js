import React from 'react';
import { objectOf, any, func, number } from 'prop-types';
import { ContentTemplateForm } from 'veritone-react-common';
import { pick } from 'lodash';

import widget from '../../shared/widget';

class ContentTemplateFormWidget extends React.Component {
  static propTypes = {
    templateData: objectOf(any).isRequired,
    initialTemplates: objectOf(any),
    onSubmit: func.isRequired,
    textInputMaxRows: number
  };

  render() {
    const templateFormProps = pick(this.props, [
      'templateData',
      'initialTemplates',
      'textInputMaxRows'
    ]);
    return (
      <ContentTemplateForm
        {...templateFormProps}
        onSubmit={this.props.onSubmit}
      />
    );
  }
}

export default widget(ContentTemplateFormWidget);
