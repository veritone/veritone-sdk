import React from "react";
import PropTypes from "prop-types";
import cx from 'classnames';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlineIcon from '@material-ui/icons/InfoOutline';
import CloseIcon from "@material-ui/icons/Close";
import Divider from '@material-ui/core/Divider';

import LocationSelect from '../AreaSelect';
import RangeSelect from '../RangeSelect';
import style from './styles.scss';


class ResponsiveDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    onAddAdvancedSearchParams: PropTypes.func,
    handleReset: PropTypes.func,
    searchByTag: PropTypes.string
  };

  onEditAoI = () => {
    const { onChangeStep } = this.props;
    onChangeStep(2);
  }

  onRemoveAoI = () => {
    const { onChangeStep, handleDeleteBoundingBox } = this.props;
    onChangeStep(1);
    handleDeleteBoundingBox();
  }

  render() {
    const { open, handleClose, searchByTag, boundingBoxes, selectedConfidenceRange } = this.props;
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
              <div className={cx(style["title-text"])}>
                Advanced Options
              </div>
              <div>
                <IconButton
                  className={cx(style["advanced-icon-button"])}
                  onClick={handleClose}
                >
                  <InfoOutlineIcon />
                </IconButton>
                <IconButton
                  className={cx(style["advanced-icon-button"])}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </div>
          <Divider />
          <div className={cx(style["dialog-content"])}>
            <div className={cx(style["area-text"])}>Area of Interest</div>
            <div className={cx(style["only-return-text"])}>
              Only return search results for this {searchByTag} if they appear in a defined region.
            </div>
            <div className={cx(style["location-select-div"])}>
              <LocationSelect
                onEditAoI={this.onEditAoI}
                onRemoveAoI={this.onRemoveAoI}
                onUpdateStep={this.props.onChangeStep}
                boundingBoxes={boundingBoxes}
                handleAddBoundingBox={this.props.handleAddBoundingBox}
                handleDeleteBoundingBox={this.props.handleDeleteBoundingBox}
                handleChangeBoundingBox={this.props.handleChangeBoundingBox}
                step={this.props.step}
              />
            </div>
          </div>
          <Divider />
          <div className={cx(style["dialog-content"])}>
            <div className={cx(style["area-text"])}>Confidence</div>
            <div className={cx(style["only-return-text"])}>
              Search by the percentage of confidence of this {searchByTag}.
            </div>
            <div className={cx(style["location-select-div"])}>
              <RangeSelect
                onChangeConfidenceRange={this.props.onChangeConfidenceRange}
                selectedConfidenceRange={selectedConfidenceRange}
              />
            </div>
          </div>
          <div className={cx(style["dialog-content"], style["action"])}>
            <div
              onClick={this.props.handleReset}
              className={cx(style["reset-all"])}
            >
              RESET ALL
            </div>
            <div>
              <Button
                onClick={handleClose}
                className={cx(style["vbtn-black-color"], style["vbtn-cancel"])}
              >
                CANCEL
                </Button>
              <Button
                onClick={this.props.onAddAdvancedSearchParams}
                variant="raised"
                className={cx(style["vbtn-blue"])}
              >
                APPLY
              </Button>
            </div>
          </div>
        </Dialog>
      </div >
    );
  }
}

export default ResponsiveDialog;
