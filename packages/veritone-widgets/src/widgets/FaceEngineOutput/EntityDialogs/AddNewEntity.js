import React, { Component } from 'react';
import {arrayOf, bool, func, shape, string} from 'prop-types';
import { get } from 'lodash';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Icon from "@material-ui/core/Icon/Icon";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import Dialog from "@material-ui/core/Dialog/Dialog";
import AddNewEntityForm from './AddNewEntityForm';
import connect from "react-redux/es/connect/connect";
import * as faceEngineOutput from "../../../redux/modules/mediaDetails/faceEngineOutput";
// import { LibraryForm } from 'veritone-react-common';

import styles from "./styles.scss";

@connect(
  (state) => ({
    open: faceEngineOutput.getAddNewEntityDialogOpen(state),
    isFetchingLibraries: faceEngineOutput.isFetchingLibraries(state),
    libraries: faceEngineOutput.getLibraries(state)
  }),
  {
    fetchLibraries: faceEngineOutput.fetchLibraries,
    createEntity: faceEngineOutput.createEntity
  },
  null,
  { withRef: true }
)
export default class AddNewEntityDialog extends Component {
  static propTypes = {
    open: bool,
    libraries: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ).isRequired,
    fetchLibraries: func.isRequired,
    isFetchingLibraries: bool,
    createEntity: func,
    onSubmit: func,
    onCancel: func
  };

  state = {
    selectedLibraryId: null
  };

  componentDidMount() {
    if(!get(this.props, 'libraries.length')) {
      this.props.fetchLibraries({
        libraryType: 'people'
      });
    }
  };

  handleSubmit = formData => {
    this.props.createEntity({
      ...formData
    }).then(res => {
      this.props.onSubmit(res.entity);
      return res;
    })
  };

  render() {
    const {
      libraries,
      isFetchingLibraries,
      onCancel
    } = this.props;
    const initialLibraryId = this.state.selectedLibraryId || get(libraries, '[0].id');
    return (
      <Dialog
        open={this.props.open}
        classes={{
          paper: styles.editNewEntityDialogPaper
        }}
      >
        <DialogTitle
          id="add-new-entity-title"
          classes={{
            root: styles.dialogTitle
          }}
        >
          <div className={styles.dialogTitleLabel}>{'Create New Entity'}</div>
          <IconButton
            onClick={this.props.onCancel}
            aria-label="Close Add New Entity"
            classes={{
              root: styles.closeButton
            }}
          >
            <Icon className="icon-close-exit" />
          </IconButton>
        </DialogTitle>
        <DialogContent className={styles.addEntityContent}>
          <DialogContentText
            classes={{
              root: styles.dialogHintText
            }}
          >
            Identify and help train face recognition engines to find this
            individual. You can view and add additional images in the Library
            application.
          </DialogContentText>
          <AddNewEntityForm
            isFetchingLibraries={isFetchingLibraries}
            libraries={libraries}
            initialValues={{
              libraryId: initialLibraryId
            }}
            onSubmit={this.handleSubmit}
            onCancel={onCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }
};
