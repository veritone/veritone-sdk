import React from 'react';
import _ from 'lodash';

import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import ErrorIconSvg from 'images/icon_error.svg';
import CheckIconSvg from 'images/icon_check_circle.svg';


import { string, arrayOf, oneOf, shape, func, node } from 'prop-types';

import classNames from 'classnames';
import styles from './styles.scss';

const TYPE_CUSTOM = 'custom';
const TYPE_PREPARING = 'preparing';
const TYPE_PROCESSING = 'processing';
const TYPE_FAILED = 'failed';
const TYPE_COMPLETED = 'completed';

const INTRO_FADE_IN = 'fade_in';

const OUTRO_NONE = 'none';
const OUTRO_FADE_OUT = 'fade_out';
const OUTRO_SLIDE_OUT = 'slide_out';

export const notificationListPropTypes = arrayOf(
  shape({
    id: string.isRequired,
    type: oneOf([
      TYPE_CUSTOM,
      TYPE_PREPARING,
      TYPE_PROCESSING,
      TYPE_FAILED,
      TYPE_COMPLETED
    ]).isRequired,
    customNode: node,
    description1: string,
    description2: string,
    statusDescription: string,
    onActionClick: func,
    onRemoveClick: func,
    outroAnimation: string
  })
);

export default class NotificationList extends React.Component {
  static propTypes = {
    notifications: notificationListPropTypes
  }

  state = {};

  static getDerivedStateFromProps(nextProps, prevState) {
    const currentEntries = nextProps.notifications || [];

    if (_.isEmpty(prevState)) {
      return {
        currentEntries,
        removedEntryIds: [],
        allEntries: currentEntries,
      }
    } else if (_.isEqual(prevState.currentEntries, currentEntries)) {
      return prevState;
    } else {
      const prevEntries = prevState.currentEntries;

      //Find New Entry
      const newEntryIds = currentEntries.reduce((ids, entry) => {
        const entryId = entry.id;
        const matchedEntry = _.find(prevEntries, {id: entryId});
        !matchedEntry && ids.push(entryId);
        return ids;
      }, []);

      //Find Removed Entry
      const removedEntryIds = prevEntries.reduce((ids, entry) => {
        const entryId = entry.id;
        const matchedEntry = _.find(currentEntries, {id: entryId});
        !matchedEntry && ids.push(entryId);
        return ids;
      }, []);

      //Merge new entries & prev entries
      let allEntries = currentEntries.reduce((accumulator, entry) => {
        let newAccumulator = accumulator.concat([]);
        const matchedPrevIndex = _.findIndex(prevEntries, {id: entry.id});
        if (matchedPrevIndex !== -1) {

          //Append outdated entries for outro animation
          if (matchedPrevIndex > 0) {
            const outDatedEntries = prevEntries.splice(0, matchedPrevIndex);
            newAccumulator = accumulator.concat(outDatedEntries);
          }

          prevEntries.splice(0, 1);   //Remove duplicated entry
        }

        newAccumulator.push(entry);

        return newAccumulator;
      }, []);

      allEntries = allEntries.concat(prevEntries); //Append all left over outdated entries for outro animation

      return {
        allEntries,
        currentEntries,
        newEntryIds,
        removedEntryIds
      }
    }
  }
  
  handleEntryActionClicked = entry => event => {
    entry.onActionClick && entry.onActionClick(entry);
  }

  handleEntryRemoveClick = entry => event => {
    entry.onRemoveClick && entry.onRemoveClick(entry);
  }

  drawCustomItem = (entryData) => {
    const entryId = entryData.id;
    const isNewEntry = _.includes(this.state.newEntryIds, entryId);
    const isRemoved = !isNewEntry && _.includes(this.state.removedEntryIds, entryId);

    return (
      <div key={entryId} className={
        classNames({
          [styles.fadeIn]: isNewEntry && entryData.introAnimation === INTRO_FADE_IN,
          [styles.fadeOut]: isRemoved && entryData.outroAnimation === OUTRO_FADE_OUT,
          [styles.slideOut]: isRemoved && entryData.outroAnimation === OUTRO_SLIDE_OUT,
          [styles.noOutro]: isRemoved && (!entryData.outroAnimation || entryData.outroAnimation === OUTRO_NONE)
        })
      }>
        { entryData.customNode }
      </div>
    );
  }

