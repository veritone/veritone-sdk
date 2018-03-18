import React, { Component } from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { format, setHours } from 'date-fns';

import withMuiThemeProvider from '../../../helpers/withMuiThemeProvider';
import styles from './styles.scss';

@withMuiThemeProvider
class OCREngineOutputView extends Component {
  static propTypes = {
    assets: arrayOf(shape({
      startTimeMs: number,
      endTimeMs: number,
      sourceEngineId: string,
      sourceEngineName: string,
      taskId: string,
      series: arrayOf(shape({
        end: number,
        start: number,
        object: shape({
          text: string
        })
      }))
    }))
  }

  static defaultProps = {
    assets: [],
    classes: {}
  }

  msToTime = (duration) => {
    let h, m, s;
    s = Math.floor(duration / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    h = (h < 10) && (h > 0) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    return (h > 0 ? h + ":" : "" ) + m + ":" + s;
  }

  render() {
    let { classes, assets } = this.props;

    return (
      <div className={classNames(styles.ocrOutputView, classes.root)}>
        <div className={classNames(styles.ocrViewHeader, classes.header)}>
          <div className={styles.headerTitle}>Text Recognition</div>
          <div className={styles.objectDetectionActions}>
            <Select value="cortex">
              <MenuItem value="cortex">Cortex</MenuItem>
            </Select>
          </div>
        </div>
        <div className={styles.ocrContent}>
          { assets.reduce((accumulator, currentValue) => {
              return [ ...accumulator, ...currentValue.series]
            }, []).map((ocrObject, i) => {
              return <div key={i} className={styles.ocrContainer}>
                <span>{ocrObject.object.text}</span>
                <span className={styles.ocrObjectTimestamp}>
                  {this.msToTime(ocrObject.start)} - {this.msToTime(ocrObject.end)}
                </span>
              </div>
            })
          }
        </div>
      </div>
    );
  }
}

export default OCREngineOutputView;