import React from 'react';
import { string, arrayOf, shape, bool, number, func, object, node } from 'prop-types';
import { get } from 'lodash';
import format from 'date-fns/format' 
import parseISO from 'date-fns/parseISO'
import { Transition } from 'react-transition-group';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Folder from '@material-ui/icons/Folder';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import { makeStyles } from '@material-ui/styles';
import MediaPlayerComponent from '../../MediaPlayer';

import styles from './styles';

const useStyles = makeStyles(styles);
// eslint-disable-next-line react/display-name
const MediaPlayer = React.forwardRef((props, ref) => (
  <MediaPlayerComponent {...props} forwardedRef={ref} />
));

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
  modifiedDateTime: string.isRequired,
  childNode: node
});

const formatDateString = date => {
  return format(parseISO(date), 'dddd, MMM d, yyyy [at] h:mm a..aaa');
};

const getDuration = (startTime, stopTime) => {
  if (startTime && stopTime) {
    const duration = (
      (new Date(stopTime)).getTime() - (new Date(startTime)).getTime()
    ) / 1000;
    return Math.floor(duration);
  }
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

const MediaInfo = ({ selectedItem, width, onPlayerRefReady, playerRef, toggleMediaInfoPanel }) => {
  const classes = useStyles();
  const itemType = selectedItem.type === 'folder' ?
    'folder' :
    get(selectedItem, 'primaryAsset.contentType', 'application').split('/')[0];
  const duration = getDuration(
    selectedItem.startDateTime,
    selectedItem.stopDateTime
  );
  return (
    <div className={classes['mediaInfoContainer']} style={{ width }}>
      {
        toggleMediaInfoPanel && (
          <div data-veritone-element="close-button" className={classes['mediaInfoBtnContainer']}>
            <Tooltip title="Hide Details" placement="left">
              <IconButton
                /* eslint-disable react/jsx-no-bind */
                onClick={() => toggleMediaInfoPanel(false)}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
      {
        (() => {
          switch (itemType) {
            case 'folder':
              return <Folder className={classes['iconInfo']} />
            case 'doc':
            case 'application':
              return <InsertDriveFile className={classes['iconInfo']} />
            case 'video':
            case 'audio':
              return (
                <MediaPlayer
                  ref={playerRef}
                  onPlayerRefReady={onPlayerRefReady}
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
                className={classes['imagePreview']}
              />
            default:
              return null;
          }
        })()
      }
      <Typography className={classes['tdoName']}>
        {selectedItem.name}</Typography>
      <div className={classes['infoDetails']}>
        <Table className={classes['tableContainer']}>
          <TableBody>
            <TableRow className={classes['tableRow']}>
              <TableCell
                className={cx(
                  classes['tableCell'],
                  classes['tableFirstColumn']
                )}
              >
                Created
              </TableCell>
              <TableCell
                className={classes['tableCell']}
              >
                <span data-veritone-element="media-panel-created-date">
                  {formatDateString(selectedItem.createdDateTime)}
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                className={cx(
                  classes['tableCell'],
                  classes['tableFirstColumn']
                )}
              >
                Modified
              </TableCell>
              <TableCell
                className={classes['tableCell']}
              >
                <span data-veritone-element="media-panel-modified-date">
                  {formatDateString(selectedItem.modifiedDateTime)}
                </span>
              </TableCell>
            </TableRow>
            {
              !!duration && (
                <TableRow className={classes['tableRow']}>
                  <TableCell
                    className={cx(
                      classes['tableCell'],
                      classes['tableFirstColumn']
                    )}
                  >
                    Duration
                  </TableCell>
                  <TableCell className={classes['tableCell']}>
                    <span data-veritone-element="media-panel-duration">
                      {formatAsDuration(duration)}
                    </span>
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        {
          !!selectedItem.childNode && selectedItem.childNode
        }
      </div>
    </div>
  )
};

MediaInfo.propTypes = {
  selectedItem: tdoShape,
  width: number,
  onPlayerRefReady: func,
  playerRef: shape({
    current: object
  }),
  toggleMediaInfoPanel: func
}

const transitionStyle = (width) => ({
  entering: {
    flexBasis: width + 40,
  },
  entered: {
    flexBasis: width + 40,
  },
})

const MediaInfoPanel = ({ open, selectedItems = [], width, ...props }) => {
  const classes = useStyles();
  const selectedItem = selectedItems.length ? selectedItems[0] : null;
  const transitionStyleByWidth = transitionStyle(width);
  return (
    <Transition in={open && selectedItems.length > 0} timeout={500}>
      {
        state => (
          <div
            className={classes['mediaPanelContainer']}
            style={
              transitionStyleByWidth[state]
            }
          >
            {
              selectedItems.length > 1 ? (
                <div>
                  You have selected {selectedItems.length} items
                </div>
              ) : selectedItem ? (
                <MediaInfo
                  selectedItem={selectedItem}
                  width={width}
                  {...props}
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
  selectedItems: arrayOf(tdoShape),
  onPlayerRefReady: func,
  playerRef: shape({
    current: object
  })
}

MediaInfoPanel.defaultProps = {
  width: 450
}

export default MediaInfoPanel;
