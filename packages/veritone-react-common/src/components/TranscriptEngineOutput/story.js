import React, { Component } from 'react';
import { bool } from 'prop-types';

import { storiesOf } from '@storybook/react';
import { boolean, number, select } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import EngineOutputNullState from '../EngineOutputNullState';

import styles from './story.styles.scss';
import TranscriptEngineOutput from './';

storiesOf('TranscriptEngineOutput', module)
  .add('Without Lazy Loading', () => {
    return <TranscriptExample />;
  })
  .add('With Lazy Loading', () => {
    return <TranscriptExample lazyLoading />;
  })
  .add('With Lazy Loading Edit Mode Callback', () => {
    return <TranscriptExample lazyLoading />;
  });

export class TranscriptExample extends Component {
  static propTypes = {
    lazyLoading: bool
  };

  static defaultProps = {
    lazyLoading: false
  };

  constructor(props) {
    super(props);

    const initialStartTime = 0;
    const initialStopTime = 200000;
    const initialNumDataChunks = 7;
    const maxSerieSize = 60;
    const minSerieSize = 1;
    const type = 'VLF';
    const badSerieRatio = 0.3;

    this.selectedEngineId = '1';
    this.engines = [
      { id: '1', name: 'Engine-X', category: { categoryType: 'dummy' } },
      { id: '2', name: 'Engine-Y', category: { categoryType: 'dummy' } },
      { id: '3', name: 'Engine-Z', category: { categoryType: 'dummy' } }
    ];

    const mockData = genMockData(
      initialStartTime,
      initialStopTime,
      initialNumDataChunks,
      maxSerieSize,
      minSerieSize,
      type,
      badSerieRatio,
      props.lazyLoading
    );
    const genSpeaker = true;
    const mockSpeakerData = genMockData(
      initialStartTime,
      initialStopTime,
      initialNumDataChunks,
      maxSerieSize,
      minSerieSize,
      'vtn-standard',
      badSerieRatio,
      props.lazyLoading,
      genSpeaker
    );
    this.state = {
      data: mockData,
      speakerData: mockSpeakerData
    };
  }

  handleDataRequesting = requestInfo => {
    if (this.props.lazyLoading) {
      const startTime = requestInfo.start;
      const stopTime = requestInfo.stop;
      const additionalData = genMockData(
        startTime,
        stopTime,
        3,
        50,
        1,
        'VLF',
        0.2
      );
      const additionalSpeakerData = genMockData(
        startTime,
        stopTime,
        3,
        50,
        1,
        'vtn-standard',
        0.2,
        true,
        true
      );
      this.setState(prevState => {
        const newMockData = { ...prevState }.data.concat(additionalData);
        const newMockSpeakerData = { ...prevState }.data.concat(
          additionalSpeakerData
        );
        return {
          data: newMockData,
          speakerData: newMockSpeakerData
        };
      });
    }
  };

  render() {
    return (
      <TranscriptEngineOutput
        parsedData={parsedData}
        editMode={boolean('Edit Mode', false)}
        selectedCombineViewTypeId={select(
          'View Type',
          mockViewTypes,
          mockViewTypes[0]
        )}
        onChange={mockOnChange}
        className={styles.outputViewRoot}
        mediaPlayerTimeMs={1000 * number('media player time', 0)}
        mediaPlayerTimeIntervalMs={
          1000 * number('media player time Interval', 1)
        }
        mediaLengthMs={9000000}
        neglectableTimeMs={2000}
        estimatedDisplayTimeMs={1500000}
        onScroll={this.handleDataRequesting}
        onClick={mockOnClick}
        engines={this.engines}
        selectedEngineId={this.selectedEngineId}
        onEngineChange={action('engine changed')}
        onExpandClick={action('expand view clicked')}
        outputNullState={
          boolean('showNullState') && (
            <EngineOutputNullState
              engineStatus="failed"
              engineName="fakeEngine"
              onRunProcess={action('Run Process')}
            />
          )
        }
      />
    );
  }
}

function mockOnChange(event, newContent) {
  console.log(newContent);
}

function mockOnClick(startTimeMs, stopTimeMs) {
  console.log(startTimeMs, stopTimeMs);
}

function genMockData(
  startTime,
  stopTime,
  numDataChunks,
  maxSerieSize = 10,
  minSerieSize = 0,
  type = 'TTML',
  badSerieRatio = 0.2,
  enableLazyLoading = true,
  genSpeaker = false
) {
  const dataChunks = [];

  let chunkStartTime = startTime;
  const timeChunk = (stopTime - startTime) / numDataChunks;
  for (let chunkIndex = 0; chunkIndex < numDataChunks; chunkIndex++) {
    const chunkStoptime = Math.ceil(chunkStartTime + timeChunk);

    const isBadSerie = false; //Math.random() < badSerieRatio;
    const series = genMockSerie(
      chunkStartTime,
      chunkStoptime,
      maxSerieSize,
      minSerieSize,
      type,
      isBadSerie,
      genSpeaker
    );

    if (enableLazyLoading) {
      dataChunks.push({
        startTimeMs: chunkStartTime,
        stopTimeMs: chunkStoptime,
        status: 'success',
        series: series
      });
    } else {
      dataChunks.push({
        series: series
      });
    }

    chunkStartTime = chunkStoptime;
  }

  return dataChunks;
}

function genMockSerie(
  startTimeMs,
  stopTimeMs,
  maxSerieSize,
  minSerieSize,
  type = 'TTML',
  badSerie = false,
  genSpeaker = false
) {
  const mockSeries = [];
  if (badSerie === false) {
    let serieSize =
      Math.round(Math.random() * (maxSerieSize - minSerieSize)) + minSerieSize;
    if (genSpeaker) {
      serieSize = Math.round(serieSize / 10);
    }
    const timeInterval = (stopTimeMs - startTimeMs) / serieSize;

    let lastStopTime = startTimeMs;
    for (let entryIndex = 0; entryIndex < serieSize; entryIndex++) {
      const numWords = Math.ceil(Math.random() * 10);
      const words = genMockWords(numWords, type);
      const newStopTime = Math.ceil(lastStopTime + timeInterval);
      const entry = {
        guid: guid(),
        startTimeMs: lastStopTime,
        stopTimeMs: newStopTime
      };
      if (!genSpeaker) {
        entry.words = words;
      } else {
        entry.speakerId = genMockSpeakerId();
      }

      lastStopTime = newStopTime;

      mockSeries.push(entry);
    }
  } else {
    // bad series only has one entry & doesn't contain words
    const mockBadSerie = {
      guid: guid(),
      startTimeMs: startTimeMs,
      stopTimeMs: stopTimeMs
    };
    // Speaker doesn't have bad series items, so just fill it
    if (genSpeaker) {
      mockBadSerie.speakerId = genMockSpeakerId();
    }
    mockSeries.push(mockBadSerie);
  }

  return mockSeries;
}

function genMockWords(size, type = 'TTML') {
  const words = [];
  if (type === 'TTML') {
    const sentenceIndex = Math.round(
      Math.random() * (ttmlSentences.length - 1)
    );
    words.push({
      word: ttmlSentences[sentenceIndex],
      confidence: 1
    });
  } else {
    for (let index = 0; index < size; index++) {
      const wordIndex = Math.round(Math.random() * (vlfWords.length - 1));
      words.push({
        word: vlfWords[wordIndex],
        confidence: Math.round(Math.random() * 100) / 100
      });
    }
  }

  return words;
}

function genMockSpeakerId() {
  const speakerIndex = Math.floor(Math.random() * speakerTags.length);
  return speakerTags[speakerIndex];
}

const ttmlSentences = [
  'Lorems ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'eque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
];

const vlfWords = [
  'escape&#39;s',
  'obese',
  'cushion',
  'shivering',
  'parallel',
  'hill',
  'impartial',
  'creator',
  'live',
  'correct',
  'flood',
  'inquisitive',
  'cars',
  'absorbing',
  'chess',
  'large',
  'mixed',
  'horses',
  'stupid',
  'tree',
  'selective',
  'seemly',
  'skillful',
  'awesome',
  'sharp',
  'island',
  'dress',
  'skirt',
  'clip',
  'confess',
  'nose',
  'cheese',
  'carve',
  'caption',
  'cry',
  'knot',
  'smile',
  'silent',
  'rapid',
  'funny',
  'superb',
  'tranquil',
  'hug',
  'hands',
  'flowers',
  'permit',
  'cheer',
  'belligerent',
  'mice',
  'grey',
  'wave',
  'grate',
  'royal',
  'number',
  'sheep',
  'naughty',
  'actor',
  'dress',
  'wound',
  'material',
  'joyous',
  'handle',
  'adorable',
  'prevent',
  'fruit',
  'festive',
  'puzzling',
  'erratic',
  'befitting',
  'check',
  'wiggly'
];

const speakerTags = ['A', 'B', 'C', 'D'];

