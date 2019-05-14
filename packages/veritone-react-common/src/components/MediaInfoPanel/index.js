import React from 'react';
import { string, arrayOf, shape, bool } from 'prop-types';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import MediaPlayer from './SimpleMediaPlayer';


const styles = {
  root: {
    width: 0,
    flexBasis: 0,
    overflowX: 'hidden',
    transition: 'flex-basis 500ms',
    backgroundColor: '#F4FAFE'
  },
  open: {

  },
  content: {
    width: 500,
    padding: '16px 20px 20px 20px',
    display: 'flex',
    flexFlow: 'column',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    alignContent: 'flex-start'
  },
  tableCell: {
    borderBottom: 0,
    fontSize: 14,
  },
  name: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 18
  },
  category: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.37)'
  },
  entering: {
    opacity: 1,
    flex: '0 0 500px',
    width: 500
  },
  entered: {
    opacity: 1,
    flex: '0 0 500px',
    width: 500
  },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

const tdoShape = shape({
  name: string.isRequired,
  startDateTime: string,
  stopDateTime: string,
  thumbnailUrl: string,
  sourceImageUrl: string,
  primaryAsset: shape({
    id: string,
    contentType: string.isRequired,
    signedUri: string.isRequired
  }),
  streams: arrayOf(shape({
    uri: string.isRequired,
    protocol: string.isRequired
  })),
  createdDateTime: string.isRequired,
  modifiedDateTime: string.isRequired
});

const getDuration = (stopTime, startTime) => {
  const duration = (
    (new Date(stopTime)).getTime() - (new Date(startTime)).getTime()
  ) / 1000;
  return Math.floor(duration);
};

const displayNumber = (number, digits=2) => {
  if (number === 0) {
    return '0'.repeat(digits)
  }
  return number < Math.pow(10, digits - 1) ?
    `${'0'.repeat(Math.floor(Math.log10(number)) + 1)}${number}` : number
}

const formatAsDuration = (seconds) => {
  const hourNumber = Math.floor(seconds/3600);

  const minuteNumber = Math.floor((seconds - hourNumber * 3600) / 60);

  const secondNumber = Math.floor(
    (seconds - hourNumber * 3600 - minuteNumber * 60) % 60);

  return (
    `${displayNumber(hourNumber)}:` +
    `${displayNumber(minuteNumber)}:` +
    `${displayNumber(secondNumber)}`
  );
}

const MediaInfo = ({ selectedItem, classes }) => (
  <div className={classes.content}>
    <MediaPlayer
      src={selectedItem.primaryAsset.signedUri}
      streams={selectedItem.streams}
      poster={selectedItem.thumbnailUrl}
    />
    <Typography className={classes.name}>
      {selectedItem.name}</Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell
            className={classNames(
              classes.tableCell, classes.category
            )}
          >
            Created
          </TableCell>
          <TableCell
            className={classes.tableCell}
          >
            {selectedItem.createdDateTime}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            className={classNames(
              classes.tableCell, classes.category
            )}
          >
            Modified
          </TableCell>
          <TableCell
            className={classes.tableCell}
          >
            {selectedItem.modifiedDateTime}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            className={classNames(
              classes.tableCell, classes.category
            )}
          >
            Duration
          </TableCell>
          <TableCell
            className={classes.tableCell}
          >
            {
              formatAsDuration(getDuration(
                selectedItem.startDateTime,
                selectedItem.stopDateTime
              ))
            }
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

MediaInfo.propTypes = {
  selectedItem: tdoShape,
  classes: shape(Object.keys(styles).reduce((styleShape, key) => ({
    ...styleShape,
    [key]: string
  }), {})),
}

const MediaInfoPanel = ({ open, classes, selectedItems }) => {
  const selectedItem = selectedItems[0];
  return (
    <Transition in={open && selectedItems.length > 0} timeout={500}>
      {
        state => selectedItems.length > 0 && (
          <div className={classNames(classes.root, classes[state])}>
            {
              selectedItems.length > 1 ? (
                <div selectedNumber={selectedItems.length}>
                  You have selected {selectedItems.length} items
                </div>
              ) : (
                <MediaInfo selectedItem={selectedItem} classes={classes} />
              )
            }
          </div>
        )
      }
    </Transition>
  )
}

MediaInfoPanel.propTypes = {
  open: bool,
  classes: shape(Object.keys(styles).reduce((styleShape, key) => ({
    ...styleShape,
    [key]: string
  }), {})),
  selectedItems: arrayOf(tdoShape)
}

export default withStyles(styles)(MediaInfoPanel);
