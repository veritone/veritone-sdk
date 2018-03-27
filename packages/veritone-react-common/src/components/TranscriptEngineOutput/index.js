import React, { Component } from 'react';
import { arrayOf , bool, number, shape, string, func } from 'prop-types';
import classNames from 'classnames';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import TranscriptChunk from './TranscriptChunk';

import styles from './styles.scss';

@withMuiThemeProvider
class TranscriptEngineOutput extends Component {
  static propTypes = {
    assets: arrayOf(shape({
      startTime: number,
      endTime: number,
      data: string
    })),
    editModeEnabled: bool,
    className: string,
    onSnippetClicked: func,
    editMode: string,
    onSnippetEdit: func,
    viewMode: string,
    mediaPlayerPosition: number
  };

  static defaultProps = {
    assets: [],
    classes: {},
    editModeEnabled: false,
    viewMode: "time"
  }

  componentDidMount() {
    this.transcriptContent.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    this.transcriptContent.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    const scrollBuffer = 100;

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
      console.log(this.props.assets)
      if (this.props.assets[i-1] !== undefined) {
        console.log(chunk.series[0].startTimeMs, this.props.assets[i-1].series[this.props.assets[i-1].series.length-1].endTimeMs);
      }
      return (
        <TranscriptTask 
          key={'transcript-task' + i} 
          chunk={chunk}
          editModeEnabled={this.props.editModeEnabled}
          onSnippetClick={this.props.onSnippetClicked}
          onSnippetEdit={this.props.onSnippetEdit}
          mediaPlayerPosition={this.props.mediaPlayerPosition}
          viewMode={this.props.viewMode}
        />
      )
    });
  }

  render() {
    let { 
      className, 
      editModeEnabled, 
      editMode
    } = this.props;

    let bulkText = this.props.assets.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.series.reduce((a, c) => {
        return a + c.text;
      }, '')
    }, '');

    return (
      <div className={classNames(className, styles.transcriptContent)} ref={this.elementRef}>
        { editMode === 'bulk' && editModeEnabled ?
            <textarea 
              className={styles.bulkEditTextArea} 
              defaultValue={bulkText}
            /> :
            this.getTranscriptChunks()
        }
      </div>
    );
  }
}

export default TranscriptEngineOutput;