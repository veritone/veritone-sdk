import React from 'react';
import { storiesOf } from '@storybook/react';

import SearchIcon from '@material-ui/icons/Search';
import ExpandableInputField from './';

const onSearch = value => console.log('Search for', value);
const onFocus = evt => console.log('Focus', evt);
const onBlur = evt => console.log('Blur', evt);

class StatefulExpandableInputField extends React.Component {
  state = {
    value: ''
  };

  onChange = evt => {
    this.setState({ value: evt.target.value });
  };

  render() {
    return (
      <ExpandableInputField
        onSearch={onSearch}
        icon={<SearchIcon />}
        onFocus={onFocus}
        value={this.state.value}
        onBlur={onBlur}
        onChange={this.onChange}
      />
    );
  }
}

storiesOf('ExpandableInputField', module).add('Base', () => {
  return (
    <div
      style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}
    >
      <StatefulExpandableInputField />
    </div>
  );
});
