import React, { Component } from 'react';
import { arrayOf, shape, number, string, bool, func } from 'prop-types';

import Snippet from '../Snippet';

class TranscriptChunk extends Component {
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
    editModeEnabled: bool,
    mediaPlayerPosition: number
  };

  handleSnippetEdit = (snippet, newText) => {
    this.props.onSnippetEdit(snippet, newText, this.props.chunk.taskId);
  };

  render() {
    let {
      chunk,
      onSnippetClick,
      editModeEnabled,
      mediaPlayerPosition
    } = this.props;
    let snippets = chunk.series.map((snippet, index) => {
      return (
        <Snippet
          key={index}
          snippet={snippet}
          onSnippetClick={onSnippetClick}
          onSnippetEdit={this.handleSnippetEdit}
          editModeEnabled={editModeEnabled}
          boldText={
            mediaPlayerPosition >= snippet.startTimeMs &&
            mediaPlayerPosition <= snippet.endTimeMs
          }
        />
      );
    });
    return <span>{snippets}</span>;
  }
}

export default TranscriptChunk;
