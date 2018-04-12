import React, {Component} from 'react';
import { bool } from 'prop-types';
import { storiesOf } from '@storybook/react';
import { number, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import styles from './story.styles.scss';
import TranslationEngineOutput from './';

storiesOf('TranslationEngineOutput', module)
  .add('Without Lazy Loading', () => {
    return <TranslationExample />;
  })
  .add('With Lazy Loading', () => {
    return <TranslationExample lazyLoading/>;
  });



export class TranslationExample extends Component {
  static propTypes = {
    lazyLoading: bool
  };

  state = {
    selectedEngineId: '1',
    engines: [
      { id: '1', name: 'Engine-X' },
      { id: '2', name: 'Engine-Y' },
      { id: '3', name: 'Engine-Z' }
    ],
    selectedLanguageId: 'en-US',
    languages: [
      { id: 'en-US', name: 'American English' },
      { id: 'en-GB', name: 'British English' },
      { id: 'fr-FR', name: 'French' },
      { id: 'es-ES', name: 'Spanish' },
      { id: 'es-MX', name: 'Mexican Spanish' }
    ],
    contents: renderMockData(0, 50000)
  };

  handleDataRequesting = (scrollStatus) => {
    let newContents = renderMockData(scrollStatus.start, scrollStatus.stop).concat(this.state.contents);
    this.setState({
      contents: newContents
    })
  }


  render () {
    let state = this.state;
    if (!this.props.lazyLoading) {
      return (
        <TranslationEngineOutput
          contents={state.contents}
          onClick={action('entry clicked')}
          onRerunProcess={action('on rerun')}
          className={styles.outputViewRoot}
  
          engines={state.engines} 
          selectedEngineId={state.selectedEngineId}
          onEngineChange={action('engine changed')}
          onExpandClicked={action('expand clicked')}
  
          languages={state.languages}
          selectedLanguageId={state.selectedLanguageId}
          onLanguageChanged={action('language changed')}
  
          mediaPlayerTimeMs={1000 * number('media player time', -1)}
          mediaPlayerTimeIntervalMs={1000}
        />
      );
    } else {
      return (
        <TranslationEngineOutput
          contents={state.contents}
          onClick={action('entry clicked')}
          onRerunProcess={action('on rerun')}
          className={styles.outputViewRoot}
  
          engines={state.engines} 
          selectedEngineId={state.selectedEngineId}
          onEngineChange={action('engine changed')}
          onExpandClicked={action('expand clicked')}
  
          languages={state.languages}
          selectedLanguageId={state.selectedLanguageId}
          onLanguageChanged={action('language changed')}
  
          onScroll={this.handleDataRequesting}
          mediaLengthMs={600000}
          neglectableTimeMs={500}
          estimatedDisplayTimeMs={50000}
  
          mediaPlayerTimeMs={1000 * number('media player time', -1)}
          mediaPlayerTimeIntervalMs={1000}
        />
      );
    }
  }
}


function renderMockData (startTimeMs, stopTimeMs, noDataRatio = 0.1, errorRatio = 0.1) {
  let mockData = (startTimeMs < stopTimeMs) ? {startTimeMs: startTimeMs, stopTimeMs: stopTimeMs} : {};

  let series = [];
  let numSeries = Math.round(Math.random() * 19) + 1;
  let timeInterval = (stopTimeMs - startTimeMs) / numSeries;
  for (let seriesIndex = 0; seriesIndex < numSeries; seriesIndex++) {
    let entryStartTime = startTimeMs + seriesIndex * timeInterval;
    let entry = {
      startTimeMs: entryStartTime,
      stopTimeMs: entryStartTime + timeInterval
    };

    let randomStatus = Math.random();
    if (randomStatus <= errorRatio) {                       //Error
      entry.status = 'error';
    } else if (randomStatus <= noDataRatio + errorRatio) {  //No Data
      // do nothing
    } else {                                                //Normal
      let numOptions = Math.round(Math.random() * 5);
      let wordOptions = [];
      for (let optionIndex = 0; optionIndex < numOptions; optionIndex++) {
        let option = sentences[Math.round(Math.random() * (sentences.length - 1))];
        wordOptions.push({
          word: option,
          confidence: Math.random()
        });
      }
      entry.words = wordOptions;
    }
    series.push(entry);
  } 

  mockData.series = series;
  return [mockData];
}

const sentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
  'eque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?'
];