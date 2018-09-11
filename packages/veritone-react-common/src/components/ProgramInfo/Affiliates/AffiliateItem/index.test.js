import React from 'react';
import { mount } from 'enzyme';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import AffiliateItem from './index';

describe('Bulk Add Affiliate', () => {
  const TEST_AFFILIATE = {
    id: 'stationId',
    name: 'Affiliate Station 1',
    timeZone: 'US/Eastern',
    schedule: {
      scheduleType: 'Recurring',
      start: '2018-04-14T19:48:25.147Z',
      end: '2018-04-17T19:48:25.147Z',
      repeatEvery: {
        number: '1',
        period: 'week'
      },
      weekly: {
        Thursday: [
          {
            start: '12:33',
            end: '03:21',
            timeZone: 'US/Eastern'
          },
          {
            start: '01:00',
            end: '01:00',
            timeZone: 'US/Eastern'
          }
        ],
        selectedDays: {
          Thursday: true
        }
      }
    }
  };

  it('should render affiliate item', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const wrapper = mount(
      <AffiliateItem
        affiliate={TEST_AFFILIATE}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(
      wrapper
        .find('.title')
        .find('.name')
        .text()
    ).toEqual('Affiliate Station 1');
    expect(wrapper.find('.title').find(IconButton)).toHaveLength(2);
    expect(wrapper.find('.title').find(DeleteIcon)).toHaveLength(1);
    expect(wrapper.find('.title').find(EditIcon)).toHaveLength(1);
    expect(wrapper.find('.schedule').text()).toEqual(
      'T 12:33-03:21 01:00-01:00'
    );
    wrapper
      .find('.title')
      .find(DeleteIcon)
      .simulate('click');
    expect(onDelete.mock.calls.length).toBe(1);
    wrapper
      .find('.title')
      .find(EditIcon)
      .simulate('click');
    expect(onEdit.mock.calls.length).toBe(1);
  });

  it('should render read only affiliate item', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const wrapper = mount(
      <AffiliateItem
        affiliate={TEST_AFFILIATE}
        readOnly
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
    expect(wrapper.find('.title').find(IconButton)).toHaveLength(0);
  });

  it('should not render delete button', () => {
    const onEdit = jest.fn();
    const wrapper = mount(
      <AffiliateItem affiliate={TEST_AFFILIATE} onEdit={onEdit} />
    );
    expect(wrapper.find('.title').find(IconButton)).toHaveLength(1);
    expect(wrapper.find('.title').find(DeleteIcon)).toHaveLength(0);
    expect(wrapper.find('.title').find(EditIcon)).toHaveLength(1);
    wrapper
      .find('.title')
      .find(EditIcon)
      .simulate('click');
    expect(onEdit.mock.calls.length).toBe(1);
  });

  it('should not render edit button', () => {
    const onDelete = jest.fn();
    const wrapper = mount(
      <AffiliateItem affiliate={TEST_AFFILIATE} onDelete={onDelete} />
    );
    expect(wrapper.find('.title').find(IconButton)).toHaveLength(1);
    expect(wrapper.find('.title').find(DeleteIcon)).toHaveLength(1);
    expect(wrapper.find('.title').find(EditIcon)).toHaveLength(0);
    wrapper
      .find('.title')
      .find(DeleteIcon)
      .simulate('click');
    expect(onDelete.mock.calls.length).toBe(1);
  });
});
