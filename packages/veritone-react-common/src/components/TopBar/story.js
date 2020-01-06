import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import ShareIcon from '@material-ui/icons/Share';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AssessmentIcon from '@material-ui/icons/Assessment';
import BuildIcon from '@material-ui/icons/Build';
import Button from '@material-ui/core/Button';

import AppBar from '../AppBar';
import TopBar from './';

storiesOf('TopBar', module)
  .add('AppBar offset', () => (
    <div>
      <AppBar />
      <TopBar menuButton appBarOffset leftText="About 448,0000 results" />
    </div>
  ))
  .add('Selected/backButton', () => (
    <TopBar
      selected
      backButton
      onClickBackButton={action('back')}
      leftText="2 items selected"
      rightIconButtons={[
        <IconButton key="1">
          <LibraryAddIcon />
        </IconButton>,
        <IconButton key="2">
          <ShareIcon />
        </IconButton>,
        <IconButton key="3">
          <CloudDownloadIcon />
        </IconButton>
      ]}
    />
  ))
  .add('Width animation/drawer (use knob)', () => {
    let drawerIsOpen = boolean('Drawer Open', false);

    return (
      <div>
        <TopBar
          width
          menuButton={!drawerIsOpen}
          leftOffset={drawerIsOpen ? 240 : 0}
          leftText="About 448,0000 results"
          rightIconButtons={[
            <IconButton key="1">
              <AssessmentIcon />
            </IconButton>,
            <IconButton key="2">
              <BuildIcon />
            </IconButton>
          ]}
        />
        <Drawer
          variant="persistent"
          style={{ width: 240, height: 200 }}
          open={drawerIsOpen}
        >
          <List
            style={{
              width: 240
            }}
          >
            <ListItem button>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="fixme" />
            </ListItem>
          </List>
        </Drawer>
      </div>
    );
  })
  .add('Menu', () => (
    <TopBar
      menuButton
      rightIconButtons={[
        <IconButton key="1">
          <LibraryAddIcon />
        </IconButton>,
        <IconButton key="2">
          <ShareIcon />
        </IconButton>,
        <IconButton key="3">
          <CloudDownloadIcon />
        </IconButton>
      ]}
      rightMenu
      rightMenuItems={[
        { label: 'Do something', handler: action('Did something') },
        { label: 'Do something else', handler: action('Did something else') }
      ]}
    />
  ))
  .add('render action button', () => (
    <TopBar
      backButton
      onClickBackButton={action('back')}
      leftText="Home"
      // eslint-disable-next-line
      renderActionButton={() => (
        <Button variant="contained" color="primary">
          Test action button
        </Button>
      )}
    />
  ));
