import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { keys, values } from 'lodash';
import { func } from 'prop-types';
import FilePicker from 'components/FilePicker';
import styles from './styles.scss';

export default class BulkAddAffiliatesDialog extends Component {
  static propTypes = {
    loadAllAffiliates: func.isRequired,
    onAdd: func.isRequired,
    onClose: func
  };

  state = {
    selectingFile: false
  };

  openFilePicker = () => {
    this.setState({
      selectingFile: true
    });
  };

  handleBulkAddAffiliates = (scheduleByLowerCaseName, errors) => {
    const affiliateNames = keys(scheduleByLowerCaseName);
    if (!affiliateNames.length) {
      return;
    }
    this.props.loadAllAffiliates(affiliateNames).then(affiliateById => {
      const result = [];
      values(affiliateById).forEach(affiliate => {
        const affiliateName = affiliate.name.toLowerCase();
        if (scheduleByLowerCaseName[affiliateName]) {
          const resultAffiliate = {
            ...affiliate,
            schedule: {
              ...scheduleByLowerCaseName[affiliateName]
            }
          };
          keys(resultAffiliate.schedule.weekly).forEach(day => {
            resultAffiliate.schedule.weekly[day].forEach(dayTimeRange => dayTimeRange.timeZone = affiliate.timeZone);
          });
          result.push(resultAffiliate);
        }
      });

      const addedCount = result.length;
      const ignoredCount = affiliateNames.length - result.length;
      const totalCount = affiliateNames.length;

      console.log('Added count', addedCount);
      console.log('Ignored count', ignoredCount);
      console.log('Total count', totalCount);

      console.log('Total count', result);

      // TODO: show processing progress bar
      // TODO: report added affiliates count
      // TODO: report ignored affiliates count
      // TODO: report errors found

      // this.props.onAdd(result);
      return null;
    });
  };

  csvToAffiliateSchedules = csvContent => {
    const scheduleByLowerCaseAffiliateName = {};
    const errors = [];
    const allCsvRows = csvContent.split(/\r\n|\n/);
    allCsvRows.forEach(csvRowString => {
      const csvRow = csvRowString.trim();
      if (!csvRow.length) {
        return;
      }

      const nameCellEndIndex = csvRow.indexOf(',');
      if (!nameCellEndIndex) {
        return;
      }

      const affiliateName = csvRow.substring(0, nameCellEndIndex).trim();
      const affiliateNameLowerCase = affiliateName.toLowerCase();
      if (affiliateNameLowerCase === 'station' || affiliateNameLowerCase === 'header') {
        // skip headers
        return;
      }

      let scheduleCellEndIndex;
      if (csvRow.charAt(nameCellEndIndex + 1) === '"') {
        // handle case: AffiliateName-FM,"Th2P4P,Su10A12P",bunchOfOtherData
        scheduleCellEndIndex = csvRow.indexOf('"', nameCellEndIndex + 2);
      } else if (nameCellEndIndex !== csvRow.length - 1) {
        scheduleCellEndIndex = csvRow.indexOf(',', nameCellEndIndex + 1);
      }
      if (!scheduleCellEndIndex) {
        scheduleCellEndIndex = csvRow.length;
      }

      const scheduleString =
        csvRow.substring(nameCellEndIndex + 1, scheduleCellEndIndex)
          .trim()
          .replace('"', '')
          .replace(',', '+');
      if (!scheduleString.length) {
        errors.push(`Empty schedule was specified. Ignoring affiliate: ${affiliateName}`);
        return;
      }

      const scheduleDaysAndTimes = this.schedulePartsToDaysAndTimes(scheduleString.split('/'));
      scheduleDaysAndTimes.errors.forEach(error => errors.push(error));
      if (!scheduleDaysAndTimes.daysAndTimes.length) {
        return;
      }

      const daysScheduleToApply = this.daysAndTimesToDaysSchedule(scheduleDaysAndTimes.daysAndTimes);
      daysScheduleToApply.errors.forEach(error => errors.push(error));
      if (!keys(daysScheduleToApply.schedule)) {
        return;
      }

      if (!scheduleByLowerCaseAffiliateName[affiliateNameLowerCase]) {
        scheduleByLowerCaseAffiliateName[affiliateNameLowerCase] = {
          scheduleType: 'Recurring',
          start: new Date().toISOString(),
          repeatEvery: {
            number: '1',
            period: 'week'
          },
          weekly: {
            selectedDays: {}
          }
        };
      }
      this.mergeDaysSchedule(scheduleByLowerCaseAffiliateName[affiliateNameLowerCase], daysScheduleToApply.schedule);
    });

    return {
      scheduleByLowerCaseName: scheduleByLowerCaseAffiliateName,
      errors
    };
  };