  drawGenericItem = (originalData, formatedData) => {
    const entryId = formatedData.id;
    const isNewEntry = _.includes(this.state.newEntryIds, entryId);
    const isRemoved = !isNewEntry && _.includes(this.state.removedEntryIds, entryId);

    return (
      <div key={formatedData.id} className={
        classNames(
          styles.entry,
          {
            [styles.fadeIn]: isNewEntry && formatedData.introAnimation === INTRO_FADE_IN,
            [styles.fadeOut]: isRemoved && formatedData.outroAnimation === OUTRO_FADE_OUT,
            [styles.slideOut]: isRemoved && formatedData.outroAnimation === OUTRO_SLIDE_OUT,
            [styles.noOutro]: isRemoved && (!formatedData.outroAnimation || formatedData.outroAnimation === OUTRO_NONE)
          }
        )
      }>
        <div className={classNames(styles.visualStatus)}>
          { formatedData.statusIcon }
        </div>
        <div className={classNames(styles.description)}>
          <div className={classNames(styles.title)}>{formatedData.description1}</div>
          <div className={classNames(styles.subtitle)}>{formatedData.description2}</div>
        </div>
        <div className={classNames(styles.extra)}>
          <div className={classNames(styles.description)}>
            {formatedData.statusDescription || 'failed'}
          </div>
          <div className={classNames(styles.actions)}>
          {
            formatedData.onActionClick && 
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryActionClicked(originalData)}
            >
              { formatedData.actionIcon }
            </IconButton>
          }
          {
            formatedData.onRemoveClick &&
            <IconButton 
              color="default"
              className={classNames(styles.iconButton)}
              onClick={this.handleEntryRemoveClick(originalData)}
            >
              {
                formatedData.removeIcon || <CloseIcon className={classNames(styles.icon)} style={{ fontSize: "20px" }} />
              }
            </IconButton>
          }
          </div>
        </div>
      </div>
    );
  }

  drawFailedItem = (entryData) => {
    const failedEntryData = {
      statusIcon: <img src={ErrorIconSvg} />,
      removeIcon: <CloseIcon className={classNames(styles.icon)} style={{ fontSize: "20px" }} />,
      actionIcon: <RefreshIcon className={classNames(styles.icon)} style={{ fontSize: "20px" }} />,
      introAnimation: INTRO_FADE_IN,
      outroAnimation: OUTRO_FADE_OUT,
      ...entryData
    };

    return this.drawGenericItem(entryData, failedEntryData);
  };

  drawCompletedItem = (entryData) => {
    const completedEntryData = {
      statusIcon: <img src={CheckIconSvg} />,
      removeIcon: <CloseIcon className={classNames(styles.icon)} style={{ fontSize: "20px" }} />,
      introAnimation: INTRO_FADE_IN,
      outroAnimation: OUTRO_SLIDE_OUT,
      ...entryData
    };

    return this.drawGenericItem(entryData, completedEntryData);
  };

  drawPreparingItem = (entryData) => {
    const preparingEntryData = {
      removeIcon: <CloseIcon className={classNames(styles.icon)} style={{ fontSize: "20px" }} />,
      statusIcon: this.drawSpinner(),
      introAnimation: INTRO_FADE_IN,
      outroAnimation: OUTRO_FADE_OUT,
      ...entryData
    };

    return this.drawGenericItem(entryData, preparingEntryData);
  };

  drawProcessingItem = (entryData) => {
    const processingEntryData = {
      removeIcon: <CloseIcon className={classNames(styles.icon)} style={{ fontSize: "20px" }} />,
      statusIcon: this.drawSpinner(),
      introAnimation: INTRO_FADE_IN,
      outroAnimation: OUTRO_FADE_OUT,
      ...entryData
    };

    return this.drawGenericItem(entryData, processingEntryData);
  };

  drawSpinner = () => {
    return (
        <div className={classNames(styles.spinner)} />
    );
  };

  render() {
    return (
      <div className={classNames(styles.notificationList)}>
      {
        this.state.allEntries.map(entry => {
          switch (entry.type) {
            case TYPE_PREPARING:
              return this.drawPreparingItem(entry);
            
            case TYPE_PROCESSING:
              return this.drawProcessingItem(entry);

            case TYPE_FAILED:
              return this.drawFailedItem(entry);

            case TYPE_COMPLETED:
              return this.drawCompletedItem(entry);
            
            case TYPE_CUSTOM:
              return this.drawCustomItem(entry);
            
            default:
              return null;
          }
        })
      }
      </div>
    );
  }
}
