import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/CheckCircle';
import CircularProgress from '@material-ui/core/CircularProgress';

import { string, arrayOf, oneOf, shape, func } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';

const TYPE_PREPARING = 'preparing';
const TYPE_PROCESSING = 'processing';
const TYPE_FAILED = 'failed';
const TYPE_COMPLETED = 'completed';

export const notificationListPropTypes = arrayOf(
  shape({
    id: string.isRequired,
    type: oneOf([
      TYPE_PREPARING,
      TYPE_PROCESSING,
      TYPE_FAILED,
      TYPE_COMPLETED
    ]).isRequired,
    description1: string,
    description2: string,
    extra: string,
    callback: func,
  })
);

export default class NotificationList extends React.Component {
  static propTypes = {
    notifications: notificationListPropTypes
  }
  
  handleEntryClicked = entry => event => {
    entry.callback && entry.callback(entry);
  }

  drawFailedItem = (item) => {
    return (
      <div key={item.id} className={classNames(styles.item)}>
        <div className={classNames(styles.visualStatus)}>
          <CancelIcon className={classNames(styles.statusIcon, styles.red)}/>
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{item.description1}</div>
          <div className={classNames(styles.subtitle)}>{item.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {item.extra || 'failed'}
          </div>
          {
            item.callback && 
            <IconButton 
              color="primary"
              className={classNames(styles.actionButton)}
              onClick={this.handleEntryClicked(item)}
            >
              <RefreshIcon />
            </IconButton>
          }
          
        </div>
      </div>
    );
  };

  drawCompletedItem = (item) => {
    return (
      <div key={item.id} className={classNames(styles.item)}>
        <div className={classNames(styles.visualStatus)}>
          <CheckIcon className={classNames(styles.statusIcon, styles.green)}/>
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{item.description1}</div>
          <div className={classNames(styles.subtitle)}>{item.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {item.extra || 'complete'}
          </div>
        </div>
      </div>
    );
  };

  drawPreparingItem = (item) => {
    return (
      <div key={item.id} className={classNames(styles.item)}>
        <div className={classNames(styles.visualStatus)}>
          <CircularProgress size={30} />
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{item.description1}</div>
          <div className={classNames(styles.subtitle)}>{item.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {item.extra || 'preparing...'}
          </div>
        </div>
      </div>
    );
  };

  drawProcessingItem = (item) => {
    return (
      <div key={item.id} className={classNames(styles.item)}>
        <div className={classNames(styles.visualStatus)}>
          <CircularProgress size={30} />
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{item.description1}</div>
          <div className={classNames(styles.subtitle)}>{item.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {item.extra || 'processing...'}
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={classNames(styles.notificationList)}>
        {
          this.props.notifications.map(entry => {
            switch (entry.type) {
              case TYPE_PREPARING:
                return this.drawPreparingItem(entry);
              
              case TYPE_PROCESSING:
                return this.drawProcessingItem(entry);

              case TYPE_FAILED:
                return this.drawFailedItem(entry);

              case TYPE_COMPLETED:
                return this.drawCompletedItem(entry);
              
              default:
                return null;
            }
          })
        }
      </div>
    );
  }
}
