import React, { Component } from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import classNames from 'classnames';
import { reduce, groupBy } from 'lodash';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

import EngineOutputHeader from '../EngineOutputHeader';
import { msToReadableString } from '../../../helpers/time';
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
    classes: shape({
      root: string,
      header: string
    })
  };

  static defaultProps = {
    assets: [],
    classes: {}
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

  handleOccurenceClick = () => {
    console.log('occurence clicked');
  }

  render() {
    let { assets, classes } = this.props;
    let groupedAssets = groupBy(reduce(assets, (accumulator, currentValue) => {
      return accumulator.concat(currentValue.series);
    }, []), 'object.label');
    return (
      <div className={classNames(styles.objectDetectionOutputView, classes.root)}>
        <EngineOutputHeader title="Object Detection">
          <Select value="macula">
            <MenuItem value="macula">Macula</MenuItem>
          </Select>
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
                <div className={styles.objectOccurenceList}>
                  {
                    groupedAssets[this.state.selectedObject].map((o, i)=>{
                      return <div 
                        onClick={this.handleOccurenceClick} 
                        className={styles.objectOccurence} 
                        key={i}
                      >
                        {msToReadableString(o.startTimeMs)} - {msToReadableString(o.endTimeMs)}
                      </div>
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