import React from 'react';
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

  onMouseDown = e => {
    let scrollAmount = parseInt(e.currentTarget.getAttribute('data-amount'));
    if (!this.keepScrolling) {
      this.continueScrolling(scrollAmount);
      this.keepScrolling = window.setInterval(
        this.continueScrolling,
        50,
        scrollAmount
      );
    }
  };

  onMouseUp = e => {
    this.stopScrolling();
  };

  stopScrolling() {
    if (this.keepScrolling) {
      window.clearInterval(this.keepScrolling);
      this.keepScrolling = undefined;
    }
  }

  setScrollContent = ref => {
    this.scrollContent = ref;
    this.setState({
      showScrollButtons: ref && ref.scrollWidth > ref.clientWidth
    });
  };

  render() {
    return [
      <div
        key="scrollLeft"
        data-amount={`-${this.props.scrollAmount}`}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        {this.state.showScrollButtons ? this.props.leftScrollButton : undefined}
      </div>,
      <div
        key="scrollChildren"
        ref={this.setScrollContent}
        style={{
          overflowX: 'hidden'
        }}
      >
        {this.props.children}
      </div>,
      <div
        key="scrollRight"
        data-amount={`${this.props.scrollAmount}`}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      >
        {this.state.showScrollButtons
          ? this.props.rightScrollButton
          : undefined}
      </div>
    ];
  }
}

export default HorizontalScroll;
