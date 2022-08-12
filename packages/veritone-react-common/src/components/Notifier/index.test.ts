import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import Notifier from './';


const handleOpen = jest.fn();
const handleClose = jest.fn();
const handleEntryRemove = jest.fn();
const handleEntryAction = jest.fn();

const mockNotifications = {
  onOpen: handleOpen,
  onClose: handleClose,
  notifications: [
    {
      id: '1234',
      type: 'preparing',
      description1: 'Top Description Goes Here',
      description2: 'Bottom Description Goes Here',
      statusDescription: 'testing testing',
      onRemoveClick: handleEntryRemove
    },
    {
      id: '2234',
      type: 'processing',
      description1: 'Top Processing Description Goes Here',
      description2: 'Bottom Processing Description Goes Here',
      statusDescription: 'processing',
      onRemoveClick: handleEntryRemove
    },
    {
      id: '3234',
      type: 'failed',
      description1: 'Failed Description 1 Goes Here',
      description2: 'Failed Description 2 Goes Here',
      test: 'something esle',
      bla: 123,
      onActionClick: handleEntryAction,
      onRemoveClick: handleEntryRemove
    },
    {
      id: '4234',
      type: 'complete',
      description1: 'Big Description Goes Here',
      description2: 'Small Description Goes Here',
      onRemoveClick: handleEntryRemove
    },
    {
      id: '5234',
      type: 'preparing',
      description1: 'preparing Description 1',
      description2: 'preparing Description 2'
    },
    {
      id: '6234',
      type: 'processing',
      description1: 'Processing Description 1',
      description2: 'Processing Description 2'
    },
    {
      id: '7234',
      type: 'failed',
      description1: 'failed Description 1',
      description2: 'failed Description 2'
    },
    {
      id: '8234',
      type: 'complete',
      description1: 'complete Description 1',
      description2: 'complete Description 2'
    }
  ]
};

describe('Notifier Component', () => {
  it('Empty notifier should be disabled', () => {
    const emptyNotifer = mount(<Notifier notifications = {[]} />)
    expect(emptyNotifer.find(IconButton).props()["disabled"]).toBe(true)
  });

  it('should display notification number', () => {
    const closeNotifier = mount(<Notifier {...mockNotifications} />);
    expect(closeNotifier.text()).toEqual(mockNotifications.notifications.length.toString());
    expect(closeNotifier.find('div[data-test="notificationWindow"]')).toHaveLength(0);
  });

  const openNotifier = mount(<Notifier {...mockNotifications} />);
  const notifierButtons = openNotifier.find(IconButton);
  it('should have notifier icon button', () => {
    expect(notifierButtons).toHaveLength(1);
  });

  notifierButtons.first().simulate('click');
  it('handle open callback should be called', () => {
    expect(handleOpen).toHaveBeenCalled();
  });

  const entryWindows = openNotifier.find('div[data-test="notificationWindow"]');
  it('should have notification list', () => {
    expect(entryWindow).toHaveLength(1);
  });

  let entryWindow = entryWindows.first();
  it('should have notification list header', () => {
    const header = entryWindow.find('div[data-test="header"]');
    expect(header).toHaveLength(1);
    expect(header.first().text()).toContain(mockNotifications.notifications.length.toString());
  });
});
