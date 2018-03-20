import React, { Component } from 'react';
import { shape, string, arrayOf, number } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import EngineOutputHeader from '../EngineOutputHeader';
import SentimentGraph from './SentimentGraph';

import styles from './styles.scss';

// Smooth/normalize sentiment time-series data, using a set of Exponentially-Weighted Moving Averages (EWMA):
function smoothAndNormalizeTimeSeries(series, duration) {
  // Exponentially-Weighted Moving Averages:
  let directionEwma = 0;
  let positiveEwma = 0;
  let negativeEwma = 0;
  let finalEwma = 0;
  // directionAlpha should be within the range [0,1], and controls the resistance of the smoothed
  // data to changes in the sign of the underlying data. A higher directionAlpha setting results
  // in *less* resistance to sign changes.
  let directionAlpha = 0.3;
  // positiveAlpha should be within the range [0,1], and controls smoothing of positive sections
  // of the time series.
  let positiveAlpha = 0.2;
  // negativeAlpha should be within the range [0,1], and controls smoothing of negative sections
  // of the time series.
  let negativeAlpha = 0.2;
  // finalAlpha should be within the range [0,1], and controls final smoothing applied to the
  // pre-processed data.
  let finalAlpha = 0.7;
  // Scores are normalized relative to normalizationBase, which should be within the range [0,1].
  // Any normalized values exceeding 1.0 or -1.0 will be clipped to 1.0 and -1.0, respectively.
  let normalizationBase = 0.7;

  let sumOfScores = 0;

  let seriesLength = series.length;

  let normalizedSeries = series.map(function mapDatum(datum) {
    let normalizedDatum = normalizeDatum(datum);
    if (seriesLength > 20) {
      normalizedDatum = smoothDatum(normalizedDatum);
    }
    sumOfScores += normalizedDatum.score;
    return normalizedDatum;
  });

  // Insert initial anchor data-point:
  if (seriesLength && normalizedSeries[0].time !== 0) {
    normalizedSeries.unshift({
      score: 0,
      time: 0
    });
    seriesLength = normalizedSeries.length;
  }

  // Remove data-points which extend beyond the media duration:
  for (let i = seriesLength - 1; i >= 0; i--) {
    if (normalizedSeries[i].time > duration) {
      normalizedSeries.splice(i, 1);
    }
  }

  // Insert final anchor data-point:
  if (normalizedSeries.length > 0 && normalizedSeries[normalizedSeries.length - 1].time !== duration) {
    normalizedSeries.push({
      score: 0,
      time: duration
    });
  }

  let paddingInterval = normalizedSeries.length > 1 ? normalizedSeries[1].time : 0;

  // Fill gaps (no sentiment data) with zero-padding:
  for (let j = normalizedSeries.length - 1; j >= 1; j--) {
    let t1 = normalizedSeries[j].time;
    let t0 = normalizedSeries[j - 1].time;
    if (t1 - t0 > paddingInterval) {
      let insertions = Math.floor((t1 - t0) / paddingInterval);
      for (let k = 0; k < insertions; k++) {
        let time = t0 + (paddingInterval * (k + 1));
        if (time >= t1) {
          break;
        }
        normalizedSeries.splice(j + k, 0, {
          score: 0,
          time: time
        });
      }
    }
    paddingInterval = 5000;
  }

  // Calculate average of adjusted data (ignoring gaps with no sentiment data):
  let average = !seriesLength ? 0 : (sumOfScores / seriesLength);
  // Round average to 1 decimal place:
  average = Math.round(average * 10) / 10;

  return {
    series: normalizedSeries,
    average: average
  };

  // Map "score" from [0,1] range to [-100,100] range and set "time" to midpoint of start/end:
  function normalizeDatum(datum) {
    let normalizedDatum = {
      score: (datum.score - 0.5) * 200,
      time: (datum.start + datum.end) / 2
    };

    normalizedDatum.score /= normalizationBase;
    if (normalizedDatum.score > 100) {
      normalizedDatum.score = 100;
    } else if (normalizedDatum.score < -100) {
      normalizedDatum.score = -100;
    }

    return normalizedDatum;
  }

  // Apply exponential smoothing to a data-point:
  function smoothDatum(datum) {
    if (datum.score >= 0) {
      directionEwma = directionAlpha + (1 - directionAlpha) * directionEwma;
    } else {
      directionEwma = -directionAlpha + (1 - directionAlpha) * directionEwma;
    }
    if (directionEwma >= 0) {
      if (positiveEwma === 0) {
        positiveEwma = datum.score;
      } else {
        positiveEwma = positiveAlpha * datum.score + (1 - positiveAlpha) * positiveEwma;
      }
      datum.score = positiveEwma;
    } else {
      if (negativeEwma === 0) {
        negativeEwma = datum.score;
      } else {
        negativeEwma = negativeAlpha * datum.score + (1 - negativeAlpha) * negativeEwma;
      }
      datum.score = negativeEwma;
    }
    finalEwma = finalAlpha * datum.score + (1 - finalAlpha) * finalEwma;
    datum.score = finalEwma;

    return datum;
  }
}

class SentimentEngineOutput extends Component {
  static propTypes = {
    data: arrayOf(shape({
      end: number,
      start: number,
      score: number
    })),
    className: string
  };

  render() {
    let { classes, data, className } = this.props;
    let duration = data[data.length - 1]['end'] - data[0]['start'];
    let taskData = smoothAndNormalizeTimeSeries(data || [], duration);
    return (
      <div className={classNames(styles.sentimentOutputView, className)}>
        <EngineOutputHeader title="Sentiment">
          <Select value="medulla">
            <MenuItem value="medulla">Medulla</MenuItem>
          </Select>
        </EngineOutputHeader>
        <div className={styles.sentimentViewContent}>
          <SentimentGraph 
            data={taskData.series}
          />
        </div>
      </div>
    );
  }
}

export default SentimentEngineOutput;
