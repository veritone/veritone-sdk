import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import { func, string, arrayOf, shape } from 'prop-types';
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
        daily: arrayOf(
          shape({
            start: string,
            end: string
          })
        ),
        weekly: shape({
          selectedDays: arrayOf(string)
        })
      }).isRequired
    }).isRequired,
    onEdit: func
  };

  handleOnEdit = affiliateId => {
    this.props.onEdit(affiliateId);
  };

  render() {
    const { affiliate, onEdit } = this.props;
    return (
      /* eslint-disable react/jsx-no-bind */
      <div className={styles.affiliateContainer}>
        <div className={styles.title}>
          <div className={styles.name}>{affiliate.name}</div>
          {onEdit && (
            <IconButton
              aria-label="Edit"
              onClick={() => this.handleOnEdit(affiliate)}
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
        <div className={styles.schedule}>TODO: render schedule</div>
      </div>
    );
  }
}
