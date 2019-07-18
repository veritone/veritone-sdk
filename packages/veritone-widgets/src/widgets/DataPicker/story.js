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

  handlePickResult = (pickedItems) => {
    this.props.onPick(pickedItems);
    this.setState({ result: pickedItems });
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

function logPickResult(result) {
  console.log('result:', result);
}

const sharedProps = {
  multiple: true,
  supportedFormats: ['audio/*', 'video/*']
};

storiesOf('DataPicker', module)
.add('All Views Enabled', () => {
  const props = {
    ...sharedProps,
    enableFolders: true,
    enableUploads: true
  };

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
})
.add('Only Folders', () => {
  const props = {
    ...sharedProps,
    enableFolders: true
  };

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
})
.add('Only Upload', () => {
  const props = {
    ...sharedProps,
    enableUploads: true
  };
  
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
})
.add('Single Selection Only', () => {
  const props = {
    ...sharedProps,
    multiple: false,
    enableFolders: true,
    enableUploads: true
  };

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
})
.add('2 Selection Only', () => {
  const props = {
    ...sharedProps,
    maxItems: 2,
    enableFolders: true,
    enableUploads: true
  };

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
})
.add('Not Fullscreen', () => {
  const props = {
    ...sharedProps,
    enableFolders: true,
    enableUploads: true,
    height: 1,
    width: 1
  };

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
})