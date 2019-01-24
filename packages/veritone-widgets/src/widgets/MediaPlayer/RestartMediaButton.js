import { string, func, shape } from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

export default class RestartMediaButton extends Component {
  static propTypes = {
    actions: shape({
      seek: func.isRequired
    }),
    className: string
  };

  handleClick = () => {
    if (this.props.actions) {
      this.props.actions.seek(0);
    }
  };

  render() {
    return (
      <button
        className={classNames(
          this.props.className,
          'video-react-control',
          'video-react-button',
          'video-react-icon',
          'video-react-icon-skip-previous'
        )}
        onClick={this.handleClick}
        type="button"
      />
    );
  }
}
