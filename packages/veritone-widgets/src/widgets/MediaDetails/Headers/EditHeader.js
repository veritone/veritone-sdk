import React from 'react';
import { string, func } from 'prop-types';
import { startCase, get } from 'lodash';
import cx from 'classnames';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton/IconButton';

import styles from './styles.scss';

const editHeader = ({
  engineCategoryIconClass,
  engineCategoryType,
  onCloseButtonClick
}) => {
  const categoryText = {
    transcript: {
      name: 'Transcription',
      subhead: 'Use the edit screen below to correct transcriptions.'
    },
    face: {
      name: 'Faces',
      subhead: 'Use the edit screen below to edit detected faces.'
    }
  };
  return (
    <div
      className={styles.editHeader}
      data-veritone-component="mdp-edit-header"
    >
      <div className={styles.editHeaderIconContainer}>
        <Icon
          className={cx(engineCategoryIconClass, styles.engineCategoryIcon)}
        />
      </div>
      <div className={styles.editHeaderText}>
        <div className={styles.editHeaderTitle}>
          <span className={styles.boldText}>
            {get(categoryText, [engineCategoryType, 'name']) ||
              startCase(engineCategoryType)}:
          </span>{' '}
          Edit Mode
        </div>
        {get(categoryText, [engineCategoryType, 'subhead']) && (
          <div className={styles.editHeaderSubHeader}>
            {get(categoryText, [engineCategoryType, 'subhead'])}
          </div>
        )}
      </div>
      <div className={styles.editHeaderCloseIconContainer}>
        <IconButton
          className={styles.closeIconButton}
          onClick={onCloseButtonClick}
          aria-label="Close"
        >
          <Icon
            classes={{ root: styles.closeIcon }}
            className="icon-close-exit"
          />
        </IconButton>
      </div>
    </div>
  );
};

editHeader.propTypes = {
  engineCategoryIconClass: string.isRequired,
  engineCategoryType: string.isRequired,
  onCloseButtonClick: func.isRequired
};

export default editHeader;
