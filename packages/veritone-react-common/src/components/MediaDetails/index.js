import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { number, func, arrayOf, any} from 'prop-types';
import styles from './styles.scss';

export default class MediaDetails extends Component {
  static propTypes = {
    mediaId: number,
    onClose: func,
    engineCategories: arrayOf(any)
  };

  state = {
    selectedEngineCategoryId: ''
  };

  handleEngineCategorySelection = categoryId => {
    this.setState({
      // ...this.state, // check if needed
      selectedEngineCategoryId: categoryId // {}
    });
  };

  render() {

    // TODOs:
    // add header
    // add action buttons menu
    // Media player segment
    // engine category selector

    return (
      <Paper className={styles.mediaDetailsPageContent}>
        <div>
          <div>{this.props.mediaId}</div>
          <div className={styles.mediaDetailsPageCloseIcon}>
            <IconButton
              onClick={this.props.onClose}
              className="icon-close-exit"
              disableRipple={true}/>
          </div>
        </div>
        <div>
          Engine categories
          {this.props.engineCategories && this.props.engineCategories.length && (
            <div>
              {
                this.props.engineCategories.map(function(engineCategory) {
                  return (
                      <a key={engineCategory.id}>{engineCategory.name}</a>
                  );
                })
              }
            </div>
          )}
        </div>

        <div>
          {this.state.selectedEngineCategoryId && this.state.selectedEngineCategoryId.length && (
            <div>
              {this.state.selectedEngineCategoryId}
            </div>
          )}
        </div>
      </Paper>
    );
  }
}
