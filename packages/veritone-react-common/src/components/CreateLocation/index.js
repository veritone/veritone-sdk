import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { findIndex } from 'lodash';

import OverlayPositioningProvider from '../BoundingPolyOverlay/OverlayPositioningProvider';
import Overlay from '../BoundingPolyOverlay/Overlay';


const styles = theme => ({
  dialog: {
    maxWidth: 640,
    paddingBottom: 24
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectDialog: {
    width: 360,
    height: 250,
    border: "1px solid #ccc!important"
  },
  content: {
    maxWidth: 615
  },
  contentText: {
    marginBottom: 24,
    color: "rgba(0,0,0,0.54)",
    fontFamily: "Roboto",
    fontSize: 15,
    lineHeight: "23px"
  },
  contentBody: {
    display: "flex",
    justifyContent: "space-between",
  },
  textField: {
    width: 180,
    margin: 0,
    padding: 0
  },
  action: {
    position: "absolute",
    bottom: 27,
    right: 25
  }
});

class ResponsiveDialog extends React.Component {
  state = {
    open: false,
    boundingBoxes: [],
    frame: 0
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

  handleChangeFrame = (e, frame) => {
    this.setState({ frame, boundingBoxes: frames[frame] });
  };
  render() {
    const { classes } = this.props;
    const { editStatus = false, location = {}, onSubmitLocation } = this.props;
    return (
      <div>
        <Button onClick={this.handleClickOpen}>Open responsive dialog</Button>
        <Dialog
          maxWidth={false}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <div className={classes.title}>
              <span>Add Custom Location</span>
              <IconButton onClick={this.handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent className={classes.content}>
            <DialogContentText className={classes.contentText}>
              Draw a bounding box around the custom area that you are interested
              in matching for this search item.
            </DialogContentText>
            <div>
              <div className={classes.contentBody}>
                <div className={classes.selectDialog}>
                  <OverlayPositioningProvider
                    contentHeight={250}
                    contentWidth={360}
                    fixedWidth
                  >
                    <Overlay
                      onAddBoundingBox={this.handleAddBoundingBox}
                      onDeleteBoundingBox={this.handleDeleteBoundingBox}
                      onChangeBoundingBox={this.handleChangeBoundingBox}
                      initialBoundingBoxPolys={this.state.boundingBoxes}
                      handleChangeFrame={this.handleChangeFrame}
                      key={this.state.frame}
                      // readOnly={!!this.state.boundingBoxes.length}
                    />
                    <div
                      style={{
                        backgroundImage: `url(https://picsum.photos/${
                          360
                          }/${250})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundColor: 'lightBlue',
                        height: 250,
                        width: 360
                      }}
                    />
                  </OverlayPositioningProvider>
                </div>
                <div>
                  <TextField
                    id="name"
                    label="Name"
                    autoFocus
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    placeholder="Location name"
                  />
                </div>
              </div>
              <div className={classes.action}>
                <Button className={classes.button}>CANCEL</Button>
                <Button variant="raised" color="primary" className={classes.button}>
                  ADD
                </Button>
              </div>
            </div>

          </DialogContent>
        </Dialog>
      </div >
    );
  }
}

ResponsiveDialog.propTypes = {
  classes: PropTypes.shape(Object),
  editStatus: PropTypes.bool,
  location: PropTypes.shape({ //editing location
    id: PropTypes.string,
    name: PropTypes.string,
    boundingPoly: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      })
    )
  }),
  onSubmitLocation: PropTypes.func
};

export default withStyles(styles)(ResponsiveDialog);
