import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { format, setHours } from 'date-fns';

import OCRObject from './OCRObject';
import EngineOutputHeader from '../EngineOutputHeader';
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
    })),
    onOcrClicked: func
  }

  static defaultProps = {
    assets: [],
    classes: {}
  }

  render() {
    let { classes, assets } = this.props;

    return (
      <div className={classNames(styles.ocrOutputView, classes.root)}>
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