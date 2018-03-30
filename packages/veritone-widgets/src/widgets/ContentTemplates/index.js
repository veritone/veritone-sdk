import React from 'react';
import { ContentTemplates as LibContentTemplates } from 'veritone-react-common';
import widget from '../../shared/widget';

class ContentTemplates extends React.Component {

  componentDidMount() {}
 
  render() {
    return <LibContentTemplates {...this.props} />
  }
}

export default widget(ContentTemplates);