import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { func, string, shape, objectOf, bool } from 'prop-types';
import { get } from 'lodash';
import styles from './styles.scss';

export default class Affiliates extends React.Component {
  static propTypes = {
    affiliate: shape({
      id: string.isRequired,
      name: string.isRequired,
      schedule: shape({
        scheduleType: string,
        start: string,
        end: string,
        repeatEvery: shape({
          number: string,
          period: string
        }),
        weekly: shape({
          selectedDays: objectOf(bool)
        })
      }).isRequired
    }).isRequired,
    onEdit: func
  };

  getScheduleString = () => {
    let result = '';
    Object.keys(
      get(this.props.affiliate, 'schedule.weekly.selectedDays')
    ).forEach(key => {
      if (this.props.affiliate.schedule.weekly.selectedDays[key]) {
        if (result.length) {
          result += '; ';
        }
        result += key.substring(0, 1);
        this.props.affiliate.schedule.weekly[key].forEach(timeInterval => {
          result += ` ${timeInterval.start}-${timeInterval.end}`;
        });
      }
    });
    return result;
  };

  render() {
    const { affiliate, onEdit } = this.props;
    const schedulerString = this.getScheduleString();
    return (
      /* eslint-disable react/jsx-no-bind */
      <div className={styles.affiliateContainer}>
        <div className={styles.title}>
          <div className={styles.name}>{affiliate.name}</div>
          {onEdit && (
            <IconButton
              aria-label="Edit"
              onClick={() => onEdit(affiliate)}
              classes={{
                root: styles.editButton
              }}
            >
              <EditIcon
                classes={{
                  root: styles.editButtonIcon
                }}
              />
            </IconButton>
          )}
        </div>
        {schedulerString.length > 30 && (
          <Tooltip id={schedulerString} title={schedulerString} placement="top">
            <div className={styles.schedule}>{schedulerString}</div>
          </Tooltip>
        )}
        {schedulerString.length <= 30 && (
          <div className={styles.schedule}>{schedulerString}</div>
        )}
      </div>
    );
  }
}
