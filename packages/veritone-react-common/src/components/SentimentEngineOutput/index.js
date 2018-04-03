import React, { Component } from 'react';
import { number, string, arrayOf, any, func, shape } from 'prop-types';
import classNames from 'classnames';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  ReferenceLine
} from 'recharts';
import EngineOutputHeader from '../EngineOutputHeader';
import { msToReadableString } from '../../helpers/time';
import styles from './styles.scss';

export default class SentimentEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(any),
    engines: arrayOf(
      shape({
        sourceEngineId: string,
        sourceEngineName: string
      })
    ),
    selectedEngineId: string,
    onEngineChange: func,
    onExpandClicked: func,
    className: string,
    mediaPlayerTime: number,
    timeWindowSizeMs: number,
    timeWindowStartMs: number,
    timeTickIntervalMs: number,
    sentimentTicks: arrayOf(number),
    sentimentDomain: arrayOf(number),
    onTimeClick: func,
    onTimeScroll: func
  };

  static defaultProps = {
    data: [],
    mediaPlayerTime: 0,
    timeWindowSizeMs: 400000,
    timeWindowStartMs: 0,
    timeTickIntervalMs: 50000,
    sentimentDomain: [100, -100],
    sentimentTicks: [100, 80, 60, 40, 20, 0, -20, -40, -60, -80, -100]
  };

  componentWillReceiveProps(newProps) {
    if (newProps.timeWindowStartMs !== this.props.timeWindowStartMs) {
      this.scrollTo(newProps.timeWindowStartMs);
    }
  }

  handleTimeScroll = event => {
    if (this.props.onTimeScroll) {
      this.scrollTimeOut && clearTimeout(this.scrollTimeOut);
      this.scrollTimeOut = setTimeout(this.onDoneTimeScroll, 500, event);
    }
  };

  onDoneTimeScroll = event => {
    this.scrollTimeOut = null;

    if (this.props.onTimeScroll) {
      let seriesData = this.flattenEngineResultsToSeries(this.props.data);
      let totalTime = seriesData[seriesData.length - 1].stopTimeMs;

      let chartWidth = event.target.scrollWidth;
      let chartPosition = event.target.scrollLeft;

      let time = totalTime * chartPosition / chartWidth;
      this.props.onTimeScroll(time);
    }
  };

  handleTimeClick = event => {
    this.props.onTimeClick && this.props.onTimeClick(event);
  };

  flattenEngineResultsToSeries = data => {
    if (!data || !data.length) {
      return [];
    }
    const allSeries = [];
    data.forEach(dataItem => {
      if (dataItem.series && dataItem.series.length) {
        dataItem.series.forEach(seriesItem => {
          if ( seriesItem.sentiment &&
            isNaN(seriesItem.sentiment.positiveValue) &&
            isNaN(seriesItem.sentiment.negativeValue)
          ) {
            // No data case - engine results has a no-value series item - set sentiment = 0
            allSeries.push({
              startTimeMs: seriesItem.startTimeMs,
              stopTimeMs: seriesItem.stopTimeMs,
              sentiment: {
                positiveConfidence: 1,
                positiveValue: 0
              }
            });
          } else {
            allSeries.push(seriesItem);
          }
        });
      } else {
        // No data case - engine result has no data for the offset range - set sentiment = 0
        allSeries.push({
          startTimeMs: dataItem.startOffsetMs,
          stopTimeMs: dataItem.stopOffsetMs,
          sentiment: {
            positiveConfidence: 1,
            positiveValue: 0
          }
        });
      }
    });
    return allSeries;
  };

  extractPropsData = () => {
    let {
      data,
      sentimentTicks,
      sentimentDomain,
      mediaPlayerTime,
      timeWindowSizeMs,
      timeWindowStartMs,
      timeTickIntervalMs,
    } = this.props;

    let chartData = [{ sartTimeMs: 0, stopTimeMs: 0, sentiment: 0 }];
    let numValidValue = 0;
    let totalSentiment = 0;
    const seriesData = this.flattenEngineResultsToSeries(data);
    seriesData.map((entry, index) => {
      let sentimentValue = 0;
      let sentiment = entry.sentiment;
      const positiveConfidence = sentiment && sentiment.positiveConfidence || 0;
      const negativeConfidence = sentiment && sentiment.negativeConfidence || 0;
      if (positiveConfidence > negativeConfidence) {
        sentimentValue = sentiment.positiveValue * 100;
      } else if (positiveConfidence < negativeConfidence) {
        sentimentValue = sentiment.negativeValue * 100;
      }
      numValidValue++;
      totalSentiment = totalSentiment + sentimentValue;
      let chartFriendlyData = {
        startTimeMs: entry.startTimeMs,
        stopTimeMs: entry.stopTimeMs,
        sentiment: sentimentValue
      };
      chartData.push(chartFriendlyData);
    });

    let totalTime = seriesData.length
      ? seriesData[seriesData.length - 1].stopTimeMs
      : 0;
    let xDomain = [0, totalTime];
    let xTicks = [];
    for (
      let xTickValue = 0;
      xTickValue <= totalTime;
      xTickValue = xTickValue + timeTickIntervalMs
    ) {
      xTicks.push(xTickValue);
    }

    return {
      chartData: chartData,
      average: parseFloat(totalSentiment / numValidValue).toFixed(2),
      xTicks: xTicks,
      xDomain: xDomain,
      yTicks: sentimentTicks,
      yDomain: sentimentDomain,
      referenceValue: mediaPlayerTime,
      totalTime: totalTime,
      scrollToTime: timeWindowStartMs,
      scaleX: (totalTime > timeWindowSizeMs ) ? totalTime / timeWindowSizeMs : 1,
    };
  };

  setScrollRef = target => {
    this.scrollContent = target;
  };

  scrollTo = timeMs => {
    let data = this.props.data;
    let scrollTarget = this.scrollContent;
    let scrollRatio = timeMs / data[data.length - 1].stopTimeMs;

    scrollTarget.scrollLeft = scrollRatio * scrollTarget.scrollWidth;
  };

  formatXValues(value) {
    return msToReadableString(value);
  }

  formatYValues(value) {
    return value + '%';
  }

  renderSummary(average) {
    return (
      <div
        className={classNames(styles.summary, {
          [styles.positive]: average >= 0,
          [styles.negative]: average < 0
        })}
      >
        {average + (average >= 0 ? '% positive' : '% negative')}
      </div>
    );
  }

  renderChart(extractedData) {
    let {
      chartData,
      xTicks,
      xDomain,
      yTicks,
      yDomain,
      scaleX,
      referenceValue
    } = extractedData;
    // Compute color offset
    let maxSentiment = Math.max(...chartData.map(entry => entry.sentiment));
    let minSentiment = Math.min(...chartData.map(entry => entry.sentiment));

    let offset = 0; // Everything is red;
    if (maxSentiment > 0 && minSentiment > 0) {
      offset = 1; // Everything is green
    } else if (maxSentiment > 0) {
      offset = maxSentiment / (maxSentiment - minSentiment); // Above 0 is green & below 0 is red
    }

    return (
      <div className={styles.sentimentBody}>
        {/* Draw Y axis this part is not scrollable */}
        <div className={styles.yAxis}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
            >
              <XAxis tick={false} type="number" />
              <YAxis
                dataKey="sentiment"
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={this.formatYValues}
                type="number"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Draw Chart Content Container */}
        <div
          className={styles.content}
          onScroll={this.handleTimeScroll}
          ref={this.setScrollRef}
        >
          {/* Draw Scrollable Chart Content */}
          <ResponsiveContainer
            width={(100 * scaleX).toString() + '%'}
            height="100%"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 40 }}
              onClick={this.handleTimeClick}
            >
              <XAxis
                interval="preserveStartEnd"
                dataKey="stopTimeMs"
                domain={xDomain}
                ticks={xTicks}
                tickFormatter={this.formatXValues}
                type="number"
              />
              <YAxis
                hide
                dataKey="sentiment"
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={this.formatYValues}
              />
              <CartesianGrid />

              {/* Split Colors */}
              <defs>
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={offset} stopColor="green" stopOpacity={1} />
                  <stop offset={offset} stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="sentiment"
                stroke="url(#splitColor)"
                fill="url(#splitColor)"
              />

              {/* Draw media player time */}
              <ReferenceLine x={referenceValue} stroke="orange" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  render() {
    let extractedData = this.extractPropsData();

    return (
      <div className={classNames(styles.sentimentOutput, this.props.className)}>
        {this.props.engines && this.props.engines.length && this.props.selectedEngineId &&
          <EngineOutputHeader
            title="Sentiment"
            engines={this.props.engines}
            selectedEngineId={this.props.selectedEngineId}
            onEngineChange={this.props.onEngineChange}
            onExpandClicked={this.props.onExpandClicked}
          />}
        {this.renderSummary(extractedData.average)}
        {this.renderChart(extractedData)}
      </div>
    );
  }
}
