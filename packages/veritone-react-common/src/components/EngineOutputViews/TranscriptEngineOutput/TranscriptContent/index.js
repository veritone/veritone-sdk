import React, { Component } from 'react';
import { arrayOf, object, bool, number, func } from 'prop-types';

import Snippet from '../Snippet';

import styles from './styles.scss';

const scrollBuffer = 100;

class TranscriptContent extends Component {
  static propTypes = {
    assets: arrayOf(object),
    editModeEnabled: bool,
    onSnippetClicked: func,
    tdoStartTime: number,
    tdoEndTime: number
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

  render() {
    let { 
      assets, 
      editModeEnabled, 
      tdoStartTime, 
      tdoEndTime, 
      onSnippetClicked 
    } = this.props;

    let snippets = assets.map((snippet, index) => {
      return (
        <Snippet 
          key={index} 
          snippet={snippet} 
          onSnippetClick={onSnippetClicked}
          editModeEnabled={editModeEnabled}
        />
      );
    })

    return (
      <div className={styles.transcriptContent} ref={this.elementRef}>
        { snippets }
      </div>
    );
  }
}

export default TranscriptContent;