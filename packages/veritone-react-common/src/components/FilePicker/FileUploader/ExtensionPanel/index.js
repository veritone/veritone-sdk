import React from 'react';
import { string, func, arrayOf } from 'prop-types';
import { isArray, uniq } from 'lodash';
import cx from 'classnames';
import mime from 'mime-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';

import styles from './styles.scss';

const ExtensionPanel = ({ acceptedFileTypes = [], closeExtensionList }) => {
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
    <div className={styles.extensionListContainer}>
      <div className={styles.extensionListHeader}>
        <span className={styles.extensionListTitle}>File Extensions</span>
        <IconButton
          classes={{
            root: styles.extensionListCloseButton
          }}
          data-veritone-element="uploader-extension-close-btn"
          onClick={closeExtensionList}
          disableRipple>
          <Close />
        </IconButton>
      </div>
      <div className={styles.extensionList}>
        {
          Object.keys(typeMapper).filter(key => typeMapper[key].length).map(key => (
            <Grid
              key={`${key}-extension-list`}
              data-veritone-element="extension-list-category"
              className={cx(styles.extensionTypeContainer, styles[key])}
              container
              spacing={2}>
              <Grid item xs={8} sm={6} md={4}>
                <span className={styles.mediaTypeKey}>{key}</span>
              </Grid>
              {
                uniq(typeMapper[key]).map(ext => (
                  <Grid key={`${key}-extension-${ext}`} item xs={8} sm={6} md={4}>
                    <span
                      className={styles.mediaExtension}
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