const mockViewTypes = ['show-speaker-view', 'transcript-view'];

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}-${s4()}-${s4()}`;
}

const parsedData = {
  lazyLoading: true,
  snippetSegments: [
    {
      sourceEngineId: '120244fe-3ea7-435e-85f6-22d9aab614ba',
      modifiedDateTime: 1541193083000,
      series: [
        {
          startTimeMs: 48005,
          stopTimeMs: 48299,
          words: [
            {
              word: 'things',
              confidence: 0.584,
              bestPath: true
            },
            {
              word: 'black',
              confidence: 0.122
            },
            {
              word: '!silence',
              confidence: 0.083
            },
            {
              word: 'thing',
              confidence: 0.068
            },
            {
              word: 'back',
              confidence: 0.053
            },
            {
              word: "it's",
              confidence: 0.036
            },
            {
              word: 'bags',
              confidence: 0.025
            },
            {
              word: 'so',
              confidence: 0.012
            },
            {
              word: 'thanks',
              confidence: 0.006
            },
            {
              word: 'yeah',
              confidence: 0.002
            },
            {
              word: 'i',
              confidence: 0.001
            },
            {
              word: 'go',
              confidence: 0.001
            }
          ],
          guid: 'e8cc-0b99-79b5'
        },
        {
          startTimeMs: 48980,
          stopTimeMs: 49126,
          words: [
            {
              word: 'like',
              confidence: 0.915,
              bestPath: true
            },
            {
              word: 'i',
              confidence: 0.028
            },
            {
              word: 'could',
              confidence: 0.019
            },
            {
              word: '!silence',
              confidence: 0.014
            },
            {
              word: 'can',
              confidence: 0.011
            },
            {
              word: 'exactly',
              confidence: 0.002
            },
            {
              word: 'second',
              confidence: 0.002
            },
            {
              word: 'back',
              confidence: 0.001
            },
            {
              word: 'thing',
              confidence: 0.001
            },
            {
              word: 'yeah',
              confidence: 0.001
            },
            {
              word: 'go',
              confidence: 0.001
            },
            {
              word: 'so',
              confidence: 0
            }
          ],
          guid: '6c35-6d29-7930'
        },
        {
          startTimeMs: 49182,
          stopTimeMs: 49257,
          words: [
            {
              word: 'a',
              confidence: 0.899,
              bestPath: true
            },
            {
              word: 'girls',
              confidence: 0.051
            },
            {
              word: 'could',
              confidence: 0.017
            },
            {
              word: '!silence',
              confidence: 0.013
            },
            {
              word: 'can',
              confidence: 0.01
            },
            {
              word: 'exactly',
              confidence: 0.001
            },
            {
              word: 'second',
              confidence: 0.001
            },
            {
              word: 'back',
              confidence: 0.001
            },
            {
              word: 'thing',
              confidence: 0.001
            },
            {
              word: 'yeah',
              confidence: 0
            },
            {
              word: 'i',
              confidence: 0
            },
            {
              word: 'go',
              confidence: 0
            }
          ],
          guid: '46eb-4c87-47ff'
        },
        {
          startTimeMs: 49419,
          stopTimeMs: 49727,
          words: [
            {
              word: 'girl',
              confidence: 0.733,
              bestPath: true
            },
            {
              word: 'girls',
              confidence: 0.086
            },
            {
              word: 'personal',
              confidence: 0.085
            },
            {
              word: "girl's",
              confidence: 0.046
            },
            {
              word: 'person',
              confidence: 0.043
            },
            {
              word: 'drill',
              confidence: 0.001
            },
            {
              word: 'exactly',
              confidence: 0
            },
            {
              word: 'can',
              confidence: 0
            },
            {
              word: 'could',
              confidence: 0
            },
            {
              word: 'back',
              confidence: 0
            },
            {
              word: 'thing',
              confidence: 0
            },
            {
              word: '!silence',
              confidence: 0
            },
            {
              word: 'second',
              confidence: 0
            },
            {
              word: 'thanks',
              confidence: 0
            },
            {
              word: 'okay',
              confidence: 0
            }
          ],
          guid: '55ce-9e74-b98d'
        },
        {
          startTimeMs: 68760,
          stopTimeMs: 68940,
          words: [
            {
              word: 'no',
              confidence: 0.776,
              bestPath: true
            },
            {
              word: 'know',
              confidence: 0.223
            }
          ],
          guid: '6815-6a44-49f0'
        },
        {
          startTimeMs: 68940,
          stopTimeMs: 69298,
          words: [
            {
              word: 'needles',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '7499-3d13-d2e1'
        },
        {
          startTimeMs: 69304,
          stopTimeMs: 69555,
          words: [
            {
              word: 'alright',
              confidence: 0.895,
              bestPath: true
            },
            {
              word: 'right',
              confidence: 0.049
            },
            {
              word: '!silence',
              confidence: 0.046
            },
            {
              word: 'or',
              confidence: 0.008
            }
          ],
          guid: '8c53-43ea-d26f'
        },
        {
          startTimeMs: 84860,
          stopTimeMs: 84980,
          words: [
            {
              word: 'how',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '3a5e-b64d-7f7f'
        },
        {
          startTimeMs: 84980,
          stopTimeMs: 85160,
          words: [
            {
              word: 'much',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: 'b7e3-c8ba-0f79'
        },
        {
          startTimeMs: 85160,
          stopTimeMs: 85249,
          words: [
            {
              word: 'you',
              confidence: 0.969,
              bestPath: true
            },
            {
              word: 'is',
              confidence: 0.016
            },
            {
              word: '!silence',
              confidence: 0.009
            },
            {
              word: "you've",
              confidence: 0.004
            }
          ],
          guid: '6e0e-516f-a836'
        },
        {
          startTimeMs: 85274,
          stopTimeMs: 85406,
          words: [
            {
              word: 'got',
              confidence: 0.835,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.134
            },
            {
              word: 'that',
              confidence: 0.016
            },
            {
              word: 'said',
              confidence: 0.007
            },
            {
              word: 'is',
              confidence: 0.004
            }
          ],
          guid: 'a535-870d-c344'
        },
        {
          startTimeMs: 90858,
          stopTimeMs: 91247,
          words: [
            {
              word: 'programs',
              confidence: 0.649,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.35
            }
          ],
          guid: '5615-256b-2c57'
        },
        {
          startTimeMs: 92448,
          stopTimeMs: 92687,
          words: [
            {
              word: 'six',
              confidence: 0.704,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.281
            },
            {
              word: 'program',
              confidence: 0.011
            },
            {
              word: 'bye',
              confidence: 0.002
            }
          ],
          guid: 'bdd6-a206-82d8'
        },
        {
          startTimeMs: 100759,
          stopTimeMs: 100933,
          words: [
            {
              word: 'oh',
              confidence: 0.832,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.101
            },
            {
              word: 'ooh',
              confidence: 0.041
            },
            {
              word: 'sure',
              confidence: 0.014
            },
            {
              word: 'should',
              confidence: 0.006
            },
            {
              word: 'okay',
              confidence: 0.002
            }
          ],
          guid: 'd943-4e9d-ebfb'
        },
        {
          startTimeMs: 101557,
          stopTimeMs: 101702,
          words: [
            {
              word: 'go',
              confidence: 0.782,
              bestPath: true
            },
            {
              word: 'the',
              confidence: 0.12
            },
            {
              word: '!silence',
              confidence: 0.047
            },
            {
              word: 'sure',
              confidence: 0.035
            },
            {
              word: 'ooh',
              confidence: 0.014
            }
          ],
          guid: 'de62-72fb-6236'
        },
        {
          startTimeMs: 101802,
          stopTimeMs: 102015,
          words: [
            {
              word: 'check',
              confidence: 0.964,
              bestPath: true
            },
            {
              word: 'gotcha',
              confidence: 0.025
            },
            {
              word: 'the',
              confidence: 0.008
            },
            {
              word: '!silence',
              confidence: 0
            }
          ],
          guid: 'ac4f-4649-8ce5'
        },
        {
          startTimeMs: 102016,
          stopTimeMs: 102169,
          words: [
            {
              word: 'out',
              confidence: 0.96,
              bestPath: true
            },
            {
              word: 'got',
              confidence: 0.023
            },
            {
              word: 'checkout',
              confidence: 0.008
            },
            {
              word: 'on',
              confidence: 0.004
            },
            {
              word: 'gotcha',
              confidence: 0.003
            },
            {
              word: 'sure',
              confidence: 0
            },
            {
              word: '!silence',
              confidence: 0
            }
          ],
          guid: '6bca-7f85-5e17'
        },
        {
          startTimeMs: 102170,
          stopTimeMs: 102260,
          words: [
            {
              word: 'how',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: 'e8f3-fdb2-3286'
        },
        {
          startTimeMs: 102260,
          stopTimeMs: 102440,
          words: [
            {
              word: 'much',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '7186-63b5-017a'
        },
        {
          startTimeMs: 102440,
          stopTimeMs: 102590,
          words: [
            {
              word: 'is',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '5372-0edb-ae76'
        },
        {
          startTimeMs: 102590,
          stopTimeMs: 102710,
          words: [
            {
              word: 'on',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '2be4-5ce6-acb4'
        },
        {
          startTimeMs: 102710,
          stopTimeMs: 102950,
          words: [
            {
              word: 'them',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: 'f661-c2a5-5bdb'
        },
        {
          startTimeMs: 109603,
          stopTimeMs: 109887,
          words: [
            {
              word: 'thing',
              confidence: 0.414,
              bestPath: true
            },
            {
              word: 'for',
              confidence: 0.187
            },
            {
              word: 'to',
              confidence: 0.144
            },
            {
              word: 'team',
              confidence: 0.106
            },
            {
              word: '!silence',
              confidence: 0.093
            },
            {
              word: 'bird',
              confidence: 0.053
            }
          ],
          guid: '65c5-31d8-2741'
        },
        {
          startTimeMs: 110340,
          stopTimeMs: 110520,
          words: [
            {
              word: 'for',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '5a31-edbb-1d68'
        },
        {
          startTimeMs: 110520,
          stopTimeMs: 110880,
          words: [
            {
              word: 'the',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '285e-97ab-fe88'
        },
        {
          startTimeMs: 111240,
          stopTimeMs: 111406,
          words: [
            {
              word: 'run',
              confidence: 0.593,
              bestPath: true
            },
            {
              word: 'what',
              confidence: 0.361
            },
            {
              word: "we're",
              confidence: 0.027
            },
            {
              word: 'one',
              confidence: 0.011
            },
            {
              word: 'around',
              confidence: 0.006
            }
          ],
          guid: '2b27-47f2-e90a'
        },
        {
          startTimeMs: 111431,
          stopTimeMs: 111600,
          words: [
            {
              word: 'talking',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: 'f0a7-20b7-387e'
        },
        {
          startTimeMs: 111600,
          stopTimeMs: 111780,
          words: [
            {
              word: 'about',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '4bd8-3e0b-db7b'
        },
        {
          startTimeMs: 112175,
          stopTimeMs: 112634,
          words: [
            {
              word: 'magnetic',
              confidence: 0.906,
              bestPath: true
            },
            {
              word: 'to',
              confidence: 0.054
            },
            {
              word: 'two',
              confidence: 0.039
            }
          ],
          guid: '739d-1f64-5461'
        },
        {
          startTimeMs: 112634,
          stopTimeMs: 112734,
          words: [
            {
              word: 'or',
              confidence: 0.733,
              bestPath: true
            },
            {
              word: 'magnetic',
              confidence: 0.093
            },
            {
              word: 'of',
              confidence: 0.092
            },
            {
              word: '!silence',
              confidence: 0.05
            },
            {
              word: 'with',
              confidence: 0.017
            },
            {
              word: 'for',
              confidence: 0.012
            }
          ],
          guid: '56a4-a9ba-77ef'
        },
        {
          startTimeMs: 112734,
          stopTimeMs: 112830,
          words: [
            {
              word: 'the',
              confidence: 0.856,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.143
            },
            {
              word: 'censors',
              confidence: 0
            }
          ],
          guid: 'b4cd-1561-068d'
        },
        {
          startTimeMs: 112830,
          stopTimeMs: 113430,
          words: [
            {
              word: 'sensors',
              confidence: 0.847,
              bestPath: true
            },
            {
              word: 'censors',
              confidence: 0.151
            },
            {
              word: '!silence',
              confidence: 0
            }
          ],
          guid: '9e86-94f5-6791'
        },
        {
          startTimeMs: 114223,
          stopTimeMs: 114498,
          words: [
            {
              word: "wasn't",
              confidence: 0.465,
              bestPath: true
            },
            {
              word: "doesn't",
              confidence: 0.284
            },
            {
              word: 'yep',
              confidence: 0.141
            },
            {
              word: 'present',
              confidence: 0.108
            }
          ],
          guid: '241b-05fb-fba5'
        },
        {
          startTimeMs: 114570,
          stopTimeMs: 114659,
          words: [
            {
              word: 'it',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '15c0-f4fe-6383'
        },
        {
          startTimeMs: 115260,
          stopTimeMs: 115470,
          words: [
            {
              word: "what's",
              confidence: 1,
              bestPath: true
            }
          ],
          guid: 'f545-ee9f-c198'
        },
        {
          startTimeMs: 115470,
          stopTimeMs: 115770,
          words: [
            {
              word: 'that',
              confidence: 1,
              bestPath: true
            }
          ],
          guid: '628e-2583-426b'
        },
        {
          startTimeMs: 144048,
          stopTimeMs: 144197,
          words: [
            {
              word: 'go',
              confidence: 0.883,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.116
            }
          ],
          guid: '2405-659a-7499'
        },
        {
          startTimeMs: 144235,
          stopTimeMs: 144300,
          words: [
            {
              word: 'to',
              confidence: 0.413,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.319
            },
            {
              word: 'over',
              confidence: 0.165
            },
            {
              word: 'your',
              confidence: 0.042
            },
            {
              word: 'no',
              confidence: 0.024
            },
            {
              word: "you're",
              confidence: 0.023
            },
            {
              word: 'or',
              confidence: 0.01
            }
          ],
          guid: '4d30-7401-f6d6'
        },
        {
          startTimeMs: 144303,
          stopTimeMs: 144369,
          words: [
            {
              word: 'the',
              confidence: 0.88,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.104
            },
            {
              word: 'web',
              confidence: 0.014
            },
            {
              word: 'goto',
              confidence: 0.001
            }
          ],
          guid: '9e5a-e85e-0778'
        },
        {
          startTimeMs: 144400,
          stopTimeMs: 144571,
          words: [
            {
              word: 'web',
              confidence: 0.975,
              bestPath: true
            },
            {
              word: 'presence',
              confidence: 0.014
            },
            {
              word: 'yeah',
              confidence: 0.004
            },
            {
              word: 'gotowebinar',
              confidence: 0.002
            },
            {
              word: 'webinar',
              confidence: 0.001
            },
            {
              word: 'yes',
              confidence: 0
            },
            {
              word: 'yep',
              confidence: 0
            },
            {
              word: 'yup',
              confidence: 0
            }
          ],
          guid: 'f289-f711-2226'
        },
        {
          startTimeMs: 184359,
          stopTimeMs: 184579,
          words: [
            {
              word: 'roller',
              confidence: 0.245,
              bestPath: true
            },
            {
              word: 'role',
              confidence: 0.222
            },
            {
              word: 'road',
              confidence: 0.138
            },
            {
              word: 'roll',
              confidence: 0.135
            },
            {
              word: 'rolling',
              confidence: 0.079
            },
            {
              word: 'row',
              confidence: 0.041
            },
            {
              word: 'rhode',
              confidence: 0.033
            },
            {
              word: 'roles',
              confidence: 0.02
            },
            {
              word: 'rather',
              confidence: 0.016
            },
            {
              word: 'rose',
              confidence: 0.015
            },
            {
              word: 'wrote',
              confidence: 0.014
            },
            {
              word: 'throw',
              confidence: 0.009
            },
            {
              word: 'really',
              confidence: 0.006
            },
            {
              word: 'royal',
              confidence: 0.004
            },
            {
              word: 'well',
              confidence: 0.003
            },
            {
              word: 'go',
              confidence: 0.003
            },
            {
              word: "you're",
              confidence: 0.003
            },
            {
              word: 'no',
              confidence: 0.002
            },
            {
              word: 'the',
              confidence: 0.001
            },
            {
              word: '!silence',
              confidence: 0
            }
          ],
          guid: '7b5e-b51f-0002'
        },
        {
          startTimeMs: 184599,
          stopTimeMs: 184903,
          words: [
            {
              word: 'dopey',
              confidence: 0.386,
              bestPath: true
            },
            {
              word: 'adobe',
              confidence: 0.241
            },
            {
              word: 'doping',
              confidence: 0.198
            },
            {
              word: 'docusign',
              confidence: 0.136
            },
            {
              word: 'dokey',
              confidence: 0.033
            },
            {
              word: 'the',
              confidence: 0.003
            },
            {
              word: '!silence',
              confidence: 0
            },
            {
              word: 'royal',
              confidence: 0
            }
          ],
          guid: 'bdd2-b5d6-f22e'
        },
        {
          startTimeMs: 184904,
          stopTimeMs: 185384,
          words: [
            {
              word: 'receivers',
              confidence: 0.737,
              bestPath: true
            },
            {
              word: 'receiver',
              confidence: 0.262
            },
            {
              word: '!silence',
              confidence: 0
            },
            {
              word: 'road',
              confidence: 0
            },
            {
              word: 'rolling',
              confidence: 0
            },
            {
              word: 'adobe',
              confidence: 0
            },
            {
              word: 'right',
              confidence: 0
            }
          ],
          guid: 'ab8e-51c9-42b7'
        },
        {
          startTimeMs: 189232,
          stopTimeMs: 189592,
          words: [
            {
              word: 'now',
              confidence: 0.995,
              bestPath: true
            },
            {
              word: '!silence',
              confidence: 0.004
            }
          ],
          guid: 'fb18-b8b6-5a4e'
        }
      ],
      userEdited: false,
      assetId: '211155739_YBNsMDBh8q',
      startTimeMs: 48005,
      stopTimeMs: 189592,
      wordGuidMap: {
        'e8cc-0b99-79b5': {
          chunkIndex: 0,
          index: 0,
          serie: {
            startTimeMs: 48005,
            stopTimeMs: 48299,
            words: [
              {
                word: 'things',
                confidence: 0.584,
                bestPath: true
              },
              {
                word: 'black',
                confidence: 0.122
              },
              {
                word: '!silence',
                confidence: 0.083
              },
              {
                word: 'thing',
                confidence: 0.068
              },
              {
                word: 'back',
                confidence: 0.053
              },
              {
                word: "it's",
                confidence: 0.036
              },
              {
                word: 'bags',
                confidence: 0.025
              },
              {
                word: 'so',
                confidence: 0.012
              },
              {
                word: 'thanks',
                confidence: 0.006
              },
              {
                word: 'yeah',
                confidence: 0.002
              },
              {
                word: 'i',
                confidence: 0.001
              },
              {
                word: 'go',
                confidence: 0.001
              }
            ],
            guid: 'e8cc-0b99-79b5'
          }
        },
        '6c35-6d29-7930': {
          chunkIndex: 0,
          index: 1,
          serie: {
            startTimeMs: 48980,
            stopTimeMs: 49126,
            words: [
              {
                word: 'like',
                confidence: 0.915,
                bestPath: true
              },
              {
                word: 'i',
                confidence: 0.028
              },
              {
                word: 'could',
                confidence: 0.019
              },
              {
                word: '!silence',
                confidence: 0.014
              },
              {
                word: 'can',
                confidence: 0.011
              },
              {
                word: 'exactly',
                confidence: 0.002
              },
              {
                word: 'second',
                confidence: 0.002
              },
              {
                word: 'back',
                confidence: 0.001
              },
              {
                word: 'thing',
                confidence: 0.001
              },
              {
                word: 'yeah',
                confidence: 0.001
              },
              {
                word: 'go',
                confidence: 0.001
              },
              {
                word: 'so',
                confidence: 0
              }
            ],
            guid: '6c35-6d29-7930'
          }
        },
        '46eb-4c87-47ff': {
          chunkIndex: 0,
          index: 2,
          serie: {
            startTimeMs: 49182,
            stopTimeMs: 49257,
            words: [
              {
                word: 'a',
                confidence: 0.899,
                bestPath: true
              },
              {
                word: 'girls',
                confidence: 0.051
              },
              {
                word: 'could',
                confidence: 0.017
              },
              {
                word: '!silence',
                confidence: 0.013
              },
              {
                word: 'can',
                confidence: 0.01
              },
              {
                word: 'exactly',
                confidence: 0.001
              },
              {
                word: 'second',
                confidence: 0.001
              },
              {
                word: 'back',
                confidence: 0.001
              },
              {
                word: 'thing',
                confidence: 0.001
              },
              {
                word: 'yeah',
                confidence: 0
              },
              {
                word: 'i',
                confidence: 0
              },
              {
                word: 'go',
                confidence: 0
              }
            ],
            guid: '46eb-4c87-47ff'
          }
        },
        '55ce-9e74-b98d': {
          chunkIndex: 0,
          index: 3,
          serie: {
            startTimeMs: 49419,
            stopTimeMs: 49727,
            words: [
              {
                word: 'girl',
                confidence: 0.733,
                bestPath: true
              },
              {
                word: 'girls',
                confidence: 0.086
              },
              {
                word: 'personal',
                confidence: 0.085
              },
              {
                word: "girl's",
                confidence: 0.046
              },
              {
                word: 'person',
                confidence: 0.043
              },
              {
                word: 'drill',
                confidence: 0.001
              },
              {
                word: 'exactly',
                confidence: 0
              },
              {
                word: 'can',
                confidence: 0
              },
              {
                word: 'could',
                confidence: 0
              },
              {
                word: 'back',
                confidence: 0
              },
              {
                word: 'thing',
                confidence: 0
              },
              {
                word: '!silence',
                confidence: 0
              },
              {
                word: 'second',
                confidence: 0
              },
              {
                word: 'thanks',
                confidence: 0
              },
              {
                word: 'okay',
                confidence: 0
              }
            ],
            guid: '55ce-9e74-b98d'
          }
        },
        '6815-6a44-49f0': {
          chunkIndex: 0,
          index: 4,
          serie: {
            startTimeMs: 68760,
            stopTimeMs: 68940,
            words: [
              {
                word: 'no',
                confidence: 0.776,
                bestPath: true
              },
              {
                word: 'know',
                confidence: 0.223
              }
            ],
            guid: '6815-6a44-49f0'
          }
        },
        '7499-3d13-d2e1': {
          chunkIndex: 0,
          index: 5,
          serie: {
            startTimeMs: 68940,
            stopTimeMs: 69298,
            words: [
              {
                word: 'needles',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '7499-3d13-d2e1'
          }
        },
        '8c53-43ea-d26f': {
          chunkIndex: 0,
          index: 6,
          serie: {
            startTimeMs: 69304,
            stopTimeMs: 69555,
            words: [
              {
                word: 'alright',
                confidence: 0.895,
                bestPath: true
              },
              {
                word: 'right',
                confidence: 0.049
              },
              {
                word: '!silence',
                confidence: 0.046
              },
              {
                word: 'or',
                confidence: 0.008
              }
            ],
            guid: '8c53-43ea-d26f'
          }
        },
        '3a5e-b64d-7f7f': {
          chunkIndex: 0,
          index: 7,
          serie: {
            startTimeMs: 84860,
            stopTimeMs: 84980,
            words: [
              {
                word: 'how',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '3a5e-b64d-7f7f'
          }
        },
        'b7e3-c8ba-0f79': {
          chunkIndex: 0,
          index: 8,
          serie: {
            startTimeMs: 84980,
            stopTimeMs: 85160,
            words: [
              {
                word: 'much',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: 'b7e3-c8ba-0f79'
          }
        },
        '6e0e-516f-a836': {
          chunkIndex: 0,
          index: 9,
          serie: {
            startTimeMs: 85160,
            stopTimeMs: 85249,
            words: [
              {
                word: 'you',
                confidence: 0.969,
                bestPath: true
              },
              {
                word: 'is',
                confidence: 0.016
              },
              {
                word: '!silence',
                confidence: 0.009
              },
              {
                word: "you've",
                confidence: 0.004
              }
            ],
            guid: '6e0e-516f-a836'
          }
        },
        'a535-870d-c344': {
          chunkIndex: 0,
          index: 10,
          serie: {
            startTimeMs: 85274,
            stopTimeMs: 85406,
            words: [
              {
                word: 'got',
                confidence: 0.835,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.134
              },
              {
                word: 'that',
                confidence: 0.016
              },
              {
                word: 'said',
                confidence: 0.007
              },
              {
                word: 'is',
                confidence: 0.004
              }
            ],
            guid: 'a535-870d-c344'
          }
        },
        '5615-256b-2c57': {
          chunkIndex: 0,
          index: 11,
          serie: {
            startTimeMs: 90858,
            stopTimeMs: 91247,
            words: [
              {
                word: 'programs',
                confidence: 0.649,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.35
              }
            ],
            guid: '5615-256b-2c57'
          }
        },
        'bdd6-a206-82d8': {
          chunkIndex: 0,
          index: 12,
          serie: {
            startTimeMs: 92448,
            stopTimeMs: 92687,
            words: [
              {
                word: 'six',
                confidence: 0.704,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.281
              },
              {
                word: 'program',
                confidence: 0.011
              },
              {
                word: 'bye',
                confidence: 0.002
              }
            ],
            guid: 'bdd6-a206-82d8'
          }
        },
        'd943-4e9d-ebfb': {
          chunkIndex: 0,
          index: 13,
          serie: {
            startTimeMs: 100759,
            stopTimeMs: 100933,
            words: [
              {
                word: 'oh',
                confidence: 0.832,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.101
              },
              {
                word: 'ooh',
                confidence: 0.041
              },
              {
                word: 'sure',
                confidence: 0.014
              },
              {
                word: 'should',
                confidence: 0.006
              },
              {
                word: 'okay',
                confidence: 0.002
              }
            ],
            guid: 'd943-4e9d-ebfb'
          }
        },
        'de62-72fb-6236': {
          chunkIndex: 0,
          index: 14,
          serie: {
            startTimeMs: 101557,
            stopTimeMs: 101702,
            words: [
              {
                word: 'go',
                confidence: 0.782,
                bestPath: true
              },
              {
                word: 'the',
                confidence: 0.12
              },
              {
                word: '!silence',
                confidence: 0.047
              },
              {
                word: 'sure',
                confidence: 0.035
              },
              {
                word: 'ooh',
                confidence: 0.014
              }
            ],
            guid: 'de62-72fb-6236'
          }
        },
        'ac4f-4649-8ce5': {
          chunkIndex: 0,
          index: 15,
          serie: {
            startTimeMs: 101802,
            stopTimeMs: 102015,
            words: [
              {
                word: 'check',
                confidence: 0.964,
                bestPath: true
              },
              {
                word: 'gotcha',
                confidence: 0.025
              },
              {
                word: 'the',
                confidence: 0.008
              },
              {
                word: '!silence',
                confidence: 0
              }
            ],
            guid: 'ac4f-4649-8ce5'
          }
        },
        '6bca-7f85-5e17': {
          chunkIndex: 0,
          index: 16,
          serie: {
            startTimeMs: 102016,
            stopTimeMs: 102169,
            words: [
              {
                word: 'out',
                confidence: 0.96,
                bestPath: true
              },
              {
                word: 'got',
                confidence: 0.023
              },
              {
                word: 'checkout',
                confidence: 0.008
              },
              {
                word: 'on',
                confidence: 0.004
              },
              {
                word: 'gotcha',
                confidence: 0.003
              },
              {
                word: 'sure',
                confidence: 0
              },
              {
                word: '!silence',
                confidence: 0
              }
            ],
            guid: '6bca-7f85-5e17'
          }
        },
        'e8f3-fdb2-3286': {
          chunkIndex: 0,
          index: 17,
          serie: {
            startTimeMs: 102170,
            stopTimeMs: 102260,
            words: [
              {
                word: 'how',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: 'e8f3-fdb2-3286'
          }
        },
        '7186-63b5-017a': {
          chunkIndex: 0,
          index: 18,
          serie: {
            startTimeMs: 102260,
            stopTimeMs: 102440,
            words: [
              {
                word: 'much',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '7186-63b5-017a'
          }
        },
        '5372-0edb-ae76': {
          chunkIndex: 0,
          index: 19,
          serie: {
            startTimeMs: 102440,
            stopTimeMs: 102590,
            words: [
              {
                word: 'is',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '5372-0edb-ae76'
          }
        },
        '2be4-5ce6-acb4': {
          chunkIndex: 0,
          index: 20,
          serie: {
            startTimeMs: 102590,
            stopTimeMs: 102710,
            words: [
              {
                word: 'on',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '2be4-5ce6-acb4'
          }
        },
        'f661-c2a5-5bdb': {
          chunkIndex: 0,
          index: 21,
          serie: {
            startTimeMs: 102710,
            stopTimeMs: 102950,
            words: [
              {
                word: 'them',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: 'f661-c2a5-5bdb'
          }
        },
        '65c5-31d8-2741': {
          chunkIndex: 0,
          index: 22,
          serie: {
            startTimeMs: 109603,
            stopTimeMs: 109887,
            words: [
              {
                word: 'thing',
                confidence: 0.414,
                bestPath: true
              },
              {
                word: 'for',
                confidence: 0.187
              },
              {
                word: 'to',
                confidence: 0.144
              },
              {
                word: 'team',
                confidence: 0.106
              },
              {
                word: '!silence',
                confidence: 0.093
              },
              {
                word: 'bird',
                confidence: 0.053
              }
            ],
            guid: '65c5-31d8-2741'
          }
        },
        '5a31-edbb-1d68': {
          chunkIndex: 0,
          index: 23,
          serie: {
            startTimeMs: 110340,
            stopTimeMs: 110520,
            words: [
              {
                word: 'for',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '5a31-edbb-1d68'
          }
        },
        '285e-97ab-fe88': {
          chunkIndex: 0,
          index: 24,
          serie: {
            startTimeMs: 110520,
            stopTimeMs: 110880,
            words: [
              {
                word: 'the',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '285e-97ab-fe88'
          }
        },
        '2b27-47f2-e90a': {
          chunkIndex: 0,
          index: 25,
          serie: {
            startTimeMs: 111240,
            stopTimeMs: 111406,
            words: [
              {
                word: 'run',
                confidence: 0.593,
                bestPath: true
              },
              {
                word: 'what',
                confidence: 0.361
              },
              {
                word: "we're",
                confidence: 0.027
              },
              {
                word: 'one',
                confidence: 0.011
              },
              {
                word: 'around',
                confidence: 0.006
              }
            ],
            guid: '2b27-47f2-e90a'
          }
        },
        'f0a7-20b7-387e': {
          chunkIndex: 0,
          index: 26,
          serie: {
            startTimeMs: 111431,
            stopTimeMs: 111600,
            words: [
              {
                word: 'talking',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: 'f0a7-20b7-387e'
          }
        },
        '4bd8-3e0b-db7b': {
          chunkIndex: 0,
          index: 27,
          serie: {
            startTimeMs: 111600,
            stopTimeMs: 111780,
            words: [
              {
                word: 'about',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '4bd8-3e0b-db7b'
          }
        },
        '739d-1f64-5461': {
          chunkIndex: 0,
          index: 28,
          serie: {
            startTimeMs: 112175,
            stopTimeMs: 112634,
            words: [
              {
                word: 'magnetic',
                confidence: 0.906,
                bestPath: true
              },
              {
                word: 'to',
                confidence: 0.054
              },
              {
                word: 'two',
                confidence: 0.039
              }
            ],
            guid: '739d-1f64-5461'
          }
        },
        '56a4-a9ba-77ef': {
          chunkIndex: 0,
          index: 29,
          serie: {
            startTimeMs: 112634,
            stopTimeMs: 112734,
            words: [
              {
                word: 'or',
                confidence: 0.733,
                bestPath: true
              },
              {
                word: 'magnetic',
                confidence: 0.093
              },
              {
                word: 'of',
                confidence: 0.092
              },
              {
                word: '!silence',
                confidence: 0.05
              },
              {
                word: 'with',
                confidence: 0.017
              },
              {
                word: 'for',
                confidence: 0.012
              }
            ],
            guid: '56a4-a9ba-77ef'
          }
        },
        'b4cd-1561-068d': {
          chunkIndex: 0,
          index: 30,
          serie: {
            startTimeMs: 112734,
            stopTimeMs: 112830,
            words: [
              {
                word: 'the',
                confidence: 0.856,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.143
              },
              {
                word: 'censors',
                confidence: 0
              }
            ],
            guid: 'b4cd-1561-068d'
          }
        },
        '9e86-94f5-6791': {
          chunkIndex: 0,
          index: 31,
          serie: {
            startTimeMs: 112830,
            stopTimeMs: 113430,
            words: [
              {
                word: 'sensors',
                confidence: 0.847,
                bestPath: true
              },
              {
                word: 'censors',
                confidence: 0.151
              },
              {
                word: '!silence',
                confidence: 0
              }
            ],
            guid: '9e86-94f5-6791'
          }
        },
        '241b-05fb-fba5': {
          chunkIndex: 0,
          index: 32,
          serie: {
            startTimeMs: 114223,
            stopTimeMs: 114498,
            words: [
              {
                word: "wasn't",
                confidence: 0.465,
                bestPath: true
              },
              {
                word: "doesn't",
                confidence: 0.284
              },
              {
                word: 'yep',
                confidence: 0.141
              },
              {
                word: 'present',
                confidence: 0.108
              }
            ],
            guid: '241b-05fb-fba5'
          }
        },
        '15c0-f4fe-6383': {
          chunkIndex: 0,
          index: 33,
          serie: {
            startTimeMs: 114570,
            stopTimeMs: 114659,
            words: [
              {
                word: 'it',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '15c0-f4fe-6383'
          }
        },
        'f545-ee9f-c198': {
          chunkIndex: 0,
          index: 34,
          serie: {
            startTimeMs: 115260,
            stopTimeMs: 115470,
            words: [
              {
                word: "what's",
                confidence: 1,
                bestPath: true
              }
            ],
            guid: 'f545-ee9f-c198'
          }
        },
        '628e-2583-426b': {
          chunkIndex: 0,
          index: 35,
          serie: {
            startTimeMs: 115470,
            stopTimeMs: 115770,
            words: [
              {
                word: 'that',
                confidence: 1,
                bestPath: true
              }
            ],
            guid: '628e-2583-426b'
          }
        },
        '2405-659a-7499': {
          chunkIndex: 0,
          index: 36,
          serie: {
            startTimeMs: 144048,
            stopTimeMs: 144197,
            words: [
              {
                word: 'go',
                confidence: 0.883,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.116
              }
            ],
            guid: '2405-659a-7499'
          }
        },
        '4d30-7401-f6d6': {
          chunkIndex: 0,
          index: 37,
          serie: {
            startTimeMs: 144235,
            stopTimeMs: 144300,
            words: [
              {
                word: 'to',
                confidence: 0.413,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.319
              },
              {
                word: 'over',
                confidence: 0.165
              },
              {
                word: 'your',
                confidence: 0.042
              },
              {
                word: 'no',
                confidence: 0.024
              },
              {
                word: "you're",
                confidence: 0.023
              },
              {
                word: 'or',
                confidence: 0.01
              }
            ],
            guid: '4d30-7401-f6d6'
          }
        },
        '9e5a-e85e-0778': {
          chunkIndex: 0,
          index: 38,
          serie: {
            startTimeMs: 144303,
            stopTimeMs: 144369,
            words: [
              {
                word: 'the',
                confidence: 0.88,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.104
              },
              {
                word: 'web',
                confidence: 0.014
              },
              {
                word: 'goto',
                confidence: 0.001
              }
            ],
            guid: '9e5a-e85e-0778'
          }
        },
        'f289-f711-2226': {
          chunkIndex: 0,
          index: 39,
          serie: {
            startTimeMs: 144400,
            stopTimeMs: 144571,
            words: [
              {
                word: 'web',
                confidence: 0.975,
                bestPath: true
              },
              {
                word: 'presence',
                confidence: 0.014
              },
              {
                word: 'yeah',
                confidence: 0.004
              },
              {
                word: 'gotowebinar',
                confidence: 0.002
              },
              {
                word: 'webinar',
                confidence: 0.001
              },
              {
                word: 'yes',
                confidence: 0
              },
              {
                word: 'yep',
                confidence: 0
              },
              {
                word: 'yup',
                confidence: 0
              }
            ],
            guid: 'f289-f711-2226'
          }
        },
        '7b5e-b51f-0002': {
          chunkIndex: 0,
          index: 40,
          serie: {
            startTimeMs: 184359,
            stopTimeMs: 184579,
            words: [
              {
                word: 'roller',
                confidence: 0.245,
                bestPath: true
              },
              {
                word: 'role',
                confidence: 0.222
              },
              {
                word: 'road',
                confidence: 0.138
              },
              {
                word: 'roll',
                confidence: 0.135
              },
              {
                word: 'rolling',
                confidence: 0.079
              },
              {
                word: 'row',
                confidence: 0.041
              },
              {
                word: 'rhode',
                confidence: 0.033
              },
              {
                word: 'roles',
                confidence: 0.02
              },
              {
                word: 'rather',
                confidence: 0.016
              },
              {
                word: 'rose',
                confidence: 0.015
              },
              {
                word: 'wrote',
                confidence: 0.014
              },
              {
                word: 'throw',
                confidence: 0.009
              },
              {
                word: 'really',
                confidence: 0.006
              },
              {
                word: 'royal',
                confidence: 0.004
              },
              {
                word: 'well',
                confidence: 0.003
              },
              {
                word: 'go',
                confidence: 0.003
              },
              {
                word: "you're",
                confidence: 0.003
              },
              {
                word: 'no',
                confidence: 0.002
              },
              {
                word: 'the',
                confidence: 0.001
              },
              {
                word: '!silence',
                confidence: 0
              }
            ],
            guid: '7b5e-b51f-0002'
          }
        },
        'bdd2-b5d6-f22e': {
          chunkIndex: 0,
          index: 41,
          serie: {
            startTimeMs: 184599,
            stopTimeMs: 184903,
            words: [
              {
                word: 'dopey',
                confidence: 0.386,
                bestPath: true
              },
              {
                word: 'adobe',
                confidence: 0.241
              },
              {
                word: 'doping',
                confidence: 0.198
              },
              {
                word: 'docusign',
                confidence: 0.136
              },
              {
                word: 'dokey',
                confidence: 0.033
              },
              {
                word: 'the',
                confidence: 0.003
              },
              {
                word: '!silence',
                confidence: 0
              },
              {
                word: 'royal',
                confidence: 0
              }
            ],
            guid: 'bdd2-b5d6-f22e'
          }
        },
        'ab8e-51c9-42b7': {
          chunkIndex: 0,
          index: 42,
          serie: {
            startTimeMs: 184904,
            stopTimeMs: 185384,
            words: [
              {
                word: 'receivers',
                confidence: 0.737,
                bestPath: true
              },
              {
                word: 'receiver',
                confidence: 0.262
              },
              {
                word: '!silence',
                confidence: 0
              },
              {
                word: 'road',
                confidence: 0
              },
              {
                word: 'rolling',
                confidence: 0
              },
              {
                word: 'adobe',
                confidence: 0
              },
              {
                word: 'right',
                confidence: 0
              }
            ],
            guid: 'ab8e-51c9-42b7'
          }
        },
        'fb18-b8b6-5a4e': {
          chunkIndex: 0,
          index: 43,
          serie: {
            startTimeMs: 189232,
            stopTimeMs: 189592,
            words: [
              {
                word: 'now',
                confidence: 0.995,
                bestPath: true
              },
              {
                word: '!silence',
                confidence: 0.004
              }
            ],
            guid: 'fb18-b8b6-5a4e'
          }
        }
      }
    }
  ],
  speakerSegments: [
    {
      engineId: '40356dac-ace5-46c7-aa02-35ef089ca9a4',
      series: [
        {
          speakerId: '?',
          startTimeMs: 0,
          stopTimeMs: 28750,
          guid: '9c97-683e-6207',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'F',
          startTimeMs: 28750,
          stopTimeMs: 30790,
          guid: 'a466-c6af-499a',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: '?',
          startTimeMs: 30790,
          stopTimeMs: 43480,
          guid: '4dea-6dd1-3236',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'G',
          startTimeMs: 43480,
          stopTimeMs: 45770,
          guid: '74de-1dd4-2c9b',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'I',
          startTimeMs: 45770,
          stopTimeMs: 47770,
          guid: 'e76e-43f8-7cd4',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'H',
          startTimeMs: 49190,
          stopTimeMs: 50690,
          guid: '1701-ac16-88f1',
          fragments: [
            {
              startTimeMs: 48005,
              stopTimeMs: 48299,
              words: [
                {
                  word: 'things',
                  confidence: 0.584,
                  bestPath: true
                },
                {
                  word: 'black',
                  confidence: 0.122
                },
                {
                  word: '!silence',
                  confidence: 0.083
                },
                {
                  word: 'thing',
                  confidence: 0.068
                },
                {
                  word: 'back',
                  confidence: 0.053
                },
                {
                  word: "it's",
                  confidence: 0.036
                },
                {
                  word: 'bags',
                  confidence: 0.025
                },
                {
                  word: 'so',
                  confidence: 0.012
                },
                {
                  word: 'thanks',
                  confidence: 0.006
                },
                {
                  word: 'yeah',
                  confidence: 0.002
                },
                {
                  word: 'i',
                  confidence: 0.001
                },
                {
                  word: 'go',
                  confidence: 0.001
                }
              ],
              guid: 'e8cc-0b99-79b5',
              chunkIndex: 0,
              index: 0
            },
            {
              startTimeMs: 48980,
              stopTimeMs: 49126,
              words: [
                {
                  word: 'like',
                  confidence: 0.915,
                  bestPath: true
                },
                {
                  word: 'i',
                  confidence: 0.028
                },
                {
                  word: 'could',
                  confidence: 0.019
                },
                {
                  word: '!silence',
                  confidence: 0.014
                },
                {
                  word: 'can',
                  confidence: 0.011
                },
                {
                  word: 'exactly',
                  confidence: 0.002
                },
                {
                  word: 'second',
                  confidence: 0.002
                },
                {
                  word: 'back',
                  confidence: 0.001
                },
                {
                  word: 'thing',
                  confidence: 0.001
                },
                {
                  word: 'yeah',
                  confidence: 0.001
                },
                {
                  word: 'go',
                  confidence: 0.001
                },
                {
                  word: 'so',
                  confidence: 0
                }
              ],
              guid: '6c35-6d29-7930',
              chunkIndex: 0,
              index: 1
            },
            {
              startTimeMs: 49182,
              stopTimeMs: 49257,
              words: [
                {
                  word: 'a',
                  confidence: 0.899,
                  bestPath: true
                },
                {
                  word: 'girls',
                  confidence: 0.051
                },
                {
                  word: 'could',
                  confidence: 0.017
                },
                {
                  word: '!silence',
                  confidence: 0.013
                },
                {
                  word: 'can',
                  confidence: 0.01
                },
                {
                  word: 'exactly',
                  confidence: 0.001
                },
                {
                  word: 'second',
                  confidence: 0.001
                },
                {
                  word: 'back',
                  confidence: 0.001
                },
                {
                  word: 'thing',
                  confidence: 0.001
                },
                {
                  word: 'yeah',
                  confidence: 0
                },
                {
                  word: 'i',
                  confidence: 0
                },
                {
                  word: 'go',
                  confidence: 0
                }
              ],
              guid: '46eb-4c87-47ff',
              chunkIndex: 0,
              index: 2
            },
            {
              startTimeMs: 49419,
              stopTimeMs: 49727,
              words: [
                {
                  word: 'girl',
                  confidence: 0.733,
                  bestPath: true
                },
                {
                  word: 'girls',
                  confidence: 0.086
                },
                {
                  word: 'personal',
                  confidence: 0.085
                },
                {
                  word: "girl's",
                  confidence: 0.046
                },
                {
                  word: 'person',
                  confidence: 0.043
                },
                {
                  word: 'drill',
                  confidence: 0.001
                },
                {
                  word: 'exactly',
                  confidence: 0
                },
                {
                  word: 'can',
                  confidence: 0
                },
                {
                  word: 'could',
                  confidence: 0
                },
                {
                  word: 'back',
                  confidence: 0
                },
                {
                  word: 'thing',
                  confidence: 0
                },
                {
                  word: '!silence',
                  confidence: 0
                },
                {
                  word: 'second',
                  confidence: 0
                },
                {
                  word: 'thanks',
                  confidence: 0
                },
                {
                  word: 'okay',
                  confidence: 0
                }
              ],
              guid: '55ce-9e74-b98d',
              chunkIndex: 0,
              index: 3
            }
          ],
          wordGuidMap: {
            'e8cc-0b99-79b5': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 0,
              serie: {
                startTimeMs: 48005,
                stopTimeMs: 48299,
                words: [
                  {
                    word: 'things',
                    confidence: 0.584,
                    bestPath: true
                  },
                  {
                    word: 'black',
                    confidence: 0.122
                  },
                  {
                    word: '!silence',
                    confidence: 0.083
                  },
                  {
                    word: 'thing',
                    confidence: 0.068
                  },
                  {
                    word: 'back',
                    confidence: 0.053
                  },
                  {
                    word: "it's",
                    confidence: 0.036
                  },
                  {
                    word: 'bags',
                    confidence: 0.025
                  },
                  {
                    word: 'so',
                    confidence: 0.012
                  },
                  {
                    word: 'thanks',
                    confidence: 0.006
                  },
                  {
                    word: 'yeah',
                    confidence: 0.002
                  },
                  {
                    word: 'i',
                    confidence: 0.001
                  },
                  {
                    word: 'go',
                    confidence: 0.001
                  }
                ],
                guid: 'e8cc-0b99-79b5',
                chunkIndex: 0,
                index: 0
              },
              speakerIndex: 5,
              speaker: {
                guid: '1701-ac16-88f1',
                startTimeMs: 49190,
                stopTimeMs: 50690,
                speakerId: 'H'
              },
              speakerChunkIndex: 0
            },
            '6c35-6d29-7930': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 1,
              serie: {
                startTimeMs: 48980,
                stopTimeMs: 49126,
                words: [
                  {
                    word: 'like',
                    confidence: 0.915,
                    bestPath: true
                  },
                  {
                    word: 'i',
                    confidence: 0.028
                  },
                  {
                    word: 'could',
                    confidence: 0.019
                  },
                  {
                    word: '!silence',
                    confidence: 0.014
                  },
                  {
                    word: 'can',
                    confidence: 0.011
                  },
                  {
                    word: 'exactly',
                    confidence: 0.002
                  },
                  {
                    word: 'second',
                    confidence: 0.002
                  },
                  {
                    word: 'back',
                    confidence: 0.001
                  },
                  {
                    word: 'thing',
                    confidence: 0.001
                  },
                  {
                    word: 'yeah',
                    confidence: 0.001
                  },
                  {
                    word: 'go',
                    confidence: 0.001
                  },
                  {
                    word: 'so',
                    confidence: 0
                  }
                ],
                guid: '6c35-6d29-7930',
                chunkIndex: 0,
                index: 1
              },
              speakerIndex: 5,
              speaker: {
                guid: '1701-ac16-88f1',
                startTimeMs: 49190,
                stopTimeMs: 50690,
                speakerId: 'H'
              },
              speakerChunkIndex: 0
            },
            '46eb-4c87-47ff': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 2,
              serie: {
                startTimeMs: 49182,
                stopTimeMs: 49257,
                words: [
                  {
                    word: 'a',
                    confidence: 0.899,
                    bestPath: true
                  },
                  {
                    word: 'girls',
                    confidence: 0.051
                  },
                  {
                    word: 'could',
                    confidence: 0.017
                  },
                  {
                    word: '!silence',
                    confidence: 0.013
                  },
                  {
                    word: 'can',
                    confidence: 0.01
                  },
                  {
                    word: 'exactly',
                    confidence: 0.001
                  },
                  {
                    word: 'second',
                    confidence: 0.001
                  },
                  {
                    word: 'back',
                    confidence: 0.001
                  },
                  {
                    word: 'thing',
                    confidence: 0.001
                  },
                  {
                    word: 'yeah',
                    confidence: 0
                  },
                  {
                    word: 'i',
                    confidence: 0
                  },
                  {
                    word: 'go',
                    confidence: 0
                  }
                ],
                guid: '46eb-4c87-47ff',
                chunkIndex: 0,
                index: 2
              },
              speakerIndex: 5,
              speaker: {
                guid: '1701-ac16-88f1',
                startTimeMs: 49190,
                stopTimeMs: 50690,
                speakerId: 'H'
              },
              speakerChunkIndex: 0
            },
            '55ce-9e74-b98d': {
              chunkIndex: 0,
              dialogueIndex: 3,
              index: 3,
              serie: {
                startTimeMs: 49419,
                stopTimeMs: 49727,
                words: [
                  {
                    word: 'girl',
                    confidence: 0.733,
                    bestPath: true
                  },
                  {
                    word: 'girls',
                    confidence: 0.086
                  },
                  {
                    word: 'personal',
                    confidence: 0.085
                  },
                  {
                    word: "girl's",
                    confidence: 0.046
                  },
                  {
                    word: 'person',
                    confidence: 0.043
                  },
                  {
                    word: 'drill',
                    confidence: 0.001
                  },
                  {
                    word: 'exactly',
                    confidence: 0
                  },
                  {
                    word: 'can',
                    confidence: 0
                  },
                  {
                    word: 'could',
                    confidence: 0
                  },
                  {
                    word: 'back',
                    confidence: 0
                  },
                  {
                    word: 'thing',
                    confidence: 0
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  },
                  {
                    word: 'second',
                    confidence: 0
                  },
                  {
                    word: 'thanks',
                    confidence: 0
                  },
                  {
                    word: 'okay',
                    confidence: 0
                  }
                ],
                guid: '55ce-9e74-b98d',
                chunkIndex: 0,
                index: 3
              },
              speakerIndex: 5,
              speaker: {
                guid: '1701-ac16-88f1',
                startTimeMs: 49190,
                stopTimeMs: 50690,
                speakerId: 'H'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'G',
          startTimeMs: 50690,
          stopTimeMs: 52060,
          guid: '2b74-dfa0-ef34',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: '?',
          startTimeMs: 70240,
          stopTimeMs: 84560,
          guid: 'a3fd-b2aa-b40f',
          fragments: [
            {
              startTimeMs: 68760,
              stopTimeMs: 68940,
              words: [
                {
                  word: 'no',
                  confidence: 0.776,
                  bestPath: true
                },
                {
                  word: 'know',
                  confidence: 0.223
                }
              ],
              guid: '6815-6a44-49f0',
              chunkIndex: 0,
              index: 4
            },
            {
              startTimeMs: 68940,
              stopTimeMs: 69298,
              words: [
                {
                  word: 'needles',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '7499-3d13-d2e1',
              chunkIndex: 0,
              index: 5
            },
            {
              startTimeMs: 69304,
              stopTimeMs: 69555,
              words: [
                {
                  word: 'alright',
                  confidence: 0.895,
                  bestPath: true
                },
                {
                  word: 'right',
                  confidence: 0.049
                },
                {
                  word: '!silence',
                  confidence: 0.046
                },
                {
                  word: 'or',
                  confidence: 0.008
                }
              ],
              guid: '8c53-43ea-d26f',
              chunkIndex: 0,
              index: 6
            }
          ],
          wordGuidMap: {
            '6815-6a44-49f0': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 4,
              serie: {
                startTimeMs: 68760,
                stopTimeMs: 68940,
                words: [
                  {
                    word: 'no',
                    confidence: 0.776,
                    bestPath: true
                  },
                  {
                    word: 'know',
                    confidence: 0.223
                  }
                ],
                guid: '6815-6a44-49f0',
                chunkIndex: 0,
                index: 4
              },
              speakerIndex: 7,
              speaker: {
                guid: 'a3fd-b2aa-b40f',
                startTimeMs: 70240,
                stopTimeMs: 84560,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            },
            '7499-3d13-d2e1': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 5,
              serie: {
                startTimeMs: 68940,
                stopTimeMs: 69298,
                words: [
                  {
                    word: 'needles',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '7499-3d13-d2e1',
                chunkIndex: 0,
                index: 5
              },
              speakerIndex: 7,
              speaker: {
                guid: 'a3fd-b2aa-b40f',
                startTimeMs: 70240,
                stopTimeMs: 84560,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            },
            '8c53-43ea-d26f': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 6,
              serie: {
                startTimeMs: 69304,
                stopTimeMs: 69555,
                words: [
                  {
                    word: 'alright',
                    confidence: 0.895,
                    bestPath: true
                  },
                  {
                    word: 'right',
                    confidence: 0.049
                  },
                  {
                    word: '!silence',
                    confidence: 0.046
                  },
                  {
                    word: 'or',
                    confidence: 0.008
                  }
                ],
                guid: '8c53-43ea-d26f',
                chunkIndex: 0,
                index: 6
              },
              speakerIndex: 7,
              speaker: {
                guid: 'a3fd-b2aa-b40f',
                startTimeMs: 70240,
                stopTimeMs: 84560,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: '?',
          startTimeMs: 85840,
          stopTimeMs: 91200,
          guid: 'f120-06d3-b279',
          fragments: [
            {
              startTimeMs: 84860,
              stopTimeMs: 84980,
              words: [
                {
                  word: 'how',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '3a5e-b64d-7f7f',
              chunkIndex: 0,
              index: 7
            },
            {
              startTimeMs: 84980,
              stopTimeMs: 85160,
              words: [
                {
                  word: 'much',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: 'b7e3-c8ba-0f79',
              chunkIndex: 0,
              index: 8
            },
            {
              startTimeMs: 85160,
              stopTimeMs: 85249,
              words: [
                {
                  word: 'you',
                  confidence: 0.969,
                  bestPath: true
                },
                {
                  word: 'is',
                  confidence: 0.016
                },
                {
                  word: '!silence',
                  confidence: 0.009
                },
                {
                  word: "you've",
                  confidence: 0.004
                }
              ],
              guid: '6e0e-516f-a836',
              chunkIndex: 0,
              index: 9
            },
            {
              startTimeMs: 85274,
              stopTimeMs: 85406,
              words: [
                {
                  word: 'got',
                  confidence: 0.835,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.134
                },
                {
                  word: 'that',
                  confidence: 0.016
                },
                {
                  word: 'said',
                  confidence: 0.007
                },
                {
                  word: 'is',
                  confidence: 0.004
                }
              ],
              guid: 'a535-870d-c344',
              chunkIndex: 0,
              index: 10
            },
            {
              startTimeMs: 90858,
              stopTimeMs: 91247,
              words: [
                {
                  word: 'programs',
                  confidence: 0.649,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.35
                }
              ],
              guid: '5615-256b-2c57',
              chunkIndex: 0,
              index: 11
            }
          ],
          wordGuidMap: {
            '3a5e-b64d-7f7f': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 7,
              serie: {
                startTimeMs: 84860,
                stopTimeMs: 84980,
                words: [
                  {
                    word: 'how',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '3a5e-b64d-7f7f',
                chunkIndex: 0,
                index: 7
              },
              speakerIndex: 8,
              speaker: {
                guid: 'f120-06d3-b279',
                startTimeMs: 85840,
                stopTimeMs: 91200,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            },
            'b7e3-c8ba-0f79': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 8,
              serie: {
                startTimeMs: 84980,
                stopTimeMs: 85160,
                words: [
                  {
                    word: 'much',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: 'b7e3-c8ba-0f79',
                chunkIndex: 0,
                index: 8
              },
              speakerIndex: 8,
              speaker: {
                guid: 'f120-06d3-b279',
                startTimeMs: 85840,
                stopTimeMs: 91200,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            },
            '6e0e-516f-a836': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 9,
              serie: {
                startTimeMs: 85160,
                stopTimeMs: 85249,
                words: [
                  {
                    word: 'you',
                    confidence: 0.969,
                    bestPath: true
                  },
                  {
                    word: 'is',
                    confidence: 0.016
                  },
                  {
                    word: '!silence',
                    confidence: 0.009
                  },
                  {
                    word: "you've",
                    confidence: 0.004
                  }
                ],
                guid: '6e0e-516f-a836',
                chunkIndex: 0,
                index: 9
              },
              speakerIndex: 8,
              speaker: {
                guid: 'f120-06d3-b279',
                startTimeMs: 85840,
                stopTimeMs: 91200,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            },
            'a535-870d-c344': {
              chunkIndex: 0,
              dialogueIndex: 3,
              index: 10,
              serie: {
                startTimeMs: 85274,
                stopTimeMs: 85406,
                words: [
                  {
                    word: 'got',
                    confidence: 0.835,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.134
                  },
                  {
                    word: 'that',
                    confidence: 0.016
                  },
                  {
                    word: 'said',
                    confidence: 0.007
                  },
                  {
                    word: 'is',
                    confidence: 0.004
                  }
                ],
                guid: 'a535-870d-c344',
                chunkIndex: 0,
                index: 10
              },
              speakerIndex: 8,
              speaker: {
                guid: 'f120-06d3-b279',
                startTimeMs: 85840,
                stopTimeMs: 91200,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            },
            '5615-256b-2c57': {
              chunkIndex: 0,
              dialogueIndex: 4,
              index: 11,
              serie: {
                startTimeMs: 90858,
                stopTimeMs: 91247,
                words: [
                  {
                    word: 'programs',
                    confidence: 0.649,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.35
                  }
                ],
                guid: '5615-256b-2c57',
                chunkIndex: 0,
                index: 11
              },
              speakerIndex: 8,
              speaker: {
                guid: 'f120-06d3-b279',
                startTimeMs: 85840,
                stopTimeMs: 91200,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'A',
          startTimeMs: 91200,
          stopTimeMs: 93400,
          guid: 'efb1-f0cc-16ba',
          fragments: [
            {
              startTimeMs: 92448,
              stopTimeMs: 92687,
              words: [
                {
                  word: 'six',
                  confidence: 0.704,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.281
                },
                {
                  word: 'program',
                  confidence: 0.011
                },
                {
                  word: 'bye',
                  confidence: 0.002
                }
              ],
              guid: 'bdd6-a206-82d8',
              chunkIndex: 0,
              index: 12
            }
          ],
          wordGuidMap: {
            'bdd6-a206-82d8': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 12,
              serie: {
                startTimeMs: 92448,
                stopTimeMs: 92687,
                words: [
                  {
                    word: 'six',
                    confidence: 0.704,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.281
                  },
                  {
                    word: 'program',
                    confidence: 0.011
                  },
                  {
                    word: 'bye',
                    confidence: 0.002
                  }
                ],
                guid: 'bdd6-a206-82d8',
                chunkIndex: 0,
                index: 12
              },
              speakerIndex: 9,
              speaker: {
                guid: 'efb1-f0cc-16ba',
                startTimeMs: 91200,
                stopTimeMs: 93400,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: '?',
          startTimeMs: 93400,
          stopTimeMs: 101420,
          guid: '3ab5-f445-72b7',
          fragments: [
            {
              startTimeMs: 100759,
              stopTimeMs: 100933,
              words: [
                {
                  word: 'oh',
                  confidence: 0.832,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.101
                },
                {
                  word: 'ooh',
                  confidence: 0.041
                },
                {
                  word: 'sure',
                  confidence: 0.014
                },
                {
                  word: 'should',
                  confidence: 0.006
                },
                {
                  word: 'okay',
                  confidence: 0.002
                }
              ],
              guid: 'd943-4e9d-ebfb',
              chunkIndex: 0,
              index: 13
            }
          ],
          wordGuidMap: {
            'd943-4e9d-ebfb': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 13,
              serie: {
                startTimeMs: 100759,
                stopTimeMs: 100933,
                words: [
                  {
                    word: 'oh',
                    confidence: 0.832,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.101
                  },
                  {
                    word: 'ooh',
                    confidence: 0.041
                  },
                  {
                    word: 'sure',
                    confidence: 0.014
                  },
                  {
                    word: 'should',
                    confidence: 0.006
                  },
                  {
                    word: 'okay',
                    confidence: 0.002
                  }
                ],
                guid: 'd943-4e9d-ebfb',
                chunkIndex: 0,
                index: 13
              },
              speakerIndex: 10,
              speaker: {
                guid: '3ab5-f445-72b7',
                startTimeMs: 93400,
                stopTimeMs: 101420,
                speakerId: '?'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'C',
          startTimeMs: 101420,
          stopTimeMs: 103050,
          guid: '630a-7ea8-f269',
          fragments: [
            {
              startTimeMs: 101557,
              stopTimeMs: 101702,
              words: [
                {
                  word: 'go',
                  confidence: 0.782,
                  bestPath: true
                },
                {
                  word: 'the',
                  confidence: 0.12
                },
                {
                  word: '!silence',
                  confidence: 0.047
                },
                {
                  word: 'sure',
                  confidence: 0.035
                },
                {
                  word: 'ooh',
                  confidence: 0.014
                }
              ],
              guid: 'de62-72fb-6236',
              chunkIndex: 0,
              index: 14
            },
            {
              startTimeMs: 101802,
              stopTimeMs: 102015,
              words: [
                {
                  word: 'check',
                  confidence: 0.964,
                  bestPath: true
                },
                {
                  word: 'gotcha',
                  confidence: 0.025
                },
                {
                  word: 'the',
                  confidence: 0.008
                },
                {
                  word: '!silence',
                  confidence: 0
                }
              ],
              guid: 'ac4f-4649-8ce5',
              chunkIndex: 0,
              index: 15
            },
            {
              startTimeMs: 102016,
              stopTimeMs: 102169,
              words: [
                {
                  word: 'out',
                  confidence: 0.96,
                  bestPath: true
                },
                {
                  word: 'got',
                  confidence: 0.023
                },
                {
                  word: 'checkout',
                  confidence: 0.008
                },
                {
                  word: 'on',
                  confidence: 0.004
                },
                {
                  word: 'gotcha',
                  confidence: 0.003
                },
                {
                  word: 'sure',
                  confidence: 0
                },
                {
                  word: '!silence',
                  confidence: 0
                }
              ],
              guid: '6bca-7f85-5e17',
              chunkIndex: 0,
              index: 16
            },
            {
              startTimeMs: 102170,
              stopTimeMs: 102260,
              words: [
                {
                  word: 'how',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: 'e8f3-fdb2-3286',
              chunkIndex: 0,
              index: 17
            },
            {
              startTimeMs: 102260,
              stopTimeMs: 102440,
              words: [
                {
                  word: 'much',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '7186-63b5-017a',
              chunkIndex: 0,
              index: 18
            },
            {
              startTimeMs: 102440,
              stopTimeMs: 102590,
              words: [
                {
                  word: 'is',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '5372-0edb-ae76',
              chunkIndex: 0,
              index: 19
            },
            {
              startTimeMs: 102590,
              stopTimeMs: 102710,
              words: [
                {
                  word: 'on',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '2be4-5ce6-acb4',
              chunkIndex: 0,
              index: 20
            },
            {
              startTimeMs: 102710,
              stopTimeMs: 102950,
              words: [
                {
                  word: 'them',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: 'f661-c2a5-5bdb',
              chunkIndex: 0,
              index: 21
            }
          ],
          wordGuidMap: {
            'de62-72fb-6236': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 14,
              serie: {
                startTimeMs: 101557,
                stopTimeMs: 101702,
                words: [
                  {
                    word: 'go',
                    confidence: 0.782,
                    bestPath: true
                  },
                  {
                    word: 'the',
                    confidence: 0.12
                  },
                  {
                    word: '!silence',
                    confidence: 0.047
                  },
                  {
                    word: 'sure',
                    confidence: 0.035
                  },
                  {
                    word: 'ooh',
                    confidence: 0.014
                  }
                ],
                guid: 'de62-72fb-6236',
                chunkIndex: 0,
                index: 14
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            'ac4f-4649-8ce5': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 15,
              serie: {
                startTimeMs: 101802,
                stopTimeMs: 102015,
                words: [
                  {
                    word: 'check',
                    confidence: 0.964,
                    bestPath: true
                  },
                  {
                    word: 'gotcha',
                    confidence: 0.025
                  },
                  {
                    word: 'the',
                    confidence: 0.008
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  }
                ],
                guid: 'ac4f-4649-8ce5',
                chunkIndex: 0,
                index: 15
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            '6bca-7f85-5e17': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 16,
              serie: {
                startTimeMs: 102016,
                stopTimeMs: 102169,
                words: [
                  {
                    word: 'out',
                    confidence: 0.96,
                    bestPath: true
                  },
                  {
                    word: 'got',
                    confidence: 0.023
                  },
                  {
                    word: 'checkout',
                    confidence: 0.008
                  },
                  {
                    word: 'on',
                    confidence: 0.004
                  },
                  {
                    word: 'gotcha',
                    confidence: 0.003
                  },
                  {
                    word: 'sure',
                    confidence: 0
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  }
                ],
                guid: '6bca-7f85-5e17',
                chunkIndex: 0,
                index: 16
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            'e8f3-fdb2-3286': {
              chunkIndex: 0,
              dialogueIndex: 3,
              index: 17,
              serie: {
                startTimeMs: 102170,
                stopTimeMs: 102260,
                words: [
                  {
                    word: 'how',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: 'e8f3-fdb2-3286',
                chunkIndex: 0,
                index: 17
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            '7186-63b5-017a': {
              chunkIndex: 0,
              dialogueIndex: 4,
              index: 18,
              serie: {
                startTimeMs: 102260,
                stopTimeMs: 102440,
                words: [
                  {
                    word: 'much',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '7186-63b5-017a',
                chunkIndex: 0,
                index: 18
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            '5372-0edb-ae76': {
              chunkIndex: 0,
              dialogueIndex: 5,
              index: 19,
              serie: {
                startTimeMs: 102440,
                stopTimeMs: 102590,
                words: [
                  {
                    word: 'is',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '5372-0edb-ae76',
                chunkIndex: 0,
                index: 19
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            '2be4-5ce6-acb4': {
              chunkIndex: 0,
              dialogueIndex: 6,
              index: 20,
              serie: {
                startTimeMs: 102590,
                stopTimeMs: 102710,
                words: [
                  {
                    word: 'on',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '2be4-5ce6-acb4',
                chunkIndex: 0,
                index: 20
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            'f661-c2a5-5bdb': {
              chunkIndex: 0,
              dialogueIndex: 7,
              index: 21,
              serie: {
                startTimeMs: 102710,
                stopTimeMs: 102950,
                words: [
                  {
                    word: 'them',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: 'f661-c2a5-5bdb',
                chunkIndex: 0,
                index: 21
              },
              speakerIndex: 11,
              speaker: {
                guid: '630a-7ea8-f269',
                startTimeMs: 101420,
                stopTimeMs: 103050,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: '?',
          startTimeMs: 103050,
          stopTimeMs: 107280,
          guid: '9efb-54aa-e164',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'A',
          startTimeMs: 107280,
          stopTimeMs: 108790,
          guid: 'e226-6e6b-ad34',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'C',
          startTimeMs: 108790,
          stopTimeMs: 111070,
          guid: '5748-ff33-da5c',
          fragments: [
            {
              startTimeMs: 109603,
              stopTimeMs: 109887,
              words: [
                {
                  word: 'thing',
                  confidence: 0.414,
                  bestPath: true
                },
                {
                  word: 'for',
                  confidence: 0.187
                },
                {
                  word: 'to',
                  confidence: 0.144
                },
                {
                  word: 'team',
                  confidence: 0.106
                },
                {
                  word: '!silence',
                  confidence: 0.093
                },
                {
                  word: 'bird',
                  confidence: 0.053
                }
              ],
              guid: '65c5-31d8-2741',
              chunkIndex: 0,
              index: 22
            },
            {
              startTimeMs: 110340,
              stopTimeMs: 110520,
              words: [
                {
                  word: 'for',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '5a31-edbb-1d68',
              chunkIndex: 0,
              index: 23
            },
            {
              startTimeMs: 110520,
              stopTimeMs: 110880,
              words: [
                {
                  word: 'the',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '285e-97ab-fe88',
              chunkIndex: 0,
              index: 24
            }
          ],
          wordGuidMap: {
            '65c5-31d8-2741': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 22,
              serie: {
                startTimeMs: 109603,
                stopTimeMs: 109887,
                words: [
                  {
                    word: 'thing',
                    confidence: 0.414,
                    bestPath: true
                  },
                  {
                    word: 'for',
                    confidence: 0.187
                  },
                  {
                    word: 'to',
                    confidence: 0.144
                  },
                  {
                    word: 'team',
                    confidence: 0.106
                  },
                  {
                    word: '!silence',
                    confidence: 0.093
                  },
                  {
                    word: 'bird',
                    confidence: 0.053
                  }
                ],
                guid: '65c5-31d8-2741',
                chunkIndex: 0,
                index: 22
              },
              speakerIndex: 14,
              speaker: {
                guid: '5748-ff33-da5c',
                startTimeMs: 108790,
                stopTimeMs: 111070,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            '5a31-edbb-1d68': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 23,
              serie: {
                startTimeMs: 110340,
                stopTimeMs: 110520,
                words: [
                  {
                    word: 'for',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '5a31-edbb-1d68',
                chunkIndex: 0,
                index: 23
              },
              speakerIndex: 14,
              speaker: {
                guid: '5748-ff33-da5c',
                startTimeMs: 108790,
                stopTimeMs: 111070,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            },
            '285e-97ab-fe88': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 24,
              serie: {
                startTimeMs: 110520,
                stopTimeMs: 110880,
                words: [
                  {
                    word: 'the',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '285e-97ab-fe88',
                chunkIndex: 0,
                index: 24
              },
              speakerIndex: 14,
              speaker: {
                guid: '5748-ff33-da5c',
                startTimeMs: 108790,
                stopTimeMs: 111070,
                speakerId: 'C'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'B',
          startTimeMs: 111070,
          stopTimeMs: 115960,
          guid: '6f1b-d9d6-ab26',
          fragments: [
            {
              startTimeMs: 111240,
              stopTimeMs: 111406,
              words: [
                {
                  word: 'run',
                  confidence: 0.593,
                  bestPath: true
                },
                {
                  word: 'what',
                  confidence: 0.361
                },
                {
                  word: "we're",
                  confidence: 0.027
                },
                {
                  word: 'one',
                  confidence: 0.011
                },
                {
                  word: 'around',
                  confidence: 0.006
                }
              ],
              guid: '2b27-47f2-e90a',
              chunkIndex: 0,
              index: 25
            },
            {
              startTimeMs: 111431,
              stopTimeMs: 111600,
              words: [
                {
                  word: 'talking',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: 'f0a7-20b7-387e',
              chunkIndex: 0,
              index: 26
            },
            {
              startTimeMs: 111600,
              stopTimeMs: 111780,
              words: [
                {
                  word: 'about',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '4bd8-3e0b-db7b',
              chunkIndex: 0,
              index: 27
            },
            {
              startTimeMs: 112175,
              stopTimeMs: 112634,
              words: [
                {
                  word: 'magnetic',
                  confidence: 0.906,
                  bestPath: true
                },
                {
                  word: 'to',
                  confidence: 0.054
                },
                {
                  word: 'two',
                  confidence: 0.039
                }
              ],
              guid: '739d-1f64-5461',
              chunkIndex: 0,
              index: 28
            },
            {
              startTimeMs: 112634,
              stopTimeMs: 112734,
              words: [
                {
                  word: 'or',
                  confidence: 0.733,
                  bestPath: true
                },
                {
                  word: 'magnetic',
                  confidence: 0.093
                },
                {
                  word: 'of',
                  confidence: 0.092
                },
                {
                  word: '!silence',
                  confidence: 0.05
                },
                {
                  word: 'with',
                  confidence: 0.017
                },
                {
                  word: 'for',
                  confidence: 0.012
                }
              ],
              guid: '56a4-a9ba-77ef',
              chunkIndex: 0,
              index: 29
            },
            {
              startTimeMs: 112734,
              stopTimeMs: 112830,
              words: [
                {
                  word: 'the',
                  confidence: 0.856,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.143
                },
                {
                  word: 'censors',
                  confidence: 0
                }
              ],
              guid: 'b4cd-1561-068d',
              chunkIndex: 0,
              index: 30
            },
            {
              startTimeMs: 112830,
              stopTimeMs: 113430,
              words: [
                {
                  word: 'sensors',
                  confidence: 0.847,
                  bestPath: true
                },
                {
                  word: 'censors',
                  confidence: 0.151
                },
                {
                  word: '!silence',
                  confidence: 0
                }
              ],
              guid: '9e86-94f5-6791',
              chunkIndex: 0,
              index: 31
            },
            {
              startTimeMs: 114223,
              stopTimeMs: 114498,
              words: [
                {
                  word: "wasn't",
                  confidence: 0.465,
                  bestPath: true
                },
                {
                  word: "doesn't",
                  confidence: 0.284
                },
                {
                  word: 'yep',
                  confidence: 0.141
                },
                {
                  word: 'present',
                  confidence: 0.108
                }
              ],
              guid: '241b-05fb-fba5',
              chunkIndex: 0,
              index: 32
            },
            {
              startTimeMs: 114570,
              stopTimeMs: 114659,
              words: [
                {
                  word: 'it',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '15c0-f4fe-6383',
              chunkIndex: 0,
              index: 33
            },
            {
              startTimeMs: 115260,
              stopTimeMs: 115470,
              words: [
                {
                  word: "what's",
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: 'f545-ee9f-c198',
              chunkIndex: 0,
              index: 34
            },
            {
              startTimeMs: 115470,
              stopTimeMs: 115770,
              words: [
                {
                  word: 'that',
                  confidence: 1,
                  bestPath: true
                }
              ],
              guid: '628e-2583-426b',
              chunkIndex: 0,
              index: 35
            }
          ],
          wordGuidMap: {
            '2b27-47f2-e90a': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 25,
              serie: {
                startTimeMs: 111240,
                stopTimeMs: 111406,
                words: [
                  {
                    word: 'run',
                    confidence: 0.593,
                    bestPath: true
                  },
                  {
                    word: 'what',
                    confidence: 0.361
                  },
                  {
                    word: "we're",
                    confidence: 0.027
                  },
                  {
                    word: 'one',
                    confidence: 0.011
                  },
                  {
                    word: 'around',
                    confidence: 0.006
                  }
                ],
                guid: '2b27-47f2-e90a',
                chunkIndex: 0,
                index: 25
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            'f0a7-20b7-387e': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 26,
              serie: {
                startTimeMs: 111431,
                stopTimeMs: 111600,
                words: [
                  {
                    word: 'talking',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: 'f0a7-20b7-387e',
                chunkIndex: 0,
                index: 26
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '4bd8-3e0b-db7b': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 27,
              serie: {
                startTimeMs: 111600,
                stopTimeMs: 111780,
                words: [
                  {
                    word: 'about',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '4bd8-3e0b-db7b',
                chunkIndex: 0,
                index: 27
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '739d-1f64-5461': {
              chunkIndex: 0,
              dialogueIndex: 3,
              index: 28,
              serie: {
                startTimeMs: 112175,
                stopTimeMs: 112634,
                words: [
                  {
                    word: 'magnetic',
                    confidence: 0.906,
                    bestPath: true
                  },
                  {
                    word: 'to',
                    confidence: 0.054
                  },
                  {
                    word: 'two',
                    confidence: 0.039
                  }
                ],
                guid: '739d-1f64-5461',
                chunkIndex: 0,
                index: 28
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '56a4-a9ba-77ef': {
              chunkIndex: 0,
              dialogueIndex: 4,
              index: 29,
              serie: {
                startTimeMs: 112634,
                stopTimeMs: 112734,
                words: [
                  {
                    word: 'or',
                    confidence: 0.733,
                    bestPath: true
                  },
                  {
                    word: 'magnetic',
                    confidence: 0.093
                  },
                  {
                    word: 'of',
                    confidence: 0.092
                  },
                  {
                    word: '!silence',
                    confidence: 0.05
                  },
                  {
                    word: 'with',
                    confidence: 0.017
                  },
                  {
                    word: 'for',
                    confidence: 0.012
                  }
                ],
                guid: '56a4-a9ba-77ef',
                chunkIndex: 0,
                index: 29
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            'b4cd-1561-068d': {
              chunkIndex: 0,
              dialogueIndex: 5,
              index: 30,
              serie: {
                startTimeMs: 112734,
                stopTimeMs: 112830,
                words: [
                  {
                    word: 'the',
                    confidence: 0.856,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.143
                  },
                  {
                    word: 'censors',
                    confidence: 0
                  }
                ],
                guid: 'b4cd-1561-068d',
                chunkIndex: 0,
                index: 30
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '9e86-94f5-6791': {
              chunkIndex: 0,
              dialogueIndex: 6,
              index: 31,
              serie: {
                startTimeMs: 112830,
                stopTimeMs: 113430,
                words: [
                  {
                    word: 'sensors',
                    confidence: 0.847,
                    bestPath: true
                  },
                  {
                    word: 'censors',
                    confidence: 0.151
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  }
                ],
                guid: '9e86-94f5-6791',
                chunkIndex: 0,
                index: 31
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '241b-05fb-fba5': {
              chunkIndex: 0,
              dialogueIndex: 7,
              index: 32,
              serie: {
                startTimeMs: 114223,
                stopTimeMs: 114498,
                words: [
                  {
                    word: "wasn't",
                    confidence: 0.465,
                    bestPath: true
                  },
                  {
                    word: "doesn't",
                    confidence: 0.284
                  },
                  {
                    word: 'yep',
                    confidence: 0.141
                  },
                  {
                    word: 'present',
                    confidence: 0.108
                  }
                ],
                guid: '241b-05fb-fba5',
                chunkIndex: 0,
                index: 32
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '15c0-f4fe-6383': {
              chunkIndex: 0,
              dialogueIndex: 8,
              index: 33,
              serie: {
                startTimeMs: 114570,
                stopTimeMs: 114659,
                words: [
                  {
                    word: 'it',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '15c0-f4fe-6383',
                chunkIndex: 0,
                index: 33
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            'f545-ee9f-c198': {
              chunkIndex: 0,
              dialogueIndex: 9,
              index: 34,
              serie: {
                startTimeMs: 115260,
                stopTimeMs: 115470,
                words: [
                  {
                    word: "what's",
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: 'f545-ee9f-c198',
                chunkIndex: 0,
                index: 34
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            },
            '628e-2583-426b': {
              chunkIndex: 0,
              dialogueIndex: 10,
              index: 35,
              serie: {
                startTimeMs: 115470,
                stopTimeMs: 115770,
                words: [
                  {
                    word: 'that',
                    confidence: 1,
                    bestPath: true
                  }
                ],
                guid: '628e-2583-426b',
                chunkIndex: 0,
                index: 35
              },
              speakerIndex: 15,
              speaker: {
                guid: '6f1b-d9d6-ab26',
                startTimeMs: 111070,
                stopTimeMs: 115960,
                speakerId: 'B'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: '?',
          startTimeMs: 115960,
          stopTimeMs: 136070,
          guid: 'fa62-969b-e706',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'A',
          startTimeMs: 136070,
          stopTimeMs: 138210,
          guid: '0416-6f35-1eb0',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: '?',
          startTimeMs: 138210,
          stopTimeMs: 143590,
          guid: '5744-d366-fed3',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'A',
          startTimeMs: 143590,
          stopTimeMs: 149320,
          guid: '045b-4683-c673',
          fragments: [
            {
              startTimeMs: 144048,
              stopTimeMs: 144197,
              words: [
                {
                  word: 'go',
                  confidence: 0.883,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.116
                }
              ],
              guid: '2405-659a-7499',
              chunkIndex: 0,
              index: 36
            },
            {
              startTimeMs: 144235,
              stopTimeMs: 144300,
              words: [
                {
                  word: 'to',
                  confidence: 0.413,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.319
                },
                {
                  word: 'over',
                  confidence: 0.165
                },
                {
                  word: 'your',
                  confidence: 0.042
                },
                {
                  word: 'no',
                  confidence: 0.024
                },
                {
                  word: "you're",
                  confidence: 0.023
                },
                {
                  word: 'or',
                  confidence: 0.01
                }
              ],
              guid: '4d30-7401-f6d6',
              chunkIndex: 0,
              index: 37
            },
            {
              startTimeMs: 144303,
              stopTimeMs: 144369,
              words: [
                {
                  word: 'the',
                  confidence: 0.88,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.104
                },
                {
                  word: 'web',
                  confidence: 0.014
                },
                {
                  word: 'goto',
                  confidence: 0.001
                }
              ],
              guid: '9e5a-e85e-0778',
              chunkIndex: 0,
              index: 38
            },
            {
              startTimeMs: 144400,
              stopTimeMs: 144571,
              words: [
                {
                  word: 'web',
                  confidence: 0.975,
                  bestPath: true
                },
                {
                  word: 'presence',
                  confidence: 0.014
                },
                {
                  word: 'yeah',
                  confidence: 0.004
                },
                {
                  word: 'gotowebinar',
                  confidence: 0.002
                },
                {
                  word: 'webinar',
                  confidence: 0.001
                },
                {
                  word: 'yes',
                  confidence: 0
                },
                {
                  word: 'yep',
                  confidence: 0
                },
                {
                  word: 'yup',
                  confidence: 0
                }
              ],
              guid: 'f289-f711-2226',
              chunkIndex: 0,
              index: 39
            }
          ],
          wordGuidMap: {
            '2405-659a-7499': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 36,
              serie: {
                startTimeMs: 144048,
                stopTimeMs: 144197,
                words: [
                  {
                    word: 'go',
                    confidence: 0.883,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.116
                  }
                ],
                guid: '2405-659a-7499',
                chunkIndex: 0,
                index: 36
              },
              speakerIndex: 19,
              speaker: {
                guid: '045b-4683-c673',
                startTimeMs: 143590,
                stopTimeMs: 149320,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            },
            '4d30-7401-f6d6': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 37,
              serie: {
                startTimeMs: 144235,
                stopTimeMs: 144300,
                words: [
                  {
                    word: 'to',
                    confidence: 0.413,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.319
                  },
                  {
                    word: 'over',
                    confidence: 0.165
                  },
                  {
                    word: 'your',
                    confidence: 0.042
                  },
                  {
                    word: 'no',
                    confidence: 0.024
                  },
                  {
                    word: "you're",
                    confidence: 0.023
                  },
                  {
                    word: 'or',
                    confidence: 0.01
                  }
                ],
                guid: '4d30-7401-f6d6',
                chunkIndex: 0,
                index: 37
              },
              speakerIndex: 19,
              speaker: {
                guid: '045b-4683-c673',
                startTimeMs: 143590,
                stopTimeMs: 149320,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            },
            '9e5a-e85e-0778': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 38,
              serie: {
                startTimeMs: 144303,
                stopTimeMs: 144369,
                words: [
                  {
                    word: 'the',
                    confidence: 0.88,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.104
                  },
                  {
                    word: 'web',
                    confidence: 0.014
                  },
                  {
                    word: 'goto',
                    confidence: 0.001
                  }
                ],
                guid: '9e5a-e85e-0778',
                chunkIndex: 0,
                index: 38
              },
              speakerIndex: 19,
              speaker: {
                guid: '045b-4683-c673',
                startTimeMs: 143590,
                stopTimeMs: 149320,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            },
            'f289-f711-2226': {
              chunkIndex: 0,
              dialogueIndex: 3,
              index: 39,
              serie: {
                startTimeMs: 144400,
                stopTimeMs: 144571,
                words: [
                  {
                    word: 'web',
                    confidence: 0.975,
                    bestPath: true
                  },
                  {
                    word: 'presence',
                    confidence: 0.014
                  },
                  {
                    word: 'yeah',
                    confidence: 0.004
                  },
                  {
                    word: 'gotowebinar',
                    confidence: 0.002
                  },
                  {
                    word: 'webinar',
                    confidence: 0.001
                  },
                  {
                    word: 'yes',
                    confidence: 0
                  },
                  {
                    word: 'yep',
                    confidence: 0
                  },
                  {
                    word: 'yup',
                    confidence: 0
                  }
                ],
                guid: 'f289-f711-2226',
                chunkIndex: 0,
                index: 39
              },
              speakerIndex: 19,
              speaker: {
                guid: '045b-4683-c673',
                startTimeMs: 143590,
                stopTimeMs: 149320,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'F',
          startTimeMs: 149320,
          stopTimeMs: 151420,
          guid: 'c2e9-77b2-d16d',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: '?',
          startTimeMs: 151420,
          stopTimeMs: 170870,
          guid: '9def-9147-f5a1',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'E',
          startTimeMs: 170870,
          stopTimeMs: 173140,
          guid: 'bab3-3620-4760',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: '?',
          startTimeMs: 173140,
          stopTimeMs: 184000,
          guid: '214e-3095-0765',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: 'A',
          startTimeMs: 184000,
          stopTimeMs: 186450,
          guid: '57e4-f412-d419',
          fragments: [
            {
              startTimeMs: 184359,
              stopTimeMs: 184579,
              words: [
                {
                  word: 'roller',
                  confidence: 0.245,
                  bestPath: true
                },
                {
                  word: 'role',
                  confidence: 0.222
                },
                {
                  word: 'road',
                  confidence: 0.138
                },
                {
                  word: 'roll',
                  confidence: 0.135
                },
                {
                  word: 'rolling',
                  confidence: 0.079
                },
                {
                  word: 'row',
                  confidence: 0.041
                },
                {
                  word: 'rhode',
                  confidence: 0.033
                },
                {
                  word: 'roles',
                  confidence: 0.02
                },
                {
                  word: 'rather',
                  confidence: 0.016
                },
                {
                  word: 'rose',
                  confidence: 0.015
                },
                {
                  word: 'wrote',
                  confidence: 0.014
                },
                {
                  word: 'throw',
                  confidence: 0.009
                },
                {
                  word: 'really',
                  confidence: 0.006
                },
                {
                  word: 'royal',
                  confidence: 0.004
                },
                {
                  word: 'well',
                  confidence: 0.003
                },
                {
                  word: 'go',
                  confidence: 0.003
                },
                {
                  word: "you're",
                  confidence: 0.003
                },
                {
                  word: 'no',
                  confidence: 0.002
                },
                {
                  word: 'the',
                  confidence: 0.001
                },
                {
                  word: '!silence',
                  confidence: 0
                }
              ],
              guid: '7b5e-b51f-0002',
              chunkIndex: 0,
              index: 40
            },
            {
              startTimeMs: 184599,
              stopTimeMs: 184903,
              words: [
                {
                  word: 'dopey',
                  confidence: 0.386,
                  bestPath: true
                },
                {
                  word: 'adobe',
                  confidence: 0.241
                },
                {
                  word: 'doping',
                  confidence: 0.198
                },
                {
                  word: 'docusign',
                  confidence: 0.136
                },
                {
                  word: 'dokey',
                  confidence: 0.033
                },
                {
                  word: 'the',
                  confidence: 0.003
                },
                {
                  word: '!silence',
                  confidence: 0
                },
                {
                  word: 'royal',
                  confidence: 0
                }
              ],
              guid: 'bdd2-b5d6-f22e',
              chunkIndex: 0,
              index: 41
            },
            {
              startTimeMs: 184904,
              stopTimeMs: 185384,
              words: [
                {
                  word: 'receivers',
                  confidence: 0.737,
                  bestPath: true
                },
                {
                  word: 'receiver',
                  confidence: 0.262
                },
                {
                  word: '!silence',
                  confidence: 0
                },
                {
                  word: 'road',
                  confidence: 0
                },
                {
                  word: 'rolling',
                  confidence: 0
                },
                {
                  word: 'adobe',
                  confidence: 0
                },
                {
                  word: 'right',
                  confidence: 0
                }
              ],
              guid: 'ab8e-51c9-42b7',
              chunkIndex: 0,
              index: 42
            }
          ],
          wordGuidMap: {
            '7b5e-b51f-0002': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 40,
              serie: {
                startTimeMs: 184359,
                stopTimeMs: 184579,
                words: [
                  {
                    word: 'roller',
                    confidence: 0.245,
                    bestPath: true
                  },
                  {
                    word: 'role',
                    confidence: 0.222
                  },
                  {
                    word: 'road',
                    confidence: 0.138
                  },
                  {
                    word: 'roll',
                    confidence: 0.135
                  },
                  {
                    word: 'rolling',
                    confidence: 0.079
                  },
                  {
                    word: 'row',
                    confidence: 0.041
                  },
                  {
                    word: 'rhode',
                    confidence: 0.033
                  },
                  {
                    word: 'roles',
                    confidence: 0.02
                  },
                  {
                    word: 'rather',
                    confidence: 0.016
                  },
                  {
                    word: 'rose',
                    confidence: 0.015
                  },
                  {
                    word: 'wrote',
                    confidence: 0.014
                  },
                  {
                    word: 'throw',
                    confidence: 0.009
                  },
                  {
                    word: 'really',
                    confidence: 0.006
                  },
                  {
                    word: 'royal',
                    confidence: 0.004
                  },
                  {
                    word: 'well',
                    confidence: 0.003
                  },
                  {
                    word: 'go',
                    confidence: 0.003
                  },
                  {
                    word: "you're",
                    confidence: 0.003
                  },
                  {
                    word: 'no',
                    confidence: 0.002
                  },
                  {
                    word: 'the',
                    confidence: 0.001
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  }
                ],
                guid: '7b5e-b51f-0002',
                chunkIndex: 0,
                index: 40
              },
              speakerIndex: 24,
              speaker: {
                guid: '57e4-f412-d419',
                startTimeMs: 184000,
                stopTimeMs: 186450,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            },
            'bdd2-b5d6-f22e': {
              chunkIndex: 0,
              dialogueIndex: 1,
              index: 41,
              serie: {
                startTimeMs: 184599,
                stopTimeMs: 184903,
                words: [
                  {
                    word: 'dopey',
                    confidence: 0.386,
                    bestPath: true
                  },
                  {
                    word: 'adobe',
                    confidence: 0.241
                  },
                  {
                    word: 'doping',
                    confidence: 0.198
                  },
                  {
                    word: 'docusign',
                    confidence: 0.136
                  },
                  {
                    word: 'dokey',
                    confidence: 0.033
                  },
                  {
                    word: 'the',
                    confidence: 0.003
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  },
                  {
                    word: 'royal',
                    confidence: 0
                  }
                ],
                guid: 'bdd2-b5d6-f22e',
                chunkIndex: 0,
                index: 41
              },
              speakerIndex: 24,
              speaker: {
                guid: '57e4-f412-d419',
                startTimeMs: 184000,
                stopTimeMs: 186450,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            },
            'ab8e-51c9-42b7': {
              chunkIndex: 0,
              dialogueIndex: 2,
              index: 42,
              serie: {
                startTimeMs: 184904,
                stopTimeMs: 185384,
                words: [
                  {
                    word: 'receivers',
                    confidence: 0.737,
                    bestPath: true
                  },
                  {
                    word: 'receiver',
                    confidence: 0.262
                  },
                  {
                    word: '!silence',
                    confidence: 0
                  },
                  {
                    word: 'road',
                    confidence: 0
                  },
                  {
                    word: 'rolling',
                    confidence: 0
                  },
                  {
                    word: 'adobe',
                    confidence: 0
                  },
                  {
                    word: 'right',
                    confidence: 0
                  }
                ],
                guid: 'ab8e-51c9-42b7',
                chunkIndex: 0,
                index: 42
              },
              speakerIndex: 24,
              speaker: {
                guid: '57e4-f412-d419',
                startTimeMs: 184000,
                stopTimeMs: 186450,
                speakerId: 'A'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'D',
          startTimeMs: 186450,
          stopTimeMs: 190930,
          guid: 'e112-795b-46d8',
          fragments: [
            {
              startTimeMs: 189232,
              stopTimeMs: 189592,
              words: [
                {
                  word: 'now',
                  confidence: 0.995,
                  bestPath: true
                },
                {
                  word: '!silence',
                  confidence: 0.004
                }
              ],
              guid: 'fb18-b8b6-5a4e',
              chunkIndex: 0,
              index: 43
            }
          ],
          wordGuidMap: {
            'fb18-b8b6-5a4e': {
              chunkIndex: 0,
              dialogueIndex: 0,
              index: 43,
              serie: {
                startTimeMs: 189232,
                stopTimeMs: 189592,
                words: [
                  {
                    word: 'now',
                    confidence: 0.995,
                    bestPath: true
                  },
                  {
                    word: '!silence',
                    confidence: 0.004
                  }
                ],
                guid: 'fb18-b8b6-5a4e',
                chunkIndex: 0,
                index: 43
              },
              speakerIndex: 25,
              speaker: {
                guid: 'e112-795b-46d8',
                startTimeMs: 186450,
                stopTimeMs: 190930,
                speakerId: 'D'
              },
              speakerChunkIndex: 0
            }
          }
        },
        {
          speakerId: 'A',
          startTimeMs: 190930,
          stopTimeMs: 193110,
          guid: '0df1-22e4-9162',
          fragments: [],
          wordGuidMap: {}
        },
        {
          speakerId: '?',
          startTimeMs: 193110,
          stopTimeMs: 203860,
          guid: '665d-da9e-094b',
          fragments: [],
          wordGuidMap: {}
        }
      ],
      modifiedDateTime: 1549481514000,
      sourceEngineId: '40356dac-ace5-46c7-aa02-35ef089ca9a4',
      userEdited: true,
      assetId: '211155739_hS9BtNNsgU',
      startTimeMs: 0,
      stopTimeMs: 203860
    }
  ]
};
