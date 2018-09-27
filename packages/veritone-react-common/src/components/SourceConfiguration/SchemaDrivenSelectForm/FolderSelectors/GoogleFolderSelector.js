import React, { Component } from 'react';
import { oneOfType, node, arrayOf } from 'prop-types';
import Button from "@material-ui/core/Button/Button";

export default class GoogleFolderSelector extends Component {
  static propTypes = {
    children: oneOfType([arrayOf(node), node])
  };

  state = {
    googlePickerReady: false
  };

  componentDidMount() {
    if(!this.isGoogleReady()) {
      throw new Error('Google  api not available');
    }
  }

  isGoogleReady() {
    return !!window.gapi;
  }

  isGooglePickerReady() {
    return this.state.googlePickerReady;
  }

  onChoose = () => {
    if (this.isGooglePickerReady()) {
      console.log('Time to pick');
    }
  };

  render() {
    return (<div onClick={this.onChoose}>
      {
        this.props.children ?
          this.props.children :
          <Button>
            Select Directory
          </Button>
      }
    </div>);
  }
}
