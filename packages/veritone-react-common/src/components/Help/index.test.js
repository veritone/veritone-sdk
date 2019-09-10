import React from 'react';
import { mount } from 'enzyme';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

import Help from './';

const handleOpen = jest.fn();
const handleClose = jest.fn();
const handleOpenDoc = jest.fn();
const handleSupportChat = jest.fn();

const basicHelpProps = {
  helpDocLink: 'https://help.veritone.com/collections/1732407-veritone-attribute',
  helpDocCallback: handleOpenDoc,
  supportCallback: handleSupportChat,
  onOpen: handleOpen,
  onClose: handleClose
}


const fullyCustomizedHelpProps = {
  helpDocLabel: 'Custom - View Help Docs',
  helpDocLink: 'https://help.veritone.com/collections/1732407-veritone-attribute',
  helpDocCallback: handleOpenDoc,
  supportLabel: 'Custom - Chat With Support',
  supportCallback: handleSupportChat,
  onOpen: handleOpen,
  onClose: handleClose
};

describe('Help Component', () => {
  //Basic Help Component
  const baiscHelpComponent = mount(<Help {...basicHelpProps} />);
  const basicHelpButtons =  baiscHelpComponent.find(IconButton);
  it('Basic Help - Should Have Help Button', () => {
    expect(basicHelpButtons).toHaveLength(1);
  });

  basicHelpButtons.first().simulate('click');
  it('Basic Help - Should trigger onOpen Callback', () => {
    expect(handleOpen).toHaveBeenCalled();
  });

  const basicHelpPanel = baiscHelpComponent.find(List);
  it('Basic Help - Should open help panel', () => {
    expect(basicHelpPanel).toHaveLength(1);
  });

  const basicHelpControls = basicHelpPanel.find(ListItem);
  it('Basic Help - Should have list items', () => {
    expect(basicHelpControls).toHaveLength(2);
  });

  it('Basic Help - Should have default open doc button', () => {
    const openDocButton = basicHelpControls.first();
    expect(openDocButton.text()).toEqual('View Help Docs');
    openDocButton.simulate('click');
    expect(handleOpenDoc).toHaveBeenCalled();
  });

  it('Basic Help - Should have default support button', () => {
    const openSupportButton = basicHelpControls.last();
    expect(openSupportButton.text()).toEqual('Chat With Support');
    openSupportButton.simulate('click');
    expect(handleSupportChat).toHaveBeenCalled();
  });


  //Customized Help Component
  window.config = {appVersion: 'Attribute App 2019.22.0'}
  const customizedHelpComponent = mount(<Help {...fullyCustomizedHelpProps} />);
  const helpButtons =  customizedHelpComponent.find(IconButton);
  it('Customized Help - Should Have Help Button', () => {
    expect(helpButtons).toHaveLength(1);
  });


  helpButtons.first().simulate('click');
  it('Customized Help - Should trigger onOpen Callback', () => {
    expect(handleOpen).toHaveBeenCalled();
  });

  const helpPanel = customizedHelpComponent.find(List);
  it('Customized Help - Should open help panel', () => {
    expect(helpPanel).toHaveLength(1);
  });

  const helpControls = helpPanel.find(ListItem);
  it('Customized Help - Should have list items', () => {
    expect(helpControls).toHaveLength(3);
  });

  const helpDocButton = helpControls.first();
  helpDocButton.simulate('click');
  it('Customized Help - Should have functional open help doc button', () => {
    expect(handleOpenDoc).toHaveBeenCalled();
    expect(helpDocButton.text()).toEqual(fullyCustomizedHelpProps.helpDocLabel);
  });

  const supportButton = helpControls.at(1);
  supportButton.simulate('click');
  it('Customized Help - Should have functional open help doc button', () => {
    expect(handleSupportChat).toHaveBeenCalled();
    expect(supportButton.text()).toEqual(fullyCustomizedHelpProps.supportLabel);
  });

  const appVersion = helpControls.at(2);
  it('Customized Help - Should have app version', () => {
    expect(appVersion.text()).toEqual(window.config.appVersion);
  });
});
