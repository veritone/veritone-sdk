import { string, func, shape } from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

const propTypes = {
  actions: shape({
    seek: func
  }),
  className: string
};

export default class RestartMediaButton extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.actions) {
      this.props.actions.seek(0);
    }
  }

  render() {
    const { className } = this.props;
    return (
      <button
        className={classNames(className, {
          'video-react-control': true,
          'video-react-button': true,
          'icon-skip_previous': true
        })}
        onClick={this.handleClick}
      />
    );
  }
}

RestartMediaButton.propTypes = propTypes;
