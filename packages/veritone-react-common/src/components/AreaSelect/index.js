import React, { Component } from 'react';
import { func, arrayOf, number } from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button';

import { OverlayPositioningProvider } from '../BoundingPolyOverlay/OverlayPositioningProvider';
import Overlay from '../BoundingPolyOverlay/Overlay';
import AreaInterest from '../AreaInterest';
import styles from './styles.scss';

const stylesByObjectType = {
  a: {
    backgroundColor: 'rgba(72,147,226,0.7)',
  },
  b: {
    backgroundColor: 'rgba(72,147,226,0.7)',
  },
  c: {
    backgroundColor: 'rgba(72,147,226,0.7)',
  },
};

const stagedBoundingBoxStyles = {
  backgroundColor: 'rgba(72,147,226,0.7)',
  border: '1px solid #4893E2',
};

const stepIntro = {
  1: 'Use your mouse to draw a bounding box on the area on the image you would like to return search results.',
  2: 'Use your mouse to draw a bounding box on the area on the image you would like to return search results.',
};
const buttonTextStep = {
  1: 'ADD AREA OF INTEREST',
  2: 'SAVE AREA OF INTEREST',
};
export default class LocationSelect extends Component {
  static propTypes = {
    handleAddBoundingBox: func,
    handleDeleteBoundingBox: func,
    handleChangeBoundingBox: func,
    onUpdateStep: func,
    boundingBoxes: arrayOf(Object),
    step: number,
    onEditAoI: func,
    onRemoveAoI: func,
  };

  state = {
    open: false,
    boundingBoxes: [],
    frame: 0,
    selected: '',
    step: 1,
    readOnly: true,
  };

  onUpdateStep = step => () => {
    const { boundingBoxes } = this.props;
    if (step === 3 && !boundingBoxes.length) {
      return;
    }
    this.props.onUpdateStep(step);
  };

  render() {
    const {
      handleAddBoundingBox,
      handleDeleteBoundingBox,
      handleChangeBoundingBox,
      boundingBoxes,
      step = 1,
      onEditAoI,
      onRemoveAoI,
    } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.screenLocation}>
          <OverlayPositioningProvider
            contentHeight={200}
            contentWidth={340}
            fixedWidth
          >
            <Overlay
              onAddBoundingBox={handleAddBoundingBox}
              onDeleteBoundingBox={handleDeleteBoundingBox}
              onChangeBoundingBox={handleChangeBoundingBox}
              initialBoundingBoxPolys={boundingBoxes}
              stylesByObjectType={stylesByObjectType}
              stagedBoundingBoxStyles={stagedBoundingBoxStyles}
              handleChangeFrame={this.handleChangeFrame}
              key={this.state.frame}
              readOnly={step !== 2}
            />
            <div className={cx(styles['image-default'])} />
          </OverlayPositioningProvider>
        </div>
        <div className={styles.locationalCheckbox}>
          {step !== 3 ? (
            <div className={cx(styles['step-item'])}>
              <div className={styles.introText}>{stepIntro[step]}</div>
              <Button
                onClick={this.onUpdateStep(step + 1)}
                className={cx(styles['btn-action-area'])}
              >
                {buttonTextStep[step]}
              </Button>
            </div>
          ) : (
            <div className={cx(styles['aria-item'])}>
              <AreaInterest
                areaOfInterest={boundingBoxes[0]}
                onEditAoI={onEditAoI}
                onRemoveAoI={onRemoveAoI}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export { stepIntro, buttonTextStep };
