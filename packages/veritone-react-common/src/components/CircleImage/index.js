import React from 'react';

import {
  any,
  string,
  func
} from 'prop-types';

import styles from './styles.scss';

export default class CircleImage extends React.Component {
  static propTypes = {
    height: string.isRequired,
    width: string,
    image: string,
    onClick: func
  };

  static defaultProps = {
    height: '38px',
    width: '38px'
  };

  state = {
    image: 'https://static.veritone.com/veritone-ui/default-nullstate.svg'
  };

  componentWillMount = () => {
    if (!this.props.width) {
      this.props.width = this.props.height;
    } else if (this.props.height !== this.props.width) {
      this.props.width = this.props.height;
    }

    if (this.props.image) {
      this.state.image = this.props.image;
    }
  }

  addDefaultSrc = (event) => {
    event.target.src = 'https://static.veritone.com/veritone-ui/default-nullstate.svg';
  };

  handleClick = () => {
    this.props.onClick();
  };

  render() {
    return (
      <div className={styles.imageWrapper} style={{height: this.props.height, width: this.props.width}} onClick={this.handleClick}>
        <img src={this.state.image} onError={this.addDefaultSrc} alt='' className={styles.imageStyle} style={{height: this.props.height, width: this.props.width}}/>
      </div>
    );
  };
}