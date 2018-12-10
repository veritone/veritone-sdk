import React from 'react';
import { func, number, oneOfType, string } from 'prop-types';
import cx from 'classnames';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import styles from './styles.scss';

const CreateLibrarySuccess = ({
  libraryName,
  width,
  height,
  onButtonClick
}) => {
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      spacing={24}
      style={{
        width: width,
        height: height || 350
      }}
      data-veritone-component="create-library-success"
    >
      <Grid item>
        <CheckCircleIcon className={styles.createLibrarySuccessIcon} />
      </Grid>
      <Grid item>
        <div className={styles.createLibrarySuccess}>Success!</div>
        <div className={styles.createLibrarySubText}>
          <span className={styles.libraryName}>{libraryName}</span> library has
          been created. You can create a new Entity from the next screen.
        </div>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onButtonClick}
          classes={{
            root: cx(styles.entityDialogButton, styles.createEntityButton)
          }}
          data-veritone-element="create-new-entity-button"
        >
          Create A New Person
        </Button>
      </Grid>
    </Grid>
  );
};

CreateLibrarySuccess.propTypes = {
  onButtonClick: func.isRequired,
  width: oneOfType([string, number]),
  height: oneOfType([string, number]),
  libraryName: string.isRequired
};

export default CreateLibrarySuccess;
