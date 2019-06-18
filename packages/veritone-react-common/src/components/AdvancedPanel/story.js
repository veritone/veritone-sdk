import React, { Component } from 'react'
import { storiesOf } from '@storybook/react';
import Button from "@material-ui/core/Button";

import AdvancedPanel from './';

export default class Story extends Component {
  state = {
    open: false
  }
  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }
  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Open responsive dialog</Button>
        <AdvancedPanel open={this.state.open} handleClose={this.handleClose} />
      </div>
    )
  }
}



storiesOf('AdvancedSearchPanel', module)
  .add('Base', () => (
    <Story />
  ));
