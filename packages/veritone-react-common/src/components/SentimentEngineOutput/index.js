import React, { Component } from 'react';
import { number, string, arrayOf, any, func } from 'prop-types';
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
import { msToReadableString } from '../../helpers/time';
import styles from './styles.scss';

export default class SentimentEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(any),
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

  //================================================================================
  //=============================Interaction Functions==============================
  //================================================================================
  handleTimeScroll = event => {
    if (this.props.onTimeScroll) {
      this.scrollTimeOut && clearTimeout(this.scrollTimeOut);
      this.scrollTimeOut = setTimeout(this.onDoneTimeScroll, 500, event);
    }
  };

  onDoneTimeScroll = event => {
    this.scrollTimeOut = null;

    if (this.props.onTimeScroll) {
      let seriesData = this.props.data;
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

  //================================================================================
  //================================Helper Functions================================
  //================================================================================
  extractPropsData = () => {
    let {
      data,
      sentimentTicks,
      sentimentDomain,
      mediaPlayerTime,
      timeWindowSizeMs,
      timeWindowStartMs,
      timeTickIntervalMs
    } = this.props;

    let chartData = [{ sartTimeMs: 0, stopTimeMs: 0, sentiment: 0 }];
    let numValidValue = 0;
    let totalSentiment = 0;
    if (data && Array.isArray(data) && data.length > 0) {
      data.map((entry, index) => {
        if (!entry.hasOwnProperty('status') || entry.status === 'complete') {
          let sentimentValue = 0;
          let sentiment = entry.sentiment;
          if (sentiment.positiveConfidence > sentiment.negativeConfidence) {
            sentimentValue = sentiment.positiveValue * 100;
          } else if (
            sentiment.positiveConfidence < sentiment.negativeConfidence
          ) {
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
        } else {
          //handle failed & pending status
          chartData.push({
            startTimeMs: entry.startTimeMs,
            stopTimeMs: entry.stopTimeMs,
            sentiment: 0
          });
        }
      });
    }

    let totalTime = data[data.length - 1].stopTimeMs;
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
      average: totalSentiment / numValidValue,
      xTicks: xTicks,
      xDomain: xDomain,
      yTicks: sentimentTicks,
      yDomain: sentimentDomain,
      referenceValue: mediaPlayerTime,
      totalTime: totalTime,
      scrollToTime: timeWindowStartMs,
      scaleX: totalTime / timeWindowSizeMs
    };
  };

  setScrollRef = target => {
    this.scrollContent = target;
  };

  scrollTo(timeMs, totalTimeMs) {
    let scrollTarget = this.scrollContent;
    let scrollRatio = timeMs / totalTimeMs;

    scrollTarget.scrollLeft = scrollRatio * scrollTarget.scrollWidth;
  }

  formatXValues(value) {
    return msToReadableString(value);
  }

  formatYValues(value) {
    return value + '%';
  }

  //================================================================================
  //================================Render Function=================================
  //================================================================================
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
      referenceValue,
      totalTime,
      scrollToTime
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

    setTimeout(() => {
      this.scrollTo(scrollToTime, totalTime);
    });

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
        {this.renderSummary(extractedData.average)}
        {this.renderChart(extractedData)}
      </div>
    );
  }
}
