import React from 'react';
import { storiesOf } from '@storybook/react';

import SelectionButton from './';

class StatefulSelectionButton extends React.Component {
  state = {
    selected: false
  };

  toggleSelection = evt => {
    this.setState((prevState, props) => ({
      selected: !prevState.selected
    }));
  };

  render() {
    return (
      <SelectionButton
        selected={this.state.selected}
        toggleSelection={this.toggleSelection}
        {...this.props}
      />
    );
  }
}

class MultipleStatefulSelectionButton extends React.Component {
  state = {
    selected: false
  };

  getSelectionHandler = id => evt => {
    this.setState({ selected: id });
  };

  render() {
    return [
      <div key="1" style={{ margin: '1em' }}>
        <SelectionButton
          selected={this.state.selected === 1}
          toggleSelection={this.getSelectionHandler(1)}
          {...this.props}
        >
          {' '}
          Button 1
        </SelectionButton>
      </div>,
      <div key="2" style={{ margin: '1em' }}>
        <SelectionButton
          selected={this.state.selected === 2}
          toggleSelection={this.getSelectionHandler(2)}
          {...this.props}
        >
          Button 2
        </SelectionButton>
      </div>,
      <div key="3" style={{ margin: '1em' }}>
        <SelectionButton
          selected={this.state.selected === 3}
          toggleSelection={this.getSelectionHandler(3)}
          {...this.props}
        >
          Button 3
        </SelectionButton>
      </div>,
      <div key="4" style={{ margin: '1em' }}>
        <SelectionButton
          selected={this.state.selected === 4}
          toggleSelection={this.getSelectionHandler(4)}
          {...this.props}
        >
          Button 4
        </SelectionButton>
      </div>
    ];
  }
}

storiesOf('SelectionButton', module).add('Base', () => {
  return <StatefulSelectionButton>Button text</StatefulSelectionButton>;
});

storiesOf('SelectionButton', module).add('Multiple', () => {
  return <MultipleStatefulSelectionButton />;
});
