import React from 'react';
import { element, string } from 'prop-types';
import { storiesOf } from '@storybook/react';
import entities from './entities';
import { SimpleText } from './SimpleText.template';
import { EntitySearchTemplate } from './EntitySearch.template';
import { SimpleSearchBar } from './SimpleSearchBar';
import { SimpleSearchBarController } from './SimpleSearchBarController';

const AppBar = ({ children, color = 'lightblue' }) => (
  <div
    style={{
      backgroundColor: color,
      height: '72px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {children}
  </div>
);

AppBar.propTypes = {
  children: element,
  color: string
};

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
      <SimpleSearchBar marginTop={'24px'} onSubmit={alert} />
    </AppBar>
  ))
  .add('With Auto Suggest', () => {
    return (
      <AppBar>
        <SimpleSearchBarController
          onSubmit={alert}
          marginTop={'24px'}
          autocompleteResults={autoSuggestResults}
        />
      </AppBar>
    );
  });
