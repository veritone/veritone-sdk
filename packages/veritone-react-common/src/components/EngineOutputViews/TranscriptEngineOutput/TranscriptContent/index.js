import React, { Component } from 'react';
import { arrayOf, object, bool, number, func, string } from 'prop-types';

import TranscriptTask from '../TranscriptTask';

import styles from './styles.scss';

const scrollBuffer = 100;

class TranscriptContent extends Component {
  static propTypes = {
    assets: arrayOf(object),
    editModeEnabled: bool,
    editMode: string,
    onSnippetClicked: func,
    tdoStartTime: number,
    tdoEndTime: number,
    onSnippetEdit: func
  };

  componentDidMount() {
    this.transcriptContent.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    this.transcriptContent.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if (this.transcriptContent.scrollTop <= scrollBuffer){
      // There will be logic here to check if the asset[0] contains the start of the recording
      console.log("Check if we should get the previous set of assets");
    } else if ((this.transcriptContent.offsetHeight + this.transcriptContent.scrollTop) >= 
      (this.transcriptContent.scrollHeight - scrollBuffer)) {
      // There will be logic here to check we have reached the end fo the recording
      // or if we need to fetch more assets
      console.log("Check if we should get the next set of assets");
    }
  }

  elementRef = (element) => {
    this.transcriptContent = element
  }

  getTranscriptChunks = () => {
    return this.props.assets.map((chunk, i) => {
      return (
        <TranscriptTask 
          key={i} 
          chunk={chunk}
          editModeEnabled={this.props.editModeEnabled}
          onSnippetClick={this.props.onSnippetClicked}
          onSnippetEdit={this.props.onSnippetEdit}
        />
      )
    });
  }

  render() {
    let { editMode } = this.props;

    return (
      <div className={styles.transcriptContent} ref={this.elementRef}>
        { editMode === 'bulk' ?
            <textarea /> :
            this.getTranscriptChunks()
        }
      </div>
    );
  }
}

export default TranscriptContent;