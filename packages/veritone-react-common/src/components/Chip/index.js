import React from 'react';
import LibChip from 'material-ui/es/Chip';
import { string, node } from 'prop-types';

import styles from './styles.scss';

export default class Chip extends React.Component {
  static propTypes = {
    label: node,
    hoveredLabel: string
  };

  state = {
    hovered: false
  };

  handleMouseOver = () => {
    if (this.props.hoveredLabel) {
      this.setState({ hovered: true });
    }
  };

  handleMouseOut = () => {
    if (this.props.hoveredLabel) {
      this.setState({ hovered: false });
    }
  };

  render() {
    const { hoveredLabel, label, ...chipProps } = this.props;

    return (
      <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <LibChip
          classes={{ root: styles.root }}
          {...chipProps}
          label={this.state.hovered ? hoveredLabel : label}
        />
      </div>
    );
  }
}
