import React from 'react';
import { mount, shallow } from 'enzyme';
import BulkAddAffiliateDialog from './index';

describe('Bulk Add Affiliate', () => {
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

  it('should parse schedules from CSV', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();

    const CSV_CONTENT = `STATION,SCHEDULE,CLEARANCE,CLEARPCT\r\n
      HEADER,Origin:PRN.LA Code:Q218RSD Name:"Rush Limbaugh Weekday"\r\n
      A-FM,MF12M5:30A+SAT12M6A+SUN12M5A/1,BunchOfData,MoreData\r\n
      B-FM,SAT6A10A/1\r\n
      C-FM,"Th2P4P,Su10A12P"`;
    const actualResult = dialogInstance.csvToAffiliateSchedules(CSV_CONTENT);
    const expectedResult = {
      errors: [],
      scheduleByLowerCaseName: {
        'a-fm': {
          repeatEvery: {
            number: '1',
            period: 'week'
          },
          scheduleType: 'Recurring',
          weekly: {
            Friday: [
              {
                end: '05:30',
                start: '00:00'
              }
            ],
            Monday: [
              {
                end: '05:30',
                start: '00:00'
              }
            ],
            Saturday: [
              {
                end: '06:00',
                start: '00:00'
              }
            ],
            Sunday: [
              {
                end: '05:00',
                start: '00:00'
              }
            ],
            Thursday: [
              {
                end: '05:30',
                start: '00:00'
              }
            ],
            Tuesday: [
              {
                end: '05:30',
                start: '00:00'
              }
            ],
            Wednesday: [
              {
                end: '05:30',
                start: '00:00'
              }
            ],
            selectedDays: {
              Friday: true,
              Monday: true,
              Saturday: true,
              Sunday: true,
              Thursday: true,
              Tuesday: true,
              Wednesday: true
            }
          }
        },
        'b-fm': {
          repeatEvery: {
            number: '1',
            period: 'week'
          },
          scheduleType: 'Recurring',
          weekly: {
            Saturday: [
              {
                end: '10:00',
                start: '06:00'
              }
            ],
            selectedDays: {
              Saturday: true
            }
          }
        },
        'c-fm': {
          repeatEvery: {
            number: '1',
            period: 'week'
          },
          scheduleType: 'Recurring',
          weekly: {
            Sunday: [
              {
                end: '12:00',
                start: '10:00'
              }
            ],
            Thursday: [
              {
                end: '16:00',
                start: '14:00'
              }
            ],
            selectedDays: {
              Sunday: true,
              Thursday: true
            }
          }
        }
      }
    };
    expect(actualResult.scheduleByLowerCaseName['a-fm'].start).toBeDefined();
    expect(actualResult.scheduleByLowerCaseName['b-fm'].start).toBeDefined();
    expect(actualResult.scheduleByLowerCaseName['c-fm'].start).toBeDefined();
    delete actualResult.scheduleByLowerCaseName['a-fm'].start;
    delete actualResult.scheduleByLowerCaseName['b-fm'].start;
    delete actualResult.scheduleByLowerCaseName['c-fm'].start;
    expect(actualResult).toEqual(expectedResult);
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

    const epmtyCsvContentWithHeader = `STATION,SCHEDULE,CLEARANCE,CLEARPCT
      HEADER,Origin:PRN.LA Code:Q218RSD Name:"Rush Limbaugh Weekday"
      NoSchedule-FM,`;

    actualResult = dialogInstance.csvToAffiliateSchedules(
      epmtyCsvContentWithHeader
    );
    expectedResult = {
      errors: [
        'Empty schedule was specified. Ignoring affiliate: NoSchedule-FM'
      ],
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

    const emptyCsvContentWithHeader = `STATION,SCHEDULE,CLEARANCE,CLEARPCT
      HEADER,Origin:PRN.LA Code:Q218RSD Name:"Rush Limbaugh Weekday"`;

    actualResult = dialogInstance.csvToAffiliateSchedules(
      emptyCsvContentWithHeader
    );
    expectedResult = {
      errors: [],
      scheduleByLowerCaseName: {}
    };
    expect(actualResult).toEqual(expectedResult);

    const blankCsv = '';
    actualResult = dialogInstance.csvToAffiliateSchedules(blankCsv);
    expectedResult = {
      errors: [],
      scheduleByLowerCaseName: {}
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it('should parse schedule parts to days and times', () => {
    const loadAllAffiliates = jest.fn();
    const onAdd = jest.fn();
    const dialogInstance = shallow(
      <BulkAddAffiliateDialog
        loadAllAffiliates={loadAllAffiliates}
        onAdd={onAdd}
      />
    ).instance();
    const actualResult = dialogInstance.schedulePartsToDaysAndTimes([
      'MF12:30M5:30A',
      'SS9P5A',
      'SUN12M5A'
    ]);
    const expectedResult = {
      errors: [],
      daysAndTimes: [
        {
          days: 'MF',
          startTime: '12:30M',
          endTime: '5:30A'
        },
        {
          days: 'SS',
          startTime: '9P',
          endTime: '5A'
        },
        {
          days: 'SUN',
          startTime: '12M',
          endTime: '5A'
        }
      ]
    };
    expect(actualResult).toEqual(expectedResult);
  });

  it('should return errors on parse schedule parts to days and times', () => {
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

    actualResult = dialogInstance.schedulePartsToDaysAndTimes([
      '1stMonday12M5A'
    ]);
    expectedResult = {
      errors: ['Daytime Format Not Supported: 1stMonday12M5A'],
      daysAndTimes: []
    };
    expect(actualResult).toEqual(expectedResult);

    actualResult = dialogInstance.schedulePartsToDaysAndTimes(['M1A5L']);
    expectedResult = {
      errors: ['Unable to parse time: 1A5'],
      daysAndTimes: []
    };
    expect(actualResult).toEqual(expectedResult);
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
    const actualResult = dialogInstance.daysAndTimesToDaysSchedule(
      daysAndTimes
    );
    const expectedResult = {
      errors: [],
      schedule: {
        Friday: [{ start: '12:00', end: '15:00' }],
        Sunday: [{ start: '21:00', end: '05:30' }]
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
      }
    ];
    const actualResult = dialogInstance.daysAndTimesToDaysSchedule(
      daysAndTimes
    );
    const expectedResult = {
      errors: ['Unable to parse days from the following string: SL'],
      schedule: {}
    };
    expect(actualResult).toEqual(expectedResult);
  });
});
