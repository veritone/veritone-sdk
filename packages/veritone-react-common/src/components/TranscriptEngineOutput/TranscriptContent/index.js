import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';

import TranscriptChunk from '../TranscriptChunk';

import styles from './styles.scss';

class TranscriptContent extends Component {
  static propTypes = {
    assets: arrayOf(object)
  };

  componentDidMount() {
    this.transcriptContent.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    this.transcriptContent.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    console.log('Scrolling and stuff');
    console.log(document.body.offsetHeight);
  }

  elementRef = (element) => {
    this.transcriptContent = element
  }

  render() {
    let dataChunks = this.props.assets.map((asset, index) => {
      return (<TranscriptChunk key={index} startTime={asset.startTime} endTime={asset.endTime} data={asset.data}/>);
    })
    return (
      <div className={styles.transcriptContent} ref={this.elementRef}>
        { dataChunks }
      </div>
    );
  }
}

export default TranscriptContent;