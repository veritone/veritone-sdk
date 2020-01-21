import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import { findIndex, get, isEqual } from 'lodash';

import { guid } from '../../helpers/guid';
import LocationSelect from '../AreaSelect';
import RangeSelect from '../RangeSelect';
import style from './styles.scss';

const id = guid();

class AdvancedPanel extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    searchByTag: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleReset: PropTypes.func.isRequired,
    advancedOptions: PropTypes.shape(Object),
    onAddAdvancedSearchParams: PropTypes.func.isRequired
  };

  state = {
    open: false,
    boundingBoxes: [],
    step: 1,
    selectedConfidenceRange: [0, 100],
    parentBoudingPoly: [],
    parentRange: [0, 100]
  };

  static getDerivedStateFromProps(nextProps, currentState) {
    const currentParentBoudingPoly = get(currentState, 'parentBoudingPoly', []);
    const currentParentRange = get(currentState, 'parentRange', [0, 100]);
    const nextBoundingPoly = get(nextProps, 'advancedOptions.boundingPoly', []);
    const nextRange = get(nextProps, 'advancedOptions.range', [0, 100]);
    if (
      !isEqual(currentParentBoudingPoly, nextBoundingPoly) ||
      !isEqual(currentParentRange, nextRange)
    ) {
      return {
        boundingBoxes: nextBoundingPoly.length
          ? [
              {
                boundingPoly: nextBoundingPoly,
                overlayObjectType: 'c',
                id: id
              }
            ]
          : [],
        step: nextBoundingPoly && nextBoundingPoly.length ? 3 : 1,
        selectedConfidenceRange: nextRange,
        parentBoudingPoly: nextBoundingPoly,
        parentRange: nextRange
      };
    }
    return null;
  }

  handleAddBoundingBox = newBox => {
    if (this.state.boundingBoxes.length) {
      return;
    }
    this.setState(state => ({
      boundingBoxes: [
        ...state.boundingBoxes,
        {
          ...newBox
        }
      ]
    }));
  };

  handleDeleteBoundingBox = deletedId => {
    this.setState(state => ({
      boundingBoxes: state.boundingBoxes.filter(({ id }) => id !== deletedId)
    }));
  };

  handleChangeBoundingBox = changedBox => {
    this.setState(state => {
      const affectedIndex = findIndex(state.boundingBoxes, {
        id: changedBox.id
      });

      let newState = {
        boundingBoxes: [...state.boundingBoxes]
      };

      newState.boundingBoxes[affectedIndex] = changedBox;

      return {
        boundingBoxes: newState.boundingBoxes
      };
    });
  };

  onEditAoI = () => {
    this.setState({
      step: 2
    });
  };

  onRemoveAoI = () => {
    this.setState({
      step: 1,
      boundingBoxes: []
    });
  };

  onUpdateStep = step => {
    this.setState({
      step: step,
      readOnly: step !== 2
    });
    if (step === 2) {
      const defaultBoundingBox = {
        boundingPoly: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 }
        ],
        overlayObjectType: 'c',
        id: guid()
      };
      this.handleAddBoundingBox(defaultBoundingBox);
    }
  };

  onChangeConfidenceRange = e => {
    this.setState({
      selectedConfidenceRange: [...e]
    });
  };

  handleResetAll = () => {
    this.setState({
      step: 1,
      boundingBoxes: [],
      selectedConfidenceRange: [0, 100]
    });
    this.props.handleReset();
  };

  handleApply = () => {
    const { onAddAdvancedSearchParams } = this.props;
    const { boundingBoxes, selectedConfidenceRange, step } = this.state;
    onAddAdvancedSearchParams({
      boundingPoly:
        step === 3 ? get(boundingBoxes, [0, 'boundingPoly'], []) : [],
      range: selectedConfidenceRange
    });
  };

  render() {
    const { boundingBoxes, step } = this.state;
    const { open, handleClose, searchByTag } = this.props;
    return (
      <div>
        <Dialog
          maxWidth={false}
          open={open}
          onClose={handleClose}
          aria-labelledby="advanced-search-panel"
          data-veritone-component="advanced-search-panel"
        >
          <div id="advanced-search-panel">
            <div className={cx(style['title'])}>
              <div className={cx(style['title-text'])}>Advanced Options</div>
              <div>
                <IconButton
                  className={cx(style['advanced-icon-button'])}
                  data-veritone-element="advanced-search-info-btn"
                >
                  <InfoOutlineIcon />
                </IconButton>
                <IconButton
                  className={cx(style['advanced-icon-button'])}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <Divider />
          <div className={cx(style['dialog-content'])}>
            <div className={cx(style['area-text'])}>Area of Interest</div>
            <div className={cx(style['only-return-text'])}>
              Only return search results for this {searchByTag} if they appear
              in a defined region.
            </div>
            <div className={cx(style['location-select-div'])}>
              <LocationSelect
                onEditAoI={this.onEditAoI}
                onRemoveAoI={this.onRemoveAoI}
                onUpdateStep={this.onUpdateStep}
                boundingBoxes={boundingBoxes}
                handleAddBoundingBox={this.handleAddBoundingBox}
                handleDeleteBoundingBox={this.handleDeleteBoundingBox}
                handleChangeBoundingBox={this.handleChangeBoundingBox}
                step={step}
              />
            </div>
          </div>
          <Divider />
          <div className={cx(style['dialog-content'])}>
            <div className={cx(style['area-text'])}>Confidence</div>
            <div className={cx(style['only-return-text'])}>
              Search by the percentage of confidence of this {searchByTag}.
            </div>
            <div className={cx(style['location-select-div'])}>
              <RangeSelect
                onChangeConfidenceRange={this.onChangeConfidenceRange}
                selectedConfidenceRange={this.state.selectedConfidenceRange}
              />
            </div>
          </div>
          <div className={cx(style['dialog-content'], style['action'])}>
            <div
              onClick={this.handleResetAll}
              className={cx(style['reset-all'])}
            >
              RESET ALL
            </div>
            <div>
              <Button
                onClick={handleClose}
                className={cx(style['vbtn-black-color'], style['vbtn-cancel'])}
              >
                CANCEL
              </Button>
              <Button
                onClick={this.handleApply}
                variant="contained"
                className={cx(style['vbtn-blue'])}
              >
                APPLY
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export { AdvancedPanel };

export default AdvancedPanel;
