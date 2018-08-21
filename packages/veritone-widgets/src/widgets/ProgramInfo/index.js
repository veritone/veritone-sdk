import React from 'react';
import {
  func,
  bool,
  objectOf,
  arrayOf,
  any,
  shape,
  string,
  number
} from 'prop-types';
import { noop } from 'lodash';
import { submit } from 'redux-form';
import { connect } from 'react-redux';
import { ProgramInfo } from 'veritone-react-common';
import FilePicker from '../FilePicker';

import * as filePickerModule from '../../redux/modules/filePicker';

import widget from '../../shared/widget';

@connect(null, { submit, pick: filePickerModule.pick }, null, { withRef: true })
class ProgramInfoWidget extends React.Component {
  static propTypes = {
    program: shape({
      name: string,
      programImage: string,
      signedProgramImage: string,
      programLiveImage: string,
      signedProgramLiveImage: string,
      description: string,
      website: string,
      format: string,
      language: string,
      isNational: bool,
      acls: arrayOf(
        shape({
          organizationId: string.isRequired,
          permission: string.isRequired
        })
      ),
      isPublic: bool,
      affiliates: arrayOf(
        shape({
          id: string.isRequired,
          name: string.isRequired,
          schedule: objectOf(any).isRequired
        })
      )
    }),
    programFormats: arrayOf(string),
    canShare: bool,
    organizations: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    canEditAffiliates: bool,
    canBulkAddAffiliates: bool,
    affiliates: arrayOf(
      shape({
        id: string.isRequired,
        name: string.isRequired
      })
    ),
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string,
    submit: func.isRequired
  };


  static defaultProps = {
    program: {}
  };

  state = {
    submitCallback: noop,
    openFilePicker: false,
    selectImageType: null,
    program: {
      ...this.props.program
    }
  };

  submit = (submitCallback = noop) => {
    this.setState(
      {
        submitCallback
      },
      () => this.props.submit('programInfo')
    );
  };

  onUploadImage = fileType => {
    console.log('open file picker widget');
    this.props.pick(this.props._widgetId);
    this.setState({
      selectImageType: fileType
    });
  };

  onPick = files => {
    console.log('on pick');
    console.log(files);
    // TODO edit url in program
  };

  render() {
    const { openFilePicker } = this.state;
    console.log(openFilePicker);
    return (
      <div>
        <ProgramInfo
          {...this.props}
          program={this.state.program}
          onSubmit={this.state.submitCallback}
          onUploadImage={this.onUploadImage}
        />
        <FilePicker
          id={this.props._widgetId}
          onPick={this.onPick}
          width={600}
          height={600}
        />
      </div>
    );
  }
}

export default widget(ProgramInfoWidget);
