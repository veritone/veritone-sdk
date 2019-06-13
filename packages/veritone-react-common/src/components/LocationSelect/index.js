import React, { Component } from 'react'
import { arrayOf, func, string } from 'prop-types';
import cx from 'classnames';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import { findIndex } from 'lodash';
import { guid } from 'helpers/guid';

import OverlayPositioningProvider from '../BoundingPolyOverlay/OverlayPositioningProvider';
import Overlay from '../BoundingPolyOverlay/Overlay';
import AreaInterest from '../AreaInterest';
import styles from './styles.scss';


export default class LocationSelect extends Component {

  static propTypes = {
    listLocation: arrayOf(Object),
    onSelectLocation: func,
    selectedLocationId: string
  }

  state = {
    open: false,
    boundingBoxes: [],
    frame: 0,
    selected: "",
    step: 1,
    readOnly: true
  };

  UNSAFE_componentWillMount() {
    const { selectedLocationId } = this.props;
    this.setState({
      selected: selectedLocationId
    });
  }

  handleChange = id => event => {
    const { onSelectLocation } = this.props;
    this.setState({ selected: id })
    onSelectLocation(id);
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }
  actionMenuItems = [
    {
      label: 'Do action 1',
      onClick: id => console.log('Action 1 performed on box', id)
    },
    {
      label: 'Do action 2',
      onClick: id => console.log('Action 2 performed on box', id)
    }
  ];

  handleAddBoundingBox = newBox => {
    if (this.state.boundingBoxes.length) {
      return;
    }
    console.log('Added box', newBox);

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
    console.log('Deleted box with ID', deletedId);

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

  onUpdateStep = (step) => (event) => {
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
      this.setState(state => ({
        boundingBoxes: [...state.boundingBoxes, defaultBoundingBox]
      }))
    }
  }

  render() {
    const { step } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.screenLocation}>
          <OverlayPositioningProvider
            contentHeight={200}
            contentWidth={340}
            fixedWidth
          >
            <Overlay
              onAddBoundingBox={this.handleAddBoundingBox}
              onDeleteBoundingBox={this.handleDeleteBoundingBox}
              onChangeBoundingBox={this.handleChangeBoundingBox}
              initialBoundingBoxPolys={this.state.boundingBoxes}
              handleChangeFrame={this.handleChangeFrame}
              key={this.state.frame}
              readOnly={!!this.state.readOnly}
            />
            <div
              style={{
                backgroundImage: `url(https://picsum.photos/${
                  340
                  }/${200})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundColor: 'lightBlue',
                height: 200,
                width: 340
              }}
            />
          </OverlayPositioningProvider>
        </div>
        <div className={styles.locationalCheckbox}>
          {step === 1 &&
            <div className={cx(styles["step-item"])}>
              <div className={styles.introText}>
                Use your mouse to draw a bounding box on the area on the image you would like to return search results.
              </div>
              <Button onClick={this.onUpdateStep(2)} color="primary">ADD AREA OF INTEREST</Button>
            </div>
          }
          {step === 2 &&
            <div className={cx(styles["step-item"])}>
              <div className={styles.introText}>
                Use your mouse to draw a bounding box on the area on the image you would like to return search results.
            </div>
              <Button onClick={this.onUpdateStep(3)} color="primary">SAVE AREA OF INTEREST</Button>
            </div>}
          {step === 3 && <div className={cx(styles["aria-item"])}>
            <AreaInterest />
          </div>}
        </div>
      </div>
    );
  }
}
