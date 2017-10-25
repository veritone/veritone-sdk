import React from 'react';
import { string } from 'prop-types';
import styles from './styles/header.scss';

const SingleTabHeader = ({ tab }) => {
  return <div className={styles.singleTabLabel}>{tab}</div>;
};

SingleTabHeader.propTypes = {
  tab: string.isRequired
};

export default SingleTabHeader;
