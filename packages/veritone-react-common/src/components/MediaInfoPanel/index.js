import React from 'react';
import { string, arrayOf, shape, bool, number } from 'prop-types';
import { get } from 'lodash';
import { Transition } from 'react-transition-group';
import cx from 'classnames';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core';
import {
  Folder,
  InsertDriveFile
} from '@material-ui/icons';
import MediaPlayer from '../MediaPlayer';

import styles from './styles.scss';

const tdoShape = shape({
  name: string.isRequired,
  startDateTime: string,
  stopDateTime: string,
  thumbnailUrl: string,
  sourceImageUrl: string,
  primaryAsset: shape({
    id: string,
    contentType: string,
    signedUri: string
  }),
  streams: arrayOf(shape({
    uri: string,
    protocol: string
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

const displayNumber = (number, digits = 2) => {
  if (number === 0) {
    return '0'.repeat(digits)
  }
  return number < Math.pow(10, digits - 1) ?
    `${'0'.repeat(Math.floor(Math.log10(number)) + 1)}${number}` : number
}

const formatAsDuration = (seconds) => {
  const hourNumber = Math.floor(seconds / 3600);

  const minuteNumber = Math.floor((seconds - hourNumber * 3600) / 60);

  const secondNumber = Math.floor(
    (seconds - hourNumber * 3600 - minuteNumber * 60) % 60);

  return (
    `${displayNumber(hourNumber)}:` +
    `${displayNumber(minuteNumber)}:` +
    `${displayNumber(secondNumber)}`
  );
}

const MediaInfo = ({ selectedItem, width }) => {
  const itemType = selectedItem.type === 'folder' ?
    'folder' :
    get(selectedItem, 'primaryAsset.contentType', 'application').split('/')[0];
  return (
    <div className={styles['media-info-container']} style={{ width }}>
      {
        (() => {
          switch (itemType) {
            case 'folder':
              return <Folder className={styles['icon-info']} />
            case 'doc':
            case 'application':
              return <InsertDriveFile className={styles['icon-info']} />
            case 'video':
            case 'audio':
              return (
                <MediaPlayer
                  src={selectedItem.primaryAsset.signedUri}
                  streams={selectedItem.streams}
                  poster={selectedItem.thumbnailUrl}
                  readOnly
                  fluid
                  useOverlayControlBar
                  preload={'none'}
                  btnRestart={false}
                  btnReplay={false}
                  btnForward={false}
                  autoHide
                  autoHideTime={1000}
                />
              )
            case 'image':
              return <img
                src={get(selectedItem, 'primaryAsset.signedUri')}
                alt={selectedItem.name}
                className={styles['image-preview']}
              />
            default:
              return null;
          }
        })()
      }
      <Typography className={styles['tdo-name']}>
        {selectedItem.name}</Typography>
      <div className={styles['info-details']}>
        <Table className={styles['table-container']}>
          <TableBody>
            <TableRow className={styles['table-row']}>
              <TableCell
                className={cx(
                  styles['table-cell'],
                  styles['table-first-column']
                )}
              >
                Created
              </TableCell>
              <TableCell
                className={styles['table-cell']}
              >
                {selectedItem.createdDateTime}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className={cx(
                  styles['table-cell'],
                  styles['table-first-column']
                )}
              >
                Modified
              </TableCell>
              <TableCell
                className={styles['table-cell']}
              >
                {selectedItem.modifiedDateTime}
              </TableCell>
            </TableRow>
            {(itemType === 'video' || itemType === 'audio') && (
              <TableRow className={styles['table-row']}>
                <TableCell
                  className={cx(
                    styles['table-cell'],
                    styles['table-first-column']
                  )}
                >
                  Duration
                </TableCell>
                <TableCell className={styles['table-cell']}>
                  {
                    formatAsDuration(getDuration(
                      selectedItem.startDateTime,
                      selectedItem.stopDateTime
                    ))
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
};

MediaInfo.propTypes = {
  selectedItem: tdoShape,
  width: number,
  classes: shape(Object.keys(styles).reduce((styleShape, key) => ({
    ...styleShape,
    [key]: string
  }), {})),
}

const transitionStyle = (width) => ({
  entering: {
    flexBasis: width,
  },
  entered: {
    flexBasis: width,
  },
})

const MediaInfoPanel = ({ open, selectedItems, width }) => {
  const selectedItem = selectedItems[0];
  const transitionStyleByWidth = transitionStyle(width);
  return (
    <Transition in={open && selectedItems.length > 0} timeout={500}>
      {
        state => (
          <div
            className={styles['media-panel-container']}
            style={
              transitionStyleByWidth[state]
            }
          >
            {
              selectedItems.length > 1 ? (
                <div selectedNumber={selectedItems.length}>
                  You have selected {selectedItems.length} items
                </div>
              ) : selectedItems.length === 1 ? (
                <MediaInfo
                  selectedItem={selectedItem}
                  width={width}
                />
              ) : null
            }
          </div>
        )
      }
    </Transition>
  )
}

MediaInfoPanel.propTypes = {
  open: bool,
  width: number,
  selectedItems: arrayOf(tdoShape)
}

MediaInfoPanel.defaultProps = {
  width: 450
}

export default MediaInfoPanel;
