import React, { Component } from 'react';
import { string, bool, shape } from 'prop-types';
import classNames from 'classnames';

import styles from './styles.scss';

class Snippet extends Component {
  static propTypes = {
    snippet: shape({
      text: string
    }),
    boldText: bool
  };

  state = {
    hoverText: false
  }

  enableHover = () => {
    this.setState({hoverText: true});
  }

  disableHover = () => {
    this.setState({hoverText: false});
  }

  render() {
    let { snippet, boldText, editModeEnabled } = this.props;
    return (
      <span 
        className={classNames(boldText && styles.boldText, this.state.hoverText && styles.hoverText)} 
        onMouseEnter={this.enableHover}
        onMouseLeave={this.disableHover}
      >{snippet.text} </span>
    );
  }
}

export default Snippet;