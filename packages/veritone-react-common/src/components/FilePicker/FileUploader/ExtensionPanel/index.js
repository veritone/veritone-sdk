import React from 'react';
import { string, func, arrayOf } from 'prop-types';
import { isArray, uniq } from 'lodash';
import cx from 'classnames';
import mime from 'mime-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import styles from './styles';

const useStyles = makeStyles(styles);

const ExtensionPanel = ({ acceptedFileTypes = [], closeExtensionList }) => {
  const classes = useStyles();
  const readableTypeNames = {
    'video/*': 'video',
    'audio/*': 'audio',
    'image/*': 'image'
  };
  const typeMapper = {
    audio: [],
    video: [],
    image: [],
    text: []
  };
  acceptedFileTypes.forEach(t => {
    let wasCategorized = false;
    const mappedType = readableTypeNames[t] || mime.extension(t) || t;
    Object.keys(typeMapper).forEach(key => {
      if (t.includes(key)) {
        isArray(typeMapper[key]) && typeMapper[key].push(mappedType.split('/').slice(-1)[0]);
        wasCategorized = true;
      }
    });
    if (!wasCategorized) {
      // Default insert into text category
      typeMapper.text.push(mappedType.split('/').slice(-1)[0]);
    }
  });

  return (
    <div className={classes.extensionListContainer}>
      <div className={classes.extensionListHeader}>
        <span className={classes.extensionListTitle}>File Extensions</span>
        <IconButton
          classes={{
            root: classes.extensionListCloseButton
          }}
          data-veritone-element="uploader-extension-close-btn"
          onClick={closeExtensionList}
          disableRipple>
          <Close />
        </IconButton>
      </div>
      <div className={classes.extensionList}>
        {
          Object.keys(typeMapper).filter(key => typeMapper[key].length).map(key => (
            <Grid
              key={`${key}-extension-list`}
              data-veritone-element="extension-list-category"
              className={cx(classes.extensionTypeContainer, classes[key])}
              container
              spacing={2}>
              <Grid item xs={8} sm={6} md={4}>
                <span className={classes.mediaTypeKey}>{key}</span>
              </Grid>
              {
                uniq(typeMapper[key]).map(ext => (
                  <Grid key={`${key}-extension-${ext}`} item xs={8} sm={6} md={4}>
                    <span
                      className={classes.mediaExtension}
                      data-veritone-element="extension-list-item"
                    >
                      {ext}
                    </span>
                  </Grid>
                ))
              }
            </Grid>
          ))
        }
      </div>
    </div>
  )
};

ExtensionPanel.propTypes = {
  acceptedFileTypes: arrayOf(string),
  closeExtensionList: func.isRequired
};

export default ExtensionPanel;