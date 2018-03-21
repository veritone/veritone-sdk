import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { reduce } from 'lodash';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import EngineOutputHeader from '../EngineOutputHeader';
import { msToReadableString } from '../../helpers/time';

import styles from './styles.scss';

class ObjectDetectionEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(shape({
      startTime: number,
      endTime: number,
      data: arrayOf(shape({
        end: number,
        found: string,
        start: number,
        saliency: number
      }))
    })),
    onObjectOccurrenceClicked: func,
    selectedEngineId: string,
    engines: arrayOf(shape({
      sourceEngineId: string,
      sourceEngineName: string
    })),
    onEngineChange: func,
    mediaPlayerLocation: number,
    className: string
  };

  static defaultProps = {
    assets: []
  }

  handlePillClicked = (objectName) => (evt) => {
    this.setState({selectedObject: objectName});
  }

  removeSelectedObject = () => {
    this.setState({selectedObject: null});
  }

  handleOccurenceClick = occurrence => (event) => {
    this.props.onObjectOccurrenceClicked(occurrence);
  }

  render() {
    let { assets, className, selectedEngineId, engines, onEngineChange, mediaPlayerLocation } = this.props;
    return (
      <div className={classNames(styles.objectDetectionOutputView, className)}>
        <EngineOutputHeader title="Object Detection">
          { engines && engines.length && <Select value={selectedEngineId} onChange={onEngineChange}>
                { engines.map((e, i) => {
                    return <MenuItem c
                      key={i} 
                      value={e.sourceEngineId}
                    >
                      {e.sourceEngineName}
                    </MenuItem>
                  })
                }
              </Select>
          }
        </ EngineOutputHeader>
        <div className={styles.objectDetectionContent}>
          { reduce(assets, (accumulator, currentValue) => {
              return accumulator.concat(currentValue.series);
            }, []).map((o, i) => {
              let highlightObject = mediaPlayerLocation >= o.startTimeMs && mediaPlayerLocation <= o.endTimeMs;
              return <div 
                key={i} 
                className={classNames(styles.objectPill, highlightObject && styles.highlightedObjectPill)} 
                onClick={this.handleOccurenceClick(o)}
              >
                <span className={styles.objectLabel}>{o.object.label}</span>&nbsp;
                <span className={styles.objectDetectedTime}>{msToReadableString(o.startTimeMs)} - {msToReadableString(o.endTimeMs)}</span>
              </div>
            })
          }
        </div>
      </div>
    );
  }
}

export default ObjectDetectionEngineOutput;