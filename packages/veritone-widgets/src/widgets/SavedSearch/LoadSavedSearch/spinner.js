import React from 'react';
import { string } from 'prop-types';

import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from '../styles.scss';

const LoadingSpinner = ({ title }) => (
    <div className={styles.loadingContainer}>
      <div className={styles.loading}>
        <CircularProgress size={'4em'}/>
        <Typography variant="subheading" style={{ paddingTop: "1em" }}>
          Loading {title}
        </Typography>
      </div>
    </div>
);

LoadingSpinner.propTypes = {
  title: string
}

export default LoadingSpinner;
