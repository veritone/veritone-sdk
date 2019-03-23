import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import { orderBy, get } from 'lodash';
import classNames from 'classnames';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import SnippetFragment from '../SnippetFragment';

import styles from './styles.scss';

const cellCache = new CellMeasurerCache({
  defaultHeight: 50,
  fixedWidth: true
});

export default class SnippetSegment extends Component {
  static propTypes = {
    series: arrayOf(
      shape({
        startTimeMs: number,
        stopTimeMs: number,
        value: string
      })
    ),
    className: string,
    contentClassName: string,
    onClick: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number,
    virtualMeasure: func
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  state = {
    virtualizedSerieBlocks: []
  }

  componentDidMount() {
    const { virtualMeasure } = this.props;
    virtualMeasure && virtualMeasure();
  }

  handleSnippetClick = entryData => event => {
    const { onClick } = this.props;

    if (onClick) {
      onClick(event, entryData);
    }
  };

  render() {
    const {
      className,
      series,
      contentClassName,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;
    const textareaToDecodeCharacters = document.createElement('textarea');

    return (
      <div className={classNames(styles.transcriptSegment, className)}>
        <div className={classNames(styles.content, contentClassName)}>
          {
            series.map(entry => {
              const startTime = entry.startTimeMs;
              const stopTime = entry.stopTimeMs;
              const words = entry.words || [];
              const orderedWords = orderBy(words, ['confidence'], ['desc']);
              const selectedWord = get(orderedWords, '[0].word');
              const fragmentKey = entry.guid
                ? entry.guid
                : `snippet-fragment-${startTime}-${stopTime}-${value.substr(0, 32)}`;
              let value = '';
              if (selectedWord) {
                textareaToDecodeCharacters.innerHTML = selectedWord;
                value = textareaToDecodeCharacters.value;
              }

              return (
                <SnippetFragment
                  key={fragmentKey}
                  value={value}
                  active={
                    !(
                      stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
                    )
                  }
                  startTimeMs={startTime}
                  stopTimeMs={stopTime}
                  onClick={this.handleSnippetClick(entry)}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