  schedulePartsToDaysAndTimes = scheduleParts => {
    const errors = [];
    const daysAndTimes = [];
    const dayTimeSplittingRegex = /([a-zA-Z- ]+)([0-9]+[0-9aApPmMnN -]+)/g;
    const timeSplittingRegex = /([0-9:]{1,5}[aApPmMnN]{0,2})([ -]{0,1})([0-9:]{1,5}[aApPmMnN]{1,2})/g;
    scheduleParts.forEach(schedulePart => {
      const dayTimeResultingParts = dayTimeSplittingRegex.exec(schedulePart.trim());
      if (dayTimeResultingParts === null) {
        errors.push(`Daytime Format Not Supported: ${schedulePart}`);
        return;
      }
      const days = dayTimeResultingParts[1].trim();
      const time = dayTimeResultingParts[2].trim();
      const timeSplittingResultingParts = timeSplittingRegex.exec(time);
      if (timeSplittingResultingParts === null) {
        errors.push(`Unable to parse time: ${time}`);
        return;
      }
      const times = [];
      timeSplittingResultingParts.forEach(match => {
        if (match && match !== ' ' && match !== '-') {
          times.push(match.trim());
        }
      });
      if (times.length <= 2) {
        errors.push(`Start and end times not found: ${time}`);
        return;
      }
      daysAndTimes.push({
        days,
        startTime: times[1].trim(),
        endTime: times[2].trim()
      });
    });
    return {
      errors,
      daysAndTimes
    }
  };

  daysAndTimesToDaysSchedule = daysAndTimes => {
    const errors = [];
    const schedule = {};
    daysAndTimes.forEach(daysAndTimesItem => {
      const days = this.parseDays(daysAndTimesItem.days);
      if (!days || days.length === 0) {
        errors.push(`Unable to parse days from the following string: ${daysAndTimesItem.days}`);
        return;
      }
      const time = this.parseTime(daysAndTimesItem.startTime, daysAndTimesItem.endTime);
      const formattedStartTime = this.formatTime(time.startHours, time.startMinutes);
      const formattedEndTime = this.formatTime(time.endHours, time.endMinutes);
      days.forEach(day => {
        if (schedule[day] && schedule[day].some(item => item.start === formattedStartTime && item.end === formattedEndTime)) {
          return;
        }
        if (!schedule[day]) {
          schedule[day] = [];
        }
        schedule[day].push({
          start: formattedStartTime,
          end: formattedEndTime
        });
      });
    });
    return {
      errors,
      schedule
    }
  };

