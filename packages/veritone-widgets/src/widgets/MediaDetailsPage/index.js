import React from 'react';
import { MediaDetails } from 'veritone-react-common';
import { FullScreenDialog } from 'veritone-react-common';

import widget from '../../shared/widget';

class MediaDetailsWidget extends React.Component {
  render() {

    // TODO: wire up redux

    return (
      <FullScreenDialog open={true}>
        <MediaDetails {...this.props}></MediaDetails>
      </FullScreenDialog>
    );
  }
}

export default widget(MediaDetailsWidget);
