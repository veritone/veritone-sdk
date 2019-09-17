import React from 'react';
import { func, string, node } from 'prop-types';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import styles from './styles.scss';

class ExpandableRow extends React.Component {
  static props = {
    summary: node,
    details: node,
    iconOpen: node,
    iconClose: node,
    onToggle: func
  };

  state = {
    expanded: false
  };

  toggleExpansion = evt => {
    this.setState(
      {
        expanded: !this.state.expanded
      },
      () => {
        if (this.props.onToggle) {
          this.props.onToggle();
        }
      }
    );
  };

  componentWillUnmount() {
    // default state is not expanded, so call onToggle to let the know the component will collapse when it unmounts
    if (this.state.expanded) {
      if (this.props.onToggle) {
        this.props.onToggle();
      }
    }
  }

  render() {
    return (
      <Paper className={styles.row} elevation={0}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className={styles.expansionContainer}
            onClick={this.toggleExpansion}
          >
            <div className={styles.summaryContainer}>{this.props.summary}</div>
            <div style={{ visibility: this.props.details ? 'visible' : 'hidden' }}>
              <IconButton onClick={this.toggleExpansion}>
                {this.state.expanded ? this.props.iconClose : this.props.iconOpen}
              </IconButton>
            </div>
          </div>
          {this.state.expanded && this.props.details && (
            <div className={styles.detailsContainer}>{this.props.details}</div>
          )}
        </div>
      </Paper>
    );
  }
}

export default ExpandableRow;
