import React from 'react';
import { func } from 'prop-types';
import { SimpleSearchBarController } from './SimpleSearchBarController';
import { SimpleSearchBarBase } from './index';

export class SimpleSearchBar extends SimpleSearchBarController {
  static propTypes = {
    onSubmit: func
  };
  render() {
    return (
      <SimpleSearchBarBase
        autocomplete={false}
        onChange={this.onChange}
        value={this.state.value}
        onSubmit={this.onSubmit}
      />
    );
  }
}
