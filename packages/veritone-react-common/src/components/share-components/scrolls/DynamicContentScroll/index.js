import React, { Component } from 'react';
import { arrayOf, string, number, shape, any, func } from 'prop-types';
import { sortBy, isNumber } from 'lodash';
import classNames from 'classnames';
import styles from './style.scss';

export default class DynamicContentScroll extends Component {
  static propTypes = {
    contents: arrayOf(
      shape({
        start: number,
        stop: number,
        content: any
      })
    ),
    className: string,

    totalSize: number,
    neglectableSize: number,
    estimatedDisplaySize: number,

    currentValue: number,
    onScroll: func,
    requestTimeMs: number
  };

  static defaultProps = {
    currentValue: 0,
    neglectableSize: 0
  };

  // eslint-disable-next-line react/sort-comp
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.currentValue !== this.props.currentValue) {
      this.scrollTo(newProps.currentValue);
    }
  }

  componentDidUpdate() {
    let requestTimeMs = this.props.requestTimeMs;

    // request more data to fill empty gaps in the display viewport
    if (!isNumber(requestTimeMs) || requestTimeMs <= 0) {
      setTimeout(this.requestMoreContents);
    } else {
      setTimeout(this.requestMoreContents, requestTimeMs);
    }
  }

  scrollTo = value => {
    if (value >= 0) {
      const anchors = this.container.querySelectorAll('[anchor=time-anchor]');
      for (
        let anchorIndex = 0, numAnchors = anchors.length;
        anchorIndex < numAnchors;
        anchorIndex++
      ) {
        const anchor = anchors[anchorIndex];
        const startVal = anchor.getAttribute('start');
        const stopVal = anchor.getAttribute('stop');

        if (startVal <= value) {
          if (stopVal > value) {
            anchor.scrollIntoView(true);
          }
        } else {
          break;
        }
      }
    }
  };

  handleScrolling = event => {
    if (this.props.onScroll) {
      this.scrollCheck && clearTimeout(this.scrollCheck);
      this.scrollCheck = setTimeout(this.requestMoreContents, 500);
    }
  };

  requestMoreContents = () => {
    if (this.props.onScroll) {
      this.scrollCheck = null;

      const fillers = this.container.querySelectorAll('[name=filler]');

      let finalStart = undefined;
      let finalStop = undefined;

      const containerBox = this.container.getBoundingClientRect();
      for (
        let fillerIndex = 0, numFillers = fillers.length;
        fillerIndex < numFillers;
        fillerIndex++
      ) {
        const filler = fillers[fillerIndex];
        const fillerBox = filler.getBoundingClientRect();

        if (fillerBox.top < containerBox.bottom) {
          if (
            fillerBox.top > containerBox.top ||
            fillerBox.bottom > containerBox.top
          ) {
            const itemStart = parseInt(filler.getAttribute('start'));
            const itemStop = parseInt(filler.getAttribute('stop'));

            if (finalStart === undefined || finalStart > itemStart) {
              finalStart = itemStart;
            }

            if (finalStop === undefined || finalStop < itemStop) {
              finalStop = itemStop;
            }
          }
        } else {
          break;
        }
      }

      finalStart !== undefined &&
        finalStop !== undefined &&
        this.props.onScroll({ start: finalStart, stop: finalStop });
    }
  };

  setContainerRef = target => {
    this.container = target;
  };

  renderFillers(start, stop) {
    const { estimatedDisplaySize, neglectableSize } = this.props;

    const numSegment = 5; // num empty segments that can be displayed in the scrollabe window at one time
    const segmentHeight = 100 / numSegment + '%';
    const segmentSize = estimatedDisplaySize / numSegment;

    const fillers = [];
    let currentStart = start;
    while (currentStart + neglectableSize < stop) {
      if (currentStart + segmentSize < stop) {
        const nextStart = currentStart + segmentSize;
        fillers.push(
          <div
            key={`key-${currentStart}-${nextStart}`}
            name={'filler'}
            anchor={'time-anchor'}
            start={currentStart}
            stop={nextStart}
            className={styles.fillerSegment}
            style={{ height: segmentHeight }}
          />
        );
        currentStart = nextStart;
      } else {
        fillers.push(
          <div
            key={`key-${currentStart}-${stop}`}
            name={'filler'}
            anchor={'time-anchor'}
            start={currentStart}
            stop={stop}
            className={styles.fillerSegment}
            style={{ height: segmentHeight }}
          />
        );
        break;
      }
    }

    return fillers;
  }

  renderContent() {
    const { contents, totalSize, neglectableSize, onScroll } = this.props;

    // Sort Contents
    const sortedContent = contents
      ? sortBy(this.props.contents, 'start', 'stop')
      : [];
    const numContents = sortedContent.length;

    let renderItems = [];
    let prevStopPoint = 0;
    for (let contentIndex = 0; contentIndex < numContents; contentIndex++) {
      const entry = sortedContent[contentIndex];
      const startVal = entry.start;
      const stopVal = entry.stop;
      const content = entry.content;

      // Add fillers above content if needed
      if (onScroll && startVal - prevStopPoint > neglectableSize) {
        const fillers = this.renderFillers(prevStopPoint, startVal);
        renderItems = renderItems.concat(fillers);
      }

      // Add Content
      renderItems.push(
        <span
          key={`anchor-key-${startVal}-${stopVal}-${contentIndex}`}
          anchor={'time-anchor'}
          start={startVal}
          stop={stopVal}
        />
      ); // add anchor for scroll to
      renderItems.push(content);
      prevStopPoint = stopVal;

      // Add fillers after content if needed
      if (
        onScroll &&
        contentIndex === numContents - 1 &&
        prevStopPoint + neglectableSize < totalSize
      ) {
        const fillers = this.renderFillers(prevStopPoint, totalSize);
        renderItems = renderItems.concat(fillers);
      }
    }

    return renderItems;
  }

  render() {
    return (
      <div
        ref={this.setContainerRef}
        className={classNames(styles.dynamicVScroll, this.props.className)}
        onScroll={this.handleScrolling}
      >
        {this.renderContent()}
      </div>
    );
  }
}
