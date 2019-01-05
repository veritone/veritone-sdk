import React, { Component } from 'react';
import { number, string, func, shape, bool } from 'prop-types';
import classNames from 'classnames';
import { isString } from 'lodash';

import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import styles from './styles.scss';

export default class SpeakerPill extends Component {
  static propTypes = {
    className: string,
    speakerSegment: shape({
      speakerId: string,
      startTimeMs: number,
      stopTimeMs: number,
      guid: string
    }).isRequired,
    editMode: bool,
    onChange: func,
    onClick: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  state = {
    showMenuButton: false,
    anchorEl: null
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  handlePillClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.speakerSegment);
    }
  };

  handleMouseEnter = () => {
    this.setState({ showMenuButton: true });
  }

  handleMouseLeave = () => {
    this.setState({ showMenuButton: false });
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const {
      editMode,
      speakerSegment
    } = this.props;
    const {
      speakerId,
      startTimeMs,
      stopTimeMs,
      guid
    } = speakerSegment;
    const {
      showMenuButton,
      anchorEl
    } = this.state;

    const extractLabel = (speakerId) => {
      if (isString(speakerId) && speakerId.length > 2) {
        return speakerId.split(' ')
          .map(part => part.slice(0, 1))
          .join('')
          .toUpperCase();
      }
      return speakerId;
    };

    const {
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;
    const speakerKey = guid ? guid : `speaker-pill-${speakerId}-${startTimeMs}-${stopTimeMs}`;
    const isHighlighted = !(stopMediaPlayHeadMs < startTimeMs || startMediaPlayHeadMs > stopTimeMs);
    const colorClass = isHighlighted ? styles.highlight : '';
    const speakerLabel = extractLabel(speakerId);

    return (
      <div
        className={ this.props.className }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }>
        <Tooltip title={speakerId} placement="bottom-end">
          <Chip
            className={ classNames(styles.speakerPill, colorClass) }
            key={ speakerKey }
            label={ speakerId }
            onClick={ this.handlePillClick }
            clickable
          />
        </Tooltip>
        {
          (editMode && showMenuButton) ?
            (
              <IconButton
                className={ styles.editButton }
                disableRipple
                onClick={this.handleMenuOpen}>
                <EditIcon 
                  className={ styles.editIcon }/>
              </IconButton>
            ) : null
        }
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}>
          hello
        </Menu>
      </div>
    );
  }
};