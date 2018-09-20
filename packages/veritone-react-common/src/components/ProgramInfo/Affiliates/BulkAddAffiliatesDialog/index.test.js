import React from 'react';
import { mount, shallow } from 'enzyme';
import BulkAddAffiliateDialog from './index';

describe('Bulk Add Affiliate', () => {

  const CSV_CONTENT =
    `STATION,SCHEDULE,CLEARANCE,CLEARPCT
    HEADER,Origin:PRN.LA Code:Q218RSD Name:"Rush Limbaugh Weekday"
    A-FM,MF12M5:30A+SAT12M6A+SUN12M5A/1,BunchOfData,MoreData
    B-FM,SAT6A10A/1
    C-FM,MFSA12M6A+SUN12M5A/1
    D-FM,AMS12M6A/1
    E-FM,SS9P5A/1
    F-FM,SUN10P3A/1
    G-FM,MF10A12N+MF1P2P/1
    H-FM,MF10A12N/1
    I-FM,MF12N3P/1
    J-FM,"Th2P4P,Su10A12P"`;

  it('should render dialog', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const onClose = jest.fn();
    const wrapper = mount(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
        onClose={onClose}
      />
    );
    expect(wrapper.find('.dialogTitle').text()).toEqual('Bulk Add Affiliates');
    wrapper
      .find('.dialogTitle')
      .find('button')
      .simulate('click');
    expect(onClose.mock.calls.length).toBe(1);
    expect(wrapper.find('.bulkAddHelperText').text()).toEqual(
      'Use the provided template to bulk add affiliates.'
    );
    expect(wrapper.find('.actionButtons').find('button')).toHaveLength(1);
    expect(
      wrapper
        .find('.actionButtons')
        .find('button')
        .at(0)
        .find('.actionButtonLabel')
        .text()
    ).toEqual('Browse To Upload');
  });

  xit('should parse schedules from CSV', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    dialogInstance.csvToAffiliateSchedules(CSV_CONTENT);
  });

  it('should return errors on parse schedules from CSV', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    let actualResult;
    let expectedResult;

    const epmtyCsvContentWithHeader =
      `STATION,SCHEDULE,CLEARANCE,CLEARPCT
      HEADER,Origin:PRN.LA Code:Q218RSD Name:"Rush Limbaugh Weekday"
      NoSchedule-FM,`;

    actualResult = dialogInstance.csvToAffiliateSchedules(epmtyCsvContentWithHeader);
    expectedResult = {
      errors: ['Empty schedule was specified. Ignoring affiliate: NoSchedule-FM'],
      scheduleByLowerCaseName: {}
    };
    expect(actualResult).toEqual(expectedResult);

  });

  it('should not fail on empty CSV', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    let actualResult;
    let expectedResult;

    const epmtyCsvContentWithHeader =
      `STATION,SCHEDULE,CLEARANCE,CLEARPCT
      HEADER,Origin:PRN.LA Code:Q218RSD Name:"Rush Limbaugh Weekday"`;

    actualResult = dialogInstance.csvToAffiliateSchedules(epmtyCsvContentWithHeader);
    expectedResult = {
      errors: [],
      scheduleByLowerCaseName: {}
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.csvToAffiliateSchedules('');
    expectedResult = {
      errors: [],
      scheduleByLowerCaseName: {}
    };
    expect(actualResult).toEqual(expectedResult);
  });

  xit('should parse schedule parts to days and times', () => {
    // test schedulePartsToDaysAndTimes
  });

  xit('should return errors on parse schedule parts to days and times', () => {
    // test schedulePartsToDaysAndTimes
    // Daytime Format Not Supported
    // Unable to parse time:
    // Start and end times not found
  });

  it('should parse time for start and end time', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    let actualResult;
    let expectedResult;

    actualResult = dialogInstance.parseTime('12M', '6P');
    expectedResult = {
      startHours: 0,
      startMinutes: 0,
      endHours: 18,
      endMinutes: 0
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('6:30P', '12:00M');
    expectedResult = {
      startHours: 18,
      startMinutes: 30,
      endHours: 0,
      endMinutes: 0
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('9P', '5A');
    expectedResult = {
      startHours: 21,
      startMinutes: 0,
      endHours: 5,
      endMinutes: 0
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('9:00A', '5:30P');
    expectedResult = {
      startHours: 9,
      startMinutes: 0,
      endHours: 17,
      endMinutes: 30
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('10A', '12N');
    expectedResult = {
      startHours: 10,
      startMinutes: 0,
      endHours: 12,
      endMinutes: 0
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('12N:00', '10A:30');
    expectedResult = {
      startHours: 12,
      startMinutes: 0,
      endHours: 10,
      endMinutes: 30
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('12N:00', '12M:30');
    expectedResult = {
      startHours: 12,
      startMinutes: 0,
      endHours: 0,
      endMinutes: 30
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseTime('12M', '12N');
    expectedResult = {
      startHours: 0,
      startMinutes: 0,
      endHours: 12,
      endMinutes: 0
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it('should parse hours and minutes from time string', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    let actualResult;
    let expectedResult;

    actualResult = dialogInstance.parseHoursAndMinutes('12M');
    expectedResult = {
      hours: 0,
      minutes: 0,
      period: 'AM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('12:00M');
    expectedResult = {
      hours: 0,
      minutes: 0,
      period: 'AM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('12:30M');
    expectedResult = {
      hours: 0,
      minutes: 30,
      period: 'AM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('6P');
    expectedResult = {
      hours: 6,
      minutes: 0,
      period: 'PM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('6:00P');
    expectedResult = {
      hours: 6,
      minutes: 0,
      period: 'PM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('6:30P');
    expectedResult = {
      hours: 6,
      minutes: 30,
      period: 'PM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('5A');
    expectedResult = {
      hours: 5,
      minutes: 0,
      period: 'AM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('5:00A');
    expectedResult = {
      hours: 5,
      minutes: 0,
      period: 'AM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('5:30A');
    expectedResult = {
      hours: 5,
      minutes: 30,
      period: 'AM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('12N');
    expectedResult = {
      hours: 12,
      minutes: 0,
      period: 'PM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('12:00N');
    expectedResult = {
      hours: 12,
      minutes: 0,
      period: 'PM'
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.parseHoursAndMinutes('12:30N');
    expectedResult = {
      hours: 12,
      minutes: 30,
      period: 'PM'
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it('should convert days and times to days schedule', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    const daysAndTimes = [
      {
        days: 'F',
        startTime: '12N',
        endTime: '3P'
      },
      {
        days: 'SU',
        startTime: '9P',
        endTime: '5:30A'
      }
    ];
    const actualResult = dialogInstance.daysAndTimesToDaysSchedule(daysAndTimes);
    const expectedResult = {
      errors: [],
      schedule: {
        Friday: [ { start: '12:00', end: '15:00' } ],
        Sunday: [ { start: '21:00', end: '05:30' } ]
      }
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it('should return errors on convert days and times to days schedule', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    const daysAndTimes = [
      {
        days: 'SL',
        startTime: '12N',
        endTime: '3P'
      },
      {
        days: 'SU',
        startTime: '9P',
        endTime: '5:30A'
      }
    ];
    const actualResult = dialogInstance.daysAndTimesToDaysSchedule(daysAndTimes);
    const expectedResult = {
      errors: ['Unable to parse days from the following string: SL'],
      schedule: {
        Sunday: [ { start: '21:00', end: '05:30' } ]
      }
    };
    expect(actualResult).toEqual(expectedResult);
  });
});
