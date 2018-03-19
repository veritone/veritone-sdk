import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { bool, func } from 'prop-types';

import styles from './story.styles.scss';

import TranscriptEngineOutput from './TranscriptEngineOutput';
import SentimentEngineOutput from './SentimentEngineOutput';
import FaceDetectionOuput from './FaceDetectionEngineOutput';
import ObjectDetectionOuput from './ObjectDetectionEngineOutput';
import OCREngineOutputView from './OCREngineOutputView';
import { 
  transcriptAssets,
  sentimentAssets,
  objectDetectionAssets,
  ocrAssets
} from './story.data.js';

class TranscriptionStory extends Component {
  static propTypes = {
    editModeEnabled: bool,
    onSnippetClicked: func
  }

  state = {
    assets: transcriptAssets,
    editMode: "bulk",
    selectedEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    engines: [
      {
        sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
        sourceEngineName: "Temporal",
      }
    ],
    viewMode: "time"
  };

  handleEngineChange = (evt) => {
    this.setState({
      selectedEngineId: evt.target.value
    })
  }

  handleEditModeChange = (evt) => {
    this.setState({
      editMode: evt.target.value
    })
  }

  handleViewModeChange = (evt) => {
    this.setState({
      viewMode: evt.target.value
    })
  }
  
  handleSnippetEdit = (snippet, innerHtml, taskId) => {
    this.setState({
      assets: this.state.assets.map((task) => {
        if (task.taskId !== taskId) {
          return task;
        } else {
          return {
            ...task,
            series: task.series.map((s) => {
              if (s.start === snippet.start && s.end === snippet.end) {
                return {
                  ...s,
                  text: innerHtml
                }
              } else {
                return s
              }
            })
          }
        }
      })
    })
  }

  render() {
    return (
      <TranscriptEngineOutput 
        assets={this.state.assets}
        editModeEnabled={this.props.editModeEnabled}
        editMode={this.state.editMode}
        onEditModeChange={this.handleEditModeChange}
        engines={this.state.engines}
        selectedEngineId={this.state.selectedEngineId}
        onEngineChange={this.handleEngineChange}
        onSnippetClicked={this.props.onSnippetClicked}
        onSnippetEdit={this.handleSnippetEdit}
        classes={{ root: styles.outputViewRoot }}
        viewMode={this.state.viewMode}
        onViewModeChange={this.handleViewModeChange}
      />
    );
  }
}

storiesOf('EngineOutputViews', module)
  .add('TranscriptEngineOutput', () => {
    return (<TranscriptionStory 
        assets={transcriptAssets}
        editModeEnabled={boolean('Edit Mode Enabled', false)}
        editMode="bulk"
        onSnippetClicked={action('Snippet Clicked')}
        classes={{ root: styles.outputViewRoot }}
    />);
  })
  .add('SentimentEngineOutput', () => {
    return (
      <SentimentEngineOutput
        data={sentimentAssets}
        classes={{ root: styles.outputViewRoot }}
      />
    );
  })
  .add('FaceDetectionOutput', () => {
    return (
      <FaceDetectionOuput
        classes={{ root: styles.outputViewRoot }}
      />
    )
  })
  .add('ObjectDetectionOutput', () => {
    return (
      <ObjectDetectionOuput 
        assets={ objectDetectionAssets }
        classes={ {
          root: styles.outputViewRoot 
        } }
      />
    )
  })
  .add('OCREngineOutputView', () => {
    return (
      <OCREngineOutputView 
        assets={ocrAssets}
        classes={ {
          root: styles.outputViewRoot 
        } }
      />
    )
  });