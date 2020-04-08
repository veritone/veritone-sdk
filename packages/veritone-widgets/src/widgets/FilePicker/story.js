import React, { Fragment } from 'react';
import { func } from 'prop-types';
import { storiesOf } from '@storybook/react';

import BaseStory from '../../shared/BaseStory';

import FilePicker, { FilePickerWidget } from './';

const FilePickerButton = (
  { handlePickFiles } // eslint-disable-line
) => <button onClick={handlePickFiles}>pick</button>;

class FilePickerComponentStory extends React.Component {
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
        <FilePicker {...this.props} onPick={this.handlePickResult} />
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

storiesOf('FilePicker', module).add('Base', () => {
  const props = {
    // accept: ['image/*'],
    // allowUrlUpload: false
    multiple: true,
    enableResize: true,
    aspectRatio: 16/9,
    height: 'auto',
    width: 600,
  };

  return (
    <BaseStory
      widget={FilePickerWidget}
      widgetProps={props}
      widgetInstanceMethods={{
        pick: instance => instance.pick(logPickResult)
      }}
      componentClass={FilePickerComponentStory}
      componentProps={{
        ...props,
        renderButton: FilePickerButton,
        onPickCancelled: (...args) => console.log('cancelled picking', args),
        onPick: logPickResult
      }}
    />
  );
});
