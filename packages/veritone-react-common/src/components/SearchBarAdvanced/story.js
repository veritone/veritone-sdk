import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AppBar from '../AppBar';
import { SearchBarAdvanced } from './index';

storiesOf('Search Bar (advanced)', module).add('Default', () => {
  return (
    <AppBar
      title="CMS"
      profileMenu
      appSwitcher
      currentAppName="Storybook"
      searchBarJustification={'flex-start'}
      searchBarLeftMargin={250}
      searchBar={
        <SearchBarAdvanced
          width={768}
          onSearch={alert}
          api={'https://api.veritone.com'}
          enabledEngineCategories={{
            'tag-search-id': '',
            'time-search-id': '',
            'sdo-search-id': ''
          }}
          relativeSize={18}
        />
      }
      rightActions={[
        { label: 'Saved Searches', onClick: action('saved searches') },
        { label: 'Search Results', onClick: action('search results') },
        { label: 'Watchlist', onClick: action('watchlist') }
      ]}
    />
  );
});
