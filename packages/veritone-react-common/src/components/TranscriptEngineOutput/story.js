import React, { Component } from 'react';
import { bool, func, arrayOf, string, number, shape } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { boolean, select, number as knobNumber } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';

import TranscriptEngineOutput from './';

const transcriptAssets = [
  {
    startTimeMs: 0,
endTimeMs: 7000,
    sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    sourceEngineName: "Temporal",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-4fba913a-7fc0-4dbe-9eae-df5892c10683",
    series: [
      {
        startTimeMs: 0,
        endTimeMs: 1000,
        text: "I have a dream . That 1 day . This nation will rise up . And live out the true meaning of its screen . We hold these truths to be self-evident that all men are created equal ."
      },
      {
        startTimeMs: 1001,
        endTimeMs: 1500,
        text: "Hello I am just typing some random stuff to show how "
      },
      {
        startTimeMs: 1501,
        endTimeMs: 2000,
        text: "we can display a transcript using"
      },
      {
        startTimeMs: 2001,
        endTimeMs: 3000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 3001,
        endTimeMs: 5000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 5001,
        endTimeMs: 7000,
        text: "Just a random string for dummy data that I made up. "
      }
    ]
  },
  {
    startTimeMs:7001,
    endTimeMs: 12500,
    sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    sourceEngineName: "Temporal",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-1e5e61a6-ad67-4116-a810-73aaad01353a",
    series: [
      {
        startTimeMs: 7001,
        endTimeMs: 8000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 8001,
        endTimeMs: 8500,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 8501,
        endTimeMs: 9500,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 9501,
        endTimeMs: 10000,
        text: "Hello I a m just typing some random stuff to show how "
      },
      {
        startTimeMs: 10001,
        endTimeMs: 10500,
        text: "we can display a transcript using"
      },
      {
        startTimeMs: 10501,
        endTimeMs: 11000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 11001,
        endTimeMs: 11500,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 11501,
        endTimeMs: 12000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 12001,
        endTimeMs: 12500,
        text: "Just a random string for dummy data that I made up. "
      },
    ]
  },
  {
    startTimeMs: 12501,
    endTimeMs: 20000,
    sourceEngineId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
    sourceEngineName: "Temporal",
    taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf",
    series: [
      {
        startTimeMs: 12501,
        endTimeMs: 13000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 13001,
        endTimeMs: 13250,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 13251,
        endTimeMs: 13500,
        text: "Hello I am just typing some random stuff to show how "
      },
      {
        startTimeMs: 13501,
        endTimeMs: 14000,
        text: "we can display a transcript using"
      },
      {
        startTimeMs: 14001,
        endTimeMs: 14500,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 14501,
        endTimeMs: 15000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 15001,
        endTimeMs: 15500,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 15501,
        endTimeMs: 16000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 16001,
        endTimeMs: 18000,
        text: "Just a random string for dummy data that I made up. "
      },
      {
        startTimeMs: 18001,
        endTimeMs: 20000,
        text: "Just a random string for dummy data that I made up. "
      },
    ]
  }
];

storiesOf('TranscriptEngineOutput', module)
  .add('Base', () => {
    return (<TranscriptionStory 
        assets={transcriptAssets}
        editModeEnabled={boolean('Edit Mode Enabled', false)}
        editMode={select('editMode', {
          snippet: 'Snippet',
          bulk: 'Bulk'
        }, 'snippet')}
        onSnippetClicked={action('Snippet Clicked')}
        mediaPlayerPosition={knobNumber('mediaPlayerPosition', 20, {
          range: true,
          min: 0,
          max: 20000,
          step: 100
        })}
    />);
  });

class TranscriptionStory extends Component {
  static propTypes = {
    assets: arrayOf(shape({
      startTime: number,
      endTime: number,
      data: string
    })),
    editModeEnabled: bool,
    onSnippetClicked: func,
    editMode: string,
    mediaPlayerPosition: number,
    viewMode: string
  }

  state = {
    assets: this.props.assets
  };
  
  handleSnippetEdit = (snippet, innerHtml, taskId) => {
    this.setState({
      assets: this.state.assets.map((task) => {
        if (task.taskId !== taskId) {
          return task;
        } else {
          return {
            ...task,
            series: task.series.map((s) => {
              if (s.startTimeMs === snippet.startTimeMs && s.endTimeMs === snippet.endTimeMs) {
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
    let { editModeEnabled, editMode, onSnippetClicked, viewMode, mediaPlayerPosition } = this.props;

    return (
      <TranscriptEngineOutput 
        assets={this.state.assets}
        editModeEnabled={editModeEnabled}
        editMode={editMode}
        onSnippetClicked={onSnippetClicked}
        onSnippetEdit={this.handleSnippetEdit}
        className={styles.outputViewRoot}
        viewMode={viewMode}
        mediaPlayerPosition={mediaPlayerPosition}
      />
    );
  }
}