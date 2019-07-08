import React from 'react';
import { storiesOf } from '@storybook/react';
import AppBar from '../AppBar';
import entities from './entities';
import { SimpleText } from './SimpleText.template';
import { EntitySearchTemplate } from './EntitySearch.template';
import { SimpleSearchBar } from './SimpleSearchBar';
import { SimpleSearchBarController } from './SimpleSearchBarController';

const autoSuggestResults = [
  {
    template: EntitySearchTemplate,
    data: entities.slice(0, 4),
    onClick: result => alert(JSON.stringify(result))
  },
  {
    template: SimpleText,
    data: entities.slice(4, 8).map(entity => entity.name),
    onClick: result => alert(JSON.stringify(result))
  }
];

storiesOf('Simple Search Bar', module)
  .add('Simple Search', () => (
    <AppBar>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <SimpleSearchBar onSubmit={data => alert(data)} />
    </AppBar>
  ))
  .add('With Auto Suggest', () => {
    return (
      <AppBar>
        <SimpleSearchBarController autocompleteResults={autoSuggestResults} />
      </AppBar>
    );
  });
