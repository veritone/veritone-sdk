import React from 'react';

import NullState from 'components/NullState';
import NullstateImage from 'images/cms-content-templates-null.svg';

export default class ContentTemplatesNullState extends React.Component {
  render() {
    return (
      <NullState
        imgProps={{
          src: NullstateImage,
          alt: "https://static.veritone.com/veritone-ui/default-nullstate.svg",
          style: {
            fontSize: '80px',
            marginBottom: '30px'
          }
        }}
        titleText="Select a content template to add"
      />
    );
  }
}
