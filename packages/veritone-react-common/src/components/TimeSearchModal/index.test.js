import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { TimeSearchForm } from './';

describe('TimeSearchModal', () => {
  it('Should render with the set input time', () => {
    const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
    const fakeOnChange = jest.fn();
    const wrapper = mount(<TimeSearchForm inputValue={input} onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange} />);
    expect(wrapper.find(".dayPartStartTimeInput").first().props().value).toEqual('01:02');
    expect(wrapper.find(".dayPartEndTimeInput").first().props().value).toEqual('03:04');
    expect(wrapper.find(".stationBroadcastSwitch").find("input").instance().checked).toEqual(false);
    // expect(wrapper.find("button.timeSearchSubmit").instance().disabled).toEqual(false);
  });

  it('Should render with the set input time and station broadcast days', () => {
    const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: true, selectedDays: [false, false, true, true, true, true, true] };
    const fakeOnChange = jest.fn();
    const wrapper = mount(<TimeSearchForm inputValue={input}
      onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange}
      onStationBroadcastTimeChange={fakeOnChange} onDayOfWeekSelectionChange={fakeOnChange} />);
    expect(wrapper.find(".dayPartStartTimeInput").first().props().value).toEqual('01:02');
    expect(wrapper.find(".dayPartEndTimeInput").first().props().value).toEqual('03:04');
    const switcher = wrapper.find(".stationBroadcastSwitch").first();
    expect(switcher.props().checked).toEqual(true);
    const checkbox = wrapper.find('[data-test="dayOfWeekSelection"]').find(Checkbox);
    expect(checkbox.at(0).props().checked).toEqual(false);
    expect(checkbox.at(1).props().checked).toEqual(false);
    expect(checkbox.at(2).props().checked).toEqual(true);
    expect(checkbox.at(3).props().checked).toEqual(true);
    expect(checkbox.at(4).props().checked).toEqual(true);
    expect(checkbox.at(5).props().checked).toEqual(true);
    expect(checkbox.at(6).props().checked).toEqual(true);
    // expect(wrapper.find("button.timeSearchSubmit").instance().disabled).toEqual(false);
  });

  // it('Search button should be disabled for invalid time', () => {
  //   const input1 = { dayPartStartTime: '', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
  //   const fakeOnChange = jest.fn();
  //   const wrapper1 = mount(<TimeSearchForm inputValue={input1} onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange} />);
  //   expect(wrapper1.find("button.timeSearchSubmit").instance().disabled).toEqual(true);
  //   const input2 = { dayPartStartTime: '01:02', dayPartEndTime: '', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
  //   const wrapper2 = mount(<TimeSearchForm inputValue={input2} onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange} />);
  //   expect(wrapper2.find("button.timeSearchSubmit").instance().disabled).toEqual(true);
  // });

  // it('Search button should be disabled for station broadcast time and no selected days', () => {
  //   const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: true, selectedDays: [false, false, false, false, false, false, false] };
  //   const fakeOnChange = jest.fn();
  //   const wrapper = mount(<TimeSearchForm inputValue={input}
  //     onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange}
  //     onStationBroadcastTimeChange={fakeOnChange} onDayOfWeekSelectionChange={fakeOnChange} />);
  //   expect(wrapper.find("button.timeSearchSubmit").instance().disabled).toEqual(true);
  // });

  it('Expect onDayPartStartTimeChange to be called when start time is changed', () => {
    const onDayPartStartTimeChange = jest.fn();
    const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
    const wrapper = mount(<TimeSearchForm inputValue={input} onDayPartStartTimeChange={onDayPartStartTimeChange} onDayPartEndTimeChange={jest.fn()} />);
    wrapper.find(TextField).first().find("input").simulate('change', { target: { value: '02:02' } });
    expect(onDayPartStartTimeChange).toHaveBeenCalled();
  });

  it('Expect onDayPartEndTimeChange to be called when end time is changed', () => {
    const onDayPartEndTimeChange = jest.fn();
    const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
    const wrapper = mount(<TimeSearchForm inputValue={input} onDayPartStartTimeChange={jest.fn()} onDayPartEndTimeChange={onDayPartEndTimeChange} />);
    wrapper.find(TextField).at(1).find("input").simulate('change', { target: { value: '02:02' } });
    expect(onDayPartEndTimeChange).toHaveBeenCalled();
  });

  it('Expect onStationBroadcastTimeChange to be called when station broadcast time is changed', () => {
    const onStationBroadcastTimeChange = jest.fn();
    const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
    const fakeOnChange = jest.fn();
    const wrapper = mount(<TimeSearchForm inputValue={input}
      onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange}
      onStationBroadcastTimeChange={onStationBroadcastTimeChange} onDayOfWeekSelectionChange={fakeOnChange} />);
    wrapper.find(".stationBroadcastSwitch").find("input").simulate('change', { target: { checked: true } });
    expect(onStationBroadcastTimeChange).toHaveBeenCalled();
  });

  it('Expect onDayOfWeekSelectionChange to be called when day of week is selected', () => {
    const onDayOfWeekSelectionChange = jest.fn();
    const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: true, selectedDays: [true, true, true, true, true, true, true] };
    const fakeOnChange = jest.fn();
    const wrapper = mount(<TimeSearchForm inputValue={input}
      onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange}
      onStationBroadcastTimeChange={fakeOnChange} onDayOfWeekSelectionChange={onDayOfWeekSelectionChange} />);
    wrapper.find('[data-test="dayOfWeekSelection"]').find("input").at(0).simulate('change', { target: { checked: false } });
    expect(onDayOfWeekSelectionChange).toHaveBeenCalled();
  });

  // it('Expect cancel button to call cancel function', () => {
  //   const onCancel = jest.fn();
  //   const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
  //   const fakeOnChange = jest.fn();
  //   const wrapper = mount(<TimeSearchForm cancel={onCancel} inputValue={input} onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange} />);
  //   wrapper.find('button.timeSearchCancel').simulate('click');
  //   expect(onCancel).toHaveBeenCalled();
  // });

  // it('Except onSearch to be called when search button is pressed ', () => {
  //   const onSearch = jest.fn();
  //   const input = { dayPartStartTime: '01:02', dayPartEndTime: '03:04', stationBroadcastTime: false, selectedDays: [true, true, true, true, true, true, true] };
  //   const fakeOnChange = jest.fn();
  //   const wrapper = mount(<TimeSearchForm onSubmit={onSearch} inputValue={input} onDayPartStartTimeChange={fakeOnChange} onDayPartEndTimeChange={fakeOnChange} />);
  //   wrapper.find('button.timeSearchSubmit').simulate('click');
  //   expect(onSearch).toHaveBeenCalled();
  // });
});
