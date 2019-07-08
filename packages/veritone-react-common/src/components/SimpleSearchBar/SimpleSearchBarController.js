import React from 'react';
import { any, arrayOf, func } from 'prop-types';
import { SimpleSearchBarBase } from './index';

export class SimpleSearchBarController extends React.Component {
  static propTypes = {
    onSubmit: func,
    autocompleteResults: arrayOf(any)
  };
  state = {
    value: ''
  };

  onChange = value => {
    this.setState({ value });
  };

  onSubmit = data => {
    this.props.onSubmit(this.state.value);
  };

  render() {
    let {
      state: { value },
      props: { autocompleteResults },
      onChange,
      onSubmit
    } = this;

    return (
      <SimpleSearchBarBase
        resetOnClickAway
        autocomplete
        onChange={onChange}
        onSubmit={onSubmit}
        value={value}
        autocompleteResults={autocompleteResults || []}
        placeholder={'Search'}
      />
    );
  }
}
