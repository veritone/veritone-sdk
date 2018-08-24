import React, { Component, Fragment, cloneElement } from 'react';
import { func, objectOf, any, node } from 'prop-types';

export default class ButtonWrapper extends Component {
  static propTypes = {
    onClick: func.isRequired,
    children: node.isRequired,
    data: objectOf(any).isRequired
  };

  handleOnClick = event => {
    const { onClick, data } = this.props;
    onClick && onClick(event, data);
  };

  render() {
    return (
      <Fragment>
        {cloneElement(this.props.children, { onClick: this.handleOnClick })}
      </Fragment>
    );
  }
}