  parseDays = rawDays => {
    switch(rawDays.toUpperCase()) {
      case 'F':
      case 'FRI':
        return ['Friday'];
      case 'M':
      case 'MON':
        return ['Monday'];
      case 'M-SU':
      case 'MSU':
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      case 'M-SA':
      case 'MSA':
        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      case 'MF':
        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      case 'MTH':
        return ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
      case 'SA':
      case 'SAT':
        return ['Saturday'];
      case 'SS':
        return ['Sunday', 'Saturday'];
      case 'SU':
      case 'SUN':
        return ['Sunday'];
      case 'TUF':
        return ['Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      case 'TUSA':
      case 'TU-SA':
        return ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      case 'TU':
        return ['Tuesday'];
      case 'WED':
        return ['Wednesday'];
      case 'TH':
      case 'THU':
        return ['Thursday'];
      default:
        return [];
    }
  };

  parseTime = (rawStartTime, rawEndTime) => {
    const endTime = this.parseHoursAndMinutes(rawEndTime);
    const startTime = this.parseHoursAndMinutes(rawStartTime);
    // Handle when the period of the endTime also applies to the context of the startTime
    // ex. 1-5PM --> 1PM - 5PM
    if (startTime.period === '') {
      if (endTime.period === 'PM' && startTime.hours < 12) {
        startTime.period = 'PM';
      }
    }
    // Convert to 24-hour format
    let startHours = startTime.hours;
    const startMinutes = startTime.minutes;
    if (startTime.period === 'PM' && startTime.hours < 12) {
      startHours += 12;
    }
    let endHours = endTime.hours;
    const endMinutes = endTime.minutes;
    if (endTime.period === 'PM' && endTime.hours < 12) {
      endHours += 12;
    }
    return {
      startHours: startHours,
      startMinutes: startMinutes,
      endHours: endHours,
      endMinutes: endMinutes
    };
  };

  parseHoursAndMinutes = rawTime => {
    let hours, minutes, period;
    let rawPeriod = '';

    const periodRegex = /[aApPmMnN]{1,2}/;
    const periodRegexResults = periodRegex.exec(rawTime);
    if (periodRegexResults !== null) {
      rawPeriod = periodRegexResults[0];
    }

    // Parse minutes, if exists
    const timeTokens = rawTime.split(':');
    if (timeTokens.length > 1) {
      const rawMinutes = timeTokens[1].replace(rawPeriod, '').trim();
      minutes = parseInt(rawMinutes, 10);
      hours = parseInt(timeTokens[0], 10);
    } else {
      minutes = 0;
      const rawHours = timeTokens[0].replace(rawPeriod, '').trim();
      hours = parseInt(rawHours, 10);
    }
    // Standardize the period used (AM/PM/'')
    if (!rawPeriod) {
      period = '';
    } else {
      switch(rawPeriod.toUpperCase().trim()) {
        case 'M':
          hours = 0;
          period = 'AM';
          break;
        case 'A':
          period = 'AM';
          break;
        case 'AM':
          period = 'AM';
          break;
        case 'N':
          hours = 12;
          period = 'PM';
          break;
        case 'P':
          period = 'PM';
          break;
        case 'PM':
          period = 'PM';
          break;
        default:
          period = '';
          break;
      }
    }
    return {
      hours: hours,
      minutes: minutes,
      period: period
    };
  };

  formatTime = (hours, minutes) => {
    let formattedHour;
    if (hours < 10) {
      formattedHour = '0' + hours;
    } else {
      formattedHour = '' + hours;
    }
    let formattedMinutes;
    if (minutes < 10) {
      formattedMinutes = '0' + minutes;
    } else {
      formattedMinutes = '' + minutes;
    }
    return `${formattedHour}:${formattedMinutes}`;
  };

  mergeDaysSchedule = (schedule, daysSchedule) => {
    keys(daysSchedule).forEach(day => {
      if (schedule.weekly[day] && schedule[day].some(item => item.start === daysSchedule[day].start && item.end === daysSchedule[day].end)) {
        return;
      }
      if (!schedule.weekly[day]) {
        schedule[day] = [];
      }
      schedule.weekly[day].push({
        start: daysSchedule[day].start,
        end: daysSchedule[day].end
      });
      schedule.weekly.selectedDays[day] = true;
    });
    return schedule;
  };

  handleFilesSelected = files => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.setState({
        selectingFile: false
      });
      const affiliateSchedulesResult = this.csvToAffiliateSchedules(
        fileReader.result
      );
      this.handleBulkAddAffiliates(affiliateSchedulesResult.scheduleByLowerCaseName, affiliateSchedulesResult.errors);
    };
    fileReader.readAsText(files[0]);
  };

  handleCloseFilePicker = () => {
    this.setState({
      selectingFile: false
    });
  };

  render() {
    const { onClose } = this.props;

    // TODO OLES: use when schedule parsing and merge is implemented
    //eslint-disable-next-line no-unused-vars
    const { onAdd } = this.props;

    return (
      <Dialog
        open
        onClose={onClose}
        disableBackdropClick
        aria-labelledby="bulk-add-affiliates-dialog"
        classes={{
          paper: styles.bulkAddAffiliatesDialogPaper
        }}
      >
        {this.state.selectingFile && (
          <FilePicker
            accept="text/csv"
            allowUrlUpload={false}
            onRequestClose={this.handleCloseFilePicker}
            onPickFiles={this.handleFilesSelected}
            width={640}
            height={482}
          />
        )}
        {!this.state.selectingFile && (
          <Fragment>
            <DialogTitle
              classes={{
                root: styles.dialogTitle
              }}
            >
              <div>Bulk Add Affiliates</div>
              <IconButton onClick={onClose} aria-label="Close">
                <Icon className="icon-close-exit" />
              </IconButton>
            </DialogTitle>
            <DialogContent
              classes={{
                root: styles.dialogContent
              }}
            >
              <div className={styles.bulkAddHelperText}>
                Use the provided template to bulk add affiliates.
              </div>
            </DialogContent>
            <DialogActions
              classes={{
                root: styles.actionButtons,
                action: styles.actionButton
              }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={this.openFilePicker}
                classes={{
                  label: styles.actionButtonLabel
                }}
              >
                <Icon className="icon-cloud_upload" />
                Browse To Upload
              </Button>
            </DialogActions>
          </Fragment>
        )}
      </Dialog>
    );
  }
}
