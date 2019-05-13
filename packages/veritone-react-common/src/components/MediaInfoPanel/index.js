import React from 'react';
import { bool, string, arrayOf, shape } from 'prop-types';
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
    transition: 'width 0.5s',
    width: 0,
    backgroundColor: '#F4FAFE'
  },
  open: {
    width: 500
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
  }
}


const MediaInfoPanel = ({ open, classes, selectedItems }) => {
  const selectedItem = selectedItems.length === 1 ? selectedItems[0] : null;
  return (
    <div className={classNames(classes.root, { [classes.open]: open })}>
      <div className={classes.content}>
        {
          selectedItem && (
            <React.Fragment>
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
                      {selectedItem.mediaEndTime - selectedItem.mediaStartTime}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </React.Fragment>
          )
        }
      </div>
    </div>
  )
}

MediaInfoPanel.propTypes = {
  open: bool,
  classes: shape(Object.keys(styles).reduce((styleShape, key) => ({
    ...styleShape,
    [key]: string
  }), {})),
  selectedItems: arrayOf(shape({
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
  }))
}


export default withStyles(styles)(MediaInfoPanel);
