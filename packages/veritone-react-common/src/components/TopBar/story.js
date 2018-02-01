import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import IconButton from 'material-ui/es/IconButton';
import Drawer from 'material-ui/es/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/es/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import LibraryAddIcon from 'material-ui-icons/LibraryAdd';
import ShareIcon from 'material-ui-icons/Share';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import AssessmentIcon from 'material-ui-icons/Assessment';
import BuildIcon from 'material-ui-icons/Build';

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
          <FileDownloadIcon />
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
          type="persistent"
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
          <FileDownloadIcon />
        </IconButton>
      ]}
      rightMenu
      rightMenuItems={[
        { label: 'Do something', handler: action('Did something') },
        { label: 'Do something else', handler: action('Did something else') }
      ]}
    />
  ));
