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
import { get, noop } from 'lodash';
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
    pick: func,
    _widgetId: string,
    relativeSize: number, // optional - used to scale text sizes from hosting app
    color: string,
    submit: func.isRequired
  };

  static defaultProps = {
    program: {}
  };

  state = {
    submitCallback: noop,
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
    this.props.pick(this.props._widgetId);
    this.setState({
      selectImageType: fileType
    });
  };

  onRemoveImage = fileType => {
    this.setState(prevState => {
      const program = {
        ...prevState.program
      };
      if (fileType === 'programImage') {
        program.programImage = null;
        program.signedProgramImage = null;
      } else if (fileType === 'programLiveImage') {
        program.programLiveImage = null;
        program.signedProgramLiveImage = null;
      }
      return {
        program
      };
    });
  };

  onPick = files => {
    const imageUri = get(files, '[0].unsignedUrl');
    const signedImageUri = get(files, '[0].getUrl');
    if (!signedImageUri) {
      throw new Error('Image uri must be signed.');
    }
    this.setState(prevState => {
      const program = {
        ...prevState.program
      };
      if (prevState.selectImageType === 'programImage') {
        program.programImage = imageUri;
        program.signedProgramImage = signedImageUri;
      } else if (prevState.selectImageType === 'programLiveImage') {
        program.programLiveImage = imageUri;
        program.signedProgramLiveImage = signedImageUri;
      }
      return {
        program,
        selectImageType: null
      };
    });
  };

  render() {
    return (
      <div>
        <ProgramInfo
          {...this.props}
          program={this.state.program}
          onUploadImage={this.onUploadImage}
          onRemoveImage={this.onRemoveImage}
          onSubmit={this.state.submitCallback}
        />
        <FilePicker
          id={this.props._widgetId}
          onPick={this.onPick}
          width={600}
          height={640}
        />
      </div>
    );
  }
}

export default widget(ProgramInfoWidget);
