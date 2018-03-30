import React from 'react';
import { IngestionAdapters } from 'veritone-react-common';
const LibSDOAdapterObj = IngestionAdapters.SDOAdapter;
import widget from '../../../shared/widget';

const LibSDOAdapter = LibSDOAdapterObj.adapter;

class SDOAdapter extends React.Component {
  static propTypes = {};

  componentDidMount() {}
 
  render() {
    return <LibSDOAdapter {...this.props} />
  }
}

export default {
  widget: widget(SDOAdapter),
  ...LibSDOAdapterObj
}