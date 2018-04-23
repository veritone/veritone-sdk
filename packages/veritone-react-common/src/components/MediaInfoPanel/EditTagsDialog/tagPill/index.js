import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import { string, func } from 'prop-types';
import styles from './styles.scss';

class TagPill extends Component {
  static propTypes = {
    text: string,
    onRemove: func
  };

  onRemoveTag = () => {
    this.props.onRemove(this.props.text);
  };

  render() {
    return (
      <div className={styles.tagPillContainer}>
        {this.props.text &&
          this.props.text.length > 32 && (
            <Tooltip
              id={this.props.text}
              title={this.props.text}
              placement="top"
              enterDelay={1000}
              leaveDelay={700}
            >
              <span className={styles.tagText}>
                {this.props.text.substring(0, 32) + '...'}
              </span>
            </Tooltip>
          )}
        {this.props.text &&
          this.props.text.length <= 32 && (
            <span className={styles.tagText}>{this.props.text}</span>
          )}
        <IconButton
          onClick={this.onRemoveTag}
          aria-label="Remove"
          classes={{
            root: styles.removeButton
          }}
        >
          <Icon
            className="icon-close-exit"
            classes={{
              root: styles.removeButtonIcon
            }}
          />
        </IconButton>
      </div>
    );
  }
}

export default TagPill;
