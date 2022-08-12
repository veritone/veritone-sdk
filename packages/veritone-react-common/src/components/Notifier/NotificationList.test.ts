import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import NotificationList from './NotificationList';

const handleEntryRemove = jest.fn();
const handleEntryAction = jest.fn();

const mockNotifications = [
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
];

describe('Notifications Component', () => {
  const notificationList = mount(
    <NotificationList notifications={mockNotifications} />
  );

  it('should have all entries', () => {
    expect(notificationList.find('div[data-test="entry"]')).toHaveLength(mockNotifications.length);
  });

  it('should have buttons for callbacks', () => {
    expect(notificationList.find(IconButton)).toHaveLength(5);
  });

  it('Preparing entry should trigger remove callback', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '1234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(1);
    actionButtons.first().simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith(
      {
        id: '1234',
        type: 'preparing',
        description1: 'Top Description Goes Here',
        description2: 'Bottom Description Goes Here',
        statusDescription: 'testing testing',
        onRemoveClick: handleEntryRemove
      }
    );
  });

  it('Processing entry should trigger remove callback', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '2234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(1);
    actionButtons.first().simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith(
      {
        id: '2234',
        type: 'processing',
        description1: 'Top Processing Description Goes Here',
        description2: 'Bottom Processing Description Goes Here',
        statusDescription: 'processing',
        onRemoveClick: handleEntryRemove
      }
    );
  });

  it('Failed entry buttons should trigger callbacks', () => {
    const failedEntry = notificationList.findWhere(entry => entry.key() === '3234');
    expect(failedEntry).toHaveLength(1);
    const failedButtons = failedEntry.find(IconButton);
    expect(failedButtons).toHaveLength(2);
    const actionButton = failedButtons.first();
    actionButton.simulate('click');
    expect(handleEntryAction).toHaveBeenCalledWith(
      {
        id: '3234',
        type: 'failed',
        description1: 'Failed Description 1 Goes Here',
        description2: 'Failed Description 2 Goes Here',
        test: 'something esle',
        bla: 123,
        onActionClick: handleEntryAction,
        onRemoveClick: handleEntryRemove
      }
    );

    const removeButton = failedButtons.last();
    removeButton.simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith(
      {
        id: '3234',
        type: 'failed',
        description1: 'Failed Description 1 Goes Here',
        description2: 'Failed Description 2 Goes Here',
        test: 'something esle',
        bla: 123,
        onActionClick: handleEntryAction,
        onRemoveClick: handleEntryRemove
      }
    );
  });

  it('complete entry should trigger remove callback', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '4234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(1);
    actionButtons.first().simulate('click');
    expect(handleEntryRemove).toHaveBeenCalledWith(
      {
        id: '4234',
        type: 'complete',
        description1: 'Big Description Goes Here',
        description2: 'Small Description Goes Here',
        onRemoveClick: handleEntryRemove
      }
    );
  });

  it('Preparing entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '5234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(0);
  });

  it('Processing entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '6234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(0);
  });

  it('Failed entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '7234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(0);
  });

  it('complete entry without callback shouldnt have any buttons', () => {
    const entry = notificationList.findWhere(entry => entry.key() === '8234');
    expect(entry).toHaveLength(1);
    const actionButtons = entry.find(IconButton);
    expect(actionButtons).toHaveLength(0);
  });
});

