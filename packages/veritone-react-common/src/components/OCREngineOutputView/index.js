import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import EngineOutputHeader from '../EngineOutputHeader';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import OCRObject from './OCRObject';
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
    })),
    onOcrClicked: func,
    className: string
  }

  static defaultProps = {
    assets: []
  }

  render() {
    let { assets, className } = this.props;

    return (
      <div className={classNames(styles.ocrOutputView, className)}>
        <EngineOutputHeader title="Text Recognition">
          <Select value="cortex">
              <MenuItem value="cortex">Cortex</MenuItem>
          </Select>
        </EngineOutputHeader>
        <div className={styles.ocrContent}>
          { assets.reduce((accumulator, currentValue) => {
              return [ ...accumulator, ...currentValue.series]
            }, []).map((ocrObject, i) => {
              return <OCRObject 
                key={i} 
                text={ocrObject.object.text}
                startTime={ocrObject.start}
                endTime={ocrObject.end}
              />
            })
          }
        </div>
      </div>
    );
  }
}

export default OCREngineOutputView;