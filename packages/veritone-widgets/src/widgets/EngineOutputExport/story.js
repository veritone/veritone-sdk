import React from 'react';
import { storiesOf } from '@storybook/react';
import { isEmpty } from 'lodash';

import BaseStory from '../../shared/BaseStory';
import EngineOutputExport from './index';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Story extends React.Component {
  state = {
    isOpen: false,
    tdoId: '',
    tdoObjects: [],
    exportResponse: {}
  };

  handleOpen = () => {
    if (this.state.tdoId) {
      this.setState(prevState => ({
        isOpen: true,
        tdoObjects: [{ id: prevState.tdoId }]
      }));
    }
  };

  handleClose = () => {
    this.setState({
      isOpen: false,
      tdoId: '',
      tdoObjects: []
    });
  };

  handleOnExport = response => {
    this.setState({
      isOpen: false,
      exportResponse: response
    });
  };

  handleTdoChange = event => {
    this.setState({
      tdoId: event.target.value,
      isOpen: false
    });
  };

  render() {
    return (
      <div>
        <TextField
          type="number"
          id="tdoId"
          label="TDO ID"
          value={this.state.tdoId}
          onChange={this.handleTdoChange}
          margin="normal"
        />
        <Button variant="contained" onClick={this.handleOpen}>
          Open
        </Button>
        {!isEmpty(this.state.exportResponse) && (
          <pre>{JSON.stringify(this.state.exportResponse, undefined, 2)}</pre>
        )}
        <EngineOutputExport
          tdos={this.state.tdoObjects}
          open={this.state.isOpen}
          onCancel={this.handleClose}
          onExport={this.handleOnExport}
        />
      </div>
    );
  }
}

storiesOf('EngineOutputExport', module).add('Base', () => {
  return <BaseStory componentClass={Story} />;
});
