import React, { Component } from 'react';
import { number, string, func, shape, bool, arrayOf } from 'prop-types';
import classNames from 'classnames';
import { isString, isArray, findIndex } from 'lodash';

import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Menu from '@material-ui/core/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

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
    speakerData: arrayOf(shape({
      series: arrayOf(shape({
        speakerId: string,
        startTimeMs: number,
        stopTimeMs: number
      }))
    })).isRequired,
    availableSpeakers: arrayOf(string).isRequired,
    editMode: bool,
    onChange: func,
    onClick: func,
    startMediaPlayHeadMs: number,
    stopMediaPlayHeadMs: number
  };

  static defaultProps = {
    startMediaPlayHeadMs: 0,
    stopMediaPlayHeadMs: 1000
  };

  state = {
    showMenuButton: false,
    anchorEl: null,
    applyAll: false,
    speakerName: this.props.speakerSegment.speakerId
  };

  handlePillClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.speakerSegment);
    }
  };

  handleMouseEnter = () => {
    this.setState({ showMenuButton: true });
  };

  handleMouseLeave = () => {
    this.setState({ showMenuButton: false });
  };

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null, showMenuButton: false });
  };

  handleClickApplyAll = () => {
    const { applyAll } = this.state;
    this.setState({ applyAll: !applyAll });
  };

  handleNameInputChange = event => {
    const value = event.target.value;
    this.setState({ speakerName: value });
  };

  handleAvailableSpeakerClick = id => () => {
    this.setState({ speakerName: id });
  };

  handleAddClick = event => {
    const { editMode, speakerData, speakerSegment, onChange } = this.props;
    const { applyAll, speakerName } = this.state;
    const { speakerId } = speakerSegment;
    const isApplyAll = speakerId ? applyAll : false;

    const { hasChange, historyDiff } = generateSpeakerUpdateDiffHistory(speakerData, speakerSegment, isApplyAll, speakerName)

    hasChange, editMode && onChange && onChange(event, historyDiff);
    this.handleMenuClose();
  };

  handleRemoveClick = event => {
    const { editMode, speakerData, speakerSegment, onChange } = this.props;
    const { applyAll } = this.state;
    const { speakerId } = speakerSegment;
    const isApplyAll = speakerId ? applyAll : false;

    const { hasChange, historyDiff } = generateSpeakerUpdateDiffHistory(speakerData, speakerSegment, isApplyAll, '')

    hasChange, editMode && onChange && onChange(event, historyDiff);
    this.handleMenuClose();
  };

  render() {
    const {
      editMode,
      speakerSegment,
      availableSpeakers,
      startMediaPlayHeadMs,
      stopMediaPlayHeadMs
    } = this.props;
    const {
      speakerId,
      startTimeMs,
      stopTimeMs,
      guid
    } = speakerSegment;
    const {
      showMenuButton,
      anchorEl,
      applyAll,
      speakerName
    } = this.state;

    const extractPillLabel = speakerId => {
      if (isString(speakerId) && speakerId.length > 2) {
        return speakerId.split(' ')
          .map(part => part.slice(0, 1))
          .join('')
          .toUpperCase();
      }
      return speakerId;
    };
    const extractLabel = speakerId => {
      if (isString(speakerId) && speakerId.length > 2) {
        return speakerId;
      }
      return 'Speaker ' + speakerId;
    };

    const speakerKey = guid ? guid : `speaker-pill-${speakerId}-${startTimeMs}-${stopTimeMs}`;
    const isHighlighted = !(stopMediaPlayHeadMs < startTimeMs || startMediaPlayHeadMs > stopTimeMs);
    const colorClass = isHighlighted ? styles.highlight : '';
    const speakerPillLabel = extractPillLabel(speakerId);
    const speakerLabel = extractLabel(speakerId);
    const otherSpeakers = availableSpeakers.filter(id => speakerId !== id);
    

    return (
      <div
        className={ this.props.className }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }>
        <Tooltip
          title={speakerLabel}
          placement="bottom-end"
          disableHoverListener={!speakerId}>
          <div style={{ display: 'inline' }}>
            {
              speakerId ? (
                <Chip
                  className={ classNames(styles.speakerPill, colorClass) }
                  key={ speakerKey }
                  label={ speakerPillLabel }
                  onClick={ this.handlePillClick }
                  clickable
                />
              ) : (
                <IconButton
                className={ classNames(styles.nullSpeakerIcon, colorClass) }
                  disableRipple
                  onClick={ this.handlePillClick }>
                  <PersonAddIcon />
                </IconButton>
              )
            }
          </div>
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
          MenuListProps={{ className: styles.speakerMenu }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}>
          {
            speakerId ? (
              <ListItem
                className={styles.speakerMenuItem}
                dense
                button
                disableRipple
                onClick={this.handleClickApplyAll}>
                <Checkbox
                  color="primary"
                  disableRipple
                  checked={applyAll} />
                <ListItemText primary={`Apply to all "${speakerLabel}"`} />
              </ListItem>
            ) : null
          }
          <ListItem
            className={styles.speakerMenuItem}
            dense
            >
            <FormControl className={styles.speakerInputContainer}>
              <InputLabel
                className={styles.speakerInputLabel}
                htmlFor={`name-input-${speakerKey}`}>
                Speaker Name
              </InputLabel>
              <Input
                className={styles.speakerInput}
                id={`name-input-${speakerKey}`}
                type="text"
                onChange={this.handleNameInputChange}
                value={speakerName}
                fullWidth
                endAdornment={
                  speakerName !== speakerId ? (
                    <Button
                      disabled={!speakerName}
                      disableRipple
                      color="primary"
                      size="small"
                      onClick={this.handleAddClick}>
                      Add
                    </Button>
                  ) : (
                    <Button
                      disabled={!speakerName}
                      disableRipple
                      color="primary"
                      size="small"
                      onClick={this.handleRemoveClick}>
                      Remove
                    </Button>
                  )
                } />
            </FormControl>
          </ListItem>
          <ListItem
            className={ classNames(styles.speakerMenuItem, styles.darkMenuSection) }
            dense>
            <span
              className={styles.speakerMenuAvailableHeader}>
              Available Speakers
            </span>
          </ListItem>
          <div
            className={ styles.availableSpeakersScroller }>
            {
              otherSpeakers.map(id => {
                return (
                  <ListItem
                    key={`available-speaker-${id}`}
                    className={ classNames(styles.speakerMenuItem, styles.darkMenuSection) }
                    dense button
                    onClick={this.handleAvailableSpeakerClick(id)}>
                    
                    <ListItemIcon>
                      {
                        speakerName === id ? (
                            <CheckIcon className={ styles.speakerCheckIcon } />
                        ) : <div />
                      }
                    </ListItemIcon>
                    <ListItemText>{extractLabel(id)}</ListItemText>
                  </ListItem>
                )
              })
            }
          </div>
        </Menu>
      </div>
    );
  }
};

function generateSpeakerUpdateDiffHistory(speakerData, speakerSegment, applyAll, speakerName) {
  const speakerChanges = [];
  const { guid, speakerId } = speakerSegment;

  if (applyAll) {
    isArray(speakerData) && speakerData.forEach((chunk, chunkIndex) => {
      isArray(chunk.series) && chunk.series.forEach((serie, index) => {
        serie.speakerId === speakerId && speakerChanges.push({
          chunkIndex,
          index,
          action: 'UPDATE',
          oldValue: serie,
          newValue: {
            ...serie,
            speakerId: speakerName
          }
        });
      });
    });
  } else {
    isArray(speakerData) && speakerData.forEach((chunk, chunkIndex) => {
      let index;
      isArray(chunk.series) &&
        (index = findIndex(chunk.series, ['guid', guid])) !== -1 &&
        speakerChanges.push({
          chunkIndex,
          index,
          action: 'UPDATE',
          oldValue: speakerSegment,
          newValue: {
            ...speakerSegment,
            speakerId: speakerName
          }
        });
    });
  }

  return {
    hasChange: speakerChanges.length,
    historyDiff: {
      speakerChanges
    }
  };
}