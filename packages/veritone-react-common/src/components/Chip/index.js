import React from 'react';
import LibChip from '@material-ui/core/Chip';
import { string, node } from 'prop-types';
import { withStyles } from 'helpers/withStyles';
import styles from './styles';

const classes = withStyles(styles);
class Chip extends React.Component {
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
          classes={{ root: classes.root }}
          {...chipProps}
          label={this.state.hovered ? hoveredLabel : label}
        />
      </div>
    );
  }
}

export default Chip;
