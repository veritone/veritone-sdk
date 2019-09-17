import React from 'react';
import { string } from 'prop-types';

import Typography from '@material-ui/core/Typography';
import styles from '../styles.scss';
import NoSearchProfilesIcon from './no-search-profiles.svg';

const NoSearchProfiles = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loading}>
      <img src={NoSearchProfilesIcon} style={{ height: '4.5em' }} />
      <Typography variant="subheading" style={{ paddingTop: "1em" }}>
        No Search Profiles
    </Typography>
    </div>
  </div>
);

export default NoSearchProfiles;
