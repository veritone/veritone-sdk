import React from 'react';
import { func, oneOfType, string, number } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import styles from './styles.scss';

const NoLibrary = ({ width, height, onButtonClick }) => {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={24}
      style={{
        width: width || '100%',
        height: height || 350
      }}
      data-veritone-component="no-library"
    >
      <Grid item>
        <img
          src="https://s3.amazonaws.com/static.veritone.com/veritone-ui/no-avatar.png"
          className={styles.noLibraryImage}
        />
      </Grid>
      <Grid item>
        <div className={styles.noLibraryText}>No Library Found</div>
        <div className={styles.noLibrarySubText}>
          Your organization currently has no libraries created
        </div>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onButtonClick}
          classes={{ root: styles.entityDialogButton }}
          data-veritone-element="cancel-button"
        >
          Create New Library
        </Button>
      </Grid>
    </Grid>
  );
};

NoLibrary.propTypes = {
  onButtonClick: func,
  width: oneOfType([string, number]),
  height: oneOfType([string, number])
};

export default NoLibrary;
