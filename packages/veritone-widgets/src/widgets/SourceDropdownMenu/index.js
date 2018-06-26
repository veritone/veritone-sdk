import React from 'react';
import { arrayOf, objectOf, any, func, string } from 'prop-types';
import { SourceDropdownMenu } from 'veritone-react-common';

import widget from '../../shared/widget';

class SourceDropdownMenuWidget extends React.Component {
  static propTypes = {
    sourceId: string,
    sources: arrayOf(objectOf(any)).isRequired,
    handleSourceChange: func.isRequired,
    openCreateSource: func.isRequired,
    closeCreateSource: func.isRequired,
    loadNextPage: func.isRequired
  };

  state = {
    sourceId: this.props.sourceId
  };

  handleSourceChange = sourceId => {
    let newState = { sourceId };
    this.setState(newState, this.sendSourceIdToParent);
  };

  sendSourceIdToParent = () => {
    this.props.handleSourceChange(this.state.sourceId);
  };

  openCreateSource = () => {
    this.props.openCreateSource(this.handleSourceChange);
  };

  render() {
    return (
      <SourceDropdownMenu
        sourceId={this.state.sourceId}
        sources={this.props.sources}
        handleSourceChange={this.handleSourceChange}
        openCreateSource={this.openCreateSource}
        closeCreateSource={this.props.closeCreateSource}
        loadNextPage={this.props.loadNextPage}
      />
    );
  }
}

export default widget(SourceDropdownMenuWidget);
