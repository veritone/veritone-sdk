import React, { Component } from 'react';
import { bool, func } from 'prop-types';

import { storiesOf } from '@storybook/react';
import { boolean, number } from '@storybook/addon-knobs/react';
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
    return (
      <TranscriptExample
        lazyLoading
        onEditTypeChange={action('on edit mode change')}
      />
    );
  });

export class TranscriptExample extends Component {
  static propTypes = {
    lazyLoading: bool,
    onEditTypeChange: func
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
      { id: '1', name: 'Engine-X' },
      { id: '2', name: 'Engine-Y' },
      { id: '3', name: 'Engine-Z' }
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
    this.state = {
      data: mockData
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
      this.setState(prevState => {
        const newMockData = { ...prevState }.data.concat(additionalData);
        return {
          data: newMockData
        };
      });
    }
  };

  render() {
    return (
      <TranscriptEngineOutput
        editMode={boolean('Edit Mode', false)}
        onChange={action('on change')}
        onEditTypeChange={this.props.onEditTypeChange}
        data={this.state.data}
        className={styles.outputViewRoot}
        mediaPlayerTimeMs={1000 * number('media player time', 0)}
        mediaPlayerTimeIntervalMs={
          1000 * number('media player time Interval', 1)
        }
        mediaLengthMs={9000000}
        neglectableTimeMs={2000}
        estimatedDisplayTimeMs={1500000}
        onScroll={this.handleDataRequesting}
        onClick={action('on click')}
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

function genMockData(
  startTime,
  stopTime,
  numDataChunks,
  maxSerieSize = 10,
  minSerieSize = 0,
  type = 'TTML',
  badSerieRatio = 0.2,
  enableLazyLoading = true
) {
  const dataChunks = [];

  let chunkStartTime = startTime;
  const timeChunk = (stopTime - startTime) / numDataChunks;
  for (let chunkIndex = 0; chunkIndex < numDataChunks; chunkIndex++) {
    const chunkStoptime = Math.ceil(chunkStartTime + timeChunk);

    const isBadSerie = Math.random() < badSerieRatio;
    const series = genMockSerie(
      chunkStartTime,
      chunkStoptime,
      maxSerieSize,
      minSerieSize,
      type,
      isBadSerie
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
  badSerie = false
) {
  const mockSeries = [];
  if (badSerie === false) {
    const serieSize =
      Math.round(Math.random() * (maxSerieSize - minSerieSize)) + minSerieSize;
    const timeInterval = (stopTimeMs - startTimeMs) / serieSize;

    let lastStopTime = startTimeMs;
    for (let entryIndex = 0; entryIndex < serieSize; entryIndex++) {
      const numWords = Math.round(Math.random() * 10);
      const words = genMockWords(numWords, type);
      const newStopTime = Math.ceil(lastStopTime + timeInterval);
      const entry = {
        startTimeMs: lastStopTime,
        stopTimeMs: newStopTime,
        words: words
      };

      lastStopTime = newStopTime;

      mockSeries.push(entry);
    }
  } else {
    // bad series only has one entry & doesn't contain words
    mockSeries.push({
      startTimeMs: startTimeMs,
      stopTimeMs: stopTimeMs
    });
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

const ttmlSentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'eque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
];

const vlfWords = [
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
