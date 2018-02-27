import React from 'react';
import StarIcon from 'material-ui-icons/Star';
import StarBorderIcon from 'material-ui-icons/StarBorder';
import amber from 'material-ui/colors/amber';
import grey from 'material-ui/colors/grey';
import { number, string } from 'prop-types';

import styles from './styles.scss';

export default class StarRating extends React.Component {
  static propTypes = {
    starColor: string.isRequired,
    starBorderColor: string.isRequired,
    size: number.isRequired,
    rating: number
  };

  static defaultProps = {
    size: 18,
    rating: 0,
    starColor: amber[500],
    starBorderColor: grey[500]
  }

  render() {
    const starProps = {
      color: this.props.starColor,
      style: {
        width: this.props.size,
        height: this.props.size
      }
    }

    return (
      <div className={styles.rating}>
        {Array.from(Array(5),
          (e, i) => this.props.rating >= (i + 1) ?
            <StarIcon {...starProps} /> :
            <StarBorderIcon
              {...starProps }
              color={this.props.starBorderColor}
            />)
        }
      </div>
    );
  }
}
