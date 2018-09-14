import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { get } from 'lodash';
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

  handleBulkAddAffiliates = scheduleByLowerCaseAffiliateName => {
    this.props.loadAllAffiliates().then(affiliates => {
      const result = [];
      affiliates.forEach(affiliate => {
        const affiliateName = affiliate.name.toLowerCase();
        if (scheduleByLowerCaseAffiliateName[affiliateName]) {
          result.push({
            ...affiliate,
            schedule: {
              ...scheduleByLowerCaseAffiliateName[affiliateName]
            }
          });
        }
      });

      // TODO: show processing progress bar
      // TODO: report added affiliates count
      // TODO: report ignored affiliates count

      // this.props.onAdd(result);
      return null;
    });
  };

  csvToAffiliateSchedulesMap = csvContent => {
    /* TODO: handle usecases like
      W/ W/o CSV header:
      KXIA-FM,MF12M5:30A+SAT12M6A+SUN12M5A/1
      KBFM-FM,SAT6A10A/1
      MFSA12M6A+SUN12M5A/1
      MS12M6A/1
      SS9P5A/1
      SUN10P3A/1
      MF10A12N+MF1P2P/1
      MF10A12N/1
      MF12N3P/1
      "Th2P4P,Su10A12P"
     */
    const scheduleByLowerCaseAffiliateName = {};
    const allLines = csvContent.split(/\r\n|\n/);
    allLines.forEach(csvLine => {
      const line = csvLine.replace('"', '');
      const affiliateData = line.split(',');
      if (
        affiliateData.length < 2 ||
        !get(affiliateData[0], length) ||
        !get(affiliateData[1], length)
      ) {
        return;
      }
      const affiliateNameLowerCase = affiliateData[0].toLowerCase();
      let schedule;
      if (scheduleByLowerCaseAffiliateName[affiliateNameLowerCase]) {
        schedule = scheduleByLowerCaseAffiliateName[affiliateNameLowerCase];
      } else {
        schedule = {
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

      for (let i = 1; i < affiliateData.length; i++) {
        const daySchedule = this.parseDaySchedule(affiliateData[1]);
        if (
          !get(daySchedule, 'day.length') ||
          !get(daySchedule, 'hours.start.length') ||
          !get(daySchedule, 'hours.end.length')
        ) {
          continue;
        }
        if (!schedule.weekly[daySchedule.day]) {
          schedule.weekly[daySchedule.day] = [];
        }
        if (
          schedule.weekly[daySchedule.day].some(
            hours =>
              hours.start === daySchedule.hours.start &&
              hours.end === daySchedule.hours.end
          )
        ) {
          continue;
        }
        schedule.weekly[daySchedule.day].push(daySchedule.hours);
        schedule.weekly.selectedDays[daySchedule.day] = true;
        scheduleByLowerCaseAffiliateName[affiliateNameLowerCase] = schedule;
      }
    });
    return scheduleByLowerCaseAffiliateName;
  };

  parseDaySchedule = dayScheduleString => {
    // TODO: implement per day(s) schedule parsing
    return {
      day: 'Monday',
      hours: {
        start: '10:00',
        end: '11:00'
      }
    };
  };

  handleFilesSelected = files => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.setState({
        selectingFile: false
      });
      const scheduleByAffiliateName = this.csvToAffiliateSchedulesMap(
        fileReader.result
      );
      this.handleBulkAddAffiliates(scheduleByAffiliateName);
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
