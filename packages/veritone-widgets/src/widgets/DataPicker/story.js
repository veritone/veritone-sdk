import React, { Fragment } from 'react';
import { func } from 'prop-types';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';
import DataPicker, { DataPickerWidget } from './';

const DataPickerButton = (
  { handlePickFiles } // eslint-disable-line
) => <button onClick={handlePickFiles}>pick</button>;

class DataPickerComponentStory extends React.Component {
  static propTypes = {
    onPick: func.isRequired
  };

  state = {
    result: null
  };

  handlePickResult = (files, { warning, error, cancelled }) => {
    this.props.onPick(files, { warning, error, cancelled });
    this.setState({ result: files });
  };

  render() {
    return (
      <Fragment>
        <DataPicker {...this.props} onPick={this.handlePickResult} />
        {this.state.result && (
          <pre>
            Latest result:
            {JSON.stringify(this.state.result, null, '\t')}
          </pre>
        )}
      </Fragment>
    );
  }
}

function logPickResult(result, { warning, error, cancelled }) {
  console.log(
    'result:',
    result,
    'warning:',
    warning,
    'error:',
    error,
    'cancelled:',
    cancelled
  );
}

storiesOf('DataPicker', module).add('Base', () => {
  const props = {};

  return (
    <BaseStory
      widget={DataPickerWidget}
      widgetProps={props}
      widgetInstanceMethods={{
        pick: instance => instance.pick(logPickResult)
      }}
      componentClass={DataPickerComponentStory}
      componentProps={{
        ...props,
        renderButton: DataPickerButton,
        onPickCancelled: (...args) => console.log('cancelled picking', args),
        onPick: logPickResult
      }}
    />
  );
});
