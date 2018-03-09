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

    console.log('Media component log');
    console.log(this.props.engineCategories);

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
        {console.log(this.props.engineCategories)}
        <div>
          Engine categories statuses
          {this.props.engineCategories && this.props.engineCategories.length && (
            <span>{this.props.engineCategories[0].status}</span>
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
