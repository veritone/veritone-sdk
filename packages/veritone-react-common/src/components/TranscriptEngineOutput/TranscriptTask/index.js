import React, { Component, Fragment } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';

import Snippet from '../Snippet';

class TranscriptTask extends Component {
  static propTypes = {
    chunk: shape({
      startTimeMs: number,
      endTimeMs: number,
      series: arrayOf(
        shape({
          start: number,
          end: number,
          text: string
        })
      )
    }),
    onSnippetClick: func,
    onSnippetEdit: func,
    editModeEnabled: bool
  };

  handleSnippetEdit = (snippet, newText) => {
    this.props.onSnippetEdit(snippet, newText, this.props.chunk.taskId);
  };

  render() {
    let { chunk, onSnippetClick, editModeEnabled } = this.props;
    let snippets = chunk.series.map((snippet, index) => {
      return (
        <Snippet
          key={index}
          snippet={snippet}
          onSnippetClick={onSnippetClick}
          onSnippetEdit={this.handleSnippetEdit}
          editModeEnabled={editModeEnabled}
        />
      );
    });
    return <Fragment>{snippets}</Fragment>;
  }
}

export default TranscriptTask;
