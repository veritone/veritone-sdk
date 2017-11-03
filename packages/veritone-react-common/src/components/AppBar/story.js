import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import AppBar from './';

storiesOf('AppBar', module)
  .add('Base', () => (
    <AppBar
      profileMenu
      appSwitcher
      currentAppName="Storybook"
      logout={action('logout')}
      user={{
        userName: 'mrobb@veritone.com',
        kvp: {
          firstName: 'Mitch',
          lastName: 'Robb',
          image: 'http://placekitten.com/g/400/300'
        }
      }}
      supportedEngineCategories={[transcriptEngine]}
      enabledApps={sampleApps}
    />
  ))
  .add('Title/close', () => (
    <AppBar title="My Veritone App" closeButton onClose={action('close')} />
  ))
  .add('rightActions', () => (
    <div>
      <AppBar
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledApps={sampleApps}
        rightActions={[
          { label: 'Saved Searches', onClick: action('saved searches') },
          { label: 'Search Results', onClick: action('search results') },
          { label: 'Watchlist', onClick: action('watchlist') }
        ]}
      />
    </div>
  ))
  .add(
    'Zero elevation, actions, switcher, profileMenu only (intro page)',
    () => (
      <AppBar
        elevation={0}
        logo={false}
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledApps={sampleApps}
        rightActions={[
          { label: 'Saved Searches', onClick: action('saved searches') }
        ]}
      />
    )
  )
  .add('Empty appswitcher', function() {
    return (
      <AppBar
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledApps={[]}
      />
    );
  })
  .add('Error appswitcher', function() {
    return (
      <AppBar
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledAppsFailedLoading
        fetchEnabledApps={action('Fetch apps')}
        enabledApps={[]}
      />
    );
  });

const transcriptEngine = {
  id: "guid-1",
  name: "Transcript",
  iconClass: "icon-engine-transcription",
  tooltip: "Search by Keyword",
  enablePill: true,
  showPill: true,
  addPill: () => console.log("show transcript modal")
}

const sampleApps = [
  {
    applicationId: '0',
    applicationName: 'Discovery',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/discovery.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/discovery-app.svg'
  },
  {
    applicationId: '1',
    applicationName: 'Test App',
    applicationIconUrl: '',
    applicationIconSvg: null
  },
  {
    applicationId: '2',
    applicationName: 'CMS',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/cms.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/cms-app.svg'
  },
  {
    applicationId: '3',
    applicationName: 'Collections',
    applicationKey: 'collections',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/collections.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/collections-app.svg'
  },
  {
    applicationId: '4',
    applicationName: 'Library',
    applicationKey: 'library',
    applicationIconUrl:
      'https://static.veritone.com/veritone-ui/appicons-2/library.png',
    applicationIconSvg:
      'https://static.veritone.com/veritone-ui/app-icons-svg/library-app.svg'
  }
];
