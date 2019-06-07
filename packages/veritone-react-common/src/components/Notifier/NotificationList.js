import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import ErrorIcon from '@material-ui/icons/PriorityHigh';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckIcon from '@material-ui/icons/Check';
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
    statusDescription: string,
    onActionClick: func,
    onRemoveClick: func
  })
);

export default class NotificationList extends React.Component {
  static propTypes = {
    notifications: notificationListPropTypes
  }
  
  handleEntryActionClicked = entry => event => {
    entry.onActionClick && entry.onActionClick(entry);
  }

  handleEntryRemoveClick = entry => event => {
    entry.onRemoveClick && entry.onRemoveClick(entry);
  }

  drawFailedItem = (entryData) => {
    return (
      <div key={entryData.id} className={classNames(styles.entry)}>
        <div className={classNames(styles.visualStatus)}>
          <ErrorIcon className={classNames(styles.statusIcon, styles.red)}/>
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{entryData.description1}</div>
          <div className={classNames(styles.subtitle)}>{entryData.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {entryData.statusDescription || 'failed'}
          </div>
          <div className={classNames(styles.actions)}>
          {
            entryData.onActionClick && 
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryActionClicked(entryData)}
            >
              <RefreshIcon className={classNames(styles.icon)} />
            </IconButton>
          }
          {
            entryData.onRemoveClick && 
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryRemoveClick(entryData)}
            >
              <CloseIcon className={classNames(styles.icon)} />
            </IconButton>
          }
          </div>
        </div>
      </div>
    );
  };

  drawCompletedItem = (entryData) => {
    return (
      <div key={entryData.id} className={classNames(styles.entry)}>
        <div className={classNames(styles.visualStatus)}>
          <CheckIcon className={classNames(styles.statusIcon, styles.green)}/>
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{entryData.description1}</div>
          <div className={classNames(styles.subtitle)}>{entryData.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {entryData.statusDescription || 'complete'}
          </div>
          <div className={classNames(styles.actions)}>
          {
            entryData.onRemoveClick && 
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryRemoveClick(entryData)}
            >
              <CloseIcon className={classNames(styles.icon)} />
            </IconButton>
          }
          </div>
        </div>
      </div>
    );
  };

  drawPreparingItem = (entryData) => {
    return (
      <div key={entryData.id} className={classNames(styles.entry)}>
        <div className={classNames(styles.visualStatus)}>
          <CircularProgress size={24} />
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{entryData.description1}</div>
          <div className={classNames(styles.subtitle)}>{entryData.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {entryData.statusDescription || 'preparing...'}
          </div>
          <div className={classNames(styles.actions)}>
          {
            entryData.onRemoveClick && 
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryRemoveClick(entryData)}
            >
              <CloseIcon className={classNames(styles.icon)} />
            </IconButton>
          }
          </div>
        </div>
      </div>
    );
  };

  drawProcessingItem = (entryData) => {
    return (
      <div key={entryData.id} className={classNames(styles.entry)}>
        <div className={classNames(styles.visualStatus)}>
          <CircularProgress size={24} />
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{entryData.description1}</div>
          <div className={classNames(styles.subtitle)}>{entryData.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {entryData.statusDescription || 'processing...'}
          </div>
          <div className={classNames(styles.actions)}>
          {
            entryData.onRemoveClick && 
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryRemoveClick(entryData)}
            >
              <CloseIcon className={classNames(styles.icon)} />
            </IconButton>
          }
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
