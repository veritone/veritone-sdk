import React from "react";
import PropTypes from "prop-types";
import { get } from 'lodash';
import cx from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Folder from '@material-ui/icons/Folder';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import KeyboardVoice from '@material-ui/icons/KeyboardVoice';
import Videocam from '@material-ui/icons/Videocam';
import { makeStyles } from '@material-ui/styles';

import MediaPlayerComponent from '../../../MediaPlayer';
import itemShape from '../itemShape';
import styles from './styles';

const useStyles = makeStyles(styles);

const FILE_ICONS = {
  'folder': Folder,
  'audio': KeyboardVoice,
  'video': Videocam,
  'doc': InsertDriveFile
}

function SimpleMediaCard(props) {
  const classes = useStyles();
  const { item, isSelected } = props;
  const { type, name, primaryAsset, modifiedDateTime, streams } = item;
  const url = () => {
    const streamUri = get(streams, 'uri');
    const signedUri = get(primaryAsset, 'signedUri');
    return streamUri || signedUri;
  }
  const iconCategory = get(primaryAsset, 'contentType', 'doc').split('/')[0];
  const FileIcon = type === 'folder' ? Folder :
    (FILE_ICONS[iconCategory] || FILE_ICONS['doc']);
  return (
    <div>
      <Card className={cx(classes["itemCard"])}>
        {url() ?
          <MediaPlayerComponent
            muted
            readOnly
            fluid
            useOverlayControlBar
            src={url()}
          />
          :
          <CardMedia className={cx(classes["itemMedia"])}>
            <FileIcon className={cx(classes["iconMedia"])} />
          </CardMedia>
        }
        <CardContent className={cx(classes["itemCardContent"], { [classes['itemCardContentSelected']]: isSelected })}>
          <Typography
            className={cx(classes["itemCardName"])}
            gutterBottom
            variant="h5"
            component="h2"
          >
            <div className={cx(classes["itemName"])}>
              {name}
            </div>
            <FileIcon className={cx(classes["typeIcon"])} />
          </Typography>
          <Typography className={cx(classes["itemTimestyle"])} component="p">
            {modifiedDateTime}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

SimpleMediaCard.propTypes = {
  item: itemShape,
  isSelected: PropTypes.bool
};

export default SimpleMediaCard;
