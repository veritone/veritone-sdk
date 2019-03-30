import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import { orderBy, get } from 'lodash';
import classNames from 'classnames';

import styles from './styles.scss';

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
    onTranslateClicked: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number,
    virtualMeasure: func
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  componentDidMount() {
    const { virtualMeasure } = this.props;
    virtualMeasure && virtualMeasure();
  }

  handleSnippetClick = entryData => event => {
    const { onTranslateClicked } = this.props;

    if (onTranslateClicked) {
      onTranslateClicked(event, entryData);
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
      <div className={classNames(styles.translateSegment, className)}>
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
                : `snippet-fragment-${startTime}-${stopTime}`;
              let value = '';
              if (selectedWord) {
                textareaToDecodeCharacters.innerHTML = selectedWord;
                value = textareaToDecodeCharacters.value;
              }
              return (
                <span
                  key={fragmentKey}
                  onClick={this.handleSnippetClick(entry)}
                  className={classNames(styles.translateSnippet, styles.read, className, {
                    [styles.highlight]: !(
                      stopMediaPlayHeadMs < startTime || startMediaPlayHeadMs > stopTime
                    )
                  })}
                >
                  {value}
                </span>
              );
            })
          }
        </div>
      </div>
    );
  }
}
