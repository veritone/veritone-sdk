import React from 'react';
import { IngestionAdapters } from 'veritone-react-common';
const LibDynamicAdapterObj = IngestionAdapters.DynamicAdapter;
import widget from '../../../shared/widget';

const LibDynamicAdapter = LibDynamicAdapterObj.adapter;

class DynamicAdapter extends React.Component {
  static propTypes = {};

  componentDidMount() {}

  render() {
    return <LibDynamicAdapter {...this.props} />;
  }
}

export default {
  widget: widget(DynamicAdapter),
  ...LibDynamicAdapterObj
};
