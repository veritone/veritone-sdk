import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';
import { isEmpty } from 'lodash';

import BaseStory from '../../shared/BaseStory';
import EngineOutputExport, { EngineOutputExportWidget } from './index';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const EngineOutputExportButton = (
  { handleOpen } // eslint-disable-line
) => (
  <Button variant="contained" onClick={handleOpen}>
    Open
  </Button>
);

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
        tdoObjects: [{ tdoId: prevState.tdoId }]
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
        <EngineOutputExportButton handleOpen={this.handleOpen} />
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
  return (
    <BaseStory
      widget={EngineOutputExportWidget}
      widgetProps={{
        tdos: object('TDOs', [
          {
            tdoId: '400000238'
          }
        ]),
        onExport: action('onExport'),
        onCancel: action('onCancel')
      }}
      widgetInstanceMethods={{
        open: instance => instance.open()
      }}
      componentClass={Story}
    />
  );
});
