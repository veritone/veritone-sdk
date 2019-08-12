import React from 'react';
import { func } from 'prop-types';
import { SimpleSearchBarController } from './SimpleSearchBarController';
import { SimpleText } from './SimpleText.template';
import { EntitySearchTemplate } from './EntitySearch.template';
import { SimpleSearchBarBase } from './index';

class SimpleSearchBar extends SimpleSearchBarController {
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
        {...this.props}
      />
    );
  }
}

export {
  SimpleSearchBar,
  SimpleSearchBarController,
  SimpleSearchBarBase,
  SimpleText,
  EntitySearchTemplate
};
