import React from 'react';
import { arrayOf, object, func, bool } from 'prop-types';
import { SourceManagement } from 'veritone-react-common';
import { omit } from 'lodash';

import widget from '../../shared/widget';

const { NullState, SourceTileView } = SourceManagement;

class SourceListWidget extends React.Component {
  static propTypes = {
    sources: arrayOf(object).isRequired,
    onSelectMenuItem: func.isRequired,
    onCreateSource: func.isRequired,
    onSelectSource: func.isRequired,
    paginate: bool,
    fetchData: func,
    onSelectLiveStream: func
  };

  state = {
    sources: this.props.sources
  };

  handleFetchData = ({ start, end }) => {
    const perPage = end - start + 1;
    const sourcesCount = this.state.sources.length;

    if (
      this.props.fetchData &&
      (!this.state.sources[end + 1] || sourcesCount - perPage < perPage)
    ) {
      const limit = !(sourcesCount % perPage)
        ? perPage
        : sourcesCount % perPage;

      this.props.fetchData(limit, sourcesCount);
    }
  };

  updateSources = sources => {
    this.setState({
      sources
    });
  };

  render() {
    const viewProps = omit(this.props, [
      'onCreateSource',
      'sources',
      'fetchData'
    ]);

    return !this.state.sources.length ? (
      <NullState onClick={this.props.onCreateSource} />
    ) : (
      <SourceTileView
        {...viewProps}
        sources={this.state.sources}
        onFetchData={this.handleFetchData}
        onSelectLiveStream={this.props.onSelectLiveStream}
      />
    );
  }
}

export default widget(SourceListWidget);
