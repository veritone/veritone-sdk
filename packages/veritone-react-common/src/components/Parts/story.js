import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import styles from './styles.scss';
import PillButton from './Buttons/PillButton';
import DynamicContentScroll from './Scrolls/DynamicContentScroll';

storiesOf('Share Components', module)
  .add('Pill Button', () => {
    return (
      <div className={styles.pillButtons}>
        <PillButton label="default label" info="(2)" />
        <PillButton
          label="custom label"
          info="custom info"
          className={styles.customButton}
          infoClassName={styles.customBadge}
          labelClassName={styles.customLabel}
        />
        <PillButton label="label only" />
        <PillButton info="(info only)" />
        <PillButton
          label="this is a very long label for a pill button"
          info="(2)"
        />
        <PillButton label="highlighted button" info="(tada)" highlight />
      </div>
    );
  })
  .add('Dynamic Vertical Scroll', () => {
    return <DynamicScrollContainer />;
  });

class DynamicScrollContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contents: this.genContents(0, 800, 50, 200)
    };

    this.handleScrolling = this.handleScrolling.bind(this);
  }

  handleScrolling(value) {
    let newContents = this.genContents(value.start, value.stop, 50, 200);
    newContents = [].concat(newContents, this.state.contents);

    this.setState({
      contents: newContents
    });
  }

  genContents(startValue, stopValue, minStepSize = 20, maxStepSize = 50) {
    let contents = [];
    let stepSize =
      Math.round(Math.random() * (maxStepSize - minStepSize)) + minStepSize;
    for (let value = startValue; value < stopValue; value = value + stepSize) {
      contents.push({
        start: value,
        stop: value + stepSize,
        value: (
          <DummyComponent key={'key-dummy' + value + '-' + value + stepSize} />
        )
      });
    }

    return contents;
  }

  render() {
    return (
      <div className={styles.dynamicVScroll}>
        <DynamicContentScroll
          contents={this.state.contents}
          totalSize={5000}
          segmentSize={100}
          neglectableSize={50}
          numSegmentPerUpdate={3}
          currentValue={0}
          onScroll={this.handleScrolling}
        />
      </div>
    );
  }
}

class DummyComponent extends Component {
  render() {
    let randomHeight = Math.round(Math.random() * 100) + 20 + 'px';
    let randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    return (
      <div
        className={styles.dummyContentBox}
        style={{ height: randomHeight, background: randomColor }}
      >
        Dummy Content Box
      </div>
    );
  }
}
