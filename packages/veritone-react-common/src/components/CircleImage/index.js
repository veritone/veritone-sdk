import React from 'react';

import {
  any,
  string
} from 'prop-types';

import styles from './styles.scss';

export default class CircleImage extends React.Component {
  static propTypes = {
    height: string.isRequired,
    width: string,
    image: string
  };

  static defaultProps = {
    height: '38px',
    width: '38px'
  };

  state = {};

  componentWillMount = () => {
    if (!this.props.width) {
      this.props.width = this.props.height;
    } else if (this.props.height !== this.props.width) {
      this.props.width = this.props.height;
    }
  }

  render() {
    return (
      <div className={styles.imageWrapper} style={{height: this.props.height, width: this.props.width}}>
        <img src={this.props.image} alt='https://static.veritone.com/veritone-ui/default-nullstate.svg' className={styles.imageStyle} style={{height: this.props.height, width: this.props.width}}/>
      </div>
    );
  };
}