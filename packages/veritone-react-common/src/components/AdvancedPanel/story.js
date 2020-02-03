import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@material-ui/core/Button';

import { AdvancedPanel } from './index';

export default class Story extends Component {
  state = {
    openAdvancedPanel: false,
    advancedEnableIds: [],
    advancedOptions: {},
  };

  handleClickOpen = () => {
    this.setState({
      openAdvancedPanel: true,
    });
  };

  handleCloseAdvanced = () => {
    this.setState({
      openAdvancedPanel: false,
    });
  };

  handleResetAdvanced = () => {
    console.log('reset');
  };

  handleApplyAdvancedOptions = () => {
    console.log('apply');
    this.handleCloseAdvanced();
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Open responsive dialog</Button>
        <AdvancedPanel
          open={this.state.openAdvancedPanel}
          handleClose={this.handleCloseAdvanced}
          handleReset={this.handleResetAdvanced}
          advancedOptions={this.getAdvancedOptions}
          onAddAdvancedSearchParams={this.handleApplyAdvancedOptions}
        />
      </div>
    );
  }
}

storiesOf('AdvancedSearchPanel', module).add('Base', () => <Story />);
