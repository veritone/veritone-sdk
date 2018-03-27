import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss'; 
import TranscriptEngineOutput from './';

export const transcriptAssets = [
  {
    startTimeMs: 0,
    endTimeMs: 13812,
    sourceEngineId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
    sourceEngineName: 'Temporal',
    taskId:
      'e1fa7d7c-6f1c-480e-b181-68940509f070-4fba913a-7fc0-4dbe-9eae-df5892c10683',
    series: [
      {
        start: 0,
        end: 13130,
        text:
          'I have a dream . That 1 day . This nation will rise up . And live out the true meaning of its screen . We hold these truths to be self-evident that all men are created equal .'
      },
      {
        start: 13131,
        end: 13146,
        text: 'Hello I am just typing some random stuff to show how '
      },
      {
        start: 13147,
        end: 13162,
        text: 'we can display a transcript using'
      },
      {
        start: 13163,
        end: 13170,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13171,
        end: 13176,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13177,
        end: 13182,
        text: 'Just a random string for dummy data that I made up. '
      }
    ]
  },
  {
    startTimeMs: 13183,
    endTimeMs: 13236,
    sourceEngineId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
    sourceEngineName: 'Temporal',
    taskId:
      'e1fa7d7c-6f1c-480e-b181-68940509f070-1e5e61a6-ad67-4116-a810-73aaad01353a',
    series: [
      {
        start: 13183,
        end: 13188,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13189,
        end: 13194,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13195,
        end: 13200,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13201,
        end: 13206,
        text: 'Hello I a m just typing some random stuff to show how '
      },
      {
        start: 13207,
        end: 13212,
        text: 'we can display a transcript using'
      },
      {
        start: 13213,
        end: 13218,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13219,
        end: 13224,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13225,
        end: 13230,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13231,
        end: 13236,
        text: 'Just a random string for dummy data that I made up. '
      }
    ]
  },
  {
    startTimeMs: 13237,
    endTimeMs: 13292,
    sourceEngineId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
    sourceEngineName: 'Temporal',
    taskId:
      'e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf',
    series: [
      {
        start: 13237,
        end: 13242,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13243,
        end: 13248,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13249,
        end: 13250,
        text: 'Hello I am just typing some random stuff to show how '
      },
      {
        start: 13251,
        end: 13256,
        text: 'we can display a transcript using'
      },
      {
        start: 13257,
        end: 13262,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13263,
        end: 13268,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13269,
        end: 13274,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13275,
        end: 13280,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13281,
        end: 13286,
        text: 'Just a random string for dummy data that I made up. '
      },
      {
        start: 13287,
        end: 13292,
        text: 'Just a random string for dummy data that I made up. '
      }
    ]
  }
];

storiesOf('TranscriptEngineOutput', module).add('Base', () => {
  return (
    <TranscriptionStory
      assets={transcriptAssets}
      editModeEnabled={boolean('Edit Mode Enabled', false)}
      editMode="bulk"
      onSnippetClicked={action('Snippet Clicked')}
    />
  );
});

class TranscriptionStory extends Component {
  static propTypes = {
    editModeEnabled: bool,
    onSnippetClicked: func
  };

  state = {
    assets: transcriptAssets,
    editMode: 'snippet',
    selectedEngineId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
    engines: [
      {
        sourceEngineId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182',
        sourceEngineName: 'Temporal'
      }
    ],
    viewMode: 'time'
  };

  handleEngineChange = evt => {
    this.setState({
      selectedEngineId: evt.target.value
    });
  };

  handleEditModeChange = evt => {
    this.setState({
      editMode: evt.target.value
    });
  };

  handleViewModeChange = evt => {
    this.setState({
      viewMode: evt.target.value
    });
  };

  handleSnippetEdit = (snippet, innerHtml, taskId) => {
    this.setState({
      assets: this.state.assets.map(task => {
        if (task.taskId !== taskId) {
          return task;
        } else {
          return {
            ...task,
            series: task.series.map(s => {
              if (s.start === snippet.start && s.end === snippet.end) {
                return {
                  ...s,
                  text: innerHtml
                };
              } else {
                return s;
              }
            })
          };
        }
      })
    });
  };

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
        className={styles.outputViewRoot}
        viewMode={this.state.viewMode}
        onViewModeChange={this.handleViewModeChange}
      />
    );
  }
}
