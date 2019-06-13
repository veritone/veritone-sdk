import React from "react";
import PropTypes from "prop-types";
import cx from 'classnames';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Info from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';
import { withStyles } from "@material-ui/core/styles";

import LocationSelect from '../LocationSelect';
import RangeSelect from '../RangeSelect';
import style from './styles.scss';


const styles = theme => ({
  dialog: {
    maxWidth: 640,
    paddingBottom: 24
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20
  },
  titleText: {
    color: "#5C636B",
    fontFamily: "Roboto",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "21px"
  },
  selectDialog: {
    width: 360,
    height: 250,
    border: "1px solid #ccc!important"
  },
  content: {
    maxWidth: 670
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
  },
  iconButton: {
    width: 24,
    height: 24,
    marginLeft: 20
  },
  areaText: {

  }
});

class ResponsiveDialog extends React.Component {
  state = {
    open: false,
    boundingBoxes: [],
    frame: 0,
    selectedConfidenceRange: [25, 100]
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

  handleChangeFrame = (e, frame) => {
    this.setState({ frame, boundingBoxes: frames[frame] });
  };

  onChangeConfidenceRange = (e) => {
    this.setState({
      selectedConfidenceRange: [...e]
    })
  }
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
          <div id="responsive-dialog-title">
            <div className={classes.title}>
              <div className={classes.titleText}>Add Custom Location</div>
              <div>
                <IconButton className={classes.iconButton} onClick={this.handleClose}>
                  <Info />
                </IconButton>
                <IconButton className={classes.iconButton} onClick={this.handleClose}>
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
              <LocationSelect />
            </div>
          </div>
          <Divider />
          <div className={cx(style["dialog-content"])}>
            <div className={cx(style["area-text"])}>Confidence</div>
            <div className={cx(style["only-return-text"])}>Search by the percentage of confidence of this logo.</div>
            <div className={cx(style["location-select-div"])}>
              <RangeSelect selectedConfidenceRange={this.state.selectedConfidenceRange} onChangeConfidenceRange={this.onChangeConfidenceRange} />
            </div>
          </div>
          <div className={cx(style["dialog-content"], style["action"])}>
            <div className={cx(style["reset-all"])}>RESET ALL</div>
            <div>
              <Button onClick={this.handleClose} className={classes.button}>CANCEL</Button>
              <Button variant="raised" color="primary" className={classes.button}>
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
