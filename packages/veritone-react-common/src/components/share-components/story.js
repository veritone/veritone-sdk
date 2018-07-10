import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import styles from './styles.scss';
import PillButton from './buttons/PillButton';
import AlertDialog from './AlertDialog';
import DynamicContentScroll from './scrolls/DynamicContentScroll';

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
  .add('Alert Dialog', () => {
    const title = `Don't read the description text!!!`;
    const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, Ut enim ad minim veniam. By clicking either button you agree to grant us an option to claim your immortal soul. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    return (
      <AlertDialog
        open={boolean('open', true)}
        title={boolean('has title', true) ? title : null}
        content={boolean('has content', true) ? content : null}
        fullScreen={boolean('Full Screen', false)}
        onApprove={action('approve button clicked')}
        onCancel={
          boolean('Enable Cancel Callback', false)
            ? action('cancel button clicked')
            : null
        }
      />
    );
  })
  .add('Dynamic Vertical Scroll', () => {
    return <DynamicScrollContainer />;
  });

// Dynamic Container Helpers
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
        content: (
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
          neglectableSize={50}
          estimatedDisplaySize={500}
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
