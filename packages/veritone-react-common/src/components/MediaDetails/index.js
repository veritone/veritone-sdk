import React, { Component } from 'react';
import EngineCategorySelector from './EngineCategorySelector';
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
    selectedEngineCategory: this.props.engineCategories && this.props.engineCategories.length ? this.props.engineCategories[0] : null
  };

  componentWillReceiveProps(nextProps) {
    // preselect 1st engine category - only on the first load
    if(!this.state.selectedEngineCategory && nextProps.engineCategories && nextProps.engineCategories.length) {
      this.setState({
        selectedEngineCategory: nextProps.engineCategories[0]
      });
    }
  }

  handleEngineCategoryChange = selectedCategoryId => {
    const selectedCategory = this.props.engineCategories.find(category => category.id === selectedCategoryId);
    this.setState({
      // ...this.state, // check if needed
      selectedEngineCategory: selectedCategory
    });
  };

  render() {

    // TODOs:
    // add header
    // add action buttons menu
    // Media player segment
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
        {this.state.selectedEngineCategory &&
          <EngineCategorySelector engineCategories={this.props.engineCategories}
                                  selectedEngineCategoryId={this.state.selectedEngineCategory.id}
                                  onSelectEngineCategory={this.handleEngineCategoryChange}/>}


        <div>
          Currently Selected category: {this.state.selectedEngineCategory &&
          <span>{this.state.selectedEngineCategory.name}</span>}
        </div>

        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'transcript' &&
          <div>Transcript component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'face' &&
        <div>Face component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'object' &&
        <div>Object component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'logo' &&
        <div>Logo component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'ocr' &&
        <div>OCR component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'fingerprint' &&
        <div>Fingerprint component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'translate' &&
        <div>Translation component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'sentiment' &&
        <div>Sentiment component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'geolocation' &&
        <div>Geolocation component</div>}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'stationPlayout' &&
        <div>Station playout component</div>}
        {/* Thumbnail is not supported: remove before release */}
        {this.state.selectedEngineCategory && this.state.selectedEngineCategory.categoryType === 'thumbnail' &&
        <div>Thumbnail component</div>}



      </Paper>
    );
  }
}
