import React, { Component } from 'react';
import { arrayOf, shape, number, string, func } from 'prop-types';
import classNames from 'classnames';
import { reduce, groupBy, uniq } from 'lodash';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

import EngineOutputHeader from '../EngineOutputHeader';
import ObjectOccurrenceInterval from './ObjectOccurrenceInterval';
import ObjectCountPill from './ObjectCountPill';

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
    onEngineChange: func
  };

  static defaultProps = {
    assets: []
  }

  state = {
    selectedObject: null
  }

  handlePillClicked = (objectName, evt) => {
    this.setState({selectedObject: objectName});
  }

  removeSelectedObject = () => {
    this.setState({selectedObject: null});
  }

  handleOccurenceClick = (occurrence) => {
    this.props.onObjectOccurrenceClicked(occurrence);
  }

  render() {
    let { assets, className, selectedEngineId, engines, onEngineChange } = this.props;
    let groupedAssets = groupBy(reduce(assets, (accumulator, currentValue) => {
      return accumulator.concat(currentValue.series);
    }, []), 'object.label');
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
          { this.state.selectedObject ? 
              <div className={styles.selectedObjectInfo}>
                <div className={styles.backButtonHeader}>
                  <Button 
                    className={styles.backButton} 
                    onClick={this.removeSelectedObject}
                    size="small"
                  >
                    <i className="icon-keyboard_backspace" /> Back
                  </Button>
                </div>
                <div className={styles.objectNameAndCount}>
                  {this.state.selectedObject} ({groupedAssets[this.state.selectedObject].length})
                </div>
                <div className={styles.objectOccurrenceList}>
                  { groupedAssets[this.state.selectedObject].map((o, i)=>{
                      return <ObjectOccurrenceInterval 
                        key={i}
                        occurrence={o}
                        className={styles.objectOccurrence}
                        onOccurrenceClick={this.handleOccurenceClick}
                      />
                    })
                  }
                </div>
              </div> :
              Object.keys(groupedAssets).map(function(objectKey, index) {
                return <ObjectCountPill 
                  key={index} 
                  className={styles.objectPill}
                  label={objectKey}
                  count={groupedAssets[objectKey].length}
                  onClick={this.handlePillClicked}
                />
              }, this)
          }
        </div>
      </div>
    );
  }
}

export default ObjectDetectionEngineOutput;