import React from 'react';
import { string, node } from 'prop-types';

import styles from './styles.scss';

export default class StarRating extends React.Component {
  static propTypes = {
  };

  render() {
    // const { } = this.props;
    return (
      <div className={styles.rating}>
        Rating
      </div>
    );
  }
}