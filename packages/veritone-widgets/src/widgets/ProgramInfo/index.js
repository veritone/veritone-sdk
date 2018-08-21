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

import widget from '../../shared/widget';

@connect(null, { submit }, null, { withRef: true })
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

  onUploadImage = fileType => event => {
    console.log('open file picket widget');
    this.setState({
      selectImageType: fileType,
      openFilePicker: true
    });
  };

  onPick = files => {
    console.log(files);
    // TODO edit url in program
  };

  render() {
    return (
      <div>
        <ProgramInfo
          {...this.props}
          program={this.state.program}
          onSubmit={this.state.submitCallback}
          onUploadImage={this.onUploadImage}
        />
        {/*<FilePicker
          open={this.state.openFilePicker}
          onPick={this.onPick}
        />*/}
      </div>
    );
  }
}

export default widget(ProgramInfoWidget);
