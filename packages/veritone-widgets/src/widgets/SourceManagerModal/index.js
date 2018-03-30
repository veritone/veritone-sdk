import React from 'react';
import { SourceManagerModal as LibSourceManagerModal } from 'veritone-react-common';
import widget from '../../shared/widget';

class SourceManagerModal extends React.Component { 
  render() {
    return <LibSourceManagerModal {...this.props} />
  }
}

export default widget(SourceManagerModal);