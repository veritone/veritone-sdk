import React from "react";
import PropTypes from "prop-types";
import cx from 'classnames';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Info from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';
import { findIndex, get } from "lodash";

import { guid } from '../../helpers/guid';
import LocationSelect from '../LocationSelect';
import RangeSelect from '../RangeSelect';
import style from './styles.scss';


class ResponsiveDialog extends React.Component {
  state = {
    open: false,
    boundingBoxes: [],
    step: 1,
    selectedConfidenceRange: [0, 100]
  };

  componentWillReceiveProps(nextProps) {
    const { advancedOptions: nextAdvancedOptions } = nextProps;
    // const { advancedOptions: currentAdvancedOptions } = this.props;
    const boundingPoly = get(nextAdvancedOptions, "boundingPoly")
    // if (JSON.stringify(nextAdvancedOptions) !== JSON.stringify(currentAdvancedOptions)) {
    this.setState(state => ({
      ...state,
      boundingBoxes: boundingPoly ? [{
        boundingPoly: nextAdvancedOptions.boundingPoly,
        overlayObjectType: "c",
        id: guid()
      }] : [],
      step: (boundingPoly && boundingPoly.length) ? 3 : 1,
      selectedConfidenceRange: nextAdvancedOptions.range ? nextAdvancedOptions.range : [0, 100]
    }))
    // }
  }

  handleAddBoundingBox = newBox => {
    if (this.state.boundingBoxes.length) {
      return;
    }

    this.setState(state => ({
      boundingBoxes: [
        ...state.boundingBoxes,
        {
          ...newBox,
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
    })
  }

  onRemoveAoI = () => {
    this.setState({
      step: 1,
      boundingBoxes: []
    })
  }

  onUpdateStep = (step) => {
    this.setState({
      step: step,
      readOnly: step !== 2
    })
    if (step === 2) {
      const defaultBoundingBox = {
        boundingPoly: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: 0 }
        ],
        overlayObjectType: "c",
        id: guid()
      }
      this.handleAddBoundingBox(defaultBoundingBox);
    }
  }

  onChangeConfidenceRange = (e) => {
    this.setState({
      selectedConfidenceRange: [...e]
    })
  }

  handleResetAll = () => {
    this.setState({
      step: 1,
      boundingBoxes: [],
      selectedConfidenceRange: [0, 100]
    });
    this.props.handleReset();
  }

  handleApply = () => {
    const { onAddAdvancedSearchParams } = this.props;
    const { boundingBoxes, selectedConfidenceRange } = this.state;
    onAddAdvancedSearchParams({
      boundingPoly: get(boundingBoxes, [0, "boundingPoly"], []),
      range: selectedConfidenceRange
    })
  }



  render() {
    const { boundingBoxes, step } = this.state;
    const { open, handleClose } = this.props;
    return (
      <div>
        <Dialog
          maxWidth={false}
          open={open}
          onClose={handleClose}
          aria-labelledby="advanced-search-panel"
        >
          <div id="advanced-search-panel">
            <div className={cx(style["title"])}>
              <div className={cx(style["title-text"])}>Advanced Options</div>
              <div>
                <IconButton className={cx(style["icon-button"])} onClick={handleClose}>
                  <Info />
                </IconButton>
                <IconButton className={cx(style["icon-button"])} onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <Divider />
          <div className={cx(style["dialog-content"])}>
            <div className={cx(style["area-text"])}>Area of Interest</div>
            <div className={cx(style["only-return-text"])}>Only return search results for this logo if they appear in a defined region.</div>
            <div className={cx(style["location-select-div"])}>
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
          <div className={cx(style["dialog-content"])}>
            <div className={cx(style["area-text"])}>Confidence</div>
            <div className={cx(style["only-return-text"])}>Search by the percentage of confidence of this logo.</div>
            <div className={cx(style["location-select-div"])}>
              <RangeSelect onChangeConfidenceRange={this.onChangeConfidenceRange} selectedConfidenceRange={this.state.selectedConfidenceRange} />
            </div>
          </div>
          <div className={cx(style["dialog-content"], style["action"])}>
            <div onClick={this.handleResetAll} className={cx(style["reset-all"])}>RESET ALL</div>
            <div>
              <Button onClick={handleClose}>CANCEL</Button>
              <Button onClick={this.handleApply} variant="raised" color="primary">
                APPLY
              </Button>
            </div>
          </div>
        </Dialog>
      </div >
    );
  }
}

ResponsiveDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
};

export default ResponsiveDialog;
