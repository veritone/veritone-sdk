import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Build, Help } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import AppBar from './';

storiesOf('AppBar', module)
  .add('Base', () => (
    <AppBar
      profileMenu
      appSwitcher
      currentAppName="Storybook"
      onLogout={action('logout')}
      user={{
        userName: 'mrobb@veritone.com',
        kvp: {
          firstName: 'Mitch',
          lastName: 'Robb',
          image: 'http://placekitten.com/g/400/300'
        }
      }}
      enabledApps={sampleApps}
    />
  ))
  .add('Title/close', () => (
    <AppBar title="My Veritone App" closeButton onClose={action('close')} />
  ))
  .add('Custom logo', () => (
    <AppBar logoSrc={'http://via.placeholder.com/485x96'} />
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
  })
  .add('Profile menu statusDescription items', function() {
    return (
      <AppBar
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledAppsFailedLoading
        fetchEnabledApps={action('Fetch apps')}
        enabledApps={[]}
        user={{
          userName: 'mrobb@veritone.com',
          kvp: {
            firstName: 'Mitch',
            lastName: 'Robb',
            image: 'http://placekitten.com/g/400/300'
          }
        }}
        additionMenuItems={[
          <MenuItem key="helpCenter" data="helpCenter">
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help Center" />
          </MenuItem>,
          <MenuItem key="appConfiguration" data="appConfiguration">
            <ListItemIcon>
              <Build />
            </ListItemIcon>
            <ListItemText primary="App Configuration" />
          </MenuItem>
        ]}
      />
    );
  })
  .add('With Notifications', function() {
    return (
      <AppBar
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledAppsFailedLoading
        fetchEnabledApps={action('Fetch apps')}
        enabledApps={[]}
        user={{
          userName: 'mrobb@veritone.com',
          kvp: {
            firstName: 'Mitch',
            lastName: 'Robb',
            image: 'http://placekitten.com/g/400/300'
          }
        }}
        notification={mockNotifications}
      />
    );
  })
  .add('With Custom Notifications', function() {
    return (
      <AppBar
        profileMenu
        appSwitcher
        currentAppName="Storybook"
        enabledAppsFailedLoading
        fetchEnabledApps={action('Fetch apps')}
        enabledApps={[]}
        user={{
          userName: 'mrobb@veritone.com',
          kvp: {
            firstName: 'Mitch',
            lastName: 'Robb',
            image: 'http://placekitten.com/g/400/300'
          }
        }}
        notification={mockCustomNotifications}
      />
    );
  });

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

const mockNotifications = {
  onOpen: action('on open'),
  onClose: action('on close'),
  notifications: [
    {
      id: '1234',
      type: 'preparing',
      description1: 'Top Description Goes Here',
      description2: 'Bottom Description Goes Here',
      statusDescription: 'testing testing',
      onRemoveClick: action()
    },
    {
      id: '2234',
      type: 'failed',
      description1: 'Failed Description 1 Goes Here',
      description2: 'Failed Description 2 Goes Here',
      test: 'something esle',
      bla: 123,
      onActionClick: action(),
      onRemoveClick: action()
    },
    {
      id: '3234',
      type: 'completed',
      description1: 'Big Description Goes Here',
      description2: 'Small Description Goes Here',
    },
    {
      id: '4234',
      type: 'processing',
      description1: 'Processing Description 1',
      description2: 'Processing Description 2',
    },
    {
      id: '5234',
      type: 'completed',
      description1: 'Long Description Goes Here, Long Description Goes Here, Long Description Goes Here',
      description2: 'Long & Small Description Goes Here, Long & Small Description Goes Here, Long & Small Description Goes Here',
      onRemoveClick: action()
    },
    {
      id: '6234',
      type: 'preparing',
      description1: 'Top Description Goes Here',
      description2: 'Bottom Description Goes Here',
      statusDescription: 'custom status'
    },
    {
      id: '7234',
      type: 'failed',
      description1: 'Failed Description 1 Goes Here',
      description2: 'Failed Description 2 Goes Here',
      onActionClick: action(),
      onRemoveClick: action()
    },
    {
      id: '8234',
      type: 'processing',
      description1: 'processing Description 1 Goes Here',
      description2: 'processing Description 2 Goes Here',
      onActionClick: action()
    },
    {
      id: '9234',
      type: 'failed',
      description1: 'Failed Description 1 Goes Here',
      description2: 'Failed Description 2 Goes Here',
      onActionClick: action()
    }
  ]
};

const mockCustomNotifications = {
  headerText: 'Custom Header Text Goes Here',
  showMoreLabel: 'Custom Show More Button',
  showLessLabel: 'Custom Show Less Button',
  onOpen: action('on open'),
  onClose: action('on close'),
  notifications: [
    {
      id: '1234',
      type: 'preparing',
      description1: 'Top Description Goes Here',
      description2: 'Bottom Description Goes Here',
    },
    {
      id: '2234',
      type: 'failed',
      description1: 'Failed Description 1 Goes Here',
      description2: 'Failed Description 2 Goes Here',
      callback: action()
    },
    {
      id: '3234',
      type: 'completed',
      description1: 'Big Description Goes Here',
      description2: 'Small Description Goes Here',
    },
    {
      id: '4234',
      type: 'processing',
      description1: 'Processing Description 1',
      description2: 'Processing Description 2',
    }
  ]
};