import React from 'react';
import { storiesOf } from '@storybook/react';

import RangeSelect from './index';

class Story extends React.Component {
  state = {
    selectedConfidenceRange: [25, 100],
  };

  onChangeConfidenceRange = e => {
    this.setState({
      selectedConfidenceRange: [...e],
    });
  };

  render() {
    return (
      <div>
        <RangeSelect
          onChangeConfidenceRange={this.onChangeConfidenceRange}
          selectedConfidenceRange={this.state.selectedConfidenceRange}
        />
      </div>
    );
  }
}

storiesOf('Range Select', module).add('Simple test', () => <Story />);
