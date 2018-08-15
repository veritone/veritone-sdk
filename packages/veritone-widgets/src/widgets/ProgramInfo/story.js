import React from 'react';
import { storiesOf } from '@storybook/react';

import VeritoneApp from '../../shared/VeritoneApp';
import ProgramInfoWidget from '.';

class Story extends React.Component {
  state = { lastResult: {} };

  componentDidMount() {
    this._programInfo = new ProgramInfoWidget({
      elId: 'programInfo-widget',
      initialValues: {}
      // handleSubmit: this.handleSubmit
    });
  }

  componentWillUnmount() {
    this._programInfo.destroy();
  }

  handleSubmit = values => {
    this.setState({
      lastResult: values
    });
  };

  submitForm = () => {
    this._programInfo.submit(values => {
      this.handleSubmit(values);
      console.log('Form Submitted:', values);
    });
  };

  render() {
    return (
      <div>
        <span id="programInfo-widget" />
        <button type="button" onClick={this.submitForm}>
          Submit
        </button>
        <div>
          Last result:
          <pre>{JSON.stringify(this.state.lastResult, null, '\t')}</pre>
        </div>
      </div>
    );
  }
}

const app = VeritoneApp();

storiesOf('Program Info', module).add('Base', () => {
  return <Story store={app._store} />;
});
