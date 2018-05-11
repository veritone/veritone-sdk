import React, { Fragment } from 'react';
import { node, number } from 'prop-types';

class HorizontalScroll extends React.Component {
  static propTypes = {
    leftScrollButton: node.isRequired,
    rightScrollButton: node.isRequired,
    scrollAmount: number,
    children: node.isRequired
  };

  static defaultProps = {
    scrollAmount: 20
  };

  state = {
    offsetLeft: 0,
    showScrollButtons: false
  };

  componentWillUnmount() {
    this.stopScrolling();
  }

  scrollContent = null;
  keepScrolling = false;
  continueScrolling = false;

  continueScrolling = amount => {
    this.setState((prevState, props) => {
      let newOffsetLeft = prevState.offsetLeft + amount;
      if (newOffsetLeft < 0) {
        newOffsetLeft = 0;
      } else if (
        newOffsetLeft >
        this.scrollContent.scrollWidth - this.scrollContent.clientWidth
      ) {
        newOffsetLeft =
          this.scrollContent.scrollWidth - this.scrollContent.clientWidth;
      }

      this.scrollContent.scrollLeft = newOffsetLeft;
      return { offsetLeft: newOffsetLeft };
    });
  };

  scrollLeft = e => {
    this.scroll(-1 * this.props.scrollAmount);
  };

  scrollRight = e => {
    this.scroll(this.props.scrollAmount);
  };

  scroll(amount) {
    if (!this.keepScrolling) {
      this.continueScrolling(amount);
      this.keepScrolling = window.setInterval(
        this.continueScrolling,
        50,
        amount
      );
    }
  }

  stopScrolling = e => {
    if (this.keepScrolling) {
      window.clearInterval(this.keepScrolling);
      this.keepScrolling = undefined;
    }
  };

  setScrollContent = ref => {
    this.scrollContent = ref;
    this.setState({
      showScrollButtons: ref && ref.scrollWidth > ref.clientWidth
    });
  };

  render() {
    return (
      <Fragment>
        <div onMouseDown={this.scrollLeft} onMouseUp={this.stopScrolling}>
          {this.state.showScrollButtons
            ? this.props.leftScrollButton
            : undefined}
        </div>
        <div
          ref={this.setScrollContent}
          style={{
            overflowX: 'hidden'
          }}
        >
          {this.props.children}
        </div>
        <div onMouseDown={this.scrollRight} onMouseUp={this.stopScrolling}>
          {this.state.showScrollButtons
            ? this.props.rightScrollButton
            : undefined}
        </div>
      </Fragment>
    );
  }
}

export default HorizontalScroll;
