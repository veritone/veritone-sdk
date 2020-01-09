import React, { Component } from 'react'
import { func, arrayOf, number, shape, any } from 'prop-types';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import OverlayPositioningProvider from '../BoundingPolyOverlay/OverlayPositioningProvider';
import Overlay from '../BoundingPolyOverlay/Overlay';
import AreaInterest from '../AreaInterest';
import styles from './styles';

const stylesByObjectType = {
  a: {
    backgroundColor: 'rgba(72,147,226,0.7)'
  },
  b: {
    backgroundColor: 'rgba(72,147,226,0.7)'
  },
  c: {
    backgroundColor: 'rgba(72,147,226,0.7)'
  }
};

const stagedBoundingBoxStyles = {
  backgroundColor: 'rgba(72,147,226,0.7)',
  border: '1px solid #4893E2'
};

const stepIntro = {
  1: 'Use your mouse to draw a bounding box on the area on the image you would like to return search results.',
  2: 'Use your mouse to draw a bounding box on the area on the image you would like to return search results.'
}
const buttonTextStep = {
  1: 'ADD AREA OF INTEREST',
  2: 'SAVE AREA OF INTEREST'
}
class LocationSelect extends Component {

  static propTypes = {
    handleAddBoundingBox: func,
    handleDeleteBoundingBox: func,
    handleChangeBoundingBox: func,
    onUpdateStep: func,
    boundingBoxes: arrayOf(Object),
    step: number,
    onEditAoI: func,
    onRemoveAoI: func,
    classes: shape({ any }),
  }

  state = {
    open: false,
    boundingBoxes: [],
    frame: 0,
    selected: '',
    step: 1,
    readOnly: true
  };

  onUpdateStep = (step) => () => {
    const { boundingBoxes } = this.props;
    if (step === 3 && !boundingBoxes.length) {
      return;
    }
    this.props.onUpdateStep(step);
  }

  render() {
    const {
      handleAddBoundingBox,
      handleDeleteBoundingBox,
      handleChangeBoundingBox,
      boundingBoxes,
      step = 1,
      onEditAoI,
      onRemoveAoI,
      classes
    } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.screenLocation}>
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
            <div className={cx(classes['imageDefault'])} />
          </OverlayPositioningProvider>
        </div>
        <div className={classes.locationalCheckbox}>
          {step !== 3 ?
            <div className={cx(classes['stepItem'])}>
              <div
                className={classes.introText}
                data-test="introText"
              >
                {stepIntro[step]}
              </div>
              <Button
                onClick={this.onUpdateStep(step + 1)}
                className={cx(classes['btnActionArea'])}
              >
                {buttonTextStep[step]}
              </Button>
            </div>
            :
            <div className={cx(classes['ariaItem'])}>
              <AreaInterest
                areaOfInterest={boundingBoxes[0]}
                onEditAoI={onEditAoI}
                onRemoveAoI={onRemoveAoI}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LocationSelect);

export {
  stepIntro,
  buttonTextStep
}