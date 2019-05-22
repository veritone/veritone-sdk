import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { get } from 'lodash';
import {
  Card,
  CardContent,
  Typography,
  CardMedia
} from "@material-ui/core";
import {
  Folder,
  InsertDriveFile,
  KeyboardVoice,
  Videocam
} from '@material-ui/icons';

import MediaPlayerComponent from '../../MediaPlayer'

const styles = {
  card: {
    maxWidth: 310
  },
  media: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 135 // 16:9
  },
  name: {
    display: "inline-block",
    maxWidth: 240,
    color: "rgba(0, 0, 0, 0.87)",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    fontSize: 14,
    fontWeight: 500
  },
  cardName: {
    display: "flex",
    alignItems: "center"
  },
  typeIcon: {
    marginLeft: 6
  },
  timeStyle: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px",
  },
  cardContent: {
    padding: "12px !important"
  },
  iconMedia: {
    fontSize: "60px",
    color: "#42A4F5"
  }
};

const FILE_ICONS = {
  'folder': Folder,
  'audio': KeyboardVoice,
  'video': Videocam,
  'doc': InsertDriveFile
}

function SimpleMediaCard(props) {
  const { classes, name, modifiedDateTime, type, primaryAsset, url } = props;
  const FileIcon = type === 'folder' ? Folder :
    FILE_ICONS[
    get(primaryAsset, 'contentType', 'doc').split('/')[0]
    ];
  return (
    <div>
      <Card className={classes.card}>
        {url ?
          <MediaPlayerComponent
            muted
            readOnly
            fluid
            useOverlayControlBar
            src={url}
          />
          :
          <CardMedia className={classes.media}>
            <FileIcon className={classes.iconMedia} />
          </CardMedia>
        }
        <CardContent className={classes.cardContent}>
          <Typography
            className={classes.cardName}
            gutterBottom
            variant="headline"
            component="h2"
          >
            <div className={classes.name}>
              {name}
            </div>
            <FileIcon className={classes.typeIcon} />
          </Typography>
          <Typography className={classes.timeStyle} component="p">
            {modifiedDateTime}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

SimpleMediaCard.propTypes = {
  classes: PropTypes.shape(Object).isRequired,
  name: PropTypes.string.isRequired,
  modifiedDateTime: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  primaryAsset: PropTypes.shape(Object),
  url: PropTypes.string
};

export default withStyles(styles)(SimpleMediaCard);
