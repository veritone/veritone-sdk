import React from 'react';

import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs/react';

import { CSPToSearchParameters } from './parser';

import SearchParameters from './';

storiesOf('SearchBar', module).add('Base (render only)', () => {
  const csp = {
    'and(': [
      {
        state: { search: 'Lakers', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      },
      {
        or: [
          {
            state: { search: 'Kobe', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Lebron', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Shaq', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          }
        ]
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar', module).add('with groups', () => {
  const csp = {
    and: [
      {
        'and(': [
          {
            state: { search: 'Lakers', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            'and(': [
              {
                state: { search: 'Kobe', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              },
              {
                state: { search: 'Bryant', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              }
            ]
          },
          {
            state: { search: 'Shaq', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          },
          {
            state: { search: 'Friendly', language: 'en' },
            engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
          }
        ]
      },
      {
        state: { search: 'Hello', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar', module).add('with double nested group', () => {
  const csp = {
    and: [
      {
        'and(': [
          {
            and: [
              {
                state: { search: 'Lakers', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              },
              {
                'and(': [
                  {
                    state: { search: 'Kobe', language: 'en' },
                    engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
                  },
                  {
                    state: { search: 'Bryant', language: 'en' },
                    engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
                  }
                ]
              }
            ]
          },
          {
            'and(': [
              {
                state: { search: 'Shaq', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              },
              {
                state: { search: 'Friendly', language: 'en' },
                engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
              }
            ]
          }
        ]
      },
      {
        state: { search: 'Hello', language: 'en' },
        engineCategoryId: '67cd4dd0-2f75-445d-a6f0-2f297d6cd182'
      }
    ]
  };
  const searchParameters = CSPToSearchParameters(object('CSP', csp));
  return <SearchParameters parameters={searchParameters} />;
});

storiesOf('SearchBar/EngineCategories', module).add('Transcript', () => {
  return <div>WIP: Add storybook for each label of an engineCategory</div>;
});
