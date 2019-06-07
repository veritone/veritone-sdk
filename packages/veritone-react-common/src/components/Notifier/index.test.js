import React from 'react';
import { mount } from 'enzyme';
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
      type: 'completed',
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
      type: 'completed',
      description1: 'completed Description 1',
      description2: 'completed Description 2'
    }
  ]
};

describe('Notifier Component', () => {
  const notifier = mount(
    <Notifier {...mockNotifications} />
  );

  it('should display notification number', () => {
    expect(notifier.text()).toEqual(mockNotifications.notifications.length.toString());
  });
/*
  const notifierButtons = notifier.find('IconButton');
  it('shoudl have notifier icon button', () => {
    expect(notifierButtons).toHaveLength(1);
  });

  notifierButtons.first().simulate('click');
  expect(handleOpen).toHaveBeenCalledWith();
  */
});
