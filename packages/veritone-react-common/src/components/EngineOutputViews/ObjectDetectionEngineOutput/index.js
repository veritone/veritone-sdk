import React, { Component } from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import classNames from 'classnames';
import { reduce, groupBy } from 'lodash';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';

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
      return accumulator.concat(currentValue.data);
    }, []), 'found');
    return (
      <div className={classNames(styles.objectDetectionOutputView, classes.root)}>
        <div className={classNames(styles.objectDetectionViewHeader, classes.header)}>
          <div className={styles.headerTitle}>Object Detection</div>
          <div className={styles.objectDetectionActions}>
            <Select value="macula">
              <MenuItem value="macula">Macula</MenuItem>
            </Select>
          </div>
        </div>
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
                      return <div onClick={this.handleOccurenceClick} className={styles.objectOccurence} key={i}>{this.msToTime(o.start)} - {this.msToTime(o.end)}</div>
                    })
                  }
                </div>
              </div> :
               Object.keys(groupedAssets).map(function(key, index) {
                return <div key={index} className={styles.objectPill} onClick={this.handlePillClicked.bind(this, key)}>
                  <span>{key}</span><a>({groupedAssets[key].length})</a>
                </div>
              }, this)
          }
        </div>
      </div>
    );
  }
}

export default ObjectDetectionEngineOutput;