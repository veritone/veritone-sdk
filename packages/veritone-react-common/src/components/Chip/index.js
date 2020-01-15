import React from 'react';
import LibChip from '@material-ui/core/Chip';
import { string, node, shape, any } from 'prop-types';
import { withStyles } from '@material-ui/styles';
import styles from './styles';

class Chip extends React.Component {
  static propTypes = {
    label: node,
    hoveredLabel: string,
    classes: shape({any}),
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
    const { hoveredLabel, label, classes, ...chipProps } = this.props;

    return (
      <div onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <LibChip
          classes={{ root: classes.root }}
          {...chipProps}
          label={this.state.hovered ? hoveredLabel : label}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Chip);
