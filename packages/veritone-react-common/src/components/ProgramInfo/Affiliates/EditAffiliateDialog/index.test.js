import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { combineReducers, createStore } from 'redux';
import EditAffiliateDialog from './index';

describe('Edit Affiliate', () => {
  const store = createStore(
    combineReducers({
      form: formReducer
    })
  );

  it('should render dialog', () => {
    const onSave = jest.fn();
    const onDelete = jest.fn();
    const onClose = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <EditAffiliateDialog
          affiliate={{
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
                Wednesday: [
                  {
                    start: '16:33',
                    end: '17:21',
                    timeZone: 'US/Eastern'
                  }
                ],
                selectedDays: {
                  Wednesday: true
                }
              }
            }
          }}
          onSave={onSave}
          onDelete={onDelete}
          onClose={onClose}
        />
      </Provider>
    );
    expect(wrapper.find('.dialogTitle').text()).toEqual('Affiliate Station 1');
    expect(wrapper.find('.scheduleDateFieldSection')).toHaveLength(2);
    expect(
      wrapper
        .find('.scheduleDateFieldSection')
        .at(0)
        .find('input')
        .instance().value
    ).toEqual('2018-04-14');
    expect(
      wrapper
        .find('.scheduleDateFieldSection')
        .at(1)
        .find('input')
        .instance().value
    ).toEqual('2018-04-17');
    expect(wrapper.find('.timeRangeContainer')).toHaveLength(7);

    const wednesdayScheduleElement = wrapper.find('.timeRangeContainer').at(2);
    expect(wednesdayScheduleElement.find('label').text()).toEqual('Wednesday');
    expect(
      wednesdayScheduleElement
        .find('label')
        .find({ type: 'checkbox' })
        .at(0)
        .props().checked
    ).toEqual(true);
    const multiTimeRange = wednesdayScheduleElement.find('.multiTimeRange');
    expect(
      multiTimeRange
        .find('input')
        .at(0)
        .instance().value
    ).toEqual('16:33');
    expect(
      multiTimeRange
        .find('input')
        .at(1)
        .instance().value
    ).toEqual('US/Eastern');
    expect(
      multiTimeRange
        .find('input')
        .at(2)
        .instance().value
    ).toEqual('17:21');
    expect(
      multiTimeRange
        .find('input')
        .at(3)
        .instance().value
    ).toEqual('US/Eastern');

    wrapper
      .find('.dialogTitleActions')
      .find('button')
      .simulate('click');
    expect(onClose.mock.calls.length).toBe(1);
    expect(wrapper.find('.actionButtons').find('button')).toHaveLength(3);
    expect(
      wrapper
        .find('.actionButtons')
        .find('.deleteActionButton')
        .find('button')
    ).toHaveLength(1);
    wrapper
      .find('.actionButtons')
      .find('.deleteActionButton')
      .find('button')
      .simulate('click');
    expect(onDelete.mock.calls.length).toBe(1);
    wrapper
      .find('.actionButtons')
      .find('button')
      .at(1)
      .simulate('click');
    expect(onClose.mock.calls.length).toBe(2);
  });

  it('should not render delete button', () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <EditAffiliateDialog
          affiliate={{
            id: 'stationId',
            name: 'Affiliate Station 1',
            timeZone: 'US/Eastern'
          }}
          onSave={onSave}
          onClose={onClose}
        />
      </Provider>
    );
    expect(
      wrapper
        .find('.actionButtons')
        .find('.deleteActionButton')
        .find('button')
    ).toHaveLength(0);
    expect(wrapper.find('.actionButtons').find('button')).toHaveLength(2);
  });
});